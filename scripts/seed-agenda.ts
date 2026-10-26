import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { weeklyAgenda } from "../src/lib/db/schema";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  await db.insert(weeklyAgenda).values([
    {
      dayOfWeek: 1,
      dayLabel: "Segunda-feira",
      title: "Semana Maflô",
      description: "Abertura da semana com a seleção de grãos em destaque.",
      timeLabel: "08h — 20h",
      sortOrder: 1,
    },
    {
      dayOfWeek: 2,
      dayLabel: "Terça-feira",
      title: "Tarde de V60",
      description: "Degustação guiada de métodos filtrados com nossos baristas.",
      timeLabel: "15h — 18h",
      sortOrder: 2,
    },
    {
      dayOfWeek: 3,
      dayLabel: "Quarta-feira",
      title: "Noite de Jazz",
      description: "Música ao vivo acompanhando o cardápio noturno.",
      timeLabel: "19h — 22h",
      sortOrder: 3,
    },
    {
      dayOfWeek: 4,
      dayLabel: "Quinta-feira",
      title: "Confeitaria Autoral",
      description: "Lançamento semanal de uma nova sobremesa da casa.",
      timeLabel: "08h — 20h",
      sortOrder: 4,
    },
    {
      dayOfWeek: 5,
      dayLabel: "Sexta-feira",
      title: "Happy Hour Maflô",
      description: "Drinks autorais e petiscos com preço especial.",
      timeLabel: "17h — 20h",
      sortOrder: 5,
    },
    {
      dayOfWeek: 6,
      dayLabel: "Sábado",
      title: "Brunch de Fim de Semana",
      description: "Cardápio especial de brunch para começar bem o sábado.",
      timeLabel: "09h — 13h",
      sortOrder: 6,
    },
    {
      dayOfWeek: 0,
      dayLabel: "Domingo",
      title: "Domingo em Família",
      description: "Espaço tranquilo para reunir a família com nossa carta clássica.",
      timeLabel: "10h — 17h",
      sortOrder: 7,
    },
  ]);

  console.log("Agenda semanal inserida com sucesso.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
