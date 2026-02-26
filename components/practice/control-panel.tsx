"use client";

import { useState } from "react";
import { BookOpen, Sparkles, Zap, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DOMAINS,
  TOPICS,
  SUBTOPICS,
  DIFFICULTIES,
  type Domain,
  type Topic,
  type Mode,
  type Difficulty,
} from "@/lib/practice-types";

interface ControlPanelProps {
  domain: Domain;
  topic: Topic;
  subtopic: string | undefined;
  mode: Mode;
  difficulty: Difficulty;
  loading: boolean;
  onDomainChange: (value: Domain) => void;
  onTopicChange: (value: Topic) => void;
  onSubtopicChange: (value: string | undefined) => void;
  onModeChange: (value: Mode) => void;
  onDifficultyChange: (value: Difficulty) => void;
  onGenerate: () => void;
}

export function ControlPanel({
  domain,
  topic,
  subtopic,
  mode,
  difficulty,
  loading,
  onDomainChange,
  onTopicChange,
  onSubtopicChange,
  onModeChange,
  onDifficultyChange,
  onGenerate,
}: ControlPanelProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const subtopicOptions =
    topic !== "mixed" ? SUBTOPICS[topic] : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-lg bg-primary p-2">
          <BookOpen className="size-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Practice Setup
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your session
          </p>
        </div>
      </div>

      {/* Domain (subtle, future-proof) */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="domain-select"
          className="text-xs font-medium text-muted-foreground"
        >
          Competition
        </Label>
        <Select
          value={domain}
          onValueChange={(v) => onDomainChange(v as Domain)}
        >
          <SelectTrigger
            id="domain-select"
            className="w-full h-8 text-xs border-dashed"
          >
            <SelectValue placeholder="Select competition" />
          </SelectTrigger>
          <SelectContent>
            {DOMAINS.map((d) => (
              <SelectItem
                key={d.value}
                value={d.value}
                disabled={d.disabled}
              >
                {d.label}
                {d.disabled ? " (Coming soon)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Topic */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="topic-select"
          className="text-sm font-medium text-foreground"
        >
          Topic
        </Label>
        <Select
          value={topic}
          onValueChange={(v) => {
            onTopicChange(v as Topic);
            onSubtopicChange(undefined);
          }}
        >
          <SelectTrigger id="topic-select" className="w-full">
            <SelectValue placeholder="Select topic" />
          </SelectTrigger>
          <SelectContent>
            {TOPICS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters (collapsible subtopic) */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <SlidersHorizontal className="size-3.5" />
            Advanced Filters
            <ChevronDown
              className={`ml-auto size-3.5 transition-transform ${
                filtersOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="subtopic-select"
              className="text-sm font-medium text-foreground"
            >
              Subtopic
            </Label>
            {topic === "mixed" ? (
              <p className="text-xs text-muted-foreground italic">
                Select a specific topic to filter by subtopic.
              </p>
            ) : (
              <Select
                value={subtopic ?? "__none__"}
                onValueChange={(v) =>
                  onSubtopicChange(v === "__none__" ? undefined : v)
                }
              >
                <SelectTrigger id="subtopic-select" className="w-full">
                  <SelectValue placeholder="All subtopics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">All subtopics</SelectItem>
                  {subtopicOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Mode */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-foreground">Mode</Label>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => onModeChange("rag")}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              mode === "rag"
                ? "border-primary bg-primary/8 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary"
            }`}
          >
            <BookOpen className="size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium leading-none">
                Real Past Problems
              </p>
              <p className="mt-1 text-xs text-muted-foreground">RAG-powered</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("simulated")}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              mode === "simulated"
                ? "border-primary bg-primary/8 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary"
            }`}
          >
            <Sparkles className="size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium leading-none">Simulated</p>
              <p className="mt-1 text-xs text-muted-foreground">
                AI-generated
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="difficulty-select"
          className="text-sm font-medium text-foreground"
        >
          Difficulty
        </Label>
        <Select
          value={difficulty}
          onValueChange={(v) => onDifficultyChange(v as Difficulty)}
        >
          <SelectTrigger id="difficulty-select" className="w-full">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
                {d.desc ? ` (${d.desc})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Generate */}
      <Button
        size="lg"
        onClick={onGenerate}
        disabled={loading}
        className="w-full gap-2 min-h-[48px] touch-manipulation"
        aria-busy={loading}
        aria-label={loading ? "Generating questions" : "Generate 10 questions"}
      >
        {loading ? (
          <>
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Generating...
          </>
        ) : (
          <>
            <Zap className="size-4" />
            Generate 10 Questions
          </>
        )}
      </Button>
    </div>
  );
}
