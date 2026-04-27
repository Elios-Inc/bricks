"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  AlertTriangleIcon,
  CircleDotIcon,
  Loader2Icon,
} from "lucide-react";

type Status = {
  configured: boolean;
  tokenExpired: boolean;
  expiresAt: string | null;
  organisationId: string | null;
  lastUpdated: string | null;
};

type Props = {
  initialStatus: Status;
};

export function ShortimizeCredentialsForm({ initialStatus }: Props) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [cookieValue, setCookieValue] = useState("");
  const [organisationId, setOrganisationId] = useState(
    status.organisationId ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/integrations/shortimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookieValue, organisationId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to save credentials");
        return;
      }

      setStatus(data);
      setCookieValue("");
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/5 bg-surface-raised p-5">
        <div className="flex items-start gap-3">
          <StatusIndicator status={status} />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-white">Connection Status</h3>
            {status.configured ? (
              <div className="mt-1 space-y-1 text-xs text-white/50">
                {status.tokenExpired ? (
                  <p className="text-amber-400">
                    Token expired. Paste a fresh cookie below to reconnect.
                  </p>
                ) : (
                  <p>
                    Token valid until{" "}
                    <span className="tabular-nums text-white/70">
                      {new Date(status.expiresAt!).toLocaleString()}
                    </span>
                  </p>
                )}
                {status.lastUpdated && (
                  <p>
                    Last updated{" "}
                    <span className="tabular-nums text-white/70">
                      {new Date(status.lastUpdated).toLocaleString()}
                    </span>
                  </p>
                )}
                {status.organisationId && (
                  <p>
                    Org{" "}
                    <span className="font-mono text-white/70">
                      {status.organisationId}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-1 text-xs text-white/50">
                No credentials configured. Paste your Shortimize session cookie
                below.
              </p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="cookie-value"
            className="mb-1.5 block text-xs font-medium text-white/70"
          >
            Session Cookie
          </label>
          <textarea
            id="cookie-value"
            value={cookieValue}
            onChange={(e) => setCookieValue(e.target.value)}
            placeholder="Paste the sb-bctwkcnnyyiaemwmuauc-auth-token cookie value here (starts with base64-...)"
            rows={4}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white placeholder:text-white/25 focus:border-glow/50 focus:outline-none focus:ring-1 focus:ring-glow/50"
            required
          />
          <p className="mt-1 text-[0.6875rem] text-white/35">
            DevTools → Application → Cookies → copy the{" "}
            <code className="text-white/50">sb-*-auth-token</code> value
          </p>
        </div>

        <div>
          <label
            htmlFor="org-id"
            className="mb-1.5 block text-xs font-medium text-white/70"
          >
            Organisation ID
          </label>
          <input
            id="org-id"
            type="text"
            value={organisationId}
            onChange={(e) => setOrganisationId(e.target.value)}
            placeholder="87f46e79-18d6-47cd-bba5-0dc937c43413"
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white placeholder:text-white/25 focus:border-glow/50 focus:outline-none focus:ring-1 focus:ring-glow/50"
            required
          />
          <p className="mt-1 text-[0.6875rem] text-white/35">
            DevTools → Network → look for{" "}
            <code className="text-white/50">organisationId</code> in any API
            request body
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
            Credentials saved. The daily sync will keep the token chain alive.
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !cookieValue || !organisationId}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-medium text-surface-base transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving && <Loader2Icon className="size-3.5 animate-spin" />}
          {status.configured ? "Update Credentials" : "Save Credentials"}
        </button>
      </form>
    </div>
  );
}

function StatusIndicator({ status }: { status: Status }) {
  if (!status.configured) {
    return (
      <CircleDotIcon className="mt-0.5 size-4 shrink-0 text-white/30" />
    );
  }
  if (status.tokenExpired) {
    return (
      <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-400" />
    );
  }
  return (
    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-400" />
  );
}
