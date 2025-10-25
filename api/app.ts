import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import geminiService from './services/geminiService';

dotenv.config();

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser());

// Routes
router.get('/api/health', (ctx) => {
  ctx.body = { status: 'OK', message: 'Server is running' };
});

// Chat API routes
router.post('/api/chat/send', async (ctx) => {
  try {
    const { message, background, character, sessionId, conversationHistory } = ctx.request.body as any;
    
    if (!message || !background || !character) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields: message, background, character' };
      return;
    }

    // 使用Gemini AI进行智能回复
    const reply = await geminiService.generateReply(
      message, 
      background, 
      character, 
      conversationHistory
    );
    
    ctx.body = {
      reply,
      sessionId: sessionId || `session-${Date.now()}`,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Chat API Error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

// AI Coach API routes
router.post('/api/coach/analyze', async (ctx) => {
  try {
    const { conversation, currentMessage } = ctx.request.body as any;
    
    if (!conversation && !currentMessage) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields: conversation or currentMessage' };
      return;
    }

    // 使用Gemini AI进行智能分析
    const analysis = await geminiService.generateCoachAnalysis(
      conversation || '', 
      currentMessage || ''
    );
    
    ctx.body = analysis;
  } catch (error) {
    console.error('Coach Analysis API Error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

// Characters API routes
router.get('/api/characters', (ctx) => {
  ctx.body = {
    characters: [
      {
        id: 'angry_colleague',
        name: '愤怒的同事',
        description: '工作中容易激动的同事角色',
        personality: '急躁、直接、容易情绪化，但内心关心工作效率',
        avatar_url: '/avatars/angry_colleague.png'
      },
      {
        id: 'stubborn_family',
        name: '固执的家人',
        description: '家庭中比较固执己见的长辈',
        personality: '传统、坚持己见、经验丰富，但关爱家人',
        avatar_url: '/avatars/stubborn_family.png'
      },
      {
        id: 'defensive_friend',
        name: '防御性朋友',
        description: '容易产生防御心理的朋友',
        personality: '敏感、自我保护意识强，但重视友情',
        avatar_url: '/avatars/defensive_friend.png'
      }
    ]
  };
});

// History API routes
router.get('/api/history/:userId', (ctx) => {
  const { userId } = ctx.params;
  
  // TODO: Implement database query
  ctx.body = {
    sessions: [
      {
        id: 'session-1',
        background: '因为工作分配问题产生争执',
        character: 'angry_colleague',
        created_at: new Date().toISOString(),
        message_count: 5
      }
    ],
    totalCount: 1
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Koa server is running on port ${PORT}`);
});

export default app
