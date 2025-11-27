import { NextRequest, NextResponse } from 'next/server';
import { ProjectAgent } from '@/lib/ai-agent/agent';
import { AIProvider } from '@/lib/ai-agent/types';

export async function POST(req: NextRequest) {
  try {
    const { command, projectId, provider } = await req.json();

    if (!command) {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      );
    }

    // ใช้ provider ที่ส่งมา หรือ default เป็น gemini (ฟรี!)
    const aiProvider: AIProvider = provider || 'gemini';
    
    const agent = new ProjectAgent(projectId || 'exam-platform', aiProvider);
    const response = await agent.processCommand(command);

    return NextResponse.json({
      success: true,
      response,
      provider: aiProvider,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') || 'exam-platform';
    const limit = parseInt(searchParams.get('limit') || '10');

    const agent = new ProjectAgent(projectId);
    const history = await agent.getConversationHistory(limit);

    return NextResponse.json({
      success: true,
      history
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}