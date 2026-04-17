"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Density = "comfortable" | "compact";

type Ctx = {
  density: Density;
  setDensity: (d: Density) => void;
  toggle: () => void;
};

const DensityContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "bricks.density";

function isDensity(value: unknown): value is Density {
  return value === "comfortable" || value === "compact";
}

function readInitialDensity(): Density {
  if (typeof window === "undefined") return "comfortable";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isDensity(stored) ? stored : "comfortable";
  } catch {
    return "comfortable";
  }
}

export function DensityProvider({ children }: { children: ReactNode }) {
  const [density, setDensityState] = useState<Density>(readInitialDensity);

  const setDensity = useCallback((d: Density) => {
    setDensityState(d);
    try {
      window.localStorage.setItem(STORAGE_KEY, d);
    } catch {
      // Ignore storage write errors.
    }
  }, []);

  const toggle = useCallback(() => {
    setDensityState((prev) => {
      const next: Density = prev === "comfortable" ? "compact" : "comfortable";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore storage write errors.
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ density, setDensity, toggle }),
    [density, setDensity, toggle],
  );

  return (
    <DensityContext.Provider value={value}>
      <div data-density={density}>{children}</div>
    </DensityContext.Provider>
  );
}

export function useDensity() {
  const ctx = useContext(DensityContext);
  if (!ctx) {
    throw new Error("useDensity must be used inside <DensityProvider />");
  }
  return ctx;
}
