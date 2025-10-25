import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { Send, User, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserInputSection() {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    selectedCharacter, 
    background,
    isBackgroundLocked 
  } = useChatStore();
  
  const [inputValue, setInputValue] = useState('');

  // 筛选出用户的消息
  const userMessages = messages.filter(msg => msg.sender_type === 'user');

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    if (!selectedCharacter) {
      alert('请先选择一个虚拟人角色');
      return;
    }
    
    if (!isBackgroundLocked || !background) {
      alert('请先设置并锁定吵架背景');
      return;
    }

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = inputValue.trim() && !isLoading && selectedCharacter && isBackgroundLocked;

  return (
    <div className="h-full flex flex-col p-6">
      {/* 标题区域 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">用户输入</h3>
        </div>
        <p className="text-white/60 text-sm">表达您的观点和想法</p>
      </div>
      
      {/* 对话区域 */}
      <div className="flex-1 overflow-hidden mb-6">
        <div className="h-full overflow-y-auto pr-2 space-y-4 chat-scroll">
          {userMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white/60 font-medium">开始您的对话</p>
                  <p className="text-white/40 text-sm mt-1">在下方输入框中表达您的观点</p>
                </div>
              </motion.div>
            </div>
          ) : (
            userMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 justify-end"
              >
                <div className="flex-1 flex justify-end">
                  <div className="max-w-[85%]">
                    <div className="bg-gradient-to-r from-green-500/15 to-green-600/15 rounded-xl p-4 border border-green-400/20 backdrop-blur-sm">
                      <p className="text-white leading-relaxed text-sm">{message.content}</p>
                    </div>
                    <div className="text-xs text-white/40 mt-2 text-right mr-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      
      {/* 输入区域 */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !selectedCharacter 
                  ? "请先选择虚拟人角色..." 
                  : !isBackgroundLocked 
                  ? "请先设置并锁定吵架背景..." 
                  : "输入您的观点和回应..."
              }
              className={`w-full h-24 px-5 py-4 rounded-xl border-2 transition-all duration-300 resize-none text-base ${
                !selectedCharacter || !isBackgroundLocked
                  ? 'bg-gray-100/10 border-gray-300/20 text-white/60 cursor-not-allowed'
                  : 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-green-400/60 focus:ring-4 focus:ring-green-400/10 hover:border-white/30'
              }`}
              disabled={!selectedCharacter || !isBackgroundLocked || isLoading}
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-white/50">
                {inputValue.length}/500 字符
              </div>
              <div className="text-xs text-white/40">
                按 Enter 发送，Shift + Enter 换行
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 min-w-[120px] justify-center ${
              !canSend
                ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed border border-gray-400/20'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl hover:scale-105 border border-green-400/30'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                发送中
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                发送
              </>
            )}
          </button>
        </div>
        
        {/* 状态提示 */}
        <div className="mt-4">
          {!selectedCharacter && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">请先选择虚拟人角色</p>
            </div>
          )}
          {selectedCharacter && !isBackgroundLocked && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">请先设置并锁定吵架背景</p>
            </div>
          )}
          {selectedCharacter && isBackgroundLocked && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-lg border border-green-400/20">
              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
              <p className="text-green-300 text-sm">准备就绪，可以开始对话</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}