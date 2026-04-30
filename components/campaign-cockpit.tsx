"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

import { campaignMarkup, campaignRuntime } from "@/components/campaign-source";

declare global {
  interface Window {
    __campaignCockpitBootstrapped?: boolean;
    Chart?: unknown;
    lucide?: { createIcons: () => void };
  }
}

function waitForRuntime() {
  return new Promise<void>((resolve) => {
    const startedAt = Date.now();

    const tick = () => {
      if (window.Chart && window.lucide) {
        resolve();
        return;
      }

      if (Date.now() - startedAt > 8000) {
        resolve();
        return;
      }

      window.setTimeout(tick, 50);
    };

    tick();
  });
}

export function CampaignCockpit() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      await waitForRuntime();
      if (cancelled || window.__campaignCockpitBootstrapped) return;

      const runtimeScript = document.createElement("script");
      runtimeScript.dataset.campaignRuntime = "true";
      runtimeScript.text = campaignRuntime;
      document.body.appendChild(runtimeScript);
      window.__campaignCockpitBootstrapped = true;
    };

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"
        strategy="afterInteractive"
      />
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: campaignMarkup }}
      />
    </>
  );
}
