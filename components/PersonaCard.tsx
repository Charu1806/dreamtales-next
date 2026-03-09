import { CSSProperties } from 'react';
import { Sparkles, BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tables } from '@/lib/supabase/types';

interface PersonaCardProps {
  persona: Tables<'child_personas'>;
  style?: CSSProperties;
  onGenerateStory: () => void;
  onViewStories: () => void;
}

const PersonaCard = ({ persona, style, onGenerateStory, onViewStories }: PersonaCardProps) => {
  return (
    <div
      className="gradient-card rounded-2xl shadow-card p-6 animate-fade-in-up hover:shadow-dreamy transition-shadow"
      style={style}
    >
      <div className="flex items-start gap-4 mb-4">
        {persona.photo_url ? (
          <img
            src={persona.photo_url}
            alt={persona.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-secondary"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-display font-bold text-foreground truncate">
            {persona.name}
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Age {persona.age} · {persona.language}
          </p>
          {persona.fondness && (
            <p className="text-sm text-accent font-body mt-1 truncate">
              Loves: {persona.fondness}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onGenerateStory}
          className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-display font-semibold rounded-xl transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 mr-2" /> Tonight's Story
        </Button>
        <Button
          onClick={onViewStories}
          variant="outline"
          className="font-display rounded-xl border-border hover:bg-muted"
        >
          <BookOpen className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonaCard;
