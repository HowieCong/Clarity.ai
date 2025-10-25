import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import { apiService } from '../services/api';
import BackgroundSection from '../components/BackgroundSection';
import VirtualPersonSection from '../components/VirtualPersonSection';
import UserInputSection from '../components/UserInputSection';
import CoachSection from '../components/CoachSection';
import Navigation from '../components/Navigation';
import { Card } from '../components/ui/card';

export default function ChatPage() {
  const { setCharacters } = useChatStore();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');

  useEffect(() => {
    // 加载可用角色
    const loadCharacters = async () => {
      try {
        const { characters } = await apiService.getCharacters();
        setCharacters(characters);
      } catch (error) {
        console.error('Failed to load characters:', error);
      }
    };

    loadCharacters();

    // 如果有sessionId，加载对应的会话数据
    if (sessionId) {
      // 这里可以添加加载特定会话的逻辑
      console.log('Loading session:', sessionId);
    }
  }, [setCharacters, sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      {/* 导航栏 */}
      <Navigation />
      
      {/* 主要内容区域 */}
      <div className="relative z-10 container mx-auto px-6 py-8 min-h-screen flex flex-col max-w-7xl">
        {/* 顶部背景设置区域 */}
        <div className="mb-8">
          <BackgroundSection />
        </div>
        
        {/* 中间对话区域 - 居中对称式三栏布局 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl grid grid-cols-12 gap-8 h-full max-h-[600px]">
            {/* 左侧虚拟人对话区域 */}
            <div className="col-span-5">
              <Card className="h-full bg-white/8 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
                <VirtualPersonSection />
              </Card>
            </div>
            
            {/* 中间分隔线 */}
            <div className="col-span-2 flex items-center justify-center">
              <div className="w-px h-3/4 bg-gradient-to-b from-transparent via-white/20 to-transparent relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/30 rounded-full"></div>
              </div>
            </div>
            
            {/* 右侧用户输入区域 */}
            <div className="col-span-5">
              <Card className="h-full bg-white/8 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300">
                <UserInputSection />
              </Card>
            </div>
          </div>
        </div>
        
        {/* 底部AI教练区域 */}
        <div className="mt-8">
          <CoachSection />
        </div>
      </div>
    </div>
  );
}