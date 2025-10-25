import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Character } from '../../shared/types';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AnalysisResponse {
  suggestions: string[];
  emotion_analysis: string;
  conflict_level: 'low' | 'medium' | 'high';
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyDvx3DAcusuTUKg4dyL9RxFWTtJ4cpeASg';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * 生成AI角色回复
   */
  async generateReply(
    userMessage: string, 
    background: string, 
    character: Character,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      // 构建系统提示词
      const systemPrompt = `你是一个${character.name}，性格特点：${character.personality}。
当前吵架背景：${background}
请根据用户的话进行回应，保持角色的性格特点，语气要符合吵架的情境，但不要过于激烈或使用不当言论。
回复要自然、符合中文表达习惯，长度控制在50-100字之间。

对话历史：
${conversationHistory.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

用户说：${userMessage}

请以${character.name}的身份回应：`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      return text || '抱歉，我现在无法回应。';
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // 返回备用回复
      const fallbackReplies = [
        `作为${character.name}，我对你刚才说的话很不认同！`,
        `在${background}的情况下，你这样说让我很生气！`,
        `我觉得你完全没有理解我的立场！`,
        `你这种态度让我无法接受！`
      ];
      
      return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    }
  }

  /**
   * 生成AI教练分析
   */
  async generateCoachAnalysis(
    conversation: string,
    currentMessage: string
  ): Promise<AnalysisResponse> {
    try {
      const systemPrompt = `你是一个专业的沟通教练，请分析当前的对话情况并提供建议。
请从以下几个方面进行分析：
1. 情绪分析：分析对话中的情绪状态
2. 沟通建议：提供3-5个具体的沟通改进建议
3. 冲突等级：评估当前冲突的严重程度（low/medium/high）

对话历史：${conversation}
当前消息：${currentMessage}

请以JSON格式返回分析结果，格式如下：
{
  "emotion_analysis": "情绪分析内容",
  "suggestions": ["建议1", "建议2", "建议3"],
  "conflict_level": "low|medium|high"
}`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const content = response.text();
      
      try {
        // 尝试解析JSON响应
        const analysis = JSON.parse(content);
        return {
          suggestions: analysis.suggestions || [],
          emotion_analysis: analysis.emotion_analysis || '无法分析当前情绪状态',
          conflict_level: analysis.conflict_level || 'medium'
        };
      } catch {
        // 如果JSON解析失败，返回默认分析
        return this.getFallbackAnalysis();
      }
    } catch (error) {
      console.error('Gemini Coach Analysis Error:', error);
      return this.getFallbackAnalysis();
    }
  }

  /**
   * 获取备用分析结果
   */
  private getFallbackAnalysis(): AnalysisResponse {
    return {
      suggestions: [
        '尝试使用"我理解你的感受"来表达共情',
        '避免使用指责性的语言，专注于事实描述',
        '寻找共同点，建立合作而非对抗的氛围',
        '适当暂停，给双方冷静思考的时间'
      ],
      emotion_analysis: '当前对话中存在一定的情绪紧张，建议双方都保持冷静，专注于解决问题而不是情绪发泄。',
      conflict_level: 'medium'
    };
  }

  /**
   * 检查API配置是否正确
   */
  isConfigured(): boolean {
    return !!(process.env.GOOGLE_API_KEY || 'AIzaSyDvx3DAcusuTUKg4dyL9RxFWTtJ4cpeASg');
  }
}

export default new GeminiService();