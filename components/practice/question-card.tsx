"use client";

import { useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  Eye,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Question, QuestionUIState } from "@/lib/practice-types";

interface QuestionCardProps {
  question: Question;
  index: number;
  state: QuestionUIState;
  onStateChange: (patch: Partial<QuestionUIState>) => void;
}

const TOPIC_LABELS: Record<string, string> = {
  algebra: "Algebra",
  geometry: "Geometry",
  "number-theory": "Number Theory",
  "counting-probability": "Counting & Prob.",
  mixed: "Mixed",
};

function difficultyBadge(level: number) {
  if (level <= 3)
    return {
      label: `Easy (${level})`,
      classes: "bg-success/12 text-success border-success/20",
    };
  if (level <= 6)
    return {
      label: `Medium (${level})`,
      classes: "bg-chart-3/12 text-chart-3 border-chart-3/20",
    };
  return {
    label: `Hard (${level})`,
    classes: "bg-destructive/12 text-destructive border-destructive/20",
  };
}

function sourceLabel(src: Question["source"]): string | null {
  if (!src) return null;
  const parts: string[] = [];
  if (src.year) parts.push(String(src.year));
  if (src.round) parts.push(src.round);
  if (src.problemNumber) parts.push(`#${src.problemNumber}`);
  return parts.length > 0 ? parts.join(" ") : null;
}

export function QuestionCard({
  question,
  index,
  state,
  onStateChange,
}: QuestionCardProps) {
  const { userAnswer, isCorrect, showHint, showSolution } = state;

  const handleCheck = useCallback(() => {
    const normalise = (s: string) =>
      s.trim().toLowerCase().replace(/\s+/g, "");
    const correct = normalise(userAnswer) === normalise(question.answer);
    onStateChange({ isCorrect: correct });
  }, [userAnswer, question.answer, onStateChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && userAnswer.trim()) handleCheck();
    },
    [handleCheck, userAnswer]
  );

  const diff = difficultyBadge(question.difficulty);
  const src = sourceLabel(question.source);
  const topicText = question.topic
    ? TOPIC_LABELS[question.topic] ?? question.topic
    : null;

  const borderClass =
    isCorrect === true
      ? "border-success/40 shadow-[0_0_0_1px_var(--success)]"
      : isCorrect === false
      ? "border-destructive/40 shadow-[0_0_0_1px_var(--destructive)]"
      : "hover:shadow-md";

  return (
    <Card className={`transition-all rounded-xl ${borderClass}`}>
      <CardContent className="flex flex-col gap-4 pt-2">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="tabular-nums font-mono text-xs bg-primary/10 text-primary border-primary/20"
          >
            {"#"}{index}
          </Badge>
          <Badge variant="outline" className={diff.classes}>
            {diff.label}
          </Badge>
          {topicText && (
            <Badge variant="secondary" className="text-xs">
              {topicText}
            </Badge>
          )}
          {src && (
            <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
              {src}
            </span>
          )}
        </div>

        {/* Prompt */}
        <p className="text-sm leading-relaxed text-foreground font-medium">
          {question.prompt}
        </p>

        {/* Answer input + check */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Input
              placeholder="Your answer..."
              value={userAnswer}
              onChange={(e) =>
                onStateChange({ userAnswer: e.target.value, isCorrect: null })
              }
              onKeyDown={handleKeyDown}
              className={`pr-10 font-mono ${
                isCorrect === true
                  ? "border-success focus-visible:ring-success/30"
                  : isCorrect === false
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : ""
              }`}
              aria-label={`Answer for question ${index}`}
            />
            {isCorrect === true && (
              <CheckCircle2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-success" />
            )}
            {isCorrect === false && (
              <XCircle className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-destructive" />
            )}
          </div>
          <Button
            size="sm"
            onClick={handleCheck}
            disabled={!userAnswer.trim()}
            className="gap-1.5 shrink-0"
          >
            <Send className="size-3.5" />
            Check
          </Button>
        </div>

        {/* Feedback */}
        {isCorrect === true && (
          <p className="text-sm font-medium text-success flex items-center gap-1.5">
            <CheckCircle2 className="size-4" />
            Correct!
          </p>
        )}
        {isCorrect === false && (
          <div className="text-sm font-medium text-destructive flex items-center gap-1.5">
            <XCircle className="size-4" />
            <span>
              {"Incorrect. The answer is "}
              <code className="rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-xs">
                {question.answer}
              </code>
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {question.hint && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStateChange({ showHint: !showHint })}
              className="gap-1.5 text-xs"
            >
              <Lightbulb className="size-3.5" />
              {showHint ? "Hide Hint" : "Hint"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStateChange({ showSolution: !showSolution })}
            className="gap-1.5 text-xs"
          >
            <Eye className="size-3.5" />
            {showSolution ? "Hide Solution" : "Show Solution"}
          </Button>
        </div>

        {/* Hint */}
        {showHint && question.hint && (
          <div className="rounded-xl border border-chart-3/20 bg-chart-3/5 px-4 py-3">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-chart-3">Hint: </span>
              {question.hint}
            </p>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-primary">Solution: </span>
              {question.solution}
            </p>
            <p className="mt-2 text-sm">
              <span className="font-semibold text-primary">Answer: </span>
              <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-sm text-primary">
                {question.answer}
              </code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
