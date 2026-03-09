"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/auth/callback' },
    });
    setLoading(false);

    if (error) {
      toast({ title: 'Oops!', description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-card rounded-2xl shadow-card p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Welcome to DreamTales
            </h1>
            <p className="text-muted-foreground font-body mt-2">
              Sign in with your email — no password needed!
            </p>
          </div>

          {sent ? (
            <div className="text-center py-6 animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground mb-2">
                Check your email ✨
              </h2>
              <p className="text-muted-foreground font-body">
                We sent a magic link to <strong>{email}</strong>. Click it to continue your adventure!
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-xl h-12 font-body text-base border-border focus:ring-primary"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-base h-12 rounded-xl transition-all hover:scale-[1.02]"
              >
                {loading ? 'Sending...' : 'Send Magic Link ✨'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
