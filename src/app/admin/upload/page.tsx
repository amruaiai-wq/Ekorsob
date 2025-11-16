// src/app/admin/upload/page.tsx
'use client'

import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Question {
  question_text: string
  question_type: string
  choices: string[] | null
  correct_answer: string
  explanation: string | null
  order_num: number
}

interface TestData {
  title: string
  description?: string
  category?: string
  subcategory?: string
  part?: string
  difficulty?: string
  time_limit_minutes?: number
  test_number?: number
  questions: Question[]
}

// โครงสร้างหมวดหมู่
const CATEGORIES = [
  {
    value: 'a-level',
    label: '🎓 A-Level',
    subcategories: [
      { value: 'biology', label: 'ชีววิทยา' },
      { value: 'chemistry', label: 'เคมี' },
      { value: 'english', label: 'ภาษาอังกฤษ' },
      { value: 'math-1', label: 'คณิตศาสตร์ 1' },
      { value: 'math-2', label: 'คณิตศาสตร์ 2' },
      { value: 'physics', label: 'ฟิสิกส์' },
      { value: 'social', label: 'สังคมศึกษา' },
      { value: 'thai', label: 'ภาษาไทย' }
    ]
  },
  {
    value: 'customs',
    label: '🛃 ข้อสอบศุลกากร',
    subcategories: [
      { value: 'analytical-thinking', label: 'การคิดวิเคราะห์' },
      { value: 'customs-law', label: 'กฎหมายศุลกากร' },
      { value: 'english', label: 'ภาษาอังกฤษ' },
      { value: 'general-knowledge', label: 'ความรู้ทั่วไป' }
    ]
  },
  {
    value: 'pak-kor',
    label: '📋 ข้อสอบ ภาค ก.',
    subcategories: [
      { value: 'english', label: 'ภาษาอังกฤษ' },
      { value: 'general-knowledge', label: 'ความรู้ทั่วไป' },
      { value: 'math-reasoning', label: 'คณิตศาสตร์และเหตุผล' },
      { value: 'thai', label: 'ภาษาไทย' }
    ]
  },
  {
    value: 'toeic',
    label: '🇬🇧 TOEIC',
    subcategories: [
      { 
        value: 'listening', 
        label: 'Listening',
        parts: [
          { value: 'Part 1', label: 'Part 1 - Photographs' },
          { value: 'Part 2', label: 'Part 2 - Question-Response' },
          { value: 'Part 3', label: 'Part 3 - Conversations' },
          { value: 'Part 4', label: 'Part 4 - Short Talks' }
        ]
      },
      { 
        value: 'reading', 
        label: 'Reading',
        parts: [
          { value: 'Part 5', label: 'Part 5 - Incomplete Sentences' },
          { value: 'Part 6', label: 'Part 6 - Text Completion' },
          { value: 'Part 7', label: 'Part 7 - Reading Comprehension' }
        ]
      }
    ]
  }
]

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<TestData | null>(null)
  const [fileType, setFileType] = useState<'json' | 'excel' | 'csv' | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const supabase = createSupabaseClient()

  // ฟังก์ชันแปลง Excel/CSV
  const parseExcelOrCSV = async (file: File): Promise<TestData | null> => {
    try {
      const XLSX = await import('xlsx')
      
      return new Promise((resolve) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          try {
            const data = e.target?.result
            let workbook
            
            if (file.name.toLowerCase().endsWith('.csv')) {
              workbook = XLSX.read(data, { type: 'string' })
            } else {
              workbook = XLSX.read(data, { type: 'array' })
            }
            
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[]
            
            const questions: Question[] = []
            
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i]
              if (!row[1]) continue
              
              const choices = [
                row[2]?.toString() || '',
                row[3]?.toString() || '',
                row[4]?.toString() || '',
                row[5]?.toString() || '',
              ]

              const question: Question = {
                question_text: row[1]?.toString() || '',
                question_type: 'multiple_choice',
                choices: choices,
                correct_answer: row[6]?.toString() || '1',
                explanation: row[7]?.toString() || null,
                order_num: i
              }
              
              if (question.question_text && question.choices && question.choices.every(c => c)) {
                questions.push(question)
              }
            }

            if (questions.length === 0) {
              alert('❌ ไม่พบข้อสอบในไฟล์')
              resolve(null)
              return
            }

            const testData: TestData = {
              title: 'ชุดข้อสอบจากไฟล์',
              difficulty: 'ปานกลาง',
              time_limit_minutes: 60,
              test_number: 1,
              questions: questions
            }

            resolve(testData)
          } catch (error) {
            console.error('Parse error:', error)
            alert('❌ ไม่สามารถอ่านไฟล์ได้')
            resolve(null)
          }
        }
        
        if (file.name.toLowerCase().endsWith('.csv')) {
          reader.readAsText(file)
        } else {
          reader.readAsArrayBuffer(file)
        }
      })
    } catch (error) {
      alert('❌ กรุณาติดตั้ง: npm install xlsx')
      return null
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setPreview(null)
    
    const fileName = selectedFile.name.toLowerCase()

    try {
      if (fileName.endsWith('.json')) {
        setFileType('json')
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const json = JSON.parse(event.target?.result as string)
            setPreview(json)
          } catch (error) {
            alert('❌ ไฟล์ JSON ไม่ถูกต้อง')
            setFile(null)
          }
        }
        reader.readAsText(selectedFile)
      } 
      else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        setFileType('excel')
        const testData = await parseExcelOrCSV(selectedFile)
        if (testData) setPreview(testData)
        else setFile(null)
      }
      else if (fileName.endsWith('.csv')) {
        setFileType('csv')
        const testData = await parseExcelOrCSV(selectedFile)
        if (testData) setPreview(testData)
        else setFile(null)
      }
      else {
        alert('❌ ประเภทไฟล์ไม่ถูกต้อง')
        setFile(null)
      }
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาดในการอ่านไฟล์')
      setFile(null)
    }
  }

  const updatePreviewField = (field: keyof TestData, value: any) => {
    if (!preview) return
    setPreview({ ...preview, [field]: value })
  }

  const getCurrentSubcategories = () => {
    const category = CATEGORIES.find(c => c.value === selectedCategory)
    return category?.subcategories || []
  }

  const getCurrentParts = () => {
    const category = CATEGORIES.find(c => c.value === selectedCategory)
    const subcategory = category?.subcategories.find(s => s.value === selectedSubcategory)
    return (subcategory as any)?.parts || []
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedCategory(value)
    setSelectedSubcategory('')
    if (preview) {
      setPreview({
        ...preview,
        category: value,
        subcategory: '',
        part: ''
      })
    }
  }

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedSubcategory(value)
    if (preview) {
      setPreview({
        ...preview,
        subcategory: value,
        part: ''
      })
    }
  }

  const handlePartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (preview) {
      setPreview({
        ...preview,
        part: value
      })
    }
  }

  const handleUpload = async () => {
    if (!preview || !preview.category || !preview.subcategory) {
      alert('❌ กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    // สำหรับ TOEIC ต้องมี Part
    if (preview.category === 'toeic' && !preview.part) {
      alert('❌ กรุณาเลือก Part สำหรับข้อสอบ TOEIC')
      return
    }

    setLoading(true)

    try {
      // หาเลข test_number ถัดไป
      const { data: existingTests } = await supabase
        .from('Tests')
        .select('test_number')
        .eq('category', preview.category)
        .eq('subcategory', preview.subcategory)
        .eq('part', preview.part || '')
        .order('test_number', { ascending: false })
        .limit(1)

      const nextTestNumber = existingTests && existingTests.length > 0 
        ? (existingTests[0].test_number || 0) + 1 
        : 1

      const testToInsert = {
        title: preview.title,
        description: preview.description || null,
        category: preview.category,
        subcategory: preview.subcategory,
        part: preview.part || null,
        difficulty: preview.difficulty || 'ปานกลาง',
        total_questions: preview.questions.length,
        test_number: nextTestNumber,
        is_active: true
      }

      const { data: test, error: testError } = await supabase
        .from('Tests')
        .insert([testToInsert])
        .select()
        .single()

      if (testError) {
        console.error('Test insert error:', testError)
        throw new Error('ไม่สามารถสร้างชุดข้อสอบได้: ' + testError.message)
      }

      console.log('✅ Test created:', test)
      console.log('Test ID:', test?.id)

      if (!test || !test.id) {
        throw new Error('ไม่สามารถรับ Test ID ได้')
      }

      const questionsToInsert = preview.questions.map((q, index) => ({
        test_id: test.id,  // ✅ เปลี่ยนจาก test.test_id เป็น test.id
        question_text: q.question_text,
        question_type: q.question_type || 'multiple_choice',
        choices: q.choices || null,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null,
        order_num: q.order_num || index + 1,
      }))

      console.log('📝 Inserting questions:', questionsToInsert.length)

      const { error: questionsError } = await supabase
        .from('Question')
        .insert(questionsToInsert)

      if (questionsError) {
        console.error('Questions insert error:', questionsError)
        throw new Error('ไม่สามารถเพิ่มข้อสอบได้: ' + questionsError.message)
      }

      console.log('✅ Questions inserted successfully')

      const successMessage = preview.part 
        ? `✅ Upload สำเร็จ!\nเพิ่มข้อสอบ ${preview.questions.length} ข้อ\nหมวดหมู่: ${preview.category} → ${preview.subcategory} → ${preview.part}\nชุดที่: ${nextTestNumber}`
        : `✅ Upload สำเร็จ!\nเพิ่มข้อสอบ ${preview.questions.length} ข้อ\nหมวดหมู่: ${preview.category} → ${preview.subcategory}\nชุดที่: ${nextTestNumber}`

      alert(successMessage)

      // Redirect ตาม category
      if (preview.category === 'toeic' && preview.part) {
        // TOEIC with Part
        const partNumber = preview.part.replace('Part ', 'part-')
        const subCategoryPath = preview.subcategory.toLowerCase()
        router.push(`/categories/toeic/${subCategoryPath}/${partNumber}`)
      } else {
        // หมวดอื่น ๆ (a-level, customs, pak-kor)
        router.push(`/categories/${preview.category}/${preview.subcategory}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ เกิดข้อผิดพลาด: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          📤 อัพโหลดข้อสอบ
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          
          {/* File Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ไฟล์ข้อสอบ *
            </label>
            <input
              type="file"
              accept=".json,.xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-3 file:px-6
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                ✓ {file.name}
              </p>
            )}
          </div>

          {/* Form แสดงเฉพาะเมื่อมีไฟล์ */}
          {preview && (
            <>
              {/* ชื่อชุดข้อสอบ */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ชื่อชุดข้อสอบ *
                </label>
                <input
                  type="text"
                  value={preview.title}
                  onChange={(e) => updatePreviewField('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="เช่น: TOEIC Part 1 - Photographs Set 1"
                />
              </div>

              {/* หมวดหมู่หลัก */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  หมวดหมู่หลัก *
                </label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* หมวดหมู่ย่อย */}
              {selectedCategory && getCurrentSubcategories().length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    หมวดหมู่ย่อย *
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={handleSubcategoryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">เลือกหมวดหมู่ย่อย</option>
                    {getCurrentSubcategories().map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Part (สำหรับ TOEIC) */}
              {selectedCategory === 'toeic' && selectedSubcategory && getCurrentParts().length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Part * (สำหรับ TOEIC)
                  </label>
                  <select
                    value={preview.part || ''}
                    onChange={handlePartChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">เลือก Part</option>
                    {getCurrentParts().map((part: any) => (
                      <option key={part.value} value={part.value}>
                        {part.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    ระดับความยาก
                  </label>
                  <select
                    value={preview.difficulty || 'ปานกลาง'}
                    onChange={(e) => updatePreviewField('difficulty', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="ง่าย">ง่าย</option>
                    <option value="ปานกลาง">ปานกลาง</option>
                    <option value="ยาก">ยาก</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    เวลาทำข้อสอบ (นาที)
                  </label>
                  <input
                    type="number"
                    value={preview.time_limit_minutes || 60}
                    onChange={(e) => updatePreviewField('time_limit_minutes', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  value={preview.description || ''}
                  onChange={(e) => updatePreviewField('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                  placeholder="คำอธิบายเพิ่มเติมเกี่ยวกับชุดข้อสอบนี้"
                />
              </div>

              {/* ตรวจสอบข้อมูล */}
              <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-bold mb-4 dark:text-white">📋 ตรวจสอบข้อมูล</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>ชื่อ:</strong> {preview.title}</p>
                  <p>
                    <strong>หมวดหมู่:</strong>{' '}
                    {preview.category && preview.subcategory ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {CATEGORIES.find(c => c.value === preview.category)?.label} 
                        {' → '}
                        {getCurrentSubcategories().find(s => s.value === preview.subcategory)?.label}
                        {preview.part && ` → ${preview.part}`}
                      </span>
                    ) : (
                      <span className="text-red-600">ยังไม่ได้เลือก</span>
                    )}
                  </p>
                  <p><strong>จำนวนข้อ:</strong> <span className="text-green-600 font-bold">{preview.questions?.length || 0} ข้อ</span></p>
                  <p><strong>ระดับความยาก:</strong> {preview.difficulty === 'ง่าย' ? '🟢 ง่าย' : preview.difficulty === 'ยาก' ? '🔴 ยาก' : '🟡 ปานกลาง'}</p>
                  <p><strong>เวลา:</strong> {preview.time_limit_minutes} นาที</p>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!preview.category || !preview.subcategory || (selectedCategory === 'toeic' && !preview.part) || loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 กำลัง Upload...' : '📤 Upload ข้อสอบ'}
              </button>
            </>
          )}

          {/* ข้อความเมื่อยังไม่ได้เลือกไฟล์ */}
          {!preview && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>📁 กรุณาเลือกไฟล์ข้อสอบ (.json, .xlsx, .csv)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}