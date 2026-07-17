export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:8000");

export type Driver = { code: string; impact_covers: number; explanation: string };
export type Forecast = {
  service_id: string;
  generated_at: string;
  data_cutoff: string;
  model_version: string;
  method: "historical_baseline" | "reservation_enriched" | "abstain";
  expected_covers: number | null;
  lower_covers: number | null;
  upper_covers: number | null;
  expected_revenue_cents: number | null;
  baseline_covers: number | null;
  drivers: Driver[];
  confidence: { score: number; level: string; reasons: string[] };
  abstention_reasons: string[];
};
export type Recommendation = {
  id: string;
  service_id: string;
  type: string;
  title: string;
  action: Record<string, unknown>;
  deadline: string;
  estimated_gain_cents: number;
  estimated_risk_cents: number;
  confidence: number;
  formula: string;
  assumptions: string[];
};
export type Briefing = {
  service_id: string;
  generated_at: string;
  forecast: Forecast;
  recommendations: Recommendation[];
  data_quality_messages: string[];
};
export type Dispatch = {
  service_date: string;
  sites: Array<{ site_id: string; expected_covers: number; planned_servers: number; required_servers: number; server_gap: number }>;
  proposals: Array<{ id: string; source_site_id: string; target_site_id: string; quantity: number; starts_at: string; ends_at: string; travel_minutes: number; estimated_gain_cents: number; confidence: number }>;
};
export type Decision = {
  id: string;
  recommendation_id: string;
  recommendation_type: string;
  site_id: string;
  status: "accepted" | "modified" | "refused";
  decided_at: string;
  estimated_gain_cents: number;
  simulated_only: true;
};
export type Roi = {
  decisions_count: number;
  accepted_count: number;
  modified_count: number;
  refused_count: number;
  estimated_gain_cents: number;
  observed_gain_cents: null;
  decisions: Decision[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.detail?.message ?? body?.detail ?? `Erreur API ${response.status}`;
    throw new Error(typeof message === "string" ? message : "Erreur API fictive");
  }
  return response.json() as Promise<T>;
}

export async function activateScenario(id: string) {
  return request(`/demo/scenarios/${id}/activate`, { method: "POST" });
}

export async function getBriefing(scenario = "concert_dry_friday", site = "republique") {
  await activateScenario(scenario);
  return request<Briefing>(`/briefings/${site}_2026-07-17_dinner?as_of=2026-07-17T08:00:00%2B02:00`);
}

export async function getForecasts() {
  await activateScenario("concert_dry_friday");
  return request<Forecast[]>("/forecasts?site_id=republique&from=2026-07-17&to=2026-07-23&as_of=2026-07-17T08:00:00%2B02:00");
}

export async function getDispatch() {
  await activateScenario("multisite_staff_imbalance");
  return request<Dispatch>("/dispatch?service_date=2026-07-17&as_of=2026-07-17T08:00:00%2B02:00");
}

export async function decide(path: string, status: Decision["status"], selectedAction?: Record<string, unknown>) {
  return request<Decision>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, selected_action: selectedAction, reason: "choix_demo", decided_at: "2026-07-17T09:00:00+02:00" }),
  });
}

export const getRoi = () => request<Roi>("/roi");
export const getBacktest = () => request<{ selected_method: string; enriched: { covers_wape: number }; temporal_leakage_violations: number }>("/backtests/current");
