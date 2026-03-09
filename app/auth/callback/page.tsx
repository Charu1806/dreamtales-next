"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Signing you in...');

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const errorParam = params.get('error');
      const errorDescription = params.get('error_description');

      // Show full URL params for debugging
      setStatus(`URL params: ${window.location.search || '(none)'}`);

      if (errorParam) {
        setStatus(`Supabase error: ${errorDescription || errorParam}`);
        return;
      }

      if (!code) {
        setStatus('No code in URL — check Supabase redirect URL settings.');
        return;
      }

      setStatus(`Exchanging code...`);
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setStatus(`Exchange failed: ${error.message}`);
        return;
      }

      router.push('/dashboard');
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in-up max-w-md px-6">
        <Sparkles className="w-12 h-12 text-primary animate-twinkle mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-sm">{status}</p>
      </div>
    </div>
  );
}
