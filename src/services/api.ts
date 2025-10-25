import { Character, ChatRequest, ChatResponse, CoachRequest, CoachAnalysis } from '../../shared/types';

const API_BASE_URL = 'http://localhost:3001/api';

// 响应验证接口
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

// 路由验证结果
interface RouteValidation {
  isValid: boolean;
  module: 'virtual_person' | 'ai_coach' | 'unknown';
  confidence: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // 验证响应格式
      if (!this.validateResponse(result)) {
        throw new Error('Invalid response format from server');
      }

      return result;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // 验证API响应格式
  private validateResponse(response: any): boolean {
    // 基本响应格式验证
    if (typeof response !== 'object' || response === null) {
      return false;
    }
    
    // 检查是否包含必要字段
    return true; // 简化验证，实际项目中应该更严格
  }

  // 验证路由目标模块
  private validateRouteTarget(request: ChatRequest | CoachRequest): RouteValidation {
    if ('character' in request) {
      // 虚拟人聊天请求
      return {
        isValid: !!request.character && !!request.message,
        module: 'virtual_person',
        confidence: request.character && request.message ? 0.95 : 0.3
      };
    } else if ('conversation' in request) {
      // AI教练分析请求
      return {
        isValid: !!request.conversation,
        module: 'ai_coach',
        confidence: request.conversation ? 0.95 : 0.3
      };
    }
    
    return {
      isValid: false,
      module: 'unknown',
      confidence: 0
    };
  }

  // 发送聊天消息（带验证）
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    // 路由验证
    const validation = this.validateRouteTarget(request);
    
    if (!validation.isValid || validation.module !== 'virtual_person') {
      throw new Error(`Invalid route for virtual person module. Confidence: ${validation.confidence}`);
    }

    // 请求参数验证
    if (!request.character || !request.message || !request.background) {
      throw new Error('Missing required parameters for chat request');
    }

    try {
      const response = await this.request<ChatResponse>('/chat/send', {
        method: 'POST',
        body: JSON.stringify({
          ...request,
          timestamp: new Date().toISOString(),
          validation: validation
        }),
      });

      // 响应内容验证
      if (!response.reply || typeof response.reply !== 'string') {
        throw new Error('Invalid response format: missing or invalid reply');
      }

      return response;
    } catch (error) {
      console.error('Virtual person module error:', error);
      throw new Error(`Virtual person response failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 获取AI教练分析（带验证）
  async getCoachAnalysis(request: CoachRequest): Promise<CoachAnalysis> {
    // 路由验证
    const validation = this.validateRouteTarget(request);
    
    if (!validation.isValid || validation.module !== 'ai_coach') {
      throw new Error(`Invalid route for AI coach module. Confidence: ${validation.confidence}`);
    }

    // 请求参数验证
    if (!request.conversation) {
      throw new Error('Missing conversation data for coach analysis');
    }

    try {
      const response = await this.request<CoachAnalysis>('/coach/analyze', {
        method: 'POST',
        body: JSON.stringify({
          ...request,
          timestamp: new Date().toISOString(),
          validation: validation
        }),
      });

      // 响应内容验证
      if (!this.validateCoachAnalysis(response)) {
        throw new Error('Invalid coach analysis response format');
      }

      return response;
    } catch (error) {
      console.error('AI coach module error:', error);
      throw new Error(`AI coach analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 验证教练分析响应格式
  private validateCoachAnalysis(analysis: any): boolean {
    if (!analysis || typeof analysis !== 'object') {
      return false;
    }

    // 检查必要字段
    const hasValidSuggestions = Array.isArray(analysis.suggestions) && 
                               analysis.suggestions.every((s: any) => typeof s === 'string');
    const hasValidEmotion = typeof analysis.emotion_analysis === 'string';
    const hasValidConflict = ['low', 'medium', 'high'].includes(analysis.conflict_level);

    return hasValidSuggestions && hasValidEmotion && hasValidConflict;
  }

  // 获取可用角色列表
  async getCharacters(): Promise<{ characters: Character[] }> {
    try {
      const response = await this.request<{ characters: Character[] }>('/characters');
      
      // 验证角色数据格式
      if (!Array.isArray(response.characters)) {
        throw new Error('Invalid characters response format');
      }

      return response;
    } catch (error) {
      console.error('Get characters error:', error);
      // 返回默认角色列表作为降级方案
      return {
        characters: [
          {
            id: 'default',
            name: '默认助手',
            description: '通用AI助手',
            avatar_url: '',
            personality: 'helpful'
          }
        ]
      };
    }
  }

  // 获取用户历史记录
  async getUserHistory(userId: string): Promise<{ sessions: any[]; totalCount: number }> {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID for history request');
    }

    return this.request<{ sessions: any[]; totalCount: number }>(`/history/${userId}`);
  }

  // 健康检查
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await this.request<{ status: string; message: string }>('/health');
      
      if (response.status !== 'ok') {
        throw new Error(`Health check failed: ${response.message}`);
      }

      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // 测试模块连通性
  async testModuleConnectivity(): Promise<{
    virtualPerson: boolean;
    aiCoach: boolean;
    overall: boolean;
  }> {
    const results = {
      virtualPerson: false,
      aiCoach: false,
      overall: false
    };

    try {
      // 测试虚拟人模块
      await this.request('/chat/health');
      results.virtualPerson = true;
    } catch (error) {
      console.warn('Virtual person module connectivity test failed:', error);
    }

    try {
      // 测试AI教练模块
      await this.request('/coach/health');
      results.aiCoach = true;
    } catch (error) {
      console.warn('AI coach module connectivity test failed:', error);
    }

    results.overall = results.virtualPerson && results.aiCoach;
    return results;
  }
}

export { ApiService };
export const apiService = new ApiService();