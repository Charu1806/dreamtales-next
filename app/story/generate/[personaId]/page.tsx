"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/supabase/types';
import { useToast } from '@/hooks/use-toast';

// Mock story generation - replace with AI later
const generateMockStory = (persona: Tables<'child_personas'>) => {
  const themes = persona.story_preference === 'Animal-based'
    ? ['forest animals', 'ocean creatures', 'sky birds']
    : persona.story_preference === 'Human-based'
    ? ['brave explorer', 'kind wizard', 'gentle knight']
    : ['magical fairy', 'friendly dragon', 'curious bunny'];

  const theme = themes[Math.floor(Math.random() * themes.length)];
  const interest = persona.fondness || 'adventure';
  const childName = persona.name;

  const pages = [
    {
      text: `Once upon a time, ${childName} found a glowing path in a magical garden. The stars twinkled softly above.`,
      imagePrompt: `soft watercolor children's book illustration of a child walking on a glowing path in a magical garden at night, stars twinkling, pastel colors, gentle lighting, storybook style`,
    },
    {
      text: `Along the way, ${childName} met a friendly ${theme} who loved ${interest} just as much!`,
      imagePrompt: `soft watercolor children's book illustration of a child meeting a friendly ${theme} in an enchanted forest, warm pastel colors, bedtime mood, storybook style`,
    },
    {
      text: `Together, they discovered a hidden treasure — a book of dreams that could make wishes come true.`,
      imagePrompt: `soft watercolor children's book illustration of a child and a ${theme} discovering a glowing magical book, bedtime mood, pastel colors, gentle lighting`,
    },
    {
      text: `${childName} made a wish for everyone to have sweet dreams tonight. The sky filled with gentle starlight.`,
      imagePrompt: `soft watercolor children's book illustration of a child making a wish under a starlit sky, magical sparkles, warm pastel colors, calming bedtime mood`,
    },
    {
      text: `And so, ${childName} snuggled into a cozy cloud bed, surrounded by warmth and love. Goodnight, sweet dreamer. 🌙`,
      imagePrompt: `soft watercolor children's book illustration of a child peacefully sleeping in a fluffy cloud bed, moonlight, warm pastel tones, calming bedtime atmosphere`,
    },
  ];

  return {
    title: `${childName} and the ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
    pages: pages.slice(0, 5),
  };
};

export default function StoryGenerate() {
  const { personaId } = useParams<{ personaId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [persona, setPersona] = useState<Tables<'child_personas'> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (personaId) {
      const supabase = createClient();
      supabase
        .from('child_personas')
        .select('*')
        .eq('id', personaId)
        .single()
        .then(({ data }) => {
          setPersona(data);
          setLoading(false);
        });
    }
  }, [personaId]);

  const handleGenerate = async () => {
    if (!persona || !user) return;

    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));

    const story = generateMockStory(persona);
    const supabase = createClient();

    const { data, error } = await supabase.from('stories').insert({
      user_id: user.id,
      persona_id: persona.id,
      title: story.title,
      story_text: story.pages.map(p => p.text).join('\n\n'),
      pages_json: story.pages,
    }).select().single();

    setGenerating(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else if (data) {
      router.push(`/story/${data.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sparkles className="w-12 h-12 text-primary animate-float" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="gradient-card rounded-2xl shadow-card p-10">
          <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className={`w-10 h-10 text-secondary ${generating ? 'animate-twinkle' : ''}`} />
          </div>

          <h1 className="text-2xl font-display font-extrabold text-foreground mb-2">
            {generating ? 'Creating magic...' : `Story for ${persona?.name}`}
          </h1>

          <p className="text-muted-foreground font-body mb-8">
            {generating
              ? 'Weaving a beautiful bedtime story just for them ✨'
              : 'Ready to create a personalized bedtime adventure?'}
          </p>

          {!generating && (
            <Button
              onClick={handleGenerate}
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-display font-bold text-lg px-10 py-6 rounded-2xl shadow-warm transition-all hover:scale-105"
            >
              Generate Tonight's Story ✨
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
