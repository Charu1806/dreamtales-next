import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <h1 className="text-6xl font-display font-extrabold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground font-body mb-8">
        This page doesn't exist... yet. 🌙
      </p>
      <Link
        href="/"
        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-display font-semibold rounded-xl px-6 py-3 transition-all hover:scale-105"
      >
        Go Home
      </Link>
    </div>
  );
}
