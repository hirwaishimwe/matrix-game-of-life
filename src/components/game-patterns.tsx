"use client";

import { useCallback } from "react";

interface PatternProps {
  pattern: boolean[];
  output: boolean;
  onClick?: () => void;
}

export function Pattern({ pattern, output, onClick }: PatternProps) {
  return (
    <div className="flex flex-col items-center" onClick={onClick}>
      <div className="grid grid-cols-3 w-12 border border-green-900">
        {pattern.map((cell, i) => (
          <div
            key={i}
            className={`w-4 h-4 flex items-center justify-center ${
              cell ? "bg-black" : "bg-green-900"
            }`}
          >
            {!cell && (
              <div className="w-2 h-2 bg-black" />
            )}
          </div>
        ))}
      </div>
      <div
        className={`w-12 h-4 mt-1 border border-green-900 ${
          output ? "bg-green-900" : "bg-black"
        }`}
      >
        {!output && <div className="w-2 h-2 mx-auto bg-black" />}
      </div>
    </div>
  );
}

interface PatternGridProps {
  rule: number;
  onChange: (newRule: number) => void;
}

export function PatternGrid({ rule, onChange }: PatternGridProps) {
  // Convert rule number to binary and ensure it has 8 bits
  const getBinaryRule = useCallback((rule: number): boolean[] => {
    const binary = rule.toString(2).padStart(8, "0");
    return binary.split("").map((bit) => bit === "1");
  }, []);

  // Convert 3 cells to a pattern index (0-7)
  const getPatternIndex = useCallback((pattern: boolean[]): number => {
    return (pattern[0] ? 4 : 0) + (pattern[1] ? 2 : 0) + (pattern[2] ? 1 : 0);
  }, []);

  // Toggle a specific pattern output
  const togglePattern = useCallback(
    (patternIndex: number) => {
      const binaryRule = getBinaryRule(rule);
      binaryRule[7 - patternIndex] = !binaryRule[7 - patternIndex];

      // Convert back to decimal
      const newRule = parseInt(
        binaryRule.map((bit) => (bit ? "1" : "0")).join(""),
        2
      );

      onChange(newRule);
    },
    [rule, onChange, getBinaryRule]
  );

  // Get all possible 3-cell patterns
  const allPatterns = [
    [false, false, false], // 000
    [false, false, true],  // 001
    [false, true, false],  // 010
    [false, true, true],   // 011
    [true, false, false],  // 100
    [true, false, true],   // 101
    [true, true, false],   // 110
    [true, true, true],    // 111
  ];

  const ruleOutputs = getBinaryRule(rule);

  return (
    <div className="pattern-grid flex gap-1">
      {allPatterns.map((pattern, i) => (
        <Pattern
          key={i}
          pattern={pattern}
          output={ruleOutputs[7 - i]}
          onClick={() => togglePattern(i)}
        />
      ))}
    </div>
  );
}
