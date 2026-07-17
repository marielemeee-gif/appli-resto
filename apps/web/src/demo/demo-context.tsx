"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { defaultScenarioId, DemoDecision, getDemoScenario } from "./scenarios";

type DecisionStatus = DemoDecision["status"];
type DemoContextValue = {
  scenario: ReturnType<typeof getDemoScenario>;
  decisions: DemoDecision[];
  storageError: string;
  selectScenario: (id: string) => void;
  decide: (recommendationId: string, status: DecisionStatus) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [scenarioId, setScenarioId] = useState(defaultScenarioId);
  const [sessionDecisions, setSessionDecisions] = useState<DemoDecision[]>([]);
  const storageError = "";

  const scenario = getDemoScenario(scenarioId);
  const decisions = useMemo(() => [...scenario.history, ...sessionDecisions], [scenario.history, sessionDecisions]);

  const value = useMemo<DemoContextValue>(() => ({
    scenario,
    decisions,
    storageError,
    selectScenario: (id) => setScenarioId(getDemoScenario(id).id),
    decide: (recommendationId, status) => {
      const recommendation = scenario.recommendations.find((item) => item.id === recommendationId);
      const dispatch = scenario.dispatch?.id === recommendationId ? scenario.dispatch : undefined;
      if (!recommendation && !dispatch) return;
      const decision: DemoDecision = {
        id: `${scenario.id}-${recommendationId}`,
        scenarioId: scenario.id,
        recommendationId,
        recommendationType: recommendation?.type ?? "dispatch",
        title: recommendation?.title ?? `Transférer ${dispatch?.quantity} serveur de ${dispatch?.source} vers ${dispatch?.target}`,
        site: recommendation ? scenario.siteName : "Groupe",
        status,
        decidedAt: "2026-07-17T09:05:00+02:00",
        estimatedGain: status === "refused" ? 0 : Math.round((recommendation?.estimatedGain ?? dispatch?.estimatedGain ?? 0) * (status === "modified" ? 0.72 : 1)),
      };
      setSessionDecisions((current) => [...current.filter((item) => item.id !== decision.id), decision]);
    },
    resetDemo: () => {
      setScenarioId(defaultScenarioId);
      setSessionDecisions([]);
    },
  }), [decisions, scenario, storageError]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo doit être utilisé dans DemoProvider");
  return value;
}
