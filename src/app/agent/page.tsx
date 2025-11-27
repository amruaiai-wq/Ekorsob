'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Brain, Sparkles, Zap } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

type AIProvider = 'claude' | 'gemini';

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('gemini'); // Default ฟรี!
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/agent/chat?limit=10');
      const data = await res.json();
      if (data.success) {
        setMessages(data.history);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: input,
          projectId: 'exam-platform',
          provider: provider // ส่ง provider ไปด้วย
        })
      });

      const data = await res.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const exampleCommands = [
    'เพิ่มฟีเจอร์ export คะแนนเป็น PDF',
    'สร้างหน้า leaderboard แสดงคะแนนสูงสุด',
    'แก้ไข dashboard ให้มี dark mode',
    'เพิ่มระบบ notification แจ้งเตือน',
    'สร้าง API สำหรับดึงข้อสอบแบบ random',
    'ปรับแต่ง UI ให้ responsive บนมือถือ'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Brain className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Development Agent</h1>
                <p className="text-purple-200">ช่วยพัฒนาเว็บแอปพลิเคชันของคุณ</p>
              </div>
            </div>

            {/* AI Provider Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setProvider('gemini')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  provider === 'gemini'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Gemini
                <span className="text-xs bg-green-500 px-2 py-0.5 rounded">ฟรี!</span>
              </button>
              
              <button
                onClick={() => setProvider('claude')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  provider === 'claude'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                <Zap className="w-4 h-4" />
                Claude
                <span className="text-xs bg-orange-500 px-2 py-0.5 rounded">Pro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Brain className="w-16 h-16 text-purple-300 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  เริ่มต้นการพัฒนากับ AI Agent
                </h3>
                <p className="text-purple-200 mb-2">
                  ใช้ <span className="font-bold text-blue-300">Gemini (ฟรี!)</span> หรือ{' '}
                  <span className="font-bold text-purple-300">Claude (Pro)</span>
                </p>
                <p className="text-purple-200/70 text-sm mb-6">
                  ลองใช้คำสั่งเหล่านี้:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                  {exampleCommands.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(example)}
                      className="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 
                               border border-purple-300/30 rounded-lg text-left
                               text-purple-100 text-sm transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {message.content}
                      </pre>
                    </div>
                    <div className="text-xs opacity-60 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString('th-TH')}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20 flex items-center gap-3">
                  <Loader2 className="w-6 h-6 text-purple-300 animate-spin" />
                  <span className="text-purple-200 text-sm">
                    {provider === 'gemini' ? 'Gemini' : 'Claude'} กำลังคิด...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/20 p-4 bg-white/5">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="พิมพ์คำสั่งของคุณ... (เช่น 'เพิ่มฟีเจอร์ export PDF')"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3
                         text-white placeholder-purple-200/50 resize-none focus:outline-none
                         focus:ring-2 focus:ring-purple-500"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-6 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50
                         text-white rounded-xl transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Provider Info */}
            <div className="mt-2 text-xs text-purple-200/60 text-center">
              ใช้ {provider === 'gemini' ? '🔵 Gemini (ฟรี)' : '🟣 Claude (Pro)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}