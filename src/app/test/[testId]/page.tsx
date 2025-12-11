// src/app/test/[testId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import QuestionRenderer from './question-renderer';
import PakKorTestInterface from '@/components/PakKorTestInterface';
import Part6Interface from '@/components/Part6Interface';

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
  }, [testId, supabase]);

  // ===============================
  // Submit Handler สำหรับ PakKor
  // ===============================
  const handlePakKorSubmit = async (answers: Record<string, string>, timeUsed: number) => {
    try {
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correct_answer) {
          correctCount++;
        }
      });

      const scorePercent = Math.round((correctCount / questions.length) * 100);

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

      const userAnswers = Object.entries(answers).map(([questionId, answer]) => {
        const question = questions.find(q => q.id === questionId);
        return {
          attempt_id: attemptData.id,
          question_id: questionId,
          submitted_choice: parseInt(answer) - 1,
          is_correct: answer === question?.correct_answer,
        };
      });

      await supabase.from('UserAnswer').insert(userAnswers);
      router.push(`/result/${attemptData.id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('เกิดข้อผิดพลาดในการส่งคำตอบ');
    }
  };

  // ===============================
  // Submit Handler สำหรับ Part 6
  // ===============================
  const handlePart6Submit = async (answers: Record<string, string>, timeUsed: number) => {
    try {
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correct_answer) {
          correctCount++;
        }
      });

      const scorePercent = Math.round((correctCount / questions.length) * 100);

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

      const letterToIndex: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      const userAnswers = Object.entries(answers).map(([questionId, answer]) => {
        const question = questions.find(q => q.id === questionId);
        return {
          attempt_id: attemptData.id,
          question_id: questionId,
          submitted_choice: letterToIndex[answer] ?? -1,
          is_correct: answer === question?.correct_answer,
        };
      });

      await supabase.from('UserAnswer').insert(userAnswers);
      router.push(`/result/${attemptData.id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('เกิดข้อผิดพลาดในการส่งคำตอบ');
    }
  };

  // ===============================
  // Loading State
  // ===============================
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

  // ===============================
  // Error State
  // ===============================
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

  // ===============================
  // ROUTING LOGIC
  // ===============================
  
  const titleLower = (test.title || '').toLowerCase();
  const categoryLower = (test.category || '').toLowerCase();
  const partLower = (test.part || '').toLowerCase();
  const subcategoryLower = (test.subcategory || test.sub_category || '').toLowerCase();

  // 1. ข้อสอบ ภาค ก. (ก.พ.)
  const isPakKor = categoryLower === 'pak-kor' || titleLower.includes('ภาค ก');
  
  // 2. TOEIC Part 6
  const isToeicPart6 = (
    (categoryLower === 'toeic' && partLower.includes('6')) ||
    subcategoryLower.includes('part-6') ||
    subcategoryLower.includes('part6') ||
    (titleLower.includes('part 6') && titleLower.includes('toeic')) ||
    (titleLower.includes('part-6') && titleLower.includes('toeic')) ||
    titleLower.includes('toeic part 6') ||
    titleLower.includes('part 6 set')
  );

  // ===============================
  // Render: ภาค ก.
  // ===============================
  if (isPakKor) {
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

  // ===============================
  // Render: TOEIC Part 6
  // ===============================
  if (isToeicPart6) {
    const passages = groupQuestionsIntoPassages(questions);

    return (
      <Part6Interface
        examTitle={test.title}
        passages={passages}
        timeLimit={test.time_limit_minutes || 16}
        onSubmit={handlePart6Submit}
      />
    );
  }

  // ===============================
  // Render: Default (QuestionRenderer) - ไม่มี title ซ้ำแล้ว
  // ===============================
  return <QuestionRenderer testId={testId as string} testTitle={test.title} />;
}

// ===============================
// Helper Functions
// ===============================
function groupQuestionsIntoPassages(questions: any[]) {
  const passageMap = new Map<string, any>();
  
  questions.forEach((q, index) => {
    const passageNumber = Math.floor(index / 4) + 1;
    const passageContent = q.passage || q.question_text || '';
    const passageKey = `passage_${passageNumber}`;
    
    if (!passageMap.has(passageKey)) {
      passageMap.set(passageKey, {
        id: passageKey,
        passage_number: passageNumber,
        content: passageContent,
        questions: [],
      });
    }
    
    const passage = passageMap.get(passageKey);
    passage.questions.push({
      id: q.id,
      blank_number: q.blank_number || (index % 4) + 1,
      option_a: getChoice(q, 0),
      option_b: getChoice(q, 1),
      option_c: getChoice(q, 2),
      option_d: getChoice(q, 3),
      correct_answer: q.correct_answer,
      explanation: q.explanation || '',
    });
  });

  return Array.from(passageMap.values());
}

function getChoice(q: any, index: number): string {
  if (Array.isArray(q.choices) && q.choices[index]) {
    return q.choices[index];
  }
  if (typeof q.choices === 'string') {
    const parts = q.choices.split(',');
    return parts[index]?.trim() || '';
  }
  const keys = ['choice_a', 'choice_b', 'choice_c', 'choice_d'];
  return q[keys[index]] || '';
}