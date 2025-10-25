import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, MessageCircle, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

interface HistorySession {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
  lastMessage: string;
  background: string;
}

const HistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState<HistorySession[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const filtered = sessions.filter(session =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.background.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSessions(filtered);
  }, [sessions, searchTerm]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      // 使用模拟用户ID，实际应用中应从认证系统获取
      const userId = 'user-123';
      const response = await apiService.getUserHistory(userId);
      
      // 转换API响应为组件需要的格式
      const formattedSessions: HistorySession[] = response.sessions.map((session: any) => ({
        id: session.id,
        title: session.title || `对话 ${session.id.slice(-6)}`,
        createdAt: session.createdAt,
        messageCount: session.messageCount || 0,
        lastMessage: session.lastMessage || '暂无消息',
        background: session.background || '未设置背景'
      }));
      
      setSessions(formattedSessions);
    } catch (error) {
      console.error('加载历史记录失败:', error);
      // 使用模拟数据作为备用
      const mockSessions: HistorySession[] = [
        {
          id: '1',
          title: '关于家务分工的讨论',
          createdAt: '2024-01-15T10:30:00Z',
          messageCount: 15,
          lastMessage: '我觉得我们需要重新分配家务...',
          background: '夫妻因为家务分工不均而产生分歧'
        },
        {
          id: '2',
          title: '工作压力与家庭时间',
          createdAt: '2024-01-14T16:45:00Z',
          messageCount: 23,
          lastMessage: '你总是说工作忙，但是...',
          background: '因为工作忙碌导致陪伴家人时间不足'
        },
        {
          id: '3',
          title: '孩子教育理念分歧',
          createdAt: '2024-01-13T09:15:00Z',
          messageCount: 31,
          lastMessage: '我认为孩子应该更自由一些...',
          background: '父母对孩子教育方式存在不同观点'
        }
      ];
      setSessions(mockSessions);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (window.confirm('确定要删除这个对话记录吗？')) {
      try {
        // 这里应该调用删除API
        // await apiService.deleteSession(sessionId);
        setSessions(prev => prev.filter(session => session.id !== sessionId));
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '今天';
    if (diffDays === 2) return '昨天';
    if (diffDays <= 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* 头部导航 */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回对话</span>
              </Link>
              <h1 className="text-2xl font-bold text-white">历史记录</h1>
            </div>
            
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索对话..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-300">加载中...</span>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm ? '未找到匹配的对话' : '暂无历史记录'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? '尝试使用其他关键词搜索' : '开始你的第一次对话吧'}
            </p>
            {!searchTerm && (
              <Link
                to="/"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                开始对话
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {session.title}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {formatDate(session.createdAt)}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-400 mb-1">背景设定：</p>
                      <p className="text-gray-300 text-sm bg-gray-700/50 rounded-lg p-2">
                        {session.background}
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-gray-300 text-sm">
                        {session.lastMessage}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{session.messageCount} 条消息</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/?session=${session.id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      继续对话
                    </Link>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;