import { describe, it, expect } from "vitest";
import { normalizeAnswer, isCorrect } from "./answer";

describe("normalizeAnswer", () => {
  it("trims leading and trailing whitespace", () => {
    expect(normalizeAnswer("  5  ")).toBe("5");
    expect(normalizeAnswer("\t  x \n")).toBe("x");
  });

  it("collapses multiple spaces to one", () => {
    expect(normalizeAnswer("a   b   c")).toBe("a b c");
    expect(normalizeAnswer("1   /   2")).toBe("1 / 2");
  });

  it("returns empty string for empty/whitespace-only input", () => {
    expect(normalizeAnswer("")).toBe("");
    expect(normalizeAnswer("   ")).toBe("");
  });
});

describe("isCorrect", () => {
  describe("exact match after normalize", () => {
    it("matches when trimmed and space-collapsed", () => {
      expect(isCorrect("  5  ", "5")).toBe(true);
      expect(isCorrect("1 2 3", "1 2 3")).toBe(true);
    });
    it("mismatch when different", () => {
      expect(isCorrect("5", "6")).toBe(false);
      expect(isCorrect("hello", "world")).toBe(false);
    });
  });

  describe("equivalent fractions", () => {
    it("accepts 2/4 and 1/2 as equal", () => {
      expect(isCorrect("2/4", "1/2")).toBe(true);
      expect(isCorrect("1/2", "2/4")).toBe(true);
    });
    it("accepts 4/8 and 1/2", () => {
      expect(isCorrect("4/8", "1/2")).toBe(true);
    });
    it("rejects different fractions", () => {
      expect(isCorrect("1/2", "1/3")).toBe(false);
      expect(isCorrect("3/4", "1/2")).toBe(false);
    });
    it("handles fractions with spaces", () => {
      expect(isCorrect(" 2 / 4 ", "1/2")).toBe(true);
    });
  });

  describe("decimals with tolerance", () => {
    it("accepts decimals within 1e-6", () => {
      expect(isCorrect("0.1", "0.1")).toBe(true);
      expect(isCorrect("0.1234567", "0.1234568")).toBe(true);
      expect(isCorrect("1.0", "1")).toBe(true);
      expect(isCorrect("1", "1.0")).toBe(true);
    });
    it("rejects decimals beyond tolerance", () => {
      expect(isCorrect("0.1", "0.2")).toBe(false);
      expect(isCorrect("1.000001", "1.000002")).toBe(false);
    });
  });

  describe("multiple-choice A/B/C/D", () => {
    it("accepts same letter case-insensitive", () => {
      expect(isCorrect("A", "A")).toBe(true);
      expect(isCorrect("a", "A")).toBe(true);
      expect(isCorrect("B", "b")).toBe(true);
      expect(isCorrect("  C  ", "C")).toBe(true);
    });
    it("rejects different letters", () => {
      expect(isCorrect("A", "B")).toBe(false);
      expect(isCorrect("C", "D")).toBe(false);
    });
    it("respects format multiple-choice", () => {
      expect(isCorrect("A", "a", "multiple-choice")).toBe(true);
      expect(isCorrect("B", "B", "multiple-choice")).toBe(true);
      expect(isCorrect("A", "B", "multiple-choice")).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("empty vs non-empty is false", () => {
      expect(isCorrect("", "5")).toBe(false);
      expect(isCorrect("5", "")).toBe(false);
    });
    it("numeric vs fraction: 0.5 and 1/2", () => {
      expect(isCorrect("0.5", "1/2")).toBe(true);
    });
    it("integer string matches same integer", () => {
      expect(isCorrect("42", "42")).toBe(true);
      expect(isCorrect("42", "43")).toBe(false);
    });
  });
});
