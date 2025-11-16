// app/categories/toeic/reading/page.tsx
import Link from "next/link";

const readingParts = [
  {
    part: "Part 5",
    title: "Incomplete Sentences",
    titleTh: "เติมประโยคให้สมบูรณ์",
    description: "ฝึกทักษะการอ่านประโยคเดี่ยว พร้อมเลือกคำศัพท์หรือโครงสร้างไวยากรณ์ที่เหมาะสม",
    questions: "30 ข้อ",
    icon: "📝",
    gradient: "from-purple-500 to-pink-500",
    link: "/categories/toeic/reading/part-5",
    color: "purple",
    sets: 25 // จำนวนชุดข้อสอบที่มี
  },
  {
    part: "Part 6",
    title: "Text Completion",
    titleTh: "เติมข้อความให้สมบูรณ์",
    description: "ฝึกทักษะการอ่านบทความสั้น และเลือกประโยคหรือคำที่เหมาะสมที่สุดให้สอดคล้องกับบริบท",
    questions: "16 ข้อ",
    icon: "📄",
    gradient: "from-blue-500 to-cyan-500",
    link: "/categories/toeic/reading/part-6",
    color: "blue",
    sets: 0 // ยังไม่มีชุดข้อสอบ
  },
  {
    part: "Part 7",
    title: "Reading Comprehension",
    titleTh: "ความเข้าใจในการอ่าน",
    description: "ฝึกทักษะการอ่านบทความยาว เอกสาร และการจับใจความสำคัญของข้อความ",
    questions: "54 ข้อ",
    icon: "📚",
    gradient: "from-green-500 to-emerald-500",
    link: "/categories/toeic/reading/part-7",
    color: "green",
    sets: 0 // ยังไม่มีชุดข้อสอบ
  }
];

export default function TOEICReadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-800 dark:via-blue-800 dark:to-cyan-800">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-6 py-16 text-center">
          {/* Back Button */}
          <Link 
            href="/categories/toeic"
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับไปหน้า TOEIC
          </Link>

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 animate-bounce-slow">
            <span className="text-5xl">📖</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            TOEIC Reading
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-2 max-w-3xl mx-auto">
            ฝึกทักษะการอ่านภาษาอังกฤษ Part 5-7 พร้อมเฉลยละเอียด
          </p>

          {/* Stats Badge */}
          <div className="inline-flex items-center px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mt-4">
            <span className="text-white font-semibold">
              รวม 100 ข้อ | 75 นาที
            </span>
          </div>
        </div>
      </div>

      {/* Parts Grid */}
      <div className="container mx-auto px-6 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            เลือก Part ที่ต้องการฝึกฝน
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            เลือก Part ที่คุณต้องการฝึกฝน แล้วเริ่มทำข้อสอบได้เลย
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Parts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {readingParts.map((part, index) => (
            <Link
              key={part.part}
              href={part.link}
              className="group relative animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 transform hover:-translate-y-2 hover:scale-105">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${part.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Coming Soon Badge */}
                {part.sets === 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs font-bold rounded-full border border-yellow-300 dark:border-yellow-700">
                      ยังไม่มีข้อสอบ
                    </span>
                  </div>
                )}

                {/* Sets Count Badge */}
                {part.sets > 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 bg-${part.color}-100 dark:bg-${part.color}-900/50 text-${part.color}-600 dark:text-${part.color}-300 text-xs font-bold rounded-full border border-${part.color}-300 dark:border-${part.color}-700`}>
                      {part.sets} ชุด
                    </span>
                  </div>
                )}

                {/* Icon Badge */}
                <div className={`absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br ${part.gradient} rounded-full flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500`}>
                  <span className="text-5xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">{part.icon}</span>
                </div>

                {/* Content */}
                <div className="relative p-8 pt-16">
                  {/* Part Number */}
                  <div className={`inline-block px-4 py-1 bg-gradient-to-r ${part.gradient} text-white text-sm font-bold rounded-full mb-3`}>
                    {part.part}
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-${part.color}-600 dark:group-hover:text-${part.color}-400 transition-colors`}>
                    {part.title}
                  </h3>

                  {/* Thai Title */}
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {part.titleTh}
                  </p>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed min-h-[4.5rem]">
                    {part.description}
                  </p>

                  {/* Questions Count */}
                  <div className={`inline-flex items-center px-4 py-2 bg-${part.color}-50 dark:bg-${part.color}-900/30 rounded-full text-sm font-semibold text-${part.color}-600 dark:text-${part.color}-300 mb-6`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {part.questions}
                  </div>

                  {/* Arrow */}
                  {part.sets > 0 ? (
                    <div className={`flex items-center text-${part.color}-600 dark:text-${part.color}-400 font-semibold group-hover:text-${part.color}-700 dark:group-hover:text-${part.color}-300`}>
                      <span className="mr-2">เริ่มทำข้อสอบ</span>
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`flex items-center text-${part.color}-600 dark:text-${part.color}-400 font-semibold group-hover:text-${part.color}-700 dark:group-hover:text-${part.color}-300`}>
                      <span className="mr-2">เข้าดูรายละเอียด</span>
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-3xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                💡 เคล็ดลับการฝึกฝน TOEIC Reading
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Part 5:</strong> มุ่งเน้นไวยากรณ์และคำศัพท์ ควรฝึกให้ทำได้รวดเร็วประมาณ 30 วินาทีต่อข้อ</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>Part 6:</strong> อ่านทั้งบทความเพื่อเข้าใจบริบท ไม่ใช่แค่ประโยคเดียว</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span><strong>Part 7:</strong> อ่านคำถามก่อนอ่านบทความ จะช่วยให้หาคำตอบได้เร็วขึ้น</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}