"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

import { candidateDetails, campaignSections, pageTitles } from "@/components/campaign-data";
import { renderSectionCharts } from "@/components/campaign-charts";
import { navigationGroups, refreshableSections } from "@/components/campaign-config";
import { CandidateDetail } from "@/components/candidate-detail";
import { CampaignDownloads } from "@/components/campaign-downloads";
import { LoginScreen } from "@/components/login-screen";

declare global {
  interface Window {
    lucide?: { createIcons: () => void };
  }
}

type SectionId = keyof typeof pageTitles;
type CandidateKey = keyof typeof candidateDetails;

const DEFAULT_SECTION: SectionId = "dashboard";
const DEFAULT_CANDIDATE: CandidateKey = "renato_araujo";

function formatLastUpdate() {
  const now = new Date();
  return `${now.toLocaleDateString("pt-BR")} · ${now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function updateCountdownElement() {
  const element = document.getElementById("countdown_dias");
  if (!element) return;

  const electionDay = new Date("2026-10-04T00:00:00");
  const now = new Date();
  const diff = Math.ceil((electionDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  element.textContent = String(Math.max(0, diff));
}

function syncCalculatorOutputs() {
  const eleitores = Number((document.getElementById("inp_eleitores") as HTMLInputElement | null)?.value || 12420000);
  const comp = Number((document.getElementById("inp_comp") as HTMLInputElement | null)?.value || 74) / 100;
  const invalidos = Number((document.getElementById("inp_invalidos") as HTMLInputElement | null)?.value || 10) / 100;
  const vagas = Number((document.getElementById("inp_vagas") as HTMLInputElement | null)?.value || 46);
  const margem = Number((document.getElementById("inp_margem") as HTMLInputElement | null)?.value || 15) / 100;
  const totalVotos = eleitores * comp;
  const validos = totalVotos * (1 - invalidos);
  const coef = Math.round(validos / vagas);
  const meta = Math.round(coef * (1 + margem));

  const resCoef = document.getElementById("res_coef");
  const resMeta = document.getElementById("res_meta");
  if (resCoef) resCoef.textContent = coef.toLocaleString("pt-BR");
  if (resMeta) resMeta.textContent = meta.toLocaleString("pt-BR");

  const renato = Number((document.getElementById("inp_renato") as HTMLInputElement | null)?.value || 45000);
  const plTotal = Number((document.getElementById("inp_pl_total") as HTMLInputElement | null)?.value || 1840000);
  const plCands = Number((document.getElementById("inp_pl_cands") as HTMLInputElement | null)?.value || 28);
  const vagasPl = Math.floor(plTotal / coef);
  const pct = ((renato / plTotal) * 100).toFixed(1);
  const pos = Math.ceil((plTotal / plCands) / renato * (plCands * 0.3));

  const resVagasPl = document.getElementById("res_vagas_pl");
  const resPctRenato = document.getElementById("res_pct_renato");
  const resPosPl = document.getElementById("res_pos_pl");
  const resRankPl = document.getElementById("res_rank_pl");

  if (resVagasPl) resVagasPl.textContent = String(vagasPl);
  if (resPctRenato) resPctRenato.textContent = `${pct}%`;
  if (resPosPl) resPosPl.textContent = renato.toLocaleString("pt-BR");
  if (resRankPl) {
    resRankPl.textContent = pos <= 3 ? "3° mais votados" : pos <= 5 ? "5 primeiros" : "top 10";
  }
}

export function CampaignCockpit() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>(DEFAULT_SECTION);
  const [selectedCandidateKey, setSelectedCandidateKey] = useState<CandidateKey>(DEFAULT_CANDIDATE);
  const [lastUpdate, setLastUpdate] = useState("—");
  const [refreshTick, setRefreshTick] = useState(0);
  const sectionHostRef = useRef<HTMLDivElement>(null);

  const titlePair = pageTitles[activeSection] ?? pageTitles.dashboard;
  const activeMarkup = useMemo(() => {
    if (activeSection === "candidato-detalhe" || activeSection === "downloads") return null;
    const sectionMarkup = campaignSections[activeSection as keyof typeof campaignSections] ?? "";
    return sectionMarkup.replace('class="section"', 'class="section active"');
  }, [activeSection]);

  useEffect(() => {
    window.setTimeout(() => {
      setLastUpdate(formatLastUpdate());
    }, 0);

    const interval = window.setInterval(() => {
      setLastUpdate(formatLastUpdate());
      updateCountdownElement();
    }, 60000);

    updateCountdownElement();

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const app = document.getElementById("app");
    if (app) app.classList.add("logado");

    window.setTimeout(() => {
      window.lucide?.createIcons();
      updateCountdownElement();
      if (refreshableSections.has(activeSection)) {
        renderSectionCharts(activeSection);
      }
      if (activeSection === "calculadora") {
        syncCalculatorOutputs();
      }
    }, 50);

    return () => {
      if (app) app.classList.remove("logado");
    };
  }, [isLoggedIn, activeSection, refreshTick]);

  useEffect(() => {
    const host = sectionHostRef.current;
    if (!host) return;

    if (activeSection === "calculadora") {
      const inputs = host.querySelectorAll<HTMLInputElement>(".calc-input");
      const onInput = () => syncCalculatorOutputs();
      inputs.forEach((input) => input.addEventListener("input", onInput));
      syncCalculatorOutputs();

      return () => {
        inputs.forEach((input) => input.removeEventListener("input", onInput));
      };
    }

    if (activeSection === "candidatos") {
      host.querySelectorAll<HTMLElement>(".cand-card").forEach((card) => {
        card.classList.toggle("active-detail", card.dataset.candidateKey === selectedCandidateKey);
      });
    }
  }, [activeSection, selectedCandidateKey, refreshTick]);

  useEffect(() => {
    const host = sectionHostRef.current;
    if (!host) return;

    const openCandidate = (candidateKey?: string) => {
      if (!candidateKey || !(candidateKey in candidateDetails)) return;
      setSelectedCandidateKey(candidateKey as CandidateKey);
      setActiveSection("candidato-detalhe");
    };

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const candidateTrigger = target?.closest<HTMLElement>("[data-candidate-key]");
      if (candidateTrigger) {
        openCandidate(candidateTrigger.dataset.candidateKey);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement | null;
      const candidateTrigger = target?.closest<HTMLElement>("[data-candidate-key]");
      if (candidateTrigger) {
        event.preventDefault();
        openCandidate(candidateTrigger.dataset.candidateKey);
      }
    };

    host.addEventListener("click", onClick);
    host.addEventListener("keydown", onKeyDown);

    return () => {
      host.removeEventListener("click", onClick);
      host.removeEventListener("keydown", onKeyDown);
    };
  }, [activeSection]);

  return (
    <>
      <Script
        src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"
        strategy="afterInteractive"
      />

      {!isLoggedIn ? <LoginScreen onLogin={() => setIsLoggedIn(true)} /> : null}

      <div id="app" className={isLoggedIn ? "logado" : undefined}>
        <div id="sidebar">
          <div className="logo-area">
            <div className="logo-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logo-img" src="renatobrancofundoecuro.png" alt="Renato Araujo do Bolsonaro" />
            </div>
            <div className="logo-photo-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logo-photo" src="candidatos/c8.png" alt="Foto principal de Renato Araujo" />
            </div>
            <div className="versao">Cockpit v3.0 · 2026</div>
          </div>

          {navigationGroups.map((group) => (
            <div className="nav-section" key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item${activeSection === item.id ? " active" : ""}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="nav-icon"><i data-lucide={item.icon} /></span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}

          <div className="sidebar-footer">
            <div className="sf-label">Última atualização</div>
            <div className="sf-val" id="lastUpdate" suppressHydrationWarning>{lastUpdate}</div>
          </div>
        </div>

        <div id="main">
          <div id="topbar">
            <div className="topbar-left">
              <div>
                <div className="page-title" id="pageTitle">{titlePair[0]}</div>
                <div className="page-sub" id="pageSub">{titlePair[1]}</div>
              </div>
            </div>
            <div className="topbar-right">
              <div className="badge-live"><div className="dot-live" /> AO VIVO</div>
              <button
                className="btn-top icon-btn"
                type="button"
                onClick={() => setRefreshTick((value) => value + 1)}
              >
                <span className="top-icon"><i data-lucide="refresh-cw" /></span>
                <span>Atualizar</span>
              </button>
              <button className="btn-top icon-btn" type="button">
                <span className="top-icon"><i data-lucide="settings-2" /></span>
                <span>Config</span>
              </button>
              <div className="avatar">G</div>
            </div>
          </div>

          <div id="content" ref={sectionHostRef}>
            {activeSection === "candidato-detalhe" ? (
              <CandidateDetail candidateKey={selectedCandidateKey} />
            ) : activeSection === "downloads" ? (
              <CampaignDownloads />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: activeMarkup ?? "" }} suppressHydrationWarning />
            )}
            <div className="mockup-warning">
              <strong>MOCKUP DE MODELO A SER CONSTRUÍDO COM DADOS NÃO REAIS</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
