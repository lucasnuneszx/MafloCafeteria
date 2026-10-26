"use client";

import { useState, type FormEvent } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { UserRound, KeyRound, LogOut, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/app/admin/ui-provider";

const easeOut = [0.22, 1, 0.36, 1] as const;

function extractClerkMessage(err: unknown, fallback: string) {
  const anyErr = err as { errors?: { message?: string }[] };
  return anyErr?.errors?.[0]?.message ?? fallback;
}

export default function PerfilContent() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const showToast = useToast();

  const [savingPassword, setSavingPassword] = useState(false);

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    setSavingPassword(true);
    try {
      await user.updatePassword({
        currentPassword: String(formData.get("currentPassword") ?? ""),
        newPassword,
      });
      showToast("Senha alterada com sucesso.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      showToast(extractClerkMessage(err, "Não foi possível alterar a senha."), "error");
    } finally {
      setSavingPassword(false);
    }
  }

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center gap-2 text-[rgba(53,43,40,0.5)] font-sans text-sm">
        <Loader2 size={16} className="animate-spin" />
        Carregando…
      </div>
    );
  }

  const primaryEmail = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-6">
      {/* Account info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="rounded-2xl border border-[#E8E2DD] bg-white p-6 sm:p-8 shadow-maflo"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#C58B66]/10 text-[#C58B66]">
            <UserRound size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-heading text-xl text-[#352B28]">{fullName || "Dados da conta"}</h2>
            <p className="font-sans text-sm text-[rgba(53,43,40,0.55)]">{primaryEmail}</p>
          </div>
        </div>
      </motion.div>

      {/* Password */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
        className="rounded-2xl border border-[#E8E2DD] bg-white p-6 sm:p-8 shadow-maflo"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#C58B66]/10 text-[#C58B66]">
            <KeyRound size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-heading text-xl text-[#352B28]">Alterar senha</h2>
            <p className="font-sans text-sm text-[rgba(53,43,40,0.55)]">
              Use uma senha forte e exclusiva para esse painel.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="currentPassword">Senha atual</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required className="mt-1" autoComplete="current-password" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input id="newPassword" name="newPassword" type="password" required minLength={8} className="mt-1" autoComplete="new-password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className="mt-1" autoComplete="new-password" />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={savingPassword}
            className="btn-primary self-start mt-1"
          >
            {savingPassword ? "Alterando…" : "Alterar senha"}
          </motion.button>
        </form>
      </motion.div>

      {/* Sign out */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
        className="rounded-2xl border border-[#E8E2DD] bg-white p-6 sm:p-8 shadow-maflo flex items-center justify-between gap-4"
      >
        <div>
          <h2 className="font-heading text-lg text-[#352B28]">Sair da conta</h2>
          <p className="font-sans text-sm text-[rgba(53,43,40,0.55)]">Encerra sua sessão neste dispositivo.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => signOut({ redirectUrl: "/" })}
          className="inline-flex items-center gap-2 font-sans text-sm font-medium px-4 py-2.5 rounded-md border border-[#E8E2DD] text-[#352B28] hover:border-red-300 hover:text-red-600 transition-colors duration-300"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Sair
        </motion.button>
      </motion.div>
    </div>
  );
}
