import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { ProjectMemory, AgentCommand, AIProvider } from './types';

export class ProjectAgent {
  private anthropic: Anthropic;
  private gemini: GoogleGenerativeAI;
  private supabase: ReturnType<typeof createClient>;
  private memory: ProjectMemory | null = null;
  private projectId: string;
  private provider: AIProvider;

  constructor(projectId: string = 'exam-platform', provider: AIProvider = 'gemini') {
    this.projectId = projectId;
    this.provider = provider;
    
    // Initialize Claude
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!
    });
    
    // Initialize Gemini
    this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    
    // Initialize Supabase
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async loadMemory(): Promise<void> {
    const { data, error } = await this.supabase
      .from('agent_memory')
      .select('memory')
      .eq('project_id', this.projectId)
      .single();

    if (error || !data) {
      this.memory = this.initMemory();
      await this.saveMemory();
    } else {
      this.memory = data.memory as ProjectMemory;
    }
  }

  private initMemory(): ProjectMemory {
    return {
      project_structure: {
        pages: [
          '/app/page.tsx',
          '/app/exam/page.tsx',
          '/app/admin/page.tsx',
          '/app/dashboard/page.tsx'
        ],
        components: [
          'ExamCard',
          'QuestionDisplay',
          'ScoreChart',
          'AdminPanel'
        ],
        api_routes: [
          '/api/exams',
          '/api/questions',
          '/api/submit-answer',
          '/api/scores'
        ],
        database_tables: [
          'users',
          'exams',
          'questions',
          'user_answers',
          'exam_results'
        ]
      },
      recent_changes: [],
      conversation_history: [],
      active_features: [
        'TOEIC Practice Tests',
        'Thai Civil Service Exams',
        'A-Level Exams',
        'Score Analytics Dashboard',
        'Admin Panel with RBAC'
      ],
      tech_stack: {
        frontend: ['Next.js 14+', 'TypeScript', 'React', 'Tailwind CSS'],
        backend: ['Next.js API Routes', 'Server Actions'],
        database: 'Supabase (PostgreSQL)',
        styling: ['Tailwind CSS', 'shadcn/ui']
      }
    };
  }

  async saveMemory(): Promise<void> {
    if (!this.memory) return;

    await this.supabase
      .from('agent_memory')
      .upsert({
        project_id: this.projectId,
        memory: this.memory,
        updated_at: new Date().toISOString()
      });
  }

  private createSystemPrompt(): string {
    if (!this.memory) return '';

    return `คุณเป็น AI Agent ที่เชี่ยวชาญในการพัฒนาเว็บแอปพลิเคชัน โดยเฉพาะ Next.js + TypeScript + Supabase

# ข้อมูลโปรเจกต์ปัจจุบัน

## โครงสร้างโปรเจกต์
${JSON.stringify(this.memory.project_structure, null, 2)}

## Tech Stack
- Frontend: ${this.memory.tech_stack.frontend.join(', ')}
- Backend: ${this.memory.tech_stack.backend.join(', ')}
- Database: ${this.memory.tech_stack.database}
- Styling: ${this.memory.tech_stack.styling.join(', ')}

## ฟีเจอร์ที่มีอยู่
${this.memory.active_features.map(f => `- ${f}`).join('\n')}

## การเปลี่ยนแปลงล่าสุด (5 รายการ)
${this.memory.recent_changes.slice(-5).map(c => 
  `[${c.timestamp}] ${c.type.toUpperCase()}: ${c.description}`
).join('\n') || 'ยังไม่มีการเปลี่ยนแปลง'}

# รูปแบบการตอบ
เมื่อได้รับคำสั่ง ให้ตอบในรูปแบบ:

**📋 สรุปงาน**
[อธิบายสิ่งที่จะทำ]

**📁 ไฟล์ที่ต้องสร้าง/แก้ไข**
- ไฟล์ 1
- ไฟล์ 2

**💻 โค้ดที่ต้องเพิ่ม**
[โค้ดพร้อมคำอธิบาย]

**✅ ขั้นตอนการทำ**
1. ขั้นตอนที่ 1
2. ขั้นตอนที่ 2

ตอบเป็นภาษาไทยทั้งหมด ยกเว้นโค้ด`;
  }

  // 🔥 ฟังก์ชันหลักที่รองรับทั้ง Claude และ Gemini
  async processCommand(userCommand: string): Promise<string> {
    await this.loadMemory();
    if (!this.memory) throw new Error('Failed to load memory');

    this.memory.conversation_history.push({
      role: 'user',
      content: userCommand,
      timestamp: new Date().toISOString()
    });

    if (this.memory.conversation_history.length > 20) {
      this.memory.conversation_history = this.memory.conversation_history.slice(-20);
    }

    let assistantResponse: string;

    // เลือกใช้ AI ตาม provider
    if (this.provider === 'claude') {
      assistantResponse = await this.callClaude();
    } else {
      assistantResponse = await this.callGemini();
    }

    this.memory.conversation_history.push({
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date().toISOString()
    });

    this.memory.recent_changes.push({
      timestamp: new Date().toISOString(),
      type: 'add',
      description: userCommand,
      files_affected: []
    });

    if (this.memory.recent_changes.length > 50) {
      this.memory.recent_changes = this.memory.recent_changes.slice(-50);
    }

    await this.saveMemory();

    await this.supabase.from('agent_tasks').insert({
      project_id: this.projectId,
      command: userCommand,
      response: assistantResponse,
      status: 'pending'
    });

    return assistantResponse;
  }

  // เรียก Claude API
  private async callClaude(): Promise<string> {
    if (!this.memory) throw new Error('Memory not loaded');

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: this.createSystemPrompt(),
      messages: this.memory.conversation_history.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    return response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';
  }

  // เรียก Gemini API
  private async callGemini(): Promise<string> {
    if (!this.memory) throw new Error('Memory not loaded');

    const model = this.gemini.getGenerativeModel({ 
      model: 'gemini-pro' 
    });

    // สร้าง chat history สำหรับ Gemini
    const history = this.memory.conversation_history.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 8000,
      },
    });

    // เพิ่ม system prompt ในข้อความแรก
    const promptWithContext = `${this.createSystemPrompt()}

---

${this.memory.conversation_history[this.memory.conversation_history.length - 1].content}`;

    const result = await chat.sendMessage(promptWithContext);
    const response = await result.response;
    return response.text();
  }

  async getConversationHistory(limit: number = 10) {
    await this.loadMemory();
    if (!this.memory) return [];
    return this.memory.conversation_history.slice(-limit);
  }

  async getRecentChanges(limit: number = 10) {
    await this.loadMemory();
    if (!this.memory) return [];
    return this.memory.recent_changes.slice(-limit);
  }

  // เปลี่ยน AI Provider
  setProvider(provider: AIProvider) {
    this.provider = provider;
  }

  getProvider(): AIProvider {
    return this.provider;
  }
}