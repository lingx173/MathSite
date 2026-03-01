"use client";

import { ClipboardList } from "lucide-react";
import { QuestionCard } from "./question-card";
import type { PracticeSet, QuestionUIState } from "@/lib/practice-types";

interface QuestionsAreaProps {
  practiceSet: PracticeSet | null;
  loading: boolean;
  error: string | null;
  questionStates: QuestionUIState[];
  onQuestionStateChange: (index: number, patch: Partial<QuestionUIState>) => void;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-6">
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-8 rounded bg-muted" />
        <div className="h-5 w-16 rounded bg-muted" />
        <div className="h-5 w-20 rounded bg-muted" />
      </div>
      <div className="h-4 w-full rounded bg-muted mb-2" />
      <div className="h-4 w-3/4 rounded bg-muted mb-4" />
      <div className="h-9 w-full rounded bg-muted mb-3" />
      <div className="flex gap-2">
        <div className="h-8 w-20 rounded bg-muted" />
        <div className="h-8 w-28 rounded bg-muted" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center rounded-2xl bg-secondary p-4 mb-6">
        <ClipboardList className="size-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 text-balance">
        Ready to Practice
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground leading-relaxed text-pretty">
        Select a topic, choose your mode and difficulty, then hit{" "}
        <span className="font-medium text-primary">Generate 5 Questions</span>{" "}
        to start your training session.
      </p>
    </div>
  );
}

function ScoreBar({ states }: { states: QuestionUIState[] }) {
  const answered = states.filter((s) => s.isCorrect !== null).length;
  const correct = states.filter((s) => s.isCorrect === true).length;
  if (answered === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-sm font-medium text-foreground">
        {correct}/{answered} correct
      </p>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-success transition-all duration-300"
          style={{ width: `${(correct / states.length) * 100}%` }}
        />
      </div>
      <p className="text-xs tabular-nums text-muted-foreground">
        {answered}/{states.length} answered
      </p>
    </div>
  );
}

export function QuestionsArea({
  practiceSet,
  loading,
  error,
  questionStates,
  onQuestionStateChange,
}: QuestionsAreaProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-destructive font-medium">{error}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Please try generating again.
        </p>
      </div>
    );
  }

  if (!practiceSet) return <EmptyState />;

  const modeLabel =
    practiceSet.meta.mode === "rag" ? "Real Past Problems" : "AI-Generated";

  return (
    <div className="flex flex-col gap-4 min-w-0">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          {modeLabel} Set
        </h2>
        <span className="text-xs text-muted-foreground">
          {practiceSet.questions.length} questions
        </span>
      </div>

      <ScoreBar states={questionStates} />

      {practiceSet.questions.map((q, i) => (
        <QuestionCard
          key={q.qid}
          question={q}
          index={i + 1}
          state={questionStates[i]}
          onStateChange={(patch) => onQuestionStateChange(i, patch)}
        />
      ))}
    </div>
  );
}
