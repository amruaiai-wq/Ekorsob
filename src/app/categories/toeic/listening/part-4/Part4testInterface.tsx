'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  talkId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Talk {
  id: number;
  title: string;
  type: string;
  audioUrl: string;
  transcript: string;
  questions: Question[];
}

export default function Part4TestInterface() {
  const router = useRouter();
  const [currentTalk, setCurrentTalk] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock data - ในอนาคตจะดึงจาก API/Database
  const talks: Talk[] = [
    {
      id: 1,
      title: 'Telephone Message',
      type: 'Voice Mail',
      audioUrl: '/audio/part4/talk1.mp3',
      transcript: `
Hello, this is Jennifer calling from Apex Electronics. I'm calling about the order you placed last week for 50 laptop computers. I wanted to let you know that we have all the items in stock and ready for delivery. However, we noticed that you requested delivery for next Monday, but unfortunately, our delivery trucks are fully booked that day. We can deliver on Tuesday instead, or if Monday is absolutely necessary, we can arrange for express shipping at an additional cost of $75. Please call me back at 555-0123 to confirm which option works best for you. Thank you.
      `,
      questions: [
        {
          id: 1,
          talkId: 1,
          question: 'What is the purpose of the message?',
          options: [
            'To cancel an order',
            'To discuss a delivery schedule',
            'To request payment',
            'To advertise products'
          ],
          correctAnswer: 1,
          explanation: 'ข้อความนี้เป็นการแจ้งเกี่ยวกับกำหนดการจัดส่งสินค้า โดยระบุว่าไม่สามารถส่งในวันจันทร์ได้ตามที่ขอไว้'
        },
        {
          id: 2,
          talkId: 1,
          question: 'What problem does the speaker mention?',
          options: [
            'Items are out of stock',
            'The price has increased',
            'Delivery trucks are fully booked',
            'The order was cancelled'
          ],
          correctAnswer: 2,
          explanation: 'ผู้พูดระบุว่า "our delivery trucks are fully booked that day" ซึ่งเป็นปัญหาที่ทำให้ไม่สามารถส่งของในวันจันทร์ได้'
        },
        {
          id: 3,
          talkId: 1,
          question: 'What does the speaker offer to do?',
          options: [
            'Provide a discount',
            'Arrange express shipping',
            'Send free samples',
            'Extend the warranty'
          ],
          correctAnswer: 1,
          explanation: 'ผู้พูดเสนอว่า "we can arrange for express shipping at an additional cost of $75" ถ้าจำเป็นต้องได้รับของในวันจันทร์'
        }
      ]
    },
    {
      id: 2,
      title: 'Company Announcement',
      type: 'Announcement',
      audioUrl: '/audio/part4/talk2.mp3',
      transcript: `
Good morning, everyone. This is Sarah from Human Resources. I have an important announcement regarding our office renovation project. Starting next Monday, the third floor will be temporarily closed for remodeling. All employees currently working on that floor will be relocated to the conference rooms on the second floor for approximately two weeks. Please make sure to pack your personal belongings by Friday afternoon. The IT department will handle moving your computers and office equipment over the weekend. If you have any questions or concerns, please don't hesitate to contact me at extension 2045. Thank you for your cooperation.
      `,
      questions: [
        {
          id: 4,
          talkId: 2,
          question: 'What is being announced?',
          options: [
            'A company merger',
            'An office renovation',
            'A holiday schedule',
            'New company policies'
          ],
          correctAnswer: 1,
          explanation: 'Sarah ประกาศเรื่อง "office renovation project" และการปิดชั้น 3 ชั่วคราวเพื่อทำการรีโนเวท'
        },
        {
          id: 5,
          talkId: 2,
          question: 'When should employees pack their belongings?',
          options: [
            'By Monday morning',
            'By Friday afternoon',
            'By next week',
            'Over the weekend'
          ],
          correctAnswer: 1,
          explanation: 'Sarah บอกให้พนักงาน "pack your personal belongings by Friday afternoon" เพื่อเตรียมย้ายสำนักงาน'
        },
        {
          id: 6,
          talkId: 2,
          question: 'Who will move the office equipment?',
          options: [
            'The employees themselves',
            'An external company',
            'The IT department',
            'The security team'
          ],
          correctAnswer: 2,
          explanation: 'ระบุชัดเจนว่า "The IT department will handle moving your computers and office equipment over the weekend"'
        }
      ]
    },
    {
      id: 3,
      title: 'Advertisement',
      type: 'Radio Ad',
      audioUrl: '/audio/part4/talk3.mp3',
      transcript: `
Are you tired of expensive gym memberships that you never use? Introducing FitLife Home Gym - the revolutionary fitness system that brings professional workouts to your living room! For just $299, you'll receive our complete set of resistance bands, a yoga mat, and access to over 500 online workout videos led by certified trainers. Plus, if you order within the next 48 hours, we'll include a free fitness tracker worth $79. That's right - absolutely free! Join thousands of satisfied customers who have already transformed their bodies from the comfort of home. Visit www.fitlifehomegym.com or call 1-800-FITLIFE to order today. Remember, this special offer expires in 48 hours, so don't miss out!
      `,
      questions: [
        {
          id: 7,
          talkId: 3,
          question: 'What is being advertised?',
          options: [
            'A gym membership',
            'A fitness tracking app',
            'A home gym system',
            'Personal training sessions'
          ],
          correctAnswer: 2,
          explanation: 'โฆษณานำเสนอ "FitLife Home Gym - the revolutionary fitness system" ซึ่งเป็นระบบออกกำลังกายที่บ้าน'
        },
        {
          id: 8,
          talkId: 3,
          question: 'What is included if customers order within 48 hours?',
          options: [
            'Free shipping',
            'A fitness tracker',
            'Extra resistance bands',
            'A discount coupon'
          ],
          correctAnswer: 1,
          explanation: 'ระบุว่า "we\'ll include a free fitness tracker worth $79" สำหรับลูกค้าที่สั่งภายใน 48 ชั่วโมง'
        },
        {
          id: 9,
          talkId: 3,
          question: 'How much does the basic package cost?',
          options: [
            '$79',
            '$199',
            '$299',
            '$379'
          ],
          correctAnswer: 2,
          explanation: 'ราคาที่ระบุไว้คือ "For just $299, you\'ll receive our complete set" ซึ่งเป็นราคาชุดพื้นฐาน'
        }
      ]
    }
  ];

  const allQuestions = talks.flatMap(talk => talk.questions);
  const totalQuestions = allQuestions.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const handleNext = () => {
    const questionsInTalk = talks[currentTalk].questions.length;
    
    if (currentQuestion < questionsInTalk - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentTalk < talks.length - 1) {
      setCurrentTalk(currentTalk + 1);
      setCurrentQuestion(0);
      setShowTranscript(false);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentTalk > 0) {
      setCurrentTalk(currentTalk - 1);
      const prevTalkQuestions = talks[currentTalk - 1].questions.length;
      setCurrentQuestion(prevTalkQuestions - 1);
      setShowTranscript(false);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    allQuestions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const currentTalkData = talks[currentTalk];
  const currentQ = currentTalkData.questions[currentQuestion];
  const globalQuestionIndex = talks
    .slice(0, currentTalk)
    .reduce((sum, talk) => sum + talk.questions.length, 0) + currentQuestion;

  if (showResults) {
    const score = calculateScore();
    const correctCount = allQuestions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-violet-950 py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full mb-6">
                <span className="text-5xl">🎉</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                ผลการทำข้อสอบ
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                TOEIC Part 4 - Short Talks
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                  {score}%
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  คะแนนรวม
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {correctCount}/{totalQuestions}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  ตอบถูก
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  {talks.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  บทพูด
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {talks.map((talk, talkIndex) => (
                <div key={talk.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg text-sm font-medium">
                      {talk.type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Talk {talkIndex + 1}: {talk.title}
                    </h3>
                  </div>
                  {talk.questions.map((question, qIndex) => {
                    const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
                    const userAnswer = selectedAnswers[question.id];
                    
                    return (
                      <div key={question.id} className="mb-4 last:mb-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                            isCorrect 
                              ? 'bg-green-100 dark:bg-green-900/30' 
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            {isCorrect ? (
                              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white mb-2">
                              {question.question}
                            </p>
                            <div className="space-y-1 text-sm">
                              <div className={`${userAnswer !== undefined ? 'font-medium' : ''}`}>
                                คำตอบของคุณ: {userAnswer !== undefined ? question.options[userAnswer] : 'ไม่ได้ตอบ'}
                                {!isCorrect && userAnswer !== undefined && (
                                  <span className="text-red-600 dark:text-red-400 ml-2">✗</span>
                                )}
                              </div>
                              {!isCorrect && (
                                <div className="text-green-600 dark:text-green-400 font-medium">
                                  เฉลย: {question.options[question.correctAnswer]} ✓
                                </div>
                              )}
                              <div className="text-gray-600 dark:text-gray-400 mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                💡 {question.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="flex-1 px-8 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300"
              >
                กลับหน้าหลัก
              </button>
              <button
                onClick={() => {
                  setShowResults(false);
                  setCurrentTalk(0);
                  setCurrentQuestion(0);
                  setSelectedAnswers({});
                  setTimeLeft(900);
                }}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                ทำใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-violet-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  TOEIC Part 4 - Short Talks
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Talk {currentTalk + 1} of {talks.length} • Question {currentQuestion + 1} of {currentTalkData.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Audio & Transcript */}
          <div className="lg:col-span-1 space-y-6">
            {/* Audio Player */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎤</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Audio Player
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentTalkData.title}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg text-sm font-medium">
                  {currentTalkData.type}
                </span>
              </div>

              <audio
                ref={audioRef}
                src={currentTalkData.audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <button
                onClick={handlePlayAudio}
                className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Pause Audio
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Play Audio
                  </>
                )}
              </button>

              <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                <p className="text-sm text-violet-800 dark:text-violet-300">
                  💡 ฟังได้มากกว่า 1 ครั้ง
                </p>
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Transcript (บทพูด)
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${showTranscript ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showTranscript && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                    {currentTalkData.transcript}
                  </pre>
                </div>
              )}

              {!showTranscript && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  คลิกเพื่อดูบทพูด (แนะนำให้ฟังก่อน)
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Questions */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Question {globalQuestionIndex + 1} of {totalQuestions}
                  </h2>
                  <span className="px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg font-medium">
                    Talk {currentTalk + 1}
                  </span>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                  {currentQ.question}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQ.id, index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                      selectedAnswers[currentQ.id] === index
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/30 dark:border-violet-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 bg-white dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedAnswers[currentQ.id] === index
                          ? 'border-violet-600 bg-violet-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedAnswers[currentQ.id] === index && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentTalk === 0 && currentQuestion === 0}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← ย้อนกลับ
                </button>
                
                {currentTalk === talks.length - 1 && 
                 currentQuestion === currentTalkData.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    ส่งคำตอบ
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    ข้อถัดไป →
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ความคืบหน้า
                </span>
                <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                  {Object.keys(selectedAnswers).length}/{totalQuestions} ข้อ
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-violet-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.keys(selectedAnswers).length / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}