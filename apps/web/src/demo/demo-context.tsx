"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { defaultScenarioId, DemoDecision, type DemoSite, getDemoScenario } from "./scenarios";

type DecisionStatus = DemoDecision["status"];
export type SupplierStatus = "recommended" | "drafted" | "confirmed_demo";
type DemoContextValue = {
  scenario: ReturnType<typeof getDemoScenario>;
  activeSite: DemoSite;
  activeSiteId: DemoSite["id"];
  decisions: DemoDecision[];
  storageError: string;
  supplierStatus: SupplierStatus;
  selectScenario: (id: string) => void;
  selectActiveSite: (id: DemoSite["id"]) => void;
  decide: (recommendationId: string, status: DecisionStatus, note?: string) => void;
  prepareSupplierDraft: () => void;
  confirmSupplierDraft: () => void;
  addCustomDecision: (title: string, owner: string, deadline: string) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [scenarioId, setScenarioId] = useState(defaultScenarioId);
  const [activeSiteId, setActiveSiteId] = useState<DemoSite["id"]>(getDemoScenario(defaultScenarioId).siteId);
  const [sessionDecisions, setSessionDecisions] = useState<DemoDecision[]>([]);
  const [supplierStates, setSupplierStates] = useState<Record<string, SupplierStatus>>({});
  const storageError = "";

  const scenario = getDemoScenario(scenarioId);
  const activeSite = scenario.sites.find((item) => item.id === activeSiteId) ?? scenario.sites.find((item) => item.id === scenario.siteId)!;
  const decisions = useMemo(() => [...scenario.history, ...sessionDecisions], [scenario.history, sessionDecisions]);
  const supplierStatus = scenario.supplierWorkflow ? supplierStates[scenario.supplierWorkflow.id] ?? "recommended" : "recommended";

  const value = useMemo<DemoContextValue>(() => ({
    scenario,
    activeSite,
    activeSiteId: activeSite.id,
    decisions,
    storageError,
    supplierStatus,
    selectScenario: (id) => {
      const nextScenario = getDemoScenario(id);
      setScenarioId(nextScenario.id);
      setActiveSiteId(nextScenario.siteId);
    },
    selectActiveSite: (id) => {
      if (scenario.sites.some((item) => item.id === id)) setActiveSiteId(id);
    },
    decide: (recommendationId, status, note) => {
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
        deadline: recommendation?.deadline ?? dispatch?.deadline,
        note: note?.trim() || undefined,
      };
      setSessionDecisions((current) => [...current.filter((item) => item.id !== decision.id), decision]);
    },
    prepareSupplierDraft: () => {
      if (!scenario.supplierWorkflow) return;
      setSupplierStates((current) => ({ ...current, [scenario.supplierWorkflow!.id]: "drafted" }));
    },
    confirmSupplierDraft: () => {
      const workflow = scenario.supplierWorkflow;
      if (!workflow || supplierStatus !== "drafted") return;
      setSupplierStates((current) => ({ ...current, [workflow.id]: "confirmed_demo" }));
      const decision: DemoDecision = {
        id: `${scenario.id}-${workflow.id}`,
        scenarioId: scenario.id,
        recommendationId: workflow.id,
        recommendationType: "supplier_order",
        title: `Brouillon ${workflow.supplierName} confirmé dans la démo`,
        site: scenario.siteName,
        status: "accepted",
        decidedAt: "2026-07-17T09:08:00+02:00",
        estimatedGain: 0,
      };
      setSessionDecisions((current) => [...current.filter((item) => item.id !== decision.id), decision]);
    },
    addCustomDecision: (title, owner, deadline) => {
      const cleanTitle = title.trim();
      const cleanOwner = owner.trim();
      if (!cleanTitle || !cleanOwner || !deadline) return;
      setSessionDecisions((current) => {
        const customCount = current.filter((item) => item.recommendationType === "custom").length;
        const decision: DemoDecision = {
          id: `${scenario.id}-custom-${customCount + 1}`,
          scenarioId: scenario.id,
          recommendationId: `custom-${customCount + 1}`,
          recommendationType: "custom",
          title: cleanTitle,
          site: activeSite.name,
          status: "accepted",
          decidedAt: "2026-07-17T09:12:00+02:00",
          estimatedGain: 0,
          owner: cleanOwner,
          deadline,
        };
        return [...current, decision];
      });
    },
    resetDemo: () => {
      setScenarioId(defaultScenarioId);
      setActiveSiteId(getDemoScenario(defaultScenarioId).siteId);
      setSessionDecisions([]);
      setSupplierStates({});
    },
  }), [activeSite, decisions, scenario, storageError, supplierStatus]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo doit être utilisé dans DemoProvider");
  return value;
}
