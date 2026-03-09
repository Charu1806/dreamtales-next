"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/supabase/types';
import { format } from 'date-fns';

export default function StoryList() {
  const { personaId } = useParams<{ personaId: string }>();
  const router = useRouter();
  const [stories, setStories] = useState<Tables<'stories'>[]>([]);
  const [persona, setPersona] = useState<Tables<'child_personas'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (personaId) {
      const supabase = createClient();
      Promise.all([
        supabase.from('stories').select('*').eq('persona_id', personaId).order('created_at', { ascending: false }),
        supabase.from('child_personas').select('*').eq('id', personaId).single(),
      ]).then(([storiesRes, personaRes]) => {
        setStories(storiesRes.data || []);
        setPersona(personaRes.data);
        setLoading(false);
      });
    }
  }, [personaId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sparkles className="w-12 h-12 text-primary animate-float" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-display font-extrabold text-foreground mb-1">
            {persona?.name}'s Stories 📚
          </h1>
          <p className="text-muted-foreground font-body">
            All the bedtime adventures so far.
          </p>
        </div>

        {stories.length === 0 ? (
          <div className="gradient-card rounded-2xl shadow-card p-10 text-center animate-fade-in-up">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body mb-4">No stories yet!</p>
            <Button
              onClick={() => router.push(`/story/generate/${personaId}`)}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-display font-semibold rounded-xl"
            >
              Create First Story ✨
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story, i) => (
              <button
                key={story.id}
                onClick={() => router.push(`/story/${story.id}`)}
                className="w-full text-left gradient-card rounded-2xl shadow-card p-5 hover:shadow-dreamy transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="font-display font-bold text-foreground mb-1">
                  {story.title || 'Untitled Story'}
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  {format(new Date(story.created_at), 'MMMM d, yyyy')}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
