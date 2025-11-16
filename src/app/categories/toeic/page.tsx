// src/app/categories/toeic/page.tsx
import Link from 'next/link'

const subcategories = [
  {
    name: 'Listening',
    slug: 'listening',
    icon: '🎧',
    description: 'ฝึกทักษะการฟัง Part 1-4',
    stats: '45 ชุด | 720+ ข้อ',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Reading',
    slug: 'reading',
    icon: '📖',
    description: 'ฝึกทักษะการอ่าน Part 5-7',
    stats: '45 ชุด | 720+ ข้อ',
    color: 'from-purple-500 to-pink-500',
  },
]

export default function TOEICCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-6 py-16">
        {/* Back Button */}
        <Link 
          href="/app" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-8 transition-colors group"
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
          <span className="text-7xl mb-6 inline-block animate-bounce">🇬🇧</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            TOEIC Practice Tests
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            แบบทดสอบภาษาอังกฤษเพื่อการสื่อสารสากล พร้อมเฉลยละเอียดและคำแนะนำจาก AI
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">90+</div>
            <div className="text-gray-600 dark:text-gray-300">ชุดข้อสอบ</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">1,800+</div>
            <div className="text-gray-600 dark:text-gray-300">คำถาม</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">AI</div>
            <div className="text-gray-600 dark:text-gray-300">เฉลยละเอียด</div>
          </div>
        </div>

        {/* Subcategories Section */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          เลือกส่วนที่ต้องการฝึก
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {subcategories.map((sub, index) => (
            <Link
              key={sub.slug}
              href={`/categories/toeic/${sub.slug}`}
              className="group"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 transform hover:-translate-y-2">
                {/* Icon */}
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                  {sub.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {sub.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {sub.description}
                </p>

                {/* Stats Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/50 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-300 mb-4">
                  {sub.stats}
                </div>

                {/* Arrow */}
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                  <span className="mr-2">เริ่มฝึกฝน</span>
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl`}></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white text-center shadow-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">🎯 เริ่มต้นฝึกฝน TOEIC วันนี้!</h3>
          <p className="text-blue-100 text-lg">
            เลือกส่วน Listening หรือ Reading ด้านบนเพื่อเริ่มฝึกทำข้อสอบ
          </p>
        </div>
      </div>
    </div>
  )
}