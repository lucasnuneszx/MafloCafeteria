"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

const CONSENT_KEY = "maflo-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Delay to not interfere with page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="false"
          aria-label="Consentimento de cookies"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[100] bg-white border border-[#E8E2DD] rounded-xl p-5 shadow-[0_12px_40px_rgba(53,43,40,0.12)]"
        >
          <div className="flex items-start gap-3 mb-4">
            <Cookie size={18} className="text-[#C58B66] mt-0.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <p className="font-sans text-sm font-medium text-[#352B28] mb-1">
                Utilizamos cookies
              </p>
              <p className="font-sans text-xs text-muted leading-relaxed">
                Usamos cookies para melhorar sua experiência e analisar o tráfego do site, conforme nossa{" "}
                <Link href="/privacidade" className="text-[#C58B66] underline underline-offset-2">
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>
            <button
              onClick={decline}
              className="shrink-0 text-muted hover:text-[#352B28] transition-colors duration-300"
              aria-label="Fechar aviso de cookies"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={decline}
              className="flex-1 font-sans text-xs px-3 py-2 rounded-md border border-[#E8E2DD] text-muted hover:text-[#352B28] hover:border-[#352B28] transition-colors duration-300"
            >
              Recusar
            </button>
            <button
              onClick={accept}
              className="flex-1 font-sans text-xs px-3 py-2 rounded-md bg-[#C58B66] text-white hover:bg-[#A86F4B] transition-colors duration-300"
            >
              Aceitar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
