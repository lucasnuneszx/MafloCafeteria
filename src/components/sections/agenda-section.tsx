import { CalendarDays } from "lucide-react";
import SectionTitle from "@/components/shared/section-title";
import SectionDivider from "@/components/shared/section-divider";
import Reveal from "@/components/shared/reveal";
import { getWeeklyAgenda } from "@/lib/agenda";

export default async function AgendaSection() {
  const agenda = await getWeeklyAgenda();

  if (agenda.length === 0) return null;

  return (
    <section id="agenda" className="section-py bg-[#FAF8F6]">
      <div className="container-maflo">
        <SectionDivider className="mb-20" />

        <div className="flex flex-col items-center gap-14">
          <SectionTitle
            eyebrow="05 — Agenda"
            title="A semana na Maflô."
            subtitle="Nossa programação é atualizada toda semana — volte sempre para conferir as novidades."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
            {agenda.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08} className="h-full">
                <div
                  className={`relative flex h-full flex-col gap-3 rounded-xl border p-6 shadow-maflo transition-colors duration-300 ${
                    item.isToday
                      ? "border-[#C58B66] bg-white"
                      : "border-[#E8E2DD] bg-white"
                  }`}
                >
                  {item.isToday && (
                    <span className="absolute -top-3 left-6 rounded-full bg-[#C58B66] px-3 py-1 font-sans text-xs font-medium tracking-wide text-white">
                      Hoje
                    </span>
                  )}
                  <div className="flex items-center gap-2 text-[#C58B66]">
                    <CalendarDays size={16} strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-sans text-xs font-medium uppercase tracking-widest">
                      {item.dayLabel}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl text-[#352B28]">{item.title}</h3>
                  {item.description && (
                    <p className="font-sans text-sm text-[rgba(53,43,40,0.7)] leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.timeLabel && (
                    <p className="mt-auto font-sans text-sm font-medium text-[#352B28] pt-2 border-t border-[#E8E2DD]">
                      {item.timeLabel}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
