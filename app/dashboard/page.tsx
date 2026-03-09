"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/supabase/types';
import PersonaCard from '@/components/PersonaCard';

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [personas, setPersonas] = useState<Tables<'child_personas'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchPersonas();
  }, [user]);

  const fetchPersonas = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('child_personas')
      .select('*')
      .order('created_at', { ascending: false });
    setPersonas(data || []);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-float">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  const firstName = user?.email?.split('@')[0] || 'Dreamer';

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">DreamTales</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="text-muted-foreground hover:text-foreground font-body"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-display font-extrabold text-foreground mb-2">
            Good evening, {firstName} 🌙
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Ready to create tonight's bedtime adventure?
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-foreground">Your Little Dreamers</h2>
          <Button
            onClick={() => router.push('/persona/new')}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-display font-semibold rounded-xl transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Child
          </Button>
        </div>

        {personas.length === 0 ? (
          <div className="gradient-card rounded-2xl shadow-card p-12 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">
              No dreamers yet!
            </h3>
            <p className="text-muted-foreground font-body mb-6">
              Create a child profile to start generating personalized bedtime stories.
            </p>
            <Button
              onClick={() => router.push('/persona/new')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold rounded-xl"
            >
              Create First Dreamer ✨
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((persona, i) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                style={{ animationDelay: `${i * 0.1}s` }}
                onGenerateStory={() => router.push(`/story/generate/${persona.id}`)}
                onViewStories={() => router.push(`/stories/${persona.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
