import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { Lock, Check, Settings } from 'lucide-react';

export default function BackgroundSection() {
  const { background, isBackgroundLocked, setBackground, lockBackground } = useChatStore();
  const [localBackground, setLocalBackground] = useState(background);

  const handleConfirm = () => {
    if (localBackground.trim()) {
      setBackground(localBackground);
      lockBackground();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isBackgroundLocked) {
      setLocalBackground(e.target.value);
    }
  };

  return (
    <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          吵架背景设置
        </h2>
        {isBackgroundLocked && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30">
            <Lock className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">已锁定</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-6 items-start">
        <div className="flex-1">
          <textarea
            value={localBackground}
            onChange={handleInputChange}
            placeholder="请详细描述吵架的背景情况，例如：因为工作分配问题产生争执，双方对任务优先级有不同看法..."
            className={`w-full h-24 px-5 py-4 rounded-xl border-2 transition-all duration-300 resize-none text-base ${
              isBackgroundLocked
                ? 'bg-gray-100/10 border-gray-300/20 text-white/60 cursor-not-allowed'
                : 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 hover:border-white/30'
            }`}
            disabled={isBackgroundLocked}
          />
          <div className="mt-2 text-xs text-white/50">
            {localBackground.length}/500 字符
          </div>
        </div>
        
        <button
          onClick={handleConfirm}
          disabled={isBackgroundLocked || !localBackground.trim()}
          className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 min-w-[140px] justify-center ${
            isBackgroundLocked || !localBackground.trim()
              ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed border border-gray-400/20'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-xl hover:shadow-2xl hover:scale-105 border border-orange-400/30'
          }`}
        >
          {isBackgroundLocked ? (
            <>
              <Check className="w-5 h-5" />
              已确认
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              确认锁定
            </>
          )}
        </button>
      </div>
      
      {isBackgroundLocked && background && (
        <div className="mt-6 p-5 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-400/20">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-orange-300 text-sm font-medium mb-1">当前背景设定</p>
              <p className="text-white/90 text-sm leading-relaxed">{background}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}