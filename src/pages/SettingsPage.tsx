import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Bell, Palette, Shield, HelpCircle, Save, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsData {
  profile: {
    name: string;
    avatar: string;
    email: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'zh-CN' | 'en-US';
    notifications: boolean;
    soundEffects: boolean;
    autoSave: boolean;
  };
  ai: {
    responseSpeed: 'fast' | 'normal' | 'thoughtful';
    personality: 'neutral' | 'friendly' | 'professional';
    analysisDepth: 'basic' | 'detailed' | 'comprehensive';
  };
  privacy: {
    saveHistory: boolean;
    shareAnalytics: boolean;
    dataRetention: '30days' | '90days' | '1year' | 'forever';
  };
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      name: '用户',
      avatar: '',
      email: 'user@example.com'
    },
    preferences: {
      theme: 'dark',
      language: 'zh-CN',
      notifications: true,
      soundEffects: true,
      autoSave: true
    },
    ai: {
      responseSpeed: 'normal',
      personality: 'friendly',
      analysisDepth: 'detailed'
    },
    privacy: {
      saveHistory: true,
      shareAnalytics: false,
      dataRetention: '90days'
    }
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'ai' | 'privacy'>('profile');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 从本地存储加载设置
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  };

  const updateSettings = <T extends keyof SettingsData>(
    section: T, 
    key: keyof SettingsData[T], 
    value: SettingsData[T][keyof SettingsData[T]]
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'preferences', label: '偏好设置', icon: Palette },
    { id: 'ai', label: 'AI设置', icon: HelpCircle },
    { id: 'privacy', label: '隐私安全', icon: Shield }
  ];

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
              <h1 className="text-2xl font-bold text-white">设置</h1>
            </div>
            
            <button
              onClick={handleSave}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                saved 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? '已保存' : '保存设置'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏导航 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'profile' | 'preferences' | 'ai' | 'privacy')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* 主内容区域 */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              {/* 个人资料 */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">个人资料</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        用户名
                      </label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        邮箱
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      头像URL
                    </label>
                    <input
                      type="url"
                      value={settings.profile.avatar}
                      onChange={(e) => updateSettings('profile', 'avatar', e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* 偏好设置 */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">偏好设置</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        主题
                      </label>
                      <select
                        value={settings.preferences.theme}
                        onChange={(e) => updateSettings('preferences', 'theme', e.target.value as 'light' | 'dark' | 'auto')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="light">浅色</option>
                        <option value="dark">深色</option>
                        <option value="auto">跟随系统</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        语言
                      </label>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => updateSettings('preferences', 'language', e.target.value as 'zh-CN' | 'en-US')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="zh-CN">简体中文</option>
                        <option value="en-US">English</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">通知提醒</h3>
                        <p className="text-gray-400 text-sm">接收系统通知和提醒</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.preferences.notifications}
                          onChange={(e) => updateSettings('preferences', 'notifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">音效</h3>
                        <p className="text-gray-400 text-sm">启用界面音效</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.preferences.soundEffects}
                          onChange={(e) => updateSettings('preferences', 'soundEffects', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">自动保存</h3>
                        <p className="text-gray-400 text-sm">自动保存对话记录</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.preferences.autoSave}
                          onChange={(e) => updateSettings('preferences', 'autoSave', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* AI设置 */}
              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">AI设置</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        响应速度
                      </label>
                      <select
                        value={settings.ai.responseSpeed}
                        onChange={(e) => updateSettings('ai', 'responseSpeed', e.target.value as 'fast' | 'normal' | 'thoughtful')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="fast">快速响应</option>
                        <option value="normal">正常速度</option>
                        <option value="thoughtful">深思熟虑</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        AI性格
                      </label>
                      <select
                        value={settings.ai.personality}
                        onChange={(e) => updateSettings('ai', 'personality', e.target.value as 'neutral' | 'friendly' | 'professional')}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="neutral">中性</option>
                        <option value="friendly">友好</option>
                        <option value="professional">专业</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      分析深度
                    </label>
                    <select
                      value={settings.ai.analysisDepth}
                      onChange={(e) => updateSettings('ai', 'analysisDepth', e.target.value as 'basic' | 'detailed' | 'comprehensive')}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="basic">基础分析</option>
                      <option value="detailed">详细分析</option>
                      <option value="comprehensive">全面分析</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 隐私安全 */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">隐私安全</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">保存历史记录</h3>
                        <p className="text-gray-400 text-sm">在本地保存对话历史</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.saveHistory}
                          onChange={(e) => updateSettings('privacy', 'saveHistory', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">分享使用数据</h3>
                        <p className="text-gray-400 text-sm">帮助改进产品体验</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.shareAnalytics}
                          onChange={(e) => updateSettings('privacy', 'shareAnalytics', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      数据保留期限
                    </label>
                    <select
                      value={settings.privacy.dataRetention}
                      onChange={(e) => updateSettings('privacy', 'dataRetention', e.target.value as '30days' | '90days' | '1year' | 'forever')}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="30days">30天</option>
                      <option value="90days">90天</option>
                      <option value="1year">1年</option>
                      <option value="forever">永久保存</option>
                    </select>
                  </div>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Bell className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="text-yellow-400 font-medium">隐私提醒</h4>
                        <p className="text-gray-300 text-sm mt-1">
                          我们重视您的隐私安全，所有数据都会根据您的设置进行处理。
                          您可以随时修改这些设置或删除您的数据。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;