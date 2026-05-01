"use client";

import { useEffect, useRef, useState } from "react";

type LoginScreenProps = {
  onLogin: () => void;
};

const DEFAULT_LOGIN = "guest";
const DEFAULT_PASSWORD = "p0l1t1c4@#";

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showError, setShowError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isUnlocking) return;

    const timer = window.setTimeout(() => {
      onLogin();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [isUnlocking, onLogin]);

  const submit = () => {
    const isValid =
      loginRef.current?.value.trim() === DEFAULT_LOGIN &&
      passwordRef.current?.value.trim() === DEFAULT_PASSWORD;

    if (!isValid) {
      setShowError(true);
      if (passwordRef.current) {
        passwordRef.current.value = "";
      }
      return;
    }

    setShowError(false);
    setIsUnlocking(true);
  };

  useEffect(() => {
    const button = buttonRef.current;
    const loginInput = loginRef.current;
    const passwordInput = passwordRef.current;

    if (!button || !loginInput || !passwordInput) return;

    const handleSubmit = () => submit();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };

    button.addEventListener("click", handleSubmit);
    loginInput.addEventListener("keydown", handleKeyDown);
    passwordInput.addEventListener("keydown", handleKeyDown);

    return () => {
      button.removeEventListener("click", handleSubmit);
      loginInput.removeEventListener("keydown", handleKeyDown);
      passwordInput.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div id="login-screen" className={isUnlocking ? "fade-out" : undefined}>
      <div className="login-bg-deco" />
      <div className="login-card">
        <div className="login-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="login-logo-img"
            src="/renatobrancofundoecuro.png"
            alt="Renato Araujo"
          />
          <div className="login-title">Cockpit de Campanha</div>
          <div className="login-subtitle">
            Deputado Federal · Rio de Janeiro · 2026
          </div>
        </div>

        <div className="login-divider" />

        <div className="login-field-wrap">
          <label className="login-field-label" htmlFor="inp_login">
            Usuario
          </label>
          <input
            ref={loginRef}
            className={`login-field${showError ? " shake" : ""}`}
            id="inp_login"
            type="text"
            placeholder="nome de usuario"
            autoComplete="username"
          />
        </div>

        <div className="login-field-wrap">
          <label className="login-field-label" htmlFor="inp_senha">
            Senha
          </label>
          <input
            ref={passwordRef}
            className={`login-field${showError ? " shake" : ""}`}
            id="inp_senha"
            type="password"
            placeholder="••••••••••"
            autoComplete="current-password"
          />
        </div>

        <button ref={buttonRef} className="login-btn" id="login-btn" disabled={isUnlocking}>
          {isUnlocking ? "Autenticando..." : "Entrar no Cockpit"}
        </button>

        <div className={`login-error${showError ? " visible" : ""}`} id="login-error">
          Usuario ou senha incorretos. Tente novamente.
        </div>

        <div className="login-footer">
          <span className="login-dot-live" />
          Sistema seguro · Acesso restrito a equipe de campanha
        </div>
      </div>
    </div>
  );
}
