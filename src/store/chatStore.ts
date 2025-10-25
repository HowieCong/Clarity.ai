import { create } from 'zustand';
import { Character, Message, ChatSession, CoachAnalysis } from '../../shared/types';
import { ApiService } from '../services/api';

const apiService = new ApiService();

interface ChatState {
  // 当前会话状态
  currentSession: ChatSession | null;
  background: string;
  isBackgroundLocked: boolean;
  selectedCharacter: Character | null;
  
  // 消息和对话
  messages: Message[];
  isLoading: boolean;
  
  // AI教练状态
  coachAnalysis: CoachAnalysis | null;
  isCoachAnalyzing: boolean;
  isCoachPanelOpen: boolean;
  
  // 可用角色
  characters: Character[];
  
  // Actions
  setBackground: (background: string) => void;
  lockBackground: () => void;
  setSelectedCharacter: (character: Character) => void;
  sendMessage: (content: string) => Promise<void>;
  getCoachAnalysis: () => Promise<void>;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setCoachAnalysis: (analysis: CoachAnalysis) => void;
  toggleCoachPanel: () => void;
  setCharacters: (characters: Character[]) => void;
  clearSession: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  currentSession: null,
  background: '',
  isBackgroundLocked: false,
  selectedCharacter: null,
  messages: [],
  isLoading: false,
  coachAnalysis: null,
  isCoachAnalyzing: false,
  isCoachPanelOpen: false,
  characters: [],

  // Actions
  setSelectedCharacter: (character: Character) => set({ selectedCharacter: character }),
  setBackground: (background: string) => set({ background }),
  lockBackground: () => set({ isBackgroundLocked: true }),
  
  sendMessage: async (content: string) => {
    const { selectedCharacter, background, messages, currentSession } = get();
    
    if (!selectedCharacter || !background) return;
    
    set({ isLoading: true });
    
    try {
      // 添加用户消息
      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        content,
        sender_type: 'user',
        timestamp: new Date().toISOString()
      };
      
      set({ messages: [...messages, userMessage] });
      
      // 准备对话历史
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender_type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // 调用API发送消息
      const response = await apiService.sendMessage({
        message: content,
        background,
        character: selectedCharacter.id,
        sessionId: currentSession?.id || 'default'
      });
      
      // 添加AI回复
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        content: response.reply,
        sender_type: 'ai',
        timestamp: new Date().toISOString()
      };
      
      set({ messages: [...get().messages, aiMessage] });
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 添加错误回复
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        content: '抱歉，我现在无法回应，请稍后再试。',
        sender_type: 'ai',
        timestamp: new Date().toISOString()
      };
      
      set({ messages: [...get().messages, errorMessage] });
    } finally {
      set({ isLoading: false });
    }
  },
  
  getCoachAnalysis: async () => {
    const { messages } = get();
    
    set({ isCoachAnalyzing: true });
    
    try {
      // 构建对话历史字符串
      const conversation = messages
        .slice(-10) // 取最近10条消息
        .map(msg => `${msg.sender_type === 'user' ? '用户' : 'AI'}：${msg.content}`)
        .join('\n');
      
      const currentMessage = messages[messages.length - 1]?.content || '';
      
      // 调用API获取分析
      const analysis = await apiService.getCoachAnalysis({
        conversation,
        currentMessage
      });
      
      set({ coachAnalysis: analysis });
    } catch (error) {
      console.error('获取教练分析失败:', error);
      
      // 设置默认分析
      const fallbackAnalysis: CoachAnalysis = {
        suggestions: [
          '尝试使用"我理解你的感受"来表达共情',
          '避免使用指责性的语言',
          '专注于解决问题而不是指责对方'
        ],
        emotion_analysis: '当前对话中存在一定的紧张情绪，建议保持冷静',
        conflict_level: 'medium'
      };
      
      set({ coachAnalysis: fallbackAnalysis });
    } finally {
      set({ isCoachAnalyzing: false });
    }
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setCoachAnalysis: (analysis: CoachAnalysis) => {
    set({ coachAnalysis: analysis });
  },

  toggleCoachPanel: () => {
    set((state) => ({
      isCoachPanelOpen: !state.isCoachPanelOpen
    }));
  },

  setCharacters: (characters: Character[]) => {
    set({ characters });
  },

  clearSession: () => {
    set({
      currentSession: null,
      background: '',
      isBackgroundLocked: false,
      selectedCharacter: null,
      messages: [],
      coachAnalysis: null,
      isCoachPanelOpen: false
    });
  }
}));