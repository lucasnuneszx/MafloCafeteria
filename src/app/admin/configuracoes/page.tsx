import { getSiteSettings } from "@/lib/site-settings";
import SettingsForm from "./settings-form";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-3xl text-[#352B28]">Configurações</h1>
        <p className="font-sans text-sm text-[rgba(53,43,40,0.65)] mt-1">
          Conteúdo editável do site — muda aqui, aparece no ar em até 5 minutos, sem precisar me chamar.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
