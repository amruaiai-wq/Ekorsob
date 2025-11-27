export interface ProjectMemory {
  project_structure: {
    pages: string[];
    components: string[];
    api_routes: string[];
    database_tables: string[];
  };
  recent_changes: Array<{
    timestamp: string;
    type: 'add' | 'modify' | 'delete';
    description: string;
    files_affected: string[];
  }>;
  conversation_history: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  active_features: string[];
  tech_stack: {
    frontend: string[];
    backend: string[];
    database: string;
    styling: string[];
  };
}

export interface AgentCommand {
  type: 'add' | 'modify' | 'delete' | 'analyze' | 'debug';
  target: string;
  details: string;
}

// 👇 เพิ่มใหม่
export type AIProvider = 'claude' | 'gemini';