import { motion } from 'framer-motion';
import { Radio, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  isLive: boolean;
}

export const Header = ({ isLive }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-foreground">
            Besu Network Dashboard
          </h1>
          {isLive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/20 border border-accent/30"
            >
              <div className="w-2 h-2 rounded-full bg-accent pulse-live" />
              <span className="text-xs font-medium text-accent">LIVE</span>
            </motion.div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Hyperledger Besu Private Network • Mainnet
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, blocks..."
            className="w-64 pl-10 bg-secondary/50 border-border/50 focus:border-primary placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
            3
          </span>
        </motion.button>

        {/* Network Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
          <Radio className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">Network ID:</span>
          <span className="text-sm font-mono text-foreground">1337</span>
        </div>
      </div>
    </motion.header>
  );
};