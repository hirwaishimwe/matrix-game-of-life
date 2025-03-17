"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Types for cellular automaton
type CellState = 0 | 1;
type Mode = "ELEMENTARY" | "TOTALISTIC";
type Rule = "30" | "90" | "110" | "184" | "1935";
type Speed = "SLOW" | "MEDIUM" | "FAST" | "MAX";
type Zoom = "1x" | "2x" | "3x";

// Increase grid size for a larger display
const GRID_WIDTH = 200;
const GRID_HEIGHT = 120;

export function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("ELEMENTARY");
  const [rule, setRule] = useState<Rule>("30");
  const [zoom, setZoom] = useState<Zoom>("2x");
  const [speed, setSpeed] = useState<Speed>("MEDIUM");
  const [isPaused, setIsPaused] = useState(false);
  const [grid, setGrid] = useState<CellState[][]>(() => createEmptyGrid());
  const animationRef = useRef<number | null>(null);
  const generationRef = useRef(0);

  // Create an empty grid
  function createEmptyGrid(): CellState[][] {
    return Array(GRID_HEIGHT)
      .fill(0)
      .map(() => Array(GRID_WIDTH).fill(0) as CellState[]);
  }

  // Initialize the grid with a single cell in the middle of the top row
  const initializeGrid = useCallback(() => {
    const newGrid = createEmptyGrid();
    newGrid[0][Math.floor(GRID_WIDTH / 2)] = 1;
    setGrid(newGrid);
    generationRef.current = 0;
  }, []);

  // Apply Wolfram cellular automaton rules to generate the first line
  const applyWolframRule = useCallback((row: CellState[]): CellState[] => {
    const newRow = Array(row.length).fill(0) as CellState[];

    for (let i = 0; i < row.length; i++) {
      const left = row[(i - 1 + row.length) % row.length];
      const center = row[i];
      const right = row[(i + 1) % row.length];

      // Convert the neighborhood to a binary pattern
      const pattern = (left << 2) | (center << 1) | right;

      // Apply the rule
      const ruleNum = parseInt(rule, 10);

      if (mode === "ELEMENTARY") {
        // Elementary cellular automaton
        newRow[i] = ((ruleNum >> pattern) & 1) as CellState;
      } else {
        // Totalistic cellular automaton
        const sum = left + center + right;
        newRow[i] = ((ruleNum >> sum) & 1) as CellState;
      }
    }

    return newRow;
  }, [mode, rule]);

  // Apply Conway's Game of Life rules
  const applyGameOfLifeRules = useCallback((grid: CellState[][]): CellState[][] => {
    const newGrid = grid.map(row => [...row]);

    for (let y = 1; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        // Count live neighbors
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;

            const nx = (x + dx + grid[y].length) % grid[y].length;
            const ny = (y + dy + grid.length) % grid.length;

            if (ny >= 0 && ny < grid.length && grid[ny][nx] === 1) {
              neighbors++;
            }
          }
        }

        // Apply Game of Life rules
        if (grid[y][x] === 1) {
          // Live cell stays alive if it has 2 or 3 live neighbors
          newGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          // Dead cell becomes alive if it has exactly 3 live neighbors
          newGrid[y][x] = (neighbors === 3) ? 1 : 0;
        }
      }
    }

    // Update the bottom row with Wolfram CA
    if (generationRef.current % 10 === 0) {
      newGrid[0] = applyWolframRule(grid[0]);
    }

    return newGrid;
  }, [applyWolframRule]);

  // Update the grid for one generation
  const updateGrid = useCallback(() => {
    setGrid(prevGrid => {
      // Copy the previous grid
      const newGrid = prevGrid.map(row => [...row]);

      // Shift all rows down one position
      for (let y = newGrid.length - 1; y > 0; y--) {
        newGrid[y] = [...newGrid[y - 1]];
      }

      // Apply the Wolfram rule to the top row
      newGrid[0] = applyWolframRule(prevGrid[0]);

      // Apply Game of Life rules to other rows
      return applyGameOfLifeRules(newGrid);
    });

    generationRef.current++;
  }, [applyWolframRule, applyGameOfLifeRules]);

  // Animation loop
  const animate = useCallback(() => {
    const speedMap: Record<Speed, number> = {
      SLOW: 500,
      MEDIUM: 250,
      FAST: 100,
      MAX: 0
    };

    updateGrid();

    if (speed === "MAX") {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, speedMap[speed]);
    }
  }, [speed, updateGrid]);

  // Start or stop the animation
  useEffect(() => {
    if (!isPaused) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, animate]);

  // Initialize the grid
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid, mode, rule]);

  // Draw the grid on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on zoom level
    const zoomFactor = parseInt(zoom.charAt(0), 10);
    canvas.width = GRID_WIDTH * zoomFactor;
    canvas.height = GRID_HEIGHT * zoomFactor;

    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 1) {
          // Matrix green glow effect for live cells
          const glowIntensity = 0.7 + 0.3 * Math.sin(Date.now() / 300 + x * 0.1 + y * 0.1);
          ctx.fillStyle = `rgba(0, ${Math.floor(190 * glowIntensity)}, 0, ${0.8 + 0.2 * glowIntensity})`;
          ctx.shadowColor = "rgba(0, 255, 0, 0.8)";
          ctx.shadowBlur = 5 * zoomFactor;
        } else {
          // Dark green for dead cells
          ctx.fillStyle = "rgba(0, 40, 0, 0.2)";
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        // Draw cell with slight gap between cells for a grid effect
        const cellSize = zoomFactor - 0.2;
        ctx.fillRect(x * zoomFactor, y * zoomFactor, cellSize, cellSize);
      }
    }
  }, [grid, zoom]);

  return (
    <div className="w-full h-[800px] relative flex flex-col"> {/* Increased height from 700px to 800px */}
      <div className="controls w-full p-2 flex flex-wrap gap-2 bg-black border-b border-green-900 z-10">
        <div className="flex items-center gap-2">
          <label className="text-sm text-green-600">MODE:</label>
          <Select
            value={mode}
            onValueChange={(value) => setMode(value as Mode)}
          >
            <SelectTrigger className="bg-black text-green-500 border-green-900 w-36">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent className="bg-black text-green-500 border-green-900">
              <SelectItem value="ELEMENTARY">ELEMENTARY</SelectItem>
              <SelectItem value="TOTALISTIC">TOTALISTIC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-green-600">PRESET:</label>
          <Select
            value={rule}
            onValueChange={(value) => setRule(value as Rule)}
          >
            <SelectTrigger className="bg-black text-green-500 border-green-900 w-36">
              <SelectValue placeholder="Select rule" />
            </SelectTrigger>
            <SelectContent className="bg-black text-green-500 border-green-900">
              <SelectItem value="30">Rule 30</SelectItem>
              <SelectItem value="90">Rule 90</SelectItem>
              <SelectItem value="110">Rule 110</SelectItem>
              <SelectItem value="184">Rule 184</SelectItem>
              <SelectItem value="1935">Code 1935</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-green-600">ZOOM:</label>
          <Select
            value={zoom}
            onValueChange={(value) => setZoom(value as Zoom)}
          >
            <SelectTrigger className="bg-black text-green-500 border-green-900 w-20">
              <SelectValue placeholder="Zoom" />
            </SelectTrigger>
            <SelectContent className="bg-black text-green-500 border-green-900">
              <SelectItem value="1x">1x</SelectItem>
              <SelectItem value="2x">2x</SelectItem>
              <SelectItem value="3x">3x</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-green-600">SPEED:</label>
          <Select
            value={speed}
            onValueChange={(value) => setSpeed(value as Speed)}
          >
            <SelectTrigger className="bg-black text-green-500 border-green-900 w-28">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent className="bg-black text-green-500 border-green-900">
              <SelectItem value="SLOW">SLOW</SelectItem>
              <SelectItem value="MEDIUM">MEDIUM</SelectItem>
              <SelectItem value="FAST">FAST</SelectItem>
              <SelectItem value="MAX">MAX</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsPaused(!isPaused)}
            className="bg-black text-green-500 border border-green-900 hover:bg-green-950"
          >
            {isPaused ? "PLAY" : "PAUSE"}
          </Button>
        </div>
      </div>

      <div className="canvas-container flex-1 bg-black flex items-center justify-center overflow-auto p-4">
        <canvas
          ref={canvasRef}
          className="border border-green-900 shadow-[0_0_25px_rgba(0,255,0,0.4)]"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
