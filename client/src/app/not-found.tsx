import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-gradient text-8xl font-bold">404</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="from-cyan to-purple mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-8 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-purple-500/25"
      >
        Go Home
      </Link>
    </div>
  );
}
