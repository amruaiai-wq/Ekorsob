'use client';

import Link from "next/link";
import { useState } from "react";

interface Test {
  id: string;
  title: string;
  description?: string;
  test_number: number;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ยาก';
  category: string;
  sub_category: string;
  part: string;
}

interface Part4ClientProps {
  tests: Test[];
}

export default function Part4Client({ tests }: Part4ClientProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ทั้งหมด');

  // กรองชุดข้อสอบตามระดับความยาก
  const filteredTests = selectedDifficulty === 'ทั้งหมด' 
    ? tests 
    : tests.filter(test => test.difficulty === selectedDifficulty);

  // นับจำนวนชุดข้อสอบในแต่ละระดับความยาก
  const easyCount = tests.filter(t => t.difficulty === 'ง่าย').length;
  const mediumCount = tests.filter(t => t.difficulty === 'ปานกลาง').length;
  const hardCount = tests.filter(t => t.difficulty === 'ยาก').length;

  const difficulties = [
    { label: 'ทั้งหมด', value: 'ทั้งหมด', count: tests.length, color: 'violet' },
    { label: 'ง่าย', value: 'ง่าย', count: easyCount, color: 'green' },
    { label: 'ปานกลาง', value: 'ปานกลาง', count: mediumCount, color: 'yellow' },
    { label: 'ยาก', value: 'ยาก', count: hardCount, color: 'red' },
  ];

  return (
    <div className="pb-20">
      {/* Stats Section */}
      <div className="bg-gradient-to-b from-violet-600/5 to-transparent dark:from-violet-900/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-violet-200 dark:border-violet-900 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                  {tests.length}
                </div>
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">ชุดข้อสอบทั้งหมด</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-green-200 dark:border-green-900 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {easyCount}
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">ระดับง่าย</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-yellow-200 dark:border-yellow-900 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {mediumCount}
                </div>
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">ระดับปานกลาง</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-red-200 dark:border-red-900 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {hardCount}
                </div>
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">ระดับยาก</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6">
        {/* Section Header with Filters */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            ชุดข้อสอบทั้งหมด ({filteredTests.length})
          </h2>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.value}
                onClick={() => setSelectedDifficulty(difficulty.value)}
                className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all transform hover:scale-105 ${
                  selectedDifficulty === difficulty.value
                    ? difficulty.color === 'violet'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-violet-500/50'
                      : difficulty.color === 'green'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-500/50'
                      : difficulty.color === 'yellow'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/50'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-500/50'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  {difficulty.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedDifficulty === difficulty.value
                      ? 'bg-white/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {difficulty.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        {filteredTests.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <Link
                key={test.id}
                href={`/categories/toeic/listening/part-4/${test.id}`}
                className="group"
              >
                <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/90 text-sm font-semibold">
                        ชุดที่ {test.test_number}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        test.difficulty === 'ง่าย'
                          ? 'bg-green-100 text-green-700'
                          : test.difficulty === 'ปานกลาง'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-100 transition-colors line-clamp-2">
                      {test.title}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Description */}
                    {test.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                        {test.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        9 ข้อ (3 บทพูด)
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ~15 นาที
                      </div>
                    </div>

                    {/* Start Button */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 dark:border-gray-700">
                      <span className="text-violet-600 dark:text-violet-400 font-bold group-hover:text-violet-700 dark:group-hover:text-violet-300">
                        เริ่มทำข้อสอบ
                      </span>
                      <svg 
                        className="w-6 h-6 text-violet-600 dark:text-violet-400 transform group-hover:translate-x-2 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-full mb-6">
              <svg className="w-12 h-12 text-violet-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ไม่พบชุดข้อสอบในระดับนี้
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ลองเลือกระดับความยากอื่น หรือเลือก "ทั้งหมด"
            </p>
            <button
              onClick={() => setSelectedDifficulty('ทั้งหมด')}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              ดูชุดข้อสอบทั้งหมด
            </button>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border-2 border-violet-200 dark:border-violet-800 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>💡</span>
                  <span>เทคนิคการทำ Part 4 ให้ได้คะแนนเต็ม</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                    <div className="flex-shrink-0 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">Preview คำถาม: </span>
                      <span className="text-gray-700 dark:text-gray-300">ใช้เวลาอ่านคำถามก่อนเริ่มฟังเพื่อรู้ว่าต้องจับประเด็นอะไร</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                    <div className="flex-shrink-0 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">จับประเด็นหลัก: </span>
                      <span className="text-gray-700 dark:text-gray-300">ฟังให้เข้าใจว่าผู้พูดคือใคร พูดที่ไหน และพูดเพื่ออะไร</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                    <div className="flex-shrink-0 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">จดบันทึก: </span>
                      <span className="text-gray-700 dark:text-gray-300">จด keyword สำคัญ เช่น ชื่อ วันที่ เวลา ตัวเลข สถานที่</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                    <div className="flex-shrink-0 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">ฟังทั้งหมด: </span>
                      <span className="text-gray-700 dark:text-gray-300">บางคำตอบอยู่ในช่วงท้าย อย่าเพิ่งตัดสินใจเร็วเกินไป</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}