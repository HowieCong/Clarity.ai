import { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { Bot, ChevronDown, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualPersonSection() {
  const { 
    characters, 
    selectedCharacter, 
    setSelectedCharacter, 
    messages, 
    isLoading 
  } = useChatStore();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 筛选出AI的消息
  const aiMessages = messages.filter(msg => msg.sender_type === 'ai');

  return (
    <div className="h-full flex flex-col p-6">
      {/* 标题区域 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">虚拟人对话</h3>
        </div>
        <p className="text-white/60 text-sm">选择AI角色开始智能对话</p>
      </div>

      {/* 角色选择下拉框 */}
      <div className="relative mb-6">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            {selectedCharacter ? (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{selectedCharacter.name}</div>
                  <div className="text-sm text-white/60">{selectedCharacter.description}</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white/60" />
                </div>
                <span className="text-white/60 font-medium">选择虚拟人角色...</span>
              </>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-white/60 transition-transform duration-300 group-hover:text-white/80 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* 下拉选项 */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden z-20 shadow-2xl"
            >
              {characters.map((character, index) => (
                <motion.button
                  key={character.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedCharacter(character);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/15 transition-all duration-200 border-b border-white/10 last:border-b-0 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white group-hover:text-blue-200 transition-colors duration-200">{character.name}</div>
                    <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-200">{character.description}</div>
                  </div>
                  <Sparkles className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 对话区域 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2 space-y-4 chat-scroll">
          {aiMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                {selectedCharacter ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">已选择 {selectedCharacter.name}</p>
                      <p className="text-white/60 text-sm mt-1">{selectedCharacter.description}</p>
                      <p className="text-white/50 text-sm mt-3">等待开始对话...</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 text-white/40" />
                    </div>
                    <div>
                      <p className="text-white/60 font-medium">请先选择一个虚拟人角色</p>
                      <p className="text-white/40 text-sm mt-1">开始您的AI对话体验</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <>
              {aiMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gradient-to-r from-blue-500/15 to-blue-600/15 rounded-xl p-4 border border-blue-400/20 backdrop-blur-sm">
                      <p className="text-white leading-relaxed text-sm">{message.content}</p>
                    </div>
                    <div className="text-xs text-white/40 mt-2 ml-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* 加载状态 */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-500/15 to-blue-600/15 rounded-xl p-4 border border-blue-400/20 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-white/70 text-sm">AI正在思考...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}