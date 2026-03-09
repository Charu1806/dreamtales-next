"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/supabase/types';

interface StoryPage {
  text: string;
  imagePrompt: string;
}

export default function StoryViewer() {
  const { storyId } = useParams<{ storyId: string }>();
  const router = useRouter();
  const [story, setStory] = useState<Tables<'stories'> | null>(null);
  const [pages, setPages] = useState<StoryPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storyId) {
      const supabase = createClient();
      supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single()
        .then(({ data }) => {
          if (data) {
            setStory(data);
            setPages((data.pages_json as unknown as StoryPage[]) || []);
          }
          setLoading(false);
        });
    }
  }, [storyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sparkles className="w-12 h-12 text-primary animate-float" />
      </div>
    );
  }

  if (!story || pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-body">Story not found.</p>
      </div>
    );
  }

  const page = pages[currentPage];
  const isFirst = currentPage === 0;
  const isLast = currentPage === pages.length - 1;

  const illustrationColors = [
    'from-secondary/30 to-primary/20',
    'from-primary/20 to-accent/30',
    'from-accent/20 to-secondary/30',
    'from-secondary/20 to-primary/30',
    'from-primary/30 to-secondary/20',
  ];

  return (
    <div className="min-h-screen bg-card flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="text-muted-foreground hover:text-foreground font-body"
        >
          <Home className="w-4 h-4 mr-2" /> Home
        </Button>
        <span className="text-sm text-muted-foreground font-body">
          {currentPage + 1} / {pages.length}
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="max-w-lg w-full animate-fade-in-up" key={currentPage}>
          {isFirst && (
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-foreground text-center mb-8">
              {story.title}
            </h1>
          )}

          <div className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${illustrationColors[currentPage % illustrationColors.length]} flex items-center justify-center mb-8 shadow-dreamy`}>
            <div className="text-center p-6">
              <Sparkles className="w-12 h-12 text-primary/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-body italic">
                ✨ Illustration placeholder
              </p>
            </div>
          </div>

          <p className="text-xl md:text-2xl font-body text-foreground text-center leading-relaxed px-4">
            {page.text}
          </p>
        </div>
      </main>

      <footer className="px-6 py-6 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={isFirst}
          className="rounded-xl font-display border-border disabled:opacity-30"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>

        <div className="flex gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentPage
                  ? 'bg-primary scale-125'
                  : 'bg-border hover:bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <Button
          size="lg"
          onClick={() => isLast ? router.push('/dashboard') : setCurrentPage(p => p + 1)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-display font-semibold transition-all hover:scale-[1.02]"
        >
          {isLast ? 'Done 🌙' : <><span>Next</span> <ArrowRight className="w-5 h-5 ml-2" /></>}
        </Button>
      </footer>
    </div>
  );
}
