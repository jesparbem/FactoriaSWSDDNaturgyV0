"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Web Speech API tipos (Chrome/Edge)
type SpeechRecognitionEvent = Event & {
  resultIndex: number;
  results: {
    [index: number]: { [index: number]: { transcript: string }; isFinal: boolean; length: number };
    length: number;
  };
};
type SpeechRecognitionErrorEvent = Event & { error: string };
type SpeechRecognition = EventTarget & {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: { new (): SpeechRecognition };
    SpeechRecognition?: { new (): SpeechRecognition };
  }
}

export interface VoiceInputProps {
  /** Texto actual del input/textarea controlado por el padre */
  value: string;
  /** Callback con el texto resultante (acumulando lo dictado) */
  onChange: (text: string) => void;
  /** Tamaño del botón */
  size?: "sm" | "md";
  /** Idioma del reconocimiento (por defecto es-ES) */
  lang?: string;
  className?: string;
  title?: string;
}

/**
 * Botón de dictado por voz que usa la Web Speech API nativa del navegador.
 * Funciona en Chrome / Edge / Safari (en macOS y iOS). Firefox no soporta aún.
 * Si no hay soporte, el botón se renderiza pero abre un tooltip al hacer click.
 */
export function VoiceInput({
  value,
  onChange,
  size = "md",
  lang = "es-ES",
  className,
  title = "Dictar por voz",
}: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognition | null>(null);
  const baseRef = useRef<string>(value);

  useEffect(() => {
    const Ctor = (typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)) as
      | { new (): SpeechRecognition }
      | undefined;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (ev) => {
      let interim = "";
      let finalText = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        const t = r[0]?.transcript ?? "";
        if (r.isFinal) finalText += t;
        else interim += t;
      }
      const newBase = baseRef.current + (finalText ? finalText : "");
      if (finalText) baseRef.current = newBase;
      onChange((newBase + interim).trimStart());
    };
    rec.onerror = (ev) => {
      setErrorMsg(ev.error === "not-allowed" ? "Permiso de micrófono denegado" : ev.error);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const toggle = useCallback(() => {
    if (!supported) {
      setErrorMsg("Tu navegador no soporta dictado nativo (usa Chrome o Edge)");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }
    const rec = recRef.current;
    if (!rec) return;
    if (listening) {
      try {
        rec.stop();
      } catch {}
      setListening(false);
    } else {
      baseRef.current = value ? value + (value.endsWith(" ") ? "" : " ") : "";
      try {
        rec.start();
        setListening(true);
        setErrorMsg(null);
      } catch (e) {
        setErrorMsg("No pude iniciar el dictado");
        setListening(false);
      }
    }
  }, [listening, supported, value]);

  const sizeCls = size === "sm" ? "h-7 w-7" : "h-9 w-9";

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={toggle}
        title={listening ? "Detener dictado" : title}
        className={cn(
          "rounded-md border transition-all flex items-center justify-center",
          sizeCls,
          listening
            ? "bg-naturgy-orange-500 border-naturgy-orange-500 text-white animate-pulse"
            : "bg-card border-border hover:border-naturgy-orange-500 text-naturgy-orange-500"
        )}
      >
        {listening ? (
          <MicOff className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
        ) : (
          <Mic className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
        )}
      </button>
      {listening && (
        <span className="absolute -bottom-5 right-0 text-[10px] text-naturgy-orange-500 font-mono whitespace-nowrap animate-fade-in">
          ● escuchando ({lang})
        </span>
      )}
      {errorMsg && (
        <span className="absolute -bottom-6 right-0 text-[10px] text-naturgy-danger whitespace-nowrap animate-fade-in">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
