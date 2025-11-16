// components/Part6Interface.tsx
'use client';

import { useState, useEffect } from 'react';
import Timer from '@/components/Timer';
import QuestionNavigation from './QuestionNavigation';

// Passage มี 4 คำถาม
interface Passage {
  id: string;
  passage_number: number;
  content: string; // เนื้อหาบทความที่มี {blank_1}, {blank_2}, {blank_3}, {blank_4}
  questions: PassageQuestion[];
}

interface PassageQuestion {
  id: string;
  blank_number: number; // 1, 2, 3, 4
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string;
}

interface Part6InterfaceProps {
  examTitle: string;
  passages: Passage[];
  timeLimit: number; // เวลาในหน่วยนาที
  onSubmit: (answers: Record<string, string>, timeUsed: number) => void;
}

export default function Part6Interface({
  examTitle,
  passages,
  timeLimit,
  onSubmit
}: Part6InterfaceProps) {
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const currentPassage = passages[currentPassageIndex];
  const totalPassages = passages.length;
  const totalQuestions = passages.reduce((sum, p) => sum + p.questions.length, 0);

  // นับจำนวนข้อที่ตอบแล้วทั้งหมด
  const answeredCount = Object.keys(answers).length;

  // เลือกคำตอบ
  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (submittedQuestions[questionId]) return;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // ส่งคำตอบข้อนี้
  const handleSubmitQuestion = (questionId: string) => {
    if (!answers[questionId]) {
      alert('กรุณาเลือกคำตอบก่อนส่ง');
      return;
    }

    setSubmittedQuestions(prev => ({
      ...prev,
      [questionId]: true
    }));
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  // ไปบทความถัดไป
  const handleNextPassage = () => {
    if (currentPassageIndex < totalPassages - 1) {
      setCurrentPassageIndex(prev => prev + 1);
    }
  };

  // ย้อนกลับบทความก่อนหน้า
  const handlePreviousPassage = () => {
    if (currentPassageIndex > 0) {
      setCurrentPassageIndex(prev => prev - 1);
    }
  };

  // กระโดดไปบทความที่เลือก
  const handleJumpToPassage = (index: number) => {
    setCurrentPassageIndex(index);
  };

  // ส่งคำตอบทั้งหมด
  const handleSubmit = async () => {
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `คุณทำได้เพียง ${answeredCount}/${totalQuestions} ข้อ\nต้องการส่งคำตอบหรือไม่?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    const timeUsed = timeLimit * 60 - timeRemaining;
    await onSubmit(answers, timeUsed);
  };

  // เมื่อหมดเวลา
  const handleTimeUp = () => {
    alert('หมดเวลา! ระบบจะส่งคำตอบอัตโนมัติ');
    handleSubmit();
  };

  // แปลง passage content ให้มี blanks แบบ interactive
  const renderPassageWithBlanks = () => {
    let content = currentPassage.content;
    
    // แทนที่ {blank_1}, {blank_2}, etc. ด้วย dropdown/buttons
    currentPassage.questions.forEach((question) => {
      const blankPlaceholder = `{blank_${question.blank_number}}`;
      const selectedAnswer = answers[question.id];
      const isSubmitted = submittedQuestions[question.id];
      const isCorrect = selectedAnswer === question.correct_answer;
      
      // สร้าง inline answer selector
      const blankElement = `<span class="inline-blank" data-question-id="${question.id}">
        <span class="blank-number">[${question.blank_number}]</span>
        ${selectedAnswer ? 
          `<span class="selected-answer ${isSubmitted ? (isCorrect ? 'correct' : 'wrong') : 'pending'}">${selectedAnswer}</span>` 
          : '<span class="blank-empty">____</span>'}
      </span>`;
      
      content = content.replace(blankPlaceholder, blankElement);
    });

    return content;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {examTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                บทความที่ {currentPassageIndex + 1} จาก {totalPassages} | 
                ตอบแล้ว <span className="font-semibold text-blue-600 dark:text-blue-400">{answeredCount}</span>/{totalQuestions} ข้อ
              </p>
            </div>
            
            {/* Timer */}
            <Timer 
              timeRemaining={timeRemaining}
              setTimeRemaining={setTimeRemaining}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content - Passage & Questions */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Passage Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
                  บทความที่ {currentPassage.passage_number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  คำถาม {((currentPassageIndex) * 4) + 1}-{((currentPassageIndex) * 4) + 4}
                </div>
              </div>

              {/* Passage Content with Highlighted Blanks */}
              <div className="prose max-w-none mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                <div 
                  className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap passage-content"
                  dangerouslySetInnerHTML={{ __html: renderPassageWithBlanks() }}
                />
              </div>

              {/* Questions for each blank */}
              <div className="space-y-6">
                {currentPassage.questions.map((question, qIndex) => {
                  const isAnswered = !!answers[question.id];
                  const isSubmitted = submittedQuestions[question.id];
                  const showExplanation = showExplanations[question.id];

                  return (
                    <div key={question.id} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {question.blank_number}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          ช่องว่างที่ {question.blank_number}
                        </h3>
                      </div>

                      {/* Options */}
                      <div className="space-y-3 mb-4">
                        {['A', 'B', 'C', 'D'].map((option) => {
                          const optionKey = `option_${option.toLowerCase()}` as keyof PassageQuestion;
                          const optionText = question[optionKey] as string;
                          const isSelected = answers[question.id] === option;
                          const isCorrect = option === question.correct_answer;
                          
                          let buttonClass = '';
                          if (isSubmitted && showExplanation) {
                            if (isCorrect) {
                              buttonClass = 'border-green-500 bg-green-50 dark:bg-green-900/30';
                            } else if (isSelected && !isCorrect) {
                              buttonClass = 'border-red-500 bg-red-50 dark:bg-red-900/30';
                            } else {
                              buttonClass = 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60';
                            }
                          } else {
                            buttonClass = isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800';
                          }
                          
                          return (
                            <button
                              key={option}
                              onClick={() => handleSelectAnswer(question.id, option)}
                              disabled={isSubmitted}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${buttonClass} ${
                                isSubmitted ? 'cursor-not-allowed' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  isSubmitted && showExplanation
                                    ? isCorrect
                                      ? 'bg-green-500 text-white'
                                      : isSelected && !isCorrect
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                    : isSelected
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                  {option}
                                </span>
                                <span className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                                  {optionText}
                                </span>
                                {isSubmitted && showExplanation && (
                                  <span className="flex-shrink-0 text-xl">
                                    {isCorrect ? '✓' : isSelected && !isCorrect ? '✗' : ''}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Submit Button for this question */}
                      {!isSubmitted && (
                        <button
                          onClick={() => handleSubmitQuestion(question.id)}
                          disabled={!isAnswered}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ส่งคำตอบข้อนี้
                        </button>
                      )}

                      {/* Explanation */}
                      {isSubmitted && showExplanation && question.explanation && (
                        <div className={`mt-4 p-4 rounded-xl border-2 ${
                          answers[question.id] === question.correct_answer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        }`}>
                          <div className="flex items-start gap-3">
                            <span className={`text-2xl ${
                              answers[question.id] === question.correct_answer
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {answers[question.id] === question.correct_answer ? '✓' : '✗'}
                            </span>
                            <div className="flex-1">
                              <p className={`font-bold mb-2 ${
                                answers[question.id] === question.correct_answer
                                  ? 'text-green-700 dark:text-green-400'
                                  : 'text-red-700 dark:text-red-400'
                              }`}>
                                {answers[question.id] === question.correct_answer ? 'ถูกต้อง! 🎉' : 'ผิด! 😔'}
                              </p>
                              <p className="text-gray-700 dark:text-gray-300 mb-2">
                                <strong>คำตอบที่ถูกต้อง:</strong> ตัวเลือก {question.correct_answer}
                              </p>
                              <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">📖 คำอธิบาย:</p>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {question.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Passage Navigation */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                <button
                  onClick={handlePreviousPassage}
                  disabled={currentPassageIndex === 0}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  ← บทความก่อนหน้า
                </button>
                
                {currentPassageIndex === totalPassages - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังส่ง...' : '✓ ส่งคำตอบ'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextPassage}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    บทความถัดไป →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Passage Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">บทความทั้งหมด</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {passages.map((passage, index) => {
                  const passageQuestions = passage.questions.map(q => q.id);
                  const answeredInPassage = passageQuestions.filter(qId => answers[qId]).length;
                  const isCurrentPassage = index === currentPassageIndex;
                  
                  return (
                    <button
                      key={passage.id}
                      onClick={() => handleJumpToPassage(index)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isCurrentPassage
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : answeredInPassage === 4
                          ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-800 dark:text-white">
                          บทความ {index + 1}
                        </span>
                        {answeredInPassage === 4 && <span className="text-green-600">✓</span>}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {answeredInPassage}/4 ข้อ
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังส่ง...' : '✓ ส่งคำตอบทั้งหมด'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .passage-content :global(.inline-blank) {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          margin: 0 0.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
        }
        
        .passage-content :global(.blank-number) {
          color: #3b82f6;
          font-weight: bold;
        }
        
        .passage-content :global(.blank-empty) {
          color: #9ca3af;
          border-bottom: 2px solid #d1d5db;
          padding: 0 1rem;
        }
        
        .passage-content :global(.selected-answer) {
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-weight: bold;
        }
        
        .passage-content :global(.selected-answer.pending) {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .passage-content :global(.selected-answer.correct) {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .passage-content :global(.selected-answer.wrong) {
          background-color: #fee2e2;
          color: #991b1b;
        }
      `}</style>
    </div>
  );
}