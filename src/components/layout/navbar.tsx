"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/icons/logo";
import { navLinks } from "@/lib/constants";
import { getLenis } from "@/lib/lenis";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>(href);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: -64 });
      } else {
        el.scrollIntoView({ behavior: "auto" });
      }
    }, 100);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF8F6]/85 backdrop-blur-md shadow-[0_1px_20px_rgba(53,43,40,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-maflo">
        <nav
          className="flex items-center justify-between h-16 md:h-20"
          aria-label="Navegação principal"
        >
          {/* Logo */}
          <Link href="#inicio" onClick={() => handleNavClick("#inicio")} aria-label="Maflô — Início">
            <Logo variant="dark" className="transition-opacity duration-300" />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-8" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="font-sans text-sm tracking-wide transition-colors duration-300 hover:text-[#C58B66] bg-transparent border-none cursor-pointer text-[#352B28]/80"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => handleNavClick("#eventos")}
              className={`font-sans text-sm font-medium tracking-widest uppercase px-5 py-2.5 rounded-md border transition-all duration-300 bg-transparent cursor-pointer ${
                scrolled
                  ? "border-[#C58B66] text-[#C58B66] hover:bg-[#C58B66] hover:text-white"
                  : "border-[#C58B66]/60 text-[#C58B66] hover:bg-[#C58B66] hover:text-white"
              }`}
            >
              Reservar
            </button>
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="lg:hidden p-2 rounded-md transition-colors duration-300"
              aria-label="Abrir menu de navegação"
            >
              <Menu
                size={24}
                className="text-[#352B28]"
              />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:w-[380px] bg-[#FAF8F6] border-l border-[#E8E2DD] p-0"
              aria-label="Menu de navegação mobile"
            >
              <div className="flex flex-col h-full">
                {/* Sheet header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-[#E8E2DD]">
                  <Logo variant="dark" />
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-md text-[rgba(53,43,40,0.5)] hover:text-[#352B28] transition-colors duration-300"
                    aria-label="Fechar menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile nav links */}
                <nav className="flex flex-col gap-1 px-8 py-8 flex-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                    >
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="font-heading text-3xl font-400 text-[#352B28] hover:text-[#C58B66] transition-colors duration-200 w-full text-left py-3 bg-transparent border-none cursor-pointer"
                      >
                        {link.label}
                      </button>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="px-8 pb-10">
                  <button
                    onClick={() => handleNavClick("#eventos")}
                    className="btn-primary w-full justify-center border-none cursor-pointer"
                  >
                    Reservar uma mesa
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </motion.header>
  );
}
