'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
}

export function ShareButton({ 
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Check out ScrollForge - PDF to Website Converter',
  text = 'Convert PDFs to interactive websites instantly with ScrollForge!'
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [supportsShare, setSupportsShare] = useState(false);

  // Check if native share is supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'share' in navigator) {
      setSupportsShare(true);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\\n\\n' + url)}`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {supportsShare && (
          <>
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share via...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="mr-2 h-4 w-4" />
            Share on LinkedIn
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Share on WhatsApp
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a href={shareLinks.email}>
            <Mail className="mr-2 h-4 w-4" />
            Share via Email
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}