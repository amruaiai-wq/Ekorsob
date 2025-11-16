// src/app/categories/pak-kor/page.tsx
import Link from 'next/link'

const subcategories = [
  {
    name: 'ความรู้ทั่วไป',
    slug: 'general-knowledge',
    icon: '📚',
    description: 'ความรู้ทั่วไป กฎหมาย และลักษณะการเป็นข้าราชการที่ดี',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'คณิตศาสตร์และเหตุผล',
    slug: 'math-reasoning',
    icon: '🧮',
    description: 'ความสามารถในการคิดวิเคราะห์และแก้ปัญหา',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'ภาษาอังกฤษ',
    slug: 'english',
    icon: '🇬🇧',
    description: 'ทักษะภาษาอังกฤษ Conversation, Grammar, Vocabulary และ Reading',
    stats: 'กำลังเพิ่มข้อสอบ',
    color: 'from-indigo-500 to-blue-500',
  },
]

export default function PakKorCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-6 py-16">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium mb-8 transition-colors group"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับหน้าหลัก
        </Link>

        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-7xl mb-6 inline-block animate-bounce">📋</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            ข้อสอบ ภาค ก. (ก.พ.)
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            ความรู้ความสามารถทั่วไป สำหรับเตรียมสอบราชการ พร้อมเฉลยละเอียด
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">3</div>
            <div className="text-gray-600 dark:text-gray-300">หมวดวิชา</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">30</div>
            <div className="text-gray-600 dark:text-gray-300">ข้อต่อชุด</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">60</div>
            <div className="text-gray-600 dark:text-gray-300">นาที</div>
          </div>
        </div>

        {/* Subcategories Section */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          เลือกวิชาที่ต้องการฝึก
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {subcategories.map((sub, index) => (
            <Link
              key={sub.slug}
              href={`/categories/pak-kor/${sub.slug}`}
              className="group"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-600 transform hover:-translate-y-2 h-full">
                {/* Icon */}
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform text-center">
                  {sub.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {sub.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 text-center">
                  {sub.description}
                </p>

                {/* Stats Badge */}
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 bg-purple-50 dark:bg-purple-900/50 rounded-full text-xs font-semibold text-purple-600 dark:text-purple-300">
                    {sub.stats}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center shadow-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">🎯 เตรียมสอบราชการอย่างมั่นใจ!</h3>
          <p className="text-purple-100 text-lg">
            ฝึกทำข้อสอบทุกวัน เพื่อเพิ่มโอกาสสอบผ่านและได้งานราชการในฝัน
          </p>
        </div>
      </div>
    </div>
  )
}