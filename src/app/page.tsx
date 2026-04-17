"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Puzzle,
  Globe,
  Zap,
  Shield,
  ArrowRight,
  GitFork,
} from "lucide-react";

export default function LandingPage() {
  const { user, loading, configured, signIn } = useAuth();
  const router = useRouter();

  if (!loading && user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-2xl">
            <Bookmark className="w-8 h-8 text-amber-500 fill-amber-500" />
            ReadStash
          </div>
          <Button
            onClick={signIn}
            variant="default"
            disabled={loading}
            className="h-11 px-5 text-base"
          >
            Sign in with Google
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-28 md:py-40 text-center px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-base font-medium border border-amber-200">
              <Zap className="w-4 h-4" />
              100% free &amp; open source
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
              Save it. Read it.{" "}
              <span className="text-amber-500">Own it.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A beautiful read-it-later app with Chrome &amp; Safari extensions.
              Save articles, videos, and links to read on your own time.
              No subscriptions, no limits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
              <Button
                size="lg"
                onClick={signIn}
                disabled={loading}
                className="h-14 px-7 text-lg w-full sm:w-auto"
              >
                Get started free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  window.open(
                    "https://github.com/ryansingh-sareen/readstash",
                    "_blank"
                  )
                }
                className="h-14 px-7 text-lg w-full sm:w-auto"
              >
                <GitFork className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-muted/50 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: Puzzle,
                  title: "Browser Extensions",
                  desc: "One-click save from Chrome and Safari. Keyboard shortcuts included.",
                },
                {
                  icon: Globe,
                  title: "Clean Dashboard",
                  desc: "Organized reading list with search, favorites, tags, and archive.",
                },
                {
                  icon: Zap,
                  title: "Instant Sync",
                  desc: "Real-time sync across all your devices powered by Firebase.",
                },
                {
                  icon: Shield,
                  title: "Your Data, Your Control",
                  desc: "Open source. Self-hostable. No tracking, no ads, no BS.",
                },
                {
                  icon: Bookmark,
                  title: "Smart Metadata",
                  desc: "Auto-extracts titles, descriptions, and images from any URL.",
                },
                {
                  icon: ArrowRight,
                  title: "Zero Friction",
                  desc: "No account limits, no paywall, no premium tier. Just save and read.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-background rounded-2xl border p-8 space-y-4"
                >
                  <f.icon className="w-10 h-10 text-amber-500" />
                  <h3 className="font-semibold text-xl">{f.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 text-center px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Ready to reclaim your reading?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Stop losing great articles in a sea of tabs.
            </p>
            <Button
              size="lg"
              onClick={signIn}
              disabled={loading}
              className="h-14 px-7 text-lg"
            >
              Start saving for free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 text-center text-base text-muted-foreground">
        <p>ReadStash &mdash; Open source, forever free.</p>
      </footer>
    </div>
  );
}
