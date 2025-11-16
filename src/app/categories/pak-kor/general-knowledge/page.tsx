// src/app/categories/pak-kor/general-knowledge/page.tsx
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function GeneralKnowledgePage() {
  const supabase = await createSupabaseServerClient()

  const { data: tests, error } = await supabase
    .from('Tests')
    .select('id, title, description, difficulty, created_at')
    .eq('category', 'pak-kor')
    .eq('subcategory', 'general-knowledge')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-6 py-16">
        <Link 
          href="/categories/pak-kor" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับไป ภาค ก.
        </Link>

        <div className="text-center mb-16">
          <span className="text-7xl mb-6 inline-block">📚</span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            ความรู้ทั่วไป
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            ความรู้ทั่วไป กฎหมาย และลักษณะการเป็นข้าราชการที่ดี
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <TestsList tests={tests} error={error} color="blue" />
      </div>
    </div>
  )
}

// Reusable Tests List Component
function TestsList({ tests, error, color }: any) {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        ชุดข้อสอบทั้งหมด ({tests?.length || 0})
      </h2>

      {error ? (
        <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-3xl">
          <span className="text-6xl mb-4 inline-block">⚠️</span>
          <p className="text-red-600 dark:text-red-400 text-lg">เกิดข้อผิดพลาดในการโหลดข้อสอบ</p>
        </div>
      ) : tests && tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test: any, index: number) => (
            <TestCard key={test.id} test={test} index={index} color={color} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

function TestCard({ test, index, color }: any) {
  return (
    <Link href={`/test/${test.id}`} className="group">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-${color}-400 dark:hover:border-${color}-600 transform hover:-translate-y-2`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 bg-${color}-100 dark:bg-${color}-900/50 text-${color}-600 dark:text-${color}-300 rounded-full text-sm font-bold`}>
            ชุดที่ {index + 1}
          </span>
          {test.difficulty && <DifficultyBadge level={test.difficulty} />}
        </div>
        <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-${color}-600 dark:group-hover:text-${color}-400 transition-colors`}>
          {test.title || `ข้อสอบชุดที่ ${index + 1}`}
        </h3>
        {test.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{test.description}</p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">150 คำถาม</span>
          <div className={`flex items-center text-${color}-600 dark:text-${color}-400 font-semibold text-sm`}>
            เริ่มทำข้อสอบ
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
      <span className="text-6xl mb-4 inline-block">📭</span>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ยังไม่มีข้อสอบในส่วนนี้</h3>
      <p className="text-gray-600 dark:text-gray-300">กำลังเพิ่มข้อสอบเร็ว ๆ นี้</p>
    </div>
  )
}

function DifficultyBadge({ level }: { level: string }) {
  const configs: any = {
    easy: { label: 'ง่าย', icon: '🟢', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    medium: { label: 'ปานกลาง', icon: '🟡', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    hard: { label: 'ยาก', icon: '🔴', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
  }
  const config = configs[level] || configs.medium
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}