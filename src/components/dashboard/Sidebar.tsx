import { motion } from 'framer-motion';
import { Home, Server, Users, ArrowLeftRight, Settings, Activity, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Dashboard', path: '/' },
  { id: 'nodes', icon: Server, label: 'Nodes', path: '/nodes' },
  { id: 'users', icon: Users, label: 'Accounts', path: '/accounts' },
  { id: 'rpc', icon: Globe, label: 'RPC Access', path: '/rpc-access' },
  { id: 'transactions', icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = ({ activeItem = 'home', onItemClick }: SidebarProps) => {
  const navigate = useNavigate();

  const handleClick = (item: typeof navItems[0]) => {
    onItemClick?.(item.id);
    navigate(item.path);
  };

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-6 bg-sidebar border-r border-sidebar-border z-50"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-8"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * (index + 1) }}
              onClick={() => handleClick(item)}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group relative',
                isActive
                  ? 'bg-primary text-primary-foreground neon-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <span className="absolute left-14 px-2 py-1 bg-card border border-border rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom indicator */}
      <div className="mt-auto">
        <div className="w-2 h-2 rounded-full bg-accent pulse-live" />
      </div>
    </motion.aside>
  );
};