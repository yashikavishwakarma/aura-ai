import type { UIMessage } from "ai";

const KEY = "yojana-mitra-chat-v1";

export function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: UIMessage[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(messages));
  } catch {
    // ignore quota errors
  }
}

export function clearMessages() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

const APPS_KEY = "yojana-mitra-applications-v1";
export type Application = {
  id: string;
  scheme: string;
  amount?: string;
  status: "applied" | "under_review" | "approved" | "credited";
  appliedAt: string;
  notes?: string;
};

export function loadApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(APPS_KEY);
    if (!raw) return defaultApps();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Application[]) : defaultApps();
  } catch {
    return defaultApps();
  }
}

export function saveApplications(apps: Application[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

function defaultApps(): Application[] {
  return [
    {
      id: "PMAY-2025-00831",
      scheme: "PM Awas Yojana (Gramin)",
      amount: "₹1,20,000",
      status: "under_review",
      appliedAt: "2025-04-12",
      notes: "Documents verified at Tehsil. Awaiting district approval.",
    },
    {
      id: "PMKISAN-2024-77210",
      scheme: "PM-Kisan Samman Nidhi",
      amount: "₹6,000 / year",
      status: "credited",
      appliedAt: "2024-09-02",
      notes: "Last instalment of ₹2,000 credited on 28 Feb 2026.",
    },
  ];
}
