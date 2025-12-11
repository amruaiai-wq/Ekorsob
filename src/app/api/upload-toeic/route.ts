// src/app/api/upload-toeic/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const testId = formData.get('testId') as string;
    const part = formData.get('part') as string; // 'part-5', 'part-6', 'part-7'

    if (!file || !testId || !part) {
      return NextResponse.json(
        { error: 'Missing file, testId, or part' },
        { status: 400 }
      );
    }

    // อ่านไฟล์ Excel
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Parsing ${part} with ${jsonData.length} rows`);

    let questions: any[] = [];

    // ============================================
    // PART 5: Incomplete Sentences
    // ============================================
    if (part === 'part-5') {
      questions = jsonData.map((row: any, index: number) => ({
        test_id: testId,
        order_num: row.order_num || index + 1,
        question_text: row.question_text || '',
        choices: [
          row.choice_a || '',
          row.choice_b || '',
          row.choice_c || '',
          row.choice_d || ''
        ],
        correct_answer: (row.correct_answer || 'A').toString().toUpperCase(),
        explanation: row.explanation || '',
        question_type: 'multiple_choice',
        part: 'part-5',
        passage: null,
        blank_number: null,
      }));
    }

    // ============================================
    // PART 6: Text Completion
    // ============================================
    else if (part === 'part-6') {
      questions = jsonData.map((row: any, index: number) => ({
        test_id: testId,
        order_num: row.order_num || index + 1,
        question_text: `(${row.blank_number || (index % 4) + 1}) ________`,
        choices: [
          row.choice_a || '',
          row.choice_b || '',
          row.choice_c || '',
          row.choice_d || ''
        ],
        correct_answer: (row.correct_answer || 'A').toString().toUpperCase(),
        explanation: row.explanation || '',
        question_type: 'multiple_choice',
        part: 'part-6',
        passage: row.passage || '',
        blank_number: row.blank_number || (index % 4) + 1,
        passage_num: row.passage_num || Math.floor(index / 4) + 1,
      }));
    }

    // ============================================
    // PART 7: Reading Comprehension
    // ============================================
    else if (part === 'part-7') {
      questions = jsonData.map((row: any, index: number) => ({
        test_id: testId,
        order_num: row.order_num || index + 1,
        question_text: row.question_text || '',
        choices: [
          row.choice_a || '',
          row.choice_b || '',
          row.choice_c || '',
          row.choice_d || ''
        ],
        correct_answer: (row.correct_answer || 'A').toString().toUpperCase(),
        explanation: row.explanation || '',
        question_type: 'multiple_choice',
        part: 'part-7',
        passage: row.passage || '',
        blank_number: null,
      }));
    }

    else {
      return NextResponse.json(
        { error: `Unknown part: ${part}` },
        { status: 400 }
      );
    }

    console.log('Sample question:', JSON.stringify(questions[0], null, 2));

    // ลบข้อสอบเก่าของ test นี้
    const { error: deleteError } = await supabase
      .from('Question')
      .delete()
      .eq('test_id', testId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
    }

    // Insert ข้อสอบใหม่
    const { data, error } = await supabase
      .from('Question')
      .insert(questions)
      .select();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // อัปเดต Tests table
    await supabase
      .from('Tests')
      .update({ 
        total_question: questions.length,
        part: part,
        category: 'toeic'
      })
      .eq('id', testId);

    return NextResponse.json({
      success: true,
      message: `อัปโหลด ${part.toUpperCase()} สำเร็จ ${questions.length} ข้อ`,
      count: questions.length,
      sample: questions[0]
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}