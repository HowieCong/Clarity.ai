// 共享类型定义

export interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar_url: string;
}

export interface Message {
  id: string;
  content: string;
  sender_type: 'user' | 'ai';
  timestamp: string;
}

export interface ChatSession {
  id: string;
  background: string;
  character_id: string;
  messages: Message[];
  created_at: string;
}

export interface CoachAnalysis {
  suggestions: string[];
  emotion_analysis: string;
  conflict_level: 'low' | 'medium' | 'high';
}

export interface ChatRequest {
  message: string;
  background: string;
  character: string;
  sessionId: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
  timestamp: number;
}

export interface CoachRequest {
  conversation: string;
  currentMessage: string;
}