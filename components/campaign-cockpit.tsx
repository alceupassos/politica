"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { campaignAppMarkup, campaignRuntime } from "@/components/campaign-source";
import { LoginScreen } from "@/components/login-screen";

declare global {
  interface Window {
    __campaignCockpitBootstrapped?: boolean;
    __campaignCockpitApi?: {
      buildCharts: (id: string) => void;
      calcCoef: () => void;
      calcQP: () => void;
      updateCountdown: () => void;
      reloadCharts: () => void;
    };
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  useEffect(() => {
    const app = document.getElementById("app");
    if (!app) return;

    app.classList.toggle("logado", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const startLegacyDashboard = () => {
      window.lucide?.createIcons();
      window.__campaignCockpitApi?.buildCharts("dashboard");
      window.__campaignCockpitApi?.calcCoef();
      window.__campaignCockpitApi?.calcQP();
      window.__campaignCockpitApi?.updateCountdown();
    };

    const timer = window.setTimeout(startLegacyDashboard, 220);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn]);

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
      {!isLoggedIn ? <LoginScreen onLogin={() => setIsLoggedIn(true)} /> : null}
      <div
        dangerouslySetInnerHTML={{ __html: campaignAppMarkup }}
        suppressHydrationWarning
      />
    </>
  );
}
