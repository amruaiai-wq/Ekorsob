'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  question_text: string;
  choices: string[];
  correct_answer: string;
  explanation?: string;
}

export default function QuestionRenderer({
  testId,
}: {
  testId: string;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from('Question')
          .select('*')
          .eq('test_id', testId)
          .order('order_num', { ascending: true });

        if (questionsError || !questionsData || questionsData.length === 0) {
          setLoading(false);
          return;
        }

        // ⭐ แปลง choices เป็น array
        const formattedQuestions = questionsData.map(q => ({
          ...q,
          choices: Array.isArray(q.choices) 
            ? q.choices 
            : typeof q.choices === 'string'
            ? q.choices.split(',').map((s: string) => s.trim())
            : []
        }));

        setQuestions(formattedQuestions);
        setAnswers(new Array(formattedQuestions.length).fill(null));

        const { data: attemptData, error: attemptError } = await supabase
          .from('TestAttempt')
          .insert({
            test_id: testId,
            total_questions: formattedQuestions.length,
            start_time: new Date().toISOString(),
            is_completed: false
          })
          .select('*')
          .single();

        if (!attemptError && attemptData?.id) {
          setAttemptId(attemptData.id);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    init();
  }, [testId]);

  const handleAnswer = async (choiceIndex: number) => {
    if (selectedAnswer !== null || !attemptId) return;

    const q = questions[current];
    const correctAnswerIndex = parseInt(q.correct_answer) - 1;
    const isCorrect = choiceIndex === correctAnswerIndex;

    await supabase.from('UserAnswer').insert({
      attempt_id: attemptId,
      question_id: q.id,
      submitted_choice: choiceIndex,
      is_correct: isCorrect,
    });

    const newAnswers = [...answers];
    newAnswers[current] = choiceIndex;
    setAnswers(newAnswers);
    setSelectedAnswer(choiceIndex);
    setShowExplanation(true);
  };

  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      if (!attemptId) return;

      const allAnswers = [...answers];
      if (selectedAnswer !== null) {
        allAnswers[current] = selectedAnswer;
      }

      const correctCount = allAnswers.filter((a, i) => {
        if (a === null) return false;
        const correctIndex = parseInt(questions[i].correct_answer) - 1;
        return a === correctIndex;
      }).length;

      const scorePercent = Math.round((correctCount / questions.length) * 100);

      await supabase
        .from('TestAttempt')
        .update({
          score: correctCount,
          score_percent: scorePercent,
          correct_answers: correctCount,
          is_completed: true,
          end_time: new Date().toISOString(),
        })
        .eq('id', attemptId);

      router.push(`/result/${attemptId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 dark:border-gray-800 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลดข้อสอบ...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || !attemptId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">ไม่พบข้อสอบ</h2>
          <p className="text-gray-600 dark:text-gray-400">กรุณาลองใหม่อีกครั้ง</p>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const correctAnswerIndex = parseInt(q.correct_answer) - 1;
  const isCorrect = selectedAnswer === correctAnswerIndex;
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Header - Clean & Minimal */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{current + 1}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">คำถามที่</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{current + 1} / {questions.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">ความคืบหน้า</p>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Focused Layout */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Question Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 mb-6">
          
          {/* Question Number Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mb-6">
            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Question</span>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 leading-relaxed">
            {q.question_text}
          </h2>

          {/* Choices - Clean Design */}
          <div className="space-y-3">
            {q.choices.map((choice, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectChoice = i === correctAnswerIndex;
              const showResult = showExplanation;

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                    !showResult
                      ? isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500'
                        : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      : isCorrectChoice
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : isSelected
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm ${
                      showResult && isCorrectChoice
                        ? 'bg-green-500 text-white'
                        : showResult && isSelected && !isCorrectChoice
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="flex-1 text-gray-900 dark:text-white font-medium">
                      {choice}
                    </span>
                    {showResult && isCorrectChoice && (
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {showResult && isSelected && !isCorrectChoice && (
                      <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result & Explanation - Compact */}
        {showExplanation && (
          <div className="space-y-4">
            
            {/* Result Badge - Clean */}
            <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl font-semibold ${
              isCorrect 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isCorrect ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span>{isCorrect ? 'ถูกต้อง' : 'ไม่ถูกต้อง'}</span>
              {!isCorrect && (
                <span className="px-2.5 py-0.5 bg-white/20 rounded-md text-sm">
                  เฉลย: {String.fromCharCode(65 + correctAnswerIndex)}
                </span>
              )}
            </div>

            {/* Explanation - Clean Box */}
            {q.explanation && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-indigo-200 dark:border-indigo-900 p-5">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">คำอธิบาย</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button - Clean */}
            <button
              onClick={handleNext}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              {current >= questions.length - 1 ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  ดูผลคะแนน
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  ข้อถัดไป
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        )}

        {/* Instruction - Subtle */}
        {!showExplanation && (
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              เลือกคำตอบที่ถูกต้อง
            </p>
          </div>
        )}
      </div>
    </div>
  );
}