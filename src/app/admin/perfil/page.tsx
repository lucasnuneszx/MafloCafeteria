import PerfilContent from "./perfil-content";

export default function AdminPerfilPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-3xl text-[#352B28]">Meu perfil</h1>
        <p className="font-sans text-sm text-[rgba(53,43,40,0.65)] mt-1">
          Dados da conta, senha e segurança do login.
        </p>
      </div>

      <div className="max-w-2xl">
        <PerfilContent />
      </div>
    </div>
  );
}
