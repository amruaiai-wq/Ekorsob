// app/categories/toeic/listening/page.tsx
import Link from "next/link";

const listeningParts = [
  {
    part: "Part 1",
    title: "Photographs",
    titleTh: "ดูรูปภาพและฟังคำบรรยาย",
    description: "ฟังคำบรรยาย 4 ข้อ เลือกข้อที่ตรงกับรูปภาพที่สุด",
    questions: "6 ข้อ",
    icon: "📷",
    gradient: "from-pink-500 to-rose-500",
    link: "/categories/toeic/listening/part-1",
    color: "pink",
    sets: 0 // จำนวนชุดข้อสอบที่มี
  },
  {
    part: "Part 2",
    title: "Question-Response",
    titleTh: "คำถาม-คำตอบ",
    description: "ฟังคำถาม 1 ข้อ และคำตอบ 3 ข้อ เลือกคำตอบที่เหมาะสมที่สุด",
    questions: "25 ข้อ",
    icon: "💬",
    gradient: "from-orange-500 to-amber-500",
    link: "/categories/toeic/listening/part-2",
    color: "orange",
    sets: 0
  },
  {
    part: "Part 3",
    title: "Conversations",
    titleTh: "บทสนทนา",
    description: "ฟังบทสนทนาระหว่าง 2-3 คน แล้วตอบคำถาม 3 ข้อ",
    questions: "39 ข้อ",
    icon: "👥",
    gradient: "from-cyan-500 to-blue-500",
    link: "/categories/toeic/listening/part-3",
    color: "cyan",
    sets: 0
  },
  {
    part: "Part 4",
    title: "Talks",
    titleTh: "การพูดเดี่ยว",
    description: "ฟังการพูดของคนเดียว เช่น ประกาศ สปีช แล้วตอบคำถาม 3 ข้อ",
    questions: "30 ข้อ",
    icon: "🎤",
    gradient: "from-violet-500 to-purple-500",
    link: "/categories/toeic/listening/part-4",
    color: "violet",
    sets: 0
  }
];

export default function TOEICListeningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-pink-950">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-600 to-violet-600 dark:from-pink-800 dark:via-rose-800 dark:to-violet-800">
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
            <span className="text-5xl">🎧</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            TOEIC Listening
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-2 max-w-3xl mx-auto">
            ฝึกทักษะการฟังภาษาอังกฤษ Part 1-4 พร้อมเฉลยละเอียด
          </p>

          {/* Stats Badge */}
          <div className="inline-flex items-center px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mt-4">
            <span className="text-white font-semibold">
              รวม 100 ข้อ | 45 นาที
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
          <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-violet-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Parts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {listeningParts.map((part, index) => (
            <Link
              key={part.part}
              href={part.link}
              className="group relative animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-pink-300 dark:hover:border-pink-700 transform hover:-translate-y-2 hover:scale-105">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${part.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Coming Soon or Sets Count Badge */}
                {part.sets === 0 ? (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs font-bold rounded-full border border-yellow-300 dark:border-yellow-700">
                      ยังไม่มีข้อสอบ
                    </span>
                  </div>
                ) : (
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
                <div className="relative p-6 pt-16">
                  {/* Part Number */}
                  <div className={`inline-block px-4 py-1 bg-gradient-to-r ${part.gradient} text-white text-sm font-bold rounded-full mb-3`}>
                    {part.part}
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-${part.color}-600 dark:group-hover:text-${part.color}-400 transition-colors`}>
                    {part.title}
                  </h3>

                  {/* Thai Title */}
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {part.titleTh}
                  </p>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed min-h-[4.5rem] text-sm">
                    {part.description}
                  </p>

                  {/* Questions Count */}
                  <div className={`inline-flex items-center px-4 py-2 bg-${part.color}-50 dark:bg-${part.color}-900/30 rounded-full text-sm font-semibold text-${part.color}-600 dark:text-${part.color}-300 mb-6`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    {part.questions}
                  </div>

                  {/* Arrow */}
                  <div className={`flex items-center text-${part.color}-600 dark:text-${part.color}-400 font-semibold group-hover:text-${part.color}-700 dark:group-hover:text-${part.color}-300`}>
                    <span className="mr-2">{part.sets > 0 ? 'เริ่มทำข้อสอบ' : 'เข้าดูรายละเอียด'}</span>
                    <svg 
                      className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
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
        <div className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-r from-pink-50 to-violet-50 dark:from-pink-900/20 dark:to-violet-900/20 rounded-3xl border border-pink-200 dark:border-pink-800">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                💡 เคล็ดลับการฝึกฝน TOEIC Listening
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span><strong>Part 1:</strong> จดจ่อกับรายละเอียดในภาพ (คน, สิ่งของ, สถานที่, การกระทำ)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span><strong>Part 2:</strong> ฟัง Wh-question ให้ชัด (Who, What, When, Where, Why, How)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span><strong>Part 3:</strong> อ่านคำถามก่อนฟัง จะได้รู้ว่าต้องจับประเด็นอะไร</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span><strong>Part 4:</strong> จับใจความสำคัญ และฟัง key words ที่เกี่ยวข้องกับคำถาม</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}