'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  conversationId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Conversation {
  id: number;
  title: string;
  audioUrl: string;
  transcript: string;
  questions: Question[];
}

export default function Part3TestInterface() {
  const router = useRouter();
  const [currentConversation, setCurrentConversation] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock data - ในอนาคตจะดึงจาก API/Database
  const conversations: Conversation[] = [
    {
      id: 1,
      title: 'Business Meeting Discussion',
      audioUrl: '/audio/part3/conversation1.mp3',
      transcript: `
Woman: Good morning, everyone. Let's discuss the marketing campaign for our new product.
Man: I've prepared some data on our target audience. Should I present it now?
Woman: Yes, please. We need to finalize the strategy by Friday.
Man: According to our research, young professionals aged 25-35 are most interested.
Woman: That's helpful. Let's focus our advertising on digital platforms then.
      `,
      questions: [
        {
          id: 1,
          conversationId: 1,
          question: 'What are the speakers discussing?',
          options: [
            'A new employee orientation',
            'A marketing campaign',
            'Office renovations',
            'Budget planning'
          ],
          correctAnswer: 1,
          explanation: 'ผู้หญิงกล่าวว่า "Let\'s discuss the marketing campaign for our new product" ซึ่งแสดงว่าพวกเขากำลังพูดถึงแคมเปญการตลาด'
        },
        {
          id: 2,
          conversationId: 1,
          question: 'What does the man offer to do?',
          options: [
            'Schedule a meeting',
            'Present research data',
            'Contact customers',
            'Update the website'
          ],
          correctAnswer: 1,
          explanation: 'ผู้ชายพูดว่า "I\'ve prepared some data on our target audience. Should I present it now?" แสดงว่าเขาเสนอที่จะนำเสนอข้อมูลการวิจัย'
        },
        {
          id: 3,
          conversationId: 1,
          question: 'What is the target audience age range?',
          options: [
            '18-24 years old',
            '25-35 years old',
            '35-45 years old',
            '45-55 years old'
          ],
          correctAnswer: 1,
          explanation: 'ผู้ชายกล่าวว่า "young professionals aged 25-35 are most interested" ระบุช่วงอายุของกลุ่มเป้าหมายไว้ชัดเจน'
        }
      ]
    },
    {
      id: 2,
      title: 'Customer Service Call',
      audioUrl: '/audio/part3/conversation2.mp3',
      transcript: `
Woman: Thank you for calling Tech Support. How may I help you today?
Man: My laptop won't turn on. I've tried charging it, but nothing happens.
Woman: I understand. Have you checked if the charging light turns on?
Man: Yes, the light is on, but the screen stays black.
Woman: Let me schedule a technician to visit you tomorrow. Is 2 PM convenient?
Man: That works perfectly. Thank you for your help.
      `,
      questions: [
        {
          id: 4,
          conversationId: 2,
          question: 'What is the man\'s problem?',
          options: [
            'His internet is slow',
            'His laptop won\'t turn on',
            'He forgot his password',
            'His keyboard is broken'
          ],
          correctAnswer: 1,
          explanation: 'ผู้ชายพูดว่า "My laptop won\'t turn on" ซึ่งเป็นปัญหาหลักที่เขาโทรมาแจ้ง'
        },
        {
          id: 5,
          conversationId: 2,
          question: 'What has the man already tried?',
          options: [
            'Restarting the computer',
            'Charging the laptop',
            'Calling another company',
            'Buying a new charger'
          ],
          correctAnswer: 1,
          explanation: 'ผู้ชายบอกว่า "I\'ve tried charging it, but nothing happens" แสดงว่าเขาได้ลองชาร์จแล้ว'
        },
        {
          id: 6,
          conversationId: 2,
          question: 'When will the technician visit?',
          options: [
            'Today at 2 PM',
            'Tomorrow at 2 PM',
            'Next week',
            'The same day'
          ],
          correctAnswer: 1,
          explanation: 'ผู้หญิงพูดว่า "Let me schedule a technician to visit you tomorrow. Is 2 PM convenient?" ดังนั้นช่างจะมาพรุ่งนี้เวลา 2 โมงเช้า'
        }
      ]
    },
    {
      id: 3,
      title: 'Office Conversation',
      audioUrl: '/audio/part3/conversation3.mp3',
      transcript: `
Man: Did you hear about the new office policy on remote work?
Woman: Yes, starting next month we can work from home two days a week.
Man: That's great! Which days are you planning to work remotely?
Woman: Probably Mondays and Fridays. The commute is really tiring.
Man: I'm thinking the same. It'll save us a lot of time and money.
Woman: Absolutely. Plus, we'll be more productive without office distractions.
      `,
      questions: [
        {
          id: 7,
          conversationId: 3,
          question: 'What is the new office policy about?',
          options: [
            'Vacation days',
            'Remote work',
            'Office hours',
            'Dress code'
          ],
          correctAnswer: 1,
          explanation: 'ผู้ชายถามว่า "Did you hear about the new office policy on remote work?" ซึ่งเป็นหัวข้อหลักของการสนทนา'
        },
        {
          id: 8,
          conversationId: 3,
          question: 'How many days can employees work from home?',
          options: [
            'One day a week',
            'Two days a week',
            'Three days a week',
            'Every day'
          ],
          correctAnswer: 1,
          explanation: 'ผู้หญิงพูดว่า "we can work from home two days a week" ระบุจำนวนวันได้ชัดเจน'
        },
        {
          id: 9,
          conversationId: 3,
          question: 'Why does the woman prefer remote work?',
          options: [
            'She doesn\'t like her coworkers',
            'The commute is tiring',
            'She has family responsibilities',
            'Her home office is better'
          ],
          correctAnswer: 1,
          explanation: 'ผู้หญิงพูดว่า "The commute is really tiring" เป็นเหตุผลที่เธอต้องการทำงานจากที่บ้าน'
        }
      ]
    }
  ];

  const allQuestions = conversations.flatMap(conv => conv.questions);
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
    const questionsInConversation = conversations[currentConversation].questions.length;
    
    if (currentQuestion < questionsInConversation - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentConversation < conversations.length - 1) {
      setCurrentConversation(currentConversation + 1);
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
    } else if (currentConversation > 0) {
      setCurrentConversation(currentConversation - 1);
      const prevConvQuestions = conversations[currentConversation - 1].questions.length;
      setCurrentQuestion(prevConvQuestions - 1);
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

  const currentConv = conversations[currentConversation];
  const currentQ = currentConv.questions[currentQuestion];
  const globalQuestionIndex = conversations
    .slice(0, currentConversation)
    .reduce((sum, conv) => sum + conv.questions.length, 0) + currentQuestion;

  if (showResults) {
    const score = calculateScore();
    const correctCount = allQuestions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6">
                <span className="text-5xl">🎉</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                ผลการทำข้อสอบ
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                TOEIC Part 3 - Conversations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
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
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {conversations.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  บทสนทนา
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {conversations.map((conv, convIndex) => (
                <div key={conv.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Conversation {convIndex + 1}: {conv.title}
                  </h3>
                  {conv.questions.map((question, qIndex) => {
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
                  setCurrentConversation(0);
                  setCurrentQuestion(0);
                  setSelectedAnswers({});
                  setTimeLeft(900);
                }}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
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
                  TOEIC Part 3 - Conversations
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Conversation {currentConversation + 1} of {conversations.length} • Question {currentQuestion + 1} of {currentConv.questions.length}
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎧</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Audio Player
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentConv.title}
                  </p>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={currentConv.audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <button
                onClick={handlePlayAudio}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
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

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 ฟังบทสนทนาได้มากกว่า 1 ครั้ง
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
                  Transcript (บทสนทนา)
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
                    {currentConv.transcript}
                  </pre>
                </div>
              )}

              {!showTranscript && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  คลิกเพื่อดูบทสนทนา (แนะนำให้ฟังก่อน)
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
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium">
                    Conversation {currentConversation + 1}
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
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedAnswers[currentQ.id] === index
                          ? 'border-blue-600 bg-blue-600'
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
                  disabled={currentConversation === 0 && currentQuestion === 0}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← ย้อนกลับ
                </button>
                
                {currentConversation === conversations.length - 1 && 
                 currentQuestion === currentConv.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    ส่งคำตอบ
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {Object.keys(selectedAnswers).length}/{totalQuestions} ข้อ
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
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