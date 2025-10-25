import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { Lightbulb, X, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoachSection() {
  const { coachAnalysis, isCoachAnalyzing, getCoachAnalysis } = useChatStore();
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    emotion: true,
    suggestions: true,
    conflict: true
  });

  const handleCoachClick = async () => {
    if (isCoachAnalyzing) return;
    
    // 触发手电筒动画
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    
    // 获取AI教练分析
    await getCoachAnalysis();
    setIsAnalysisOpen(true);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="relative">
      {/* AI教练按钮 */}
      <motion.button
        onClick={handleCoachClick}
        disabled={isCoachAnalyzing}
        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isCoachAnalyzing
            ? 'bg-yellow-500/30 cursor-not-allowed'
            : 'bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-lg hover:shadow-xl backdrop-blur-md'
        }`}
        whileHover={{ scale: isCoachAnalyzing ? 1 : 1.05 }}
        whileTap={{ scale: isCoachAnalyzing ? 1 : 0.95 }}
      >
        {/* 灯塔图标 */}
        <Lightbulb className={`w-8 h-8 text-white ${isCoachAnalyzing ? 'animate-pulse' : ''}`} />
        
        {/* 手电筒动画效果 */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: [0, 1, 0] }}
              exit={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 rounded-2xl bg-yellow-400/30 pointer-events-none"
            />
          )}
        </AnimatePresence>
        
        {/* 加载状态 */}
        {isCoachAnalyzing && (
          <div className="absolute inset-0 rounded-2xl border-2 border-white/30 border-t-white animate-spin"></div>
        )}
      </motion.button>
      
      {/* 提示文字 */}
      <div className="mt-3 text-center">
        <p className="text-sm text-white/90 font-medium">AI教练</p>
        <p className="text-xs text-white/60 mt-1">
          {isCoachAnalyzing ? '分析中...' : '点击获取建议'}
        </p>
      </div>
      
      {/* 分析结果面板 */}
      <AnimatePresence>
        {isAnalysisOpen && coachAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-full right-0 mb-6 w-80 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* 头部 */}
            <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 backdrop-blur-md px-6 py-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">AI教练分析</h3>
                </div>
                <button
                  onClick={() => setIsAnalysisOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-white/80" />
                </button>
              </div>
            </div>
            
            {/* 内容区域 */}
            <div className="p-6 max-h-96 overflow-y-auto space-y-4">
              {/* 情绪分析折叠面板 */}
              {coachAnalysis.emotion_analysis && (
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleSection('emotion')}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-white/90 font-medium text-sm">情绪分析</span>
                    </div>
                    {expandedSections.emotion ? 
                      <ChevronUp className="w-4 h-4 text-white/60" /> : 
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    }
                  </button>
                  <AnimatePresence>
                    {expandedSections.emotion && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <p className="text-white/80 text-sm leading-relaxed">{coachAnalysis.emotion_analysis}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* 沟通建议折叠面板 */}
              {coachAnalysis.suggestions && coachAnalysis.suggestions.length > 0 && (
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleSection('suggestions')}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/90 font-medium text-sm">沟通建议</span>
                    </div>
                    {expandedSections.suggestions ? 
                      <ChevronUp className="w-4 h-4 text-white/60" /> : 
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    }
                  </button>
                  <AnimatePresence>
                    {expandedSections.suggestions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <ul className="space-y-3">
                            {coachAnalysis.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-white/80 text-sm leading-relaxed">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* 冲突等级折叠面板 */}
              {coachAnalysis.conflict_level && (
                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleSection('conflict')}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-white/90 font-medium text-sm">冲突等级</span>
                    </div>
                    {expandedSections.conflict ? 
                      <ChevronUp className="w-4 h-4 text-white/60" /> : 
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    }
                  </button>
                  <AnimatePresence>
                    {expandedSections.conflict && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-white/10 rounded-full h-2">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: coachAnalysis.conflict_level === 'low' ? '33%' :
                                         coachAnalysis.conflict_level === 'medium' ? '66%' : '100%'
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`h-2 rounded-full ${
                                  coachAnalysis.conflict_level === 'low' ? 'bg-green-400' :
                                  coachAnalysis.conflict_level === 'medium' ? 'bg-yellow-400' :
                                  'bg-red-400'
                                }`}
                              />
                            </div>
                            <span className={`text-sm font-medium ${
                              coachAnalysis.conflict_level === 'low' ? 'text-green-400' :
                              coachAnalysis.conflict_level === 'medium' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {coachAnalysis.conflict_level === 'low' ? '低' :
                               coachAnalysis.conflict_level === 'medium' ? '中' : '高'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}