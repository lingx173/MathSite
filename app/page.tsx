"use client";

import { useState, useCallback } from "react";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ControlPanel } from "@/components/practice/control-panel";
import { QuestionsArea } from "@/components/practice/questions-area";
import { generateSet } from "@/lib/practice-api";
import type {
  Domain,
  Topic,
  Mode,
  Difficulty,
  PracticeSet,
  QuestionUIState,
} from "@/lib/practice-types";

function freshUIStates(count: number): QuestionUIState[] {
  return Array.from({ length: count }, () => ({
    userAnswer: "",
    isCorrect: null,
    showSolution: false,
    showHint: false,
  }));
}

export default function PracticePage() {
  /* ── Control state ─────────────────────────────────────────── */
  const [domain, setDomain] = useState<Domain>("mathcounts");
  const [topic, setTopic] = useState<Topic>("mixed");
  const [subtopic, setSubtopic] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<Mode>("rag");
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");

  /* ── Practice state ────────────────────────────────────────── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [practiceSet, setPracticeSet] = useState<PracticeSet | null>(null);
  const [questionStates, setQuestionStates] = useState<QuestionUIState[]>([]);

  /* ── Generate handler ──────────────────────────────────────── */
  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPracticeSet(null);
    setQuestionStates([]);
    try {
      const set = await generateSet(domain, topic, subtopic, mode, difficulty);
      setPracticeSet(set);
      setQuestionStates(freshUIStates(set.questions.length));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate questions.";
      setError(message);
      toast.error("Generation failed", { description: message });
    } finally {
      setLoading(false);
    }
  }, [domain, topic, subtopic, mode, difficulty]);

  /* ── Per-question state updater ────────────────────────────── */
  const handleQuestionStateChange = useCallback(
    (index: number, patch: Partial<QuestionUIState>) => {
      setQuestionStates((prev) =>
        prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
      );
    },
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              MathCounts Trainer
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Competition Math Practice
            </p>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Left / top panel */}
          <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:h-fit lg:w-72 xl:w-80">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <ControlPanel
                domain={domain}
                topic={topic}
                subtopic={subtopic}
                mode={mode}
                difficulty={difficulty}
                loading={loading}
                onDomainChange={setDomain}
                onTopicChange={setTopic}
                onSubtopicChange={setSubtopic}
                onModeChange={setMode}
                onDifficultyChange={setDifficulty}
                onGenerate={handleGenerate}
              />
            </div>
          </aside>

          {/* Right / bottom area */}
          <section className="min-w-0 flex-1" aria-label="Questions area">
            <QuestionsArea
              practiceSet={practiceSet}
              loading={loading}
              error={error}
              questionStates={questionStates}
              onQuestionStateChange={handleQuestionStateChange}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
