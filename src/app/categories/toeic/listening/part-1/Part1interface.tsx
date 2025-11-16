// components/Part1Interface.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Timer from './Timer';

interface Part1Question {
  id: string;
  question_number: number;
  image_url: string; // URL รูปภาพ
  audio_url: string; // URL ไฟล์เสียงที่มีคำบรรยาย A, B, C, D
  correct_answer: string; // A, B, C, D
  explanation?: string;
  transcript?: {
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  }; // Transcript สำหรับดูหลังส่งคำตอบ
}

interface Part1InterfaceProps {
  examTitle: string;
  questions: Part1Question[];
  timeLimit: number; // เวลาในหน่วยนาที
  onSubmit: (answers: Record<string, string>, timeUsed: number) => void;
}

export default function Part1Interface({
  examTitle,
  questions,
  timeLimit,
  onSubmit
}: Part1InterfaceProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-pink-950 py-8 px-4">
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
                ตอบแล้ว <span className="font-semibold text-pink-600 dark:text-pink-400">{answeredCount}</span> ข้อ
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
              <div className="inline-block bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                ข้อที่ {currentQuestion.question_number}
              </div>

              {/* Image */}
              <div className="mb-8">
                <div className="relative rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
                  <img 
                    src={currentQuestion.image_url} 
                    alt={`Question ${currentQuestion.question_number}`}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                    }}
                  />
                </div>
              </div>

              {/* Audio Player */}
              <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border-2 border-pink-200 dark:border-pink-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">🎧</span>
                    ฟังคำบรรยาย
                  </h3>
                  {hasListened[currentQuestion.id] && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                      ✓ ฟังแล้ว
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
                  className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                      กำลังเล่น...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      เล่นเสียง
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
                  คุณจะได้ยินคำบรรยาย 4 ข้อ (A, B, C, D) - เลือกข้อที่ตรงกับรูปภาพมากที่สุด
                </p>
              </div>

              {/* Answer Options */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  เลือกคำตอบ
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['A', 'B', 'C', 'D'].map((option) => {
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
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/20';
                    }
                    
                    return (
                      <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={isCurrentSubmitted}
                        className={`p-6 rounded-2xl border-2 transition-all ${buttonClass} ${
                          isCurrentSubmitted ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <span className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                            showResult
                              ? isCorrect
                                ? 'bg-green-500 text-white'
                                : isSelected && !isCorrect
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                              : isSelected
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {option}
                          </span>
                          {showResult && (
                            <span className="text-2xl">
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
                  className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
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
                        <div className="mt-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📝 Transcript:</p>
                          <div className="space-y-2 text-sm">
                            <p className={currentQuestion.correct_answer === 'A' ? 'font-bold text-green-600 dark:text-green-400' : ''}>
                              (A) {currentQuestion.transcript.option_a}
                            </p>
                            <p className={currentQuestion.correct_answer === 'B' ? 'font-bold text-green-600 dark:text-green-400' : ''}>
                              (B) {currentQuestion.transcript.option_b}
                            </p>
                            <p className={currentQuestion.correct_answer === 'C' ? 'font-bold text-green-600 dark:text-green-400' : ''}>
                              (C) {currentQuestion.transcript.option_c}
                            </p>
                            <p className={currentQuestion.correct_answer === 'D' ? 'font-bold text-green-600 dark:text-green-400' : ''}>
                              (D) {currentQuestion.transcript.option_d}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      {currentQuestion.explanation && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">💡 คำอธิบาย:</p>
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
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
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                {questions.map((q, index) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`p-3 rounded-xl font-bold text-sm transition-all ${
                        isCurrent
                          ? 'bg-pink-500 text-white shadow-lg scale-110'
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