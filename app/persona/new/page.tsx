"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function PersonaForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('English');
  const [fears, setFears] = useState('');
  const [fondness, setFondness] = useState('');
  const [storyPreference, setStoryPreference] = useState('Surprise me');
  const [storyline, setStoryline] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !age) return;

    setSaving(true);
    const supabase = createClient();
    let photo_url: string | null = null;

    if (photoFile) {
      const ext = photoFile.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('child-photos')
        .upload(path, photoFile);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('child-photos')
          .getPublicUrl(path);
        photo_url = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from('child_personas').insert({
      user_id: user.id,
      name,
      age: parseInt(age),
      language,
      fears: fears || null,
      fondness: fondness || null,
      story_preference: storyPreference,
      storyline: storyline || null,
      photo_url,
    });

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Dreamer created! ✨', description: `${name} is ready for adventures.` });
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-display font-extrabold text-foreground mb-2">
            Create a Little Dreamer 🌟
          </h1>
          <p className="text-muted-foreground font-body mb-8">
            Tell us about your child so we can make stories just for them.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo upload */}
            <div className="flex justify-center">
              <label className="cursor-pointer group">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                <p className="text-xs text-muted-foreground text-center mt-2 font-body">Upload photo</p>
              </label>
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold text-foreground">Child's Name *</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Luna"
                className="rounded-xl h-11 font-body"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold text-foreground">Age *</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="e.g. 5"
                className="rounded-xl h-11 font-body"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold text-foreground">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="rounded-xl h-11 font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold text-foreground">Story Preference</Label>
              <Select value={storyPreference} onValueChange={setStoryPreference}>
                <SelectTrigger className="rounded-xl h-11 font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surprise me">Surprise me ✨</SelectItem>
                  <SelectItem value="Human-based">Human-based</SelectItem>
                  <SelectItem value="Animal-based">Animal-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold text-foreground">Interests & Favorites</Label>
              <Input
                value={fondness}
                onChange={e => setFondness(e.target.value)}
                placeholder="e.g. dinosaurs, painting, space"
                className="rounded-xl h-11 font-body"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold text-foreground">Fears (handled gently)</Label>
              <Input
                value={fears}
                onChange={e => setFears(e.target.value)}
                placeholder="e.g. the dark, thunder"
                className="rounded-xl h-11 font-body"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-display font-semibold text-foreground">Story Theme (optional)</Label>
              <Textarea
                value={storyline}
                onChange={e => setStoryline(e.target.value)}
                placeholder="e.g. An adventure in a magical forest..."
                className="rounded-xl font-body resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold rounded-xl h-12 transition-all hover:scale-[1.02]"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Dreamer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="font-display rounded-xl h-12 border-border"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
