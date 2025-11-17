'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import QuestionRenderer from './question-renderer';
import PakKorTestInterface from '@/components/PakKorTestInterface';

export default function TestPage() {
  const { testId } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initTest = async () => {
      if (!testId || testId === 'undefined') {
        setError('ไม่พบ Test ID');
        setLoading(false);
        return;
      }

      // โหลดข้อมูลชุดข้อสอบ
      const { data: testData, error: testError } = await supabase
        .from('Tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (testError || !testData) {
        console.error('Error loading test:', testError?.message);
        setError('ไม่พบข้อมูลชุดข้อสอบ');
        setLoading(false);
        return;
      }

      // โหลดข้อสอบ
      const { data: questionsData, error: questionsError } = await supabase
        .from('Question')
        .select('*')
        .eq('test_id', testId)
        .order('order_num', { ascending: true });

      if (questionsError || !questionsData || questionsData.length === 0) {
        console.error('Error loading questions:', questionsError?.message);
        setError('ไม่พบข้อสอบ');
        setLoading(false);
        return;
      }

      setTest(testData);
      setQuestions(questionsData);
      setLoading(false);
    };

    initTest();
  }, [testId]);

  // ฟังก์ชัน submit สำหรับ PakKorTestInterface
  const handlePakKorSubmit = async (answers: Record<string, string>, timeUsed: number) => {
    try {
      // ⭐ answers ที่ได้รับมาเป็น "1","2","3","4" แล้ว (แปลงจาก A,B,C,D ใน PakKorTestInterface)
      
      // คำนวณคะแนน
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correct_answer) {
          correctCount++;
        }
      });

      const scorePercent = Math.round((correctCount / questions.length) * 100);

      // บันทึกผลลง TestAttempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('TestAttempt')
        .insert({
          test_id: testId,
          total_questions: questions.length,
          score: correctCount,
          score_percent: scorePercent,
          correct_answers: correctCount,
          start_time: new Date(Date.now() - timeUsed * 1000).toISOString(),
          end_time: new Date().toISOString(),
          is_completed: true,
        })
        .select()
        .single();

      if (attemptError) {
        console.error('Error saving attempt:', attemptError);
        alert('เกิดข้อผิดพลาดในการบันทึกผลสอบ');
        return;
      }

      // บันทึก UserAnswer
      const userAnswers = Object.entries(answers).map(([questionId, answer]) => {
        const question = questions.find(q => q.id === questionId);
        return {
          attempt_id: attemptData.id,
          question_id: questionId,
          submitted_choice: parseInt(answer) - 1, // แปลง "1" เป็น 0, "2" เป็น 1, etc.
          is_correct: answer === question?.correct_answer,
        };
      });

      await supabase.from('UserAnswer').insert(userAnswers);

      // ไปหน้าผลลัพธ์
      router.push(`/result/${attemptData.id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('เกิดข้อผิดพลาดในการส่งคำตอบ');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p>⏳ กำลังโหลดข้อสอบ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-red-600 text-2xl mb-4">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-20 text-gray-500">
        ⚠️ ไม่สามารถเริ่มทำข้อสอบได้
      </div>
    );
  }

  // ⭐ เช็ค category และเลือก Component
  const isPakKor = test.category === 'pak-kor';

  if (isPakKor) {
    // สำหรับข้อสอบ ก.พ. - ใช้ PakKorTestInterface
    const formattedQuestions = questions.map((q: any, index: number) => ({
      id: q.id,
      order_num: q.order_num || index + 1,
      part: q.part || 'Part 1: Conversation',
      passage: q.passage || null,
      question_text: q.question_text,
      blank_number: q.blank_number || null,
      choice_a: Array.isArray(q.choices) ? q.choices[0] : q.choices?.split(',')[0]?.trim() || '',
      choice_b: Array.isArray(q.choices) ? q.choices[1] : q.choices?.split(',')[1]?.trim() || '',
      choice_c: Array.isArray(q.choices) ? q.choices[2] : q.choices?.split(',')[2]?.trim() || '',
      choice_d: Array.isArray(q.choices) ? q.choices[3] : q.choices?.split(',')[3]?.trim() || '',
      correct_answer: q.correct_answer,
      explanation: q.explanation || null,
    }));

    return (
      <PakKorTestInterface
        examTitle={test.title}
        questions={formattedQuestions}
        timeLimit={test.time_limit_minutes || 40}
        onSubmit={handlePakKorSubmit}
      />
    );
  }

  // สำหรับข้อสอบอื่นๆ (TOEIC, A-Level, etc.) - ใช้ QuestionRenderer เดิม
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        {test.title}
      </h1>
      {test.description && (
        <p className="text-center text-gray-600 mb-8">{test.description}</p>
      )}

      <QuestionRenderer testId={testId as string} />
    </main>
  );
}