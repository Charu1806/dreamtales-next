"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      const code = new URLSearchParams(window.location.search).get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('[auth/callback] error:', error.message);
          router.push('/login?error=auth');
          return;
        }
      }

      router.push('/dashboard');
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in-up">
        <Sparkles className="w-12 h-12 text-primary animate-twinkle mx-auto mb-4" />
        <p className="text-muted-foreground font-body">Signing you in...</p>
      </div>
    </div>
  );
}
