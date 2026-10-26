import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";

const ALLOWED_ADMIN_EMAILS = (process.env.ADMIN_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Defense in depth: the proxy already gates every /admin request, but Server
 * Functions are reachable directly by their own route and would silently lose
 * that coverage if the proxy matcher ever changes. Every admin-only mutation
 * must call this itself rather than trust the proxy alone.
 */
export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autenticado.");
  }

  if (ALLOWED_ADMIN_EMAILS.length === 0) {
    throw new Error("Acesso administrativo não configurado.");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses
    .find((e) => e.id === user.primaryEmailAddressId)
    ?.emailAddress?.toLowerCase();

  if (!email || !ALLOWED_ADMIN_EMAILS.includes(email)) {
    throw new Error("Não autorizado.");
  }
}
