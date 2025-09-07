'use client';

import { motion } from 'framer-motion';
import { Star, Github, Heart } from 'lucide-react';

export function GitHubBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-4 left-4 z-50 flex flex-col gap-2"
    >
      {/* GitHub Star Button */}
      <a
        href="https://github.com/ReyKan-KP/ScrollForge"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 hover:bg-card hover:border-primary/50 transition-all hover:scale-105"
      >
        <Star className="w-4 h-4 text-yellow-500 group-hover:fill-yellow-500" />
        <span className="text-sm font-medium">Star on GitHub</span>
        <Github className="w-4 h-4" />
      </a>
      
      {/* Open Source Badge */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2">
        <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
        <span className="text-sm">Open Source Project</span>
      </div>
    </motion.div>
  );
}

export function CreatorBadge() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground"
    >
      <span>Created with</span>
      <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
      <span>by</span>
      <a
        href="https://github.com/ReyKan-KP"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-primary hover:underline flex items-center gap-1"
      >
        <Github className="w-4 h-4" />
        ReyKan-KP (Kanishaka Pranjal)
      </a>
      <span>•</span>
      <a
        href="https://github.com/ReyKan-KP/ScrollForge"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline flex items-center gap-1"
      >
        <Star className="w-3 h-3" />
        Star Repository
      </a>
    </motion.div>
  );
}

export function FloatingGitHubButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <a
        href="https://github.com/ReyKan-KP/ScrollForge"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <Github className="w-6 h-6 text-white" />
        <div className="absolute -top-12 right-0 bg-card border border-border rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <div className="text-xs font-medium">View on GitHub</div>
          <div className="text-xs text-muted-foreground">⭐ Star the repo!</div>
        </div>
      </a>
    </motion.div>
  );
}