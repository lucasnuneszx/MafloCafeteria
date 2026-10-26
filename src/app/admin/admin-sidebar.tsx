"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Wallet,
  Package,
  Settings,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import Logo from "@/components/icons/logo";

interface Badges {
  reservas?: number;
  financeiro?: number;
  estoque?: number;
}

function UserFooter({ size = "default" }: { size?: "default" | "compact" }) {
  const { user } = useUser();
  const label = user?.firstName || user?.emailAddresses[0]?.emailAddress || "Equipe Maflô";
  const initial = label.charAt(0).toUpperCase();
  const avatarSize = size === "compact" ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm";

  return (
    <Link
      href="/admin/perfil"
      className="flex items-center gap-3 rounded-lg group"
      aria-label="Meu perfil"
    >
      <span
        className={`flex items-center justify-center shrink-0 rounded-full bg-[#C58B66]/20 text-[#C58B66] font-heading ${avatarSize}`}
      >
        {initial}
      </span>
      {size === "default" && (
        <span className="flex flex-col leading-tight">
          <span className="font-sans text-xs text-white/40">Logado como</span>
          <span className="font-sans text-xs text-white/70 group-hover:text-white transition-colors duration-300">
            {label}
          </span>
        </span>
      )}
    </Link>
  );
}

const NAV_ITEMS = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard, exact: true, badgeKey: undefined },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays, exact: false, badgeKey: undefined },
  { href: "/admin/reservas", label: "Reservas", icon: ClipboardList, exact: false, badgeKey: "reservas" as const },
  { href: "/admin/financeiro", label: "Financeiro", icon: Wallet, exact: false, badgeKey: "financeiro" as const },
  { href: "/admin/estoque", label: "Estoque", icon: Package, exact: false, badgeKey: "estoque" as const },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings, exact: false, badgeKey: undefined },
  { href: "/admin/perfil", label: "Meu perfil", icon: UserCircle, exact: false, badgeKey: undefined },
];

function NavLinks({
  pathname,
  badges,
  onNavigate,
}: {
  pathname: string;
  badges: Badges;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        const badgeValue = item.badgeKey ? badges[item.badgeKey] : undefined;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="relative flex items-center gap-3 rounded-lg px-4 py-2.5 font-sans text-sm transition-colors duration-300"
          >
            {isActive && (
              <motion.span
                layoutId="admin-nav-active"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-[#C58B66]/15 border border-[#C58B66]/25"
              />
            )}
            <Icon
              size={17}
              strokeWidth={1.75}
              className={`relative shrink-0 ${isActive ? "text-[#C58B66]" : "text-white/50"}`}
            />
            <span className={`relative flex-1 ${isActive ? "text-white font-medium" : "text-white/60"}`}>
              {item.label}
            </span>
            {Boolean(badgeValue) && (
              <span className="relative flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none">
                {badgeValue}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar({ badges = {} }: { badges?: Badges }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col justify-between bg-[#1a1512] px-4 py-8">
        <div className="flex flex-col gap-10">
          <Link href="/admin" className="px-4">
            <Logo variant="light" height={40} />
          </Link>
          <NavLinks pathname={pathname} badges={badges} />
        </div>

        <div className="px-4 py-3 border-t border-white/10 pt-6">
          <UserFooter />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-[#E8E2DD] bg-[#1a1512] px-5 py-4">
        <Link href="/admin">
          <Logo variant="light" height={32} />
        </Link>
        <div className="flex items-center gap-3">
          <UserFooter size="compact" />
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            className="p-1.5 rounded-md text-white/70 hover:text-white transition-colors duration-300"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col justify-between bg-[#1a1512] px-4 py-8 lg:hidden"
            >
              <div className="flex flex-col gap-10">
                <div className="flex items-center justify-between px-4">
                  <Logo variant="light" height={36} />
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Fechar menu"
                    className="p-1.5 rounded-md text-white/60 hover:text-white transition-colors duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
                <NavLinks pathname={pathname} badges={badges} onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
