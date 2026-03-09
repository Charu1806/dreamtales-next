"use client";

import { useRouter } from 'next/navigation';
import { Moon, Stars, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/hero-bg.jpg)` }}
      />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      {/* Floating decorations */}
      <div className="absolute top-20 left-10 animate-float opacity-60">
        <Stars className="w-8 h-8 text-secondary" />
      </div>
      <div className="absolute top-32 right-16 animate-float opacity-50" style={{ animationDelay: '1s' }}>
        <Moon className="w-10 h-10 text-primary" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float opacity-40" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="w-6 h-6 text-accent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-xl animate-fade-in-up">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center shadow-warm">
            <Moon className="w-10 h-10 text-secondary" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground leading-tight mb-4">
          DreamTales
        </h1>

        <p className="text-lg md:text-xl text-foreground/80 font-body mb-2">
          Every night, your child becomes the hero of a new story.
        </p>

        <p className="text-base text-muted-foreground font-body mb-10">
          Create magical illustrated bedtime stories in seconds.
        </p>

        <Button
          size="lg"
          onClick={() => router.push('/login')}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-display font-bold text-lg px-10 py-6 rounded-2xl shadow-warm transition-all hover:scale-105"
        >
          Get Started ✨
        </Button>
      </div>
    </div>
  );
}
