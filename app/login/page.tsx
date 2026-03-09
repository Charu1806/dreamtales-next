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
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);

    if (error) {
      toast({ title: 'Oops!', description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });
    setLoading(false);

    if (error) {
      toast({ title: 'Invalid code', description: error.message, variant: 'destructive' });
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => sent ? setSent(false) : router.push('/')}
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
            <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-xl font-display font-bold text-foreground mb-2">
                  Check your email ✨
                </h2>
                <p className="text-muted-foreground font-body">
                  We sent a 6-digit code to <strong>{email}</strong>. Enter it below to sign in.
                </p>
              </div>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="rounded-xl h-12 font-body text-base border-border text-center tracking-widest text-xl"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading || code.length < 6}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-base h-12 rounded-xl transition-all hover:scale-[1.02]"
                >
                  {loading ? 'Verifying...' : 'Verify Code ✨'}
                </Button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSendCode} className="space-y-4">
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
                {loading ? 'Sending...' : 'Send Code ✨'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
