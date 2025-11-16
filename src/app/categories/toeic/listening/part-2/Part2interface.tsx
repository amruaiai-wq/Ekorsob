// components/Part2Interface.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Timer from '@/components/Timer';

interface Part2Question {
  id: string;
  question_number: number;
  audio_url: string; // URL ไฟล์เสียงที่มีคำถาม + คำตอบ A, B, C
  correct_answer: string; // A, B, C
  explanation?: string;
  transcript?: {
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
  }; // Transcript สำหรับดูหลังส่งคำตอบ
}

interface Part2InterfaceProps {
  examTitle: string;
  questions: Part2Question[];
  timeLimit: number; // เวลาในหน่วยนาที
  onSubmit: (answers: Record<string, string>, timeUsed: number) => void;
}

export default function Part2Interface({
  examTitle,
  questions,
  timeLimit,
  onSubmit
}: Part2InterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasListened, setHasListened] = useState<Record<string, boolean>>({});
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isCurrentAnswered = !!answers[currentQuestion.id];
  const isCurrentSubmitted = submittedQuestions[currentQuestion.id];

  // เล่นเสียง
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setHasListened(prev => ({ ...prev, [currentQuestion.id]: true }));
    }
  };

  // หยุดเสียงเมื่อเปลี่ยนข้อ
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentQuestionIndex]);

  // เลือกคำตอบ
  const handleSelectAnswer = (answer: string) => {
    if (isCurrentSubmitted) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  // ส่งคำตอบข้อนี้
  const handleSubmitCurrentAnswer = () => {
    if (!isCurrentAnswered) {
      alert('กรุณาเลือกคำตอบก่อนส่ง');
      return;
    }

    setSubmittedQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
    setShowExplanation(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
  };

  // ไปข้อถัดไป
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // ย้อนกลับข้อก่อนหน้า
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // กระโดดไปข้อที่เลือก
  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {examTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                ข้อ {currentQuestionIndex + 1} จาก {totalQuestions} | 
                ตอบแล้ว <span className="font-semibold text-orange-600 dark:text-orange-400">{answeredCount}</span> ข้อ
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
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              
              {/* Question Number */}
              <div className="inline-block bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                ข้อที่ {currentQuestion.question_number}
              </div>

              {/* Instructions */}
              <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      📝 วิธีทำ Part 2
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      คุณจะได้ยิน <strong>คำถาม 1 ข้อ</strong> ตามด้วย <strong>คำตอบ 3 ข้อ (A, B, C)</strong>
                      <br />เลือกคำตอบที่เหมาะสมกับคำถามมากที่สุด
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              <div className="mb-8 p-8 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/10 rounded-2xl border-2 border-orange-200 dark:border-orange-800 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="text-3xl">🎧</span>
                    ฟังคำถามและคำตอบ
                  </h3>
                  {hasListened[currentQuestion.id] && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      ฟังแล้ว
                    </span>
                  )}
                </div>

                <audio
                  ref={audioRef}
                  src={currentQuestion.audio_url}
                  onEnded={() => setIsPlaying(false)}
                  onError={() => alert('ไม่สามารถโหลดไฟล์เสียงได้')}
                />

                <button
                  onClick={playAudio}
                  disabled={isPlaying}
                  className="w-full px-8 py-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                      <span>กำลังเล่น...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span>เล่นเสียง</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                  คุณจะได้ยิน: <strong>คำถาม</strong> → <strong>(A)</strong> → <strong>(B)</strong> → <strong>(C)</strong>
                </p>
              </div>

              {/* Answer Options */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  เลือกคำตอบ
                </h3>
                <div className="space-y-4">
                  {['A', 'B', 'C'].map((option) => {
                    const isSelected = answers[currentQuestion.id] === option;
                    const isCorrect = option === currentQuestion.correct_answer;
                    const showResult = isCurrentSubmitted && showExplanation[currentQuestion.id];
                    
                    let buttonClass = '';
                    if (showResult) {
                      if (isCorrect) {
                        buttonClass = 'border-green-500 bg-green-50 dark:bg-green-900/30';
                      } else if (isSelected && !isCorrect) {
                        buttonClass = 'border-red-500 bg-red-50 dark:bg-red-900/30';
                      } else {
                        buttonClass = 'border-gray-200 dark:border-gray-700 opacity-60';
                      }
                    } else {
                      buttonClass = isSelected
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 shadow-lg scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20';
                    }
                    
                    return (
                      <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={isCurrentSubmitted}
                        className={`w-full p-6 rounded-2xl border-3 transition-all ${buttonClass} ${
                          isCurrentSubmitted ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl ${
                            showResult
                              ? isCorrect
                                ? 'bg-green-500 text-white'
                                : isSelected && !isCorrect
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                              : isSelected
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {option}
                          </span>
                          <span className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                            {isCurrentSubmitted && currentQuestion.transcript
                              ? currentQuestion.transcript[`option_${option.toLowerCase()}` as keyof typeof currentQuestion.transcript]
                              : `ตัวเลือก ${option}`
                            }
                          </span>
                          {showResult && (
                            <span className="ml-auto text-3xl">
                              {isCorrect ? '✓' : isSelected && !isCorrect ? '✗' : ''}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              {!isCurrentSubmitted && (
                <button
                  onClick={handleSubmitCurrentAnswer}
                  disabled={!isCurrentAnswered}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                  ส่งคำตอบข้อนี้
                </button>
              )}

              {/* Explanation */}
              {isCurrentSubmitted && showExplanation[currentQuestion.id] && (
                <div className={`mb-6 p-6 rounded-2xl border-2 ${
                  answers[currentQuestion.id] === currentQuestion.correct_answer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`text-3xl ${
                      answers[currentQuestion.id] === currentQuestion.correct_answer
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {answers[currentQuestion.id] === currentQuestion.correct_answer ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className={`font-bold text-xl mb-2 ${
                        answers[currentQuestion.id] === currentQuestion.correct_answer
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}>
                        {answers[currentQuestion.id] === currentQuestion.correct_answer ? 'ถูกต้อง! 🎉' : 'ผิด! 😔'}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        <strong>คำตอบที่ถูกต้อง:</strong> ตัวเลือก {currentQuestion.correct_answer}
                      </p>

                      {/* Transcript */}
                      {currentQuestion.transcript && (
                        <div className="mt-4 p-5 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <span className="text-xl">📝</span>
                            Transcript:
                          </p>
                          <div className="space-y-3 text-sm">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="font-bold text-blue-700 dark:text-blue-400 mb-1">คำถาม:</p>
                              <p className="text-gray-800 dark:text-gray-200">{currentQuestion.transcript.question}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${currentQuestion.correct_answer === 'A' ? 'bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500' : 'bg-gray-50 dark:bg-gray-800'}`}>
                              <p className={`font-bold mb-1 ${currentQuestion.correct_answer === 'A' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-400'}`}>
                                (A) {currentQuestion.transcript.option_a}
                              </p>
                            </div>
                            <div className={`p-3 rounded-lg ${currentQuestion.correct_answer === 'B' ? 'bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500' : 'bg-gray-50 dark:bg-gray-800'}`}>
                              <p className={`font-bold mb-1 ${currentQuestion.correct_answer === 'B' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-400'}`}>
                                (B) {currentQuestion.transcript.option_b}
                              </p>
                            </div>
                            <div className={`p-3 rounded-lg ${currentQuestion.correct_answer === 'C' ? 'bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500' : 'bg-gray-50 dark:bg-gray-800'}`}>
                              <p className={`font-bold mb-1 ${currentQuestion.correct_answer === 'C' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-400'}`}>
                                (C) {currentQuestion.transcript.option_c}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      {currentQuestion.explanation && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                            <span className="text-xl">💡</span>
                            คำอธิบาย:
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  ← ข้อก่อนหน้า
                </button>
                
                {currentQuestionIndex === totalQuestions - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังส่ง...' : '✓ ส่งคำตอบ'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    ข้อถัดไป →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">คำถามทั้งหมด</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((q, index) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`p-2 rounded-lg font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-orange-500 text-white shadow-lg scale-110'
                          : isAnswered
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังส่ง...' : '✓ ส่งคำตอบทั้งหมด'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}