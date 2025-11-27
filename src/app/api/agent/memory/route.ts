// /app/api/agent/memory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ProjectAgent } from '@/lib/ai-agent/agent';

// ดู memory ทั้งหมด
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') || 'exam-platform';

    const agent = new ProjectAgent(projectId);
    await agent.loadMemory();

    const [history, changes] = await Promise.all([
      agent.getConversationHistory(20),
      agent.getRecentChanges(20)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        conversation_history: history,
        recent_changes: changes
      }
    });

  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// อัพเดทโครงสร้างโปรเจกต์
export async function POST(req: NextRequest) {
  try {
    const { projectId, updates } = await req.json();

    const agent = new ProjectAgent(projectId || 'exam-platform');
    await agent.updateProjectStructure(updates);

    return NextResponse.json({
      success: true,
      message: 'Project structure updated'
    });

  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}