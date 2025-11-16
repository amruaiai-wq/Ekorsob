// app/categories/toeic/reading/part-6/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Part6Client from "./Part6Client";

export default async function Part6Page() {
  const supabase = await createSupabaseServerClient();

  // ดึงข้อมูลชุดข้อสอบ Part 6 จาก Database
  const { data: tests } = await supabase
    .from('Tests')
    .select('*')
    .eq('category', 'toeic')
    .eq('subcategory', 'reading')
    .eq('part', 'Part 6')
    .order('test_number', { ascending: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 dark:from-blue-800 dark:via-cyan-800 dark:to-sky-800">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6 py-12">
          {/* Back Button */}
          <Link 
            href="/categories/toeic/reading"
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับไป TOEIC Reading
          </Link>

          <div className="flex items-center gap-6">
            {/* Icon */}
            <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>

            <div>
              {/* Badge */}
              <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-bold mb-2">
                Part 6
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
                Text Completion
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/90">
                เติมข้อความให้สมบูรณ์ | 16 ข้อต่อชุด
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component with Tests Data */}
      <Part6Client tests={tests || []} />
    </div>
  );
}