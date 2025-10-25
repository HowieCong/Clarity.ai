import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, History, Settings } from 'lucide-react';
import { Button } from './ui/button';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: MessageCircle, label: '对话' },
    { path: '/history', icon: History, label: '历史' },
    { path: '/settings', icon: Settings, label: '设置' }
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">对话空间</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Button
                key={path}
                asChild
                variant={location.pathname === path ? "secondary" : "ghost"}
                className={`${
                  location.pathname === path
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Link to={path} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}