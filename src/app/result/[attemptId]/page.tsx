'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResultPage() {
  const { attemptId } = useParams()
  const supabase = createClient()

  const [attempt, setAttempt] = useState<any>(null)
  const [test, setTest] = useState<any>(null)
  const [answers, setAnswers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      console.log('🔍 Loading results for attemptId:', attemptId);
      console.log('🔍 attemptId type:', typeof attemptId);
      
      if (!attemptId || attemptId === 'undefined') {
        console.error('❌ Invalid attemptId:', attemptId);
        setError('ไม่พบ ID การทำข้อสอบ')
        setLoading(false)
        return
      }

      try {
        // ✅ ดึงข้อมูล attempt
        const { data: attemptData, error: attemptError } = await supabase
          .from('TestAttempt')
          .select('*')
          .eq('id', attemptId)
          .single()

        if (attemptError || !attemptData) {
          console.error('❌ Attempt error:', attemptError);
          setError('ไม่พบข้อมูลการทำข้อสอบ')
          setLoading(false)
          return
        }
        
        console.log('✅ Attempt data loaded:', attemptData);
        setAttempt(attemptData)

        // ✅ ดึงข้อมูล test
        const { data: testData } = await supabase
          .from('Tests')
          .select('id, title, category, subcategory, total_questions')
          .eq('id', attemptData.test_id)
          .single()
        
        console.log('✅ Test data loaded:', testData);
        setTest(testData)

        // ✅ ดึงคำตอบทั้งหมด
        const { data: answersData } = await supabase
          .from('UserAnswer')
          .select('*')
          .eq('attempt_id', attemptId)
        
        console.log('✅ Answers loaded:', answersData?.length);
        setAnswers(answersData || [])

        setLoading(false)
      } catch (err) {
        console.error('❌ Load error:', err)
        setError('เกิดข้อผิดพลาดระหว่างโหลดข้อมูล')
        setLoading(false)
      }
    }

    loadResults()
  }, [attemptId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">กำลังโหลดผลคะแนน...</p>
        </div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Attempt ID: {String(attemptId)}</p>
          <Link
            href="/categories"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            ← กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    )
  }

  const correctCount = answers.filter(a => a.is_correct).length
  const totalQuestions = attempt.total_questions || test?.total_questions || 0
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const startTime = new Date(attempt.start_time)
  const endTime = new Date(attempt.end_time || new Date())
  const timeDiff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
  const minutes = Math.floor(timeDiff / 60)
  const seconds = timeDiff % 60

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-t-4 border-indigo-600">

          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              ผลลัพธ์การทำข้อสอบ
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <span className="text-xl">🎯</span>
              <p className="text-base font-semibold">{test?.title || 'ไม่ระบุชื่อข้อสอบ'}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(attempt.start_time).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* คะแนน */}
          <div className="text-center mb-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
            <div className={`text-6xl font-bold mb-2 ${
              scorePercent >= 80 ? 'text-green-600' :
              scorePercent >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {scorePercent}%
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ✓ ตอบถูก {correctCount}/{totalQuestions} ข้อ
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ⏱️ ใช้เวลา {minutes > 0 ? `${minutes} นาที ` : ''}{seconds} วินาที
            </p>
          </div>

          {/* ข้อความกำลังใจ */}
          <div className="text-center mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            {scorePercent >= 80 ? (
              <>
                <div className="text-3xl mb-2">🎉</div>
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-1">เยี่ยมมาก!</h3>
                <p className="text-sm text-purple-700 dark:text-purple-400">คุณทำได้ดีมาก! รักษาฟอร์มนี้ไว้นะ</p>
              </>
            ) : scorePercent >= 60 ? (
              <>
                <div className="text-3xl mb-2">💪</div>
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-1">ดีมาก!</h3>
                <p className="text-sm text-purple-700 dark:text-purple-400">คุณทำได้ดี ลองทำอีกครั้งเพื่อเพิ่มคะแนน!</p>
              </>
            ) : (
              <>
                <div className="text-3xl mb-2">📚</div>
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-1">อย่าท้อแท้!</h3>
                <p className="text-sm text-purple-700 dark:text-purple-400">ฝึกต่อไป คุณจะทำได้ดีขึ้นแน่นอน!</p>
              </>
            )}
          </div>

          {/* ปุ่ม Action */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link
              href={`/test/${attempt.test_id}`}
              className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm text-center hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              ทำใหม่อีกครั้ง
            </Link>
            <Link
              href={test ? `/categories/${test.category}/${test.subcategory}` : '/categories'}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              เลือกข้อสอบอื่น
            </Link>
          </div>

          {/* สรุปผล */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-green-600 dark:text-green-400 font-semibold mb-1 text-xs">✓ ตอบถูก</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">{correctCount} ข้อ</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-semibold mb-1 text-xs">✗ ตอบผิด</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">{totalQuestions - correctCount} ข้อ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}