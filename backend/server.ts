import { readFileSync } from "fs";
import pl from "tau-prolog";

// program é uma string
const program = readFileSync("./backend/data/animals.pl", "utf8");

function createSession(): Promise<any> {
  // O papel da promisse é informar para o programa se pôde ser consultado sem problemas
  return new Promise((resolve, reject) => {

    // Cria um interpretador Prolog que pode executar no máximo 1000 passos
    const s = pl.create(1000);

    s.consult(program, {
      success: () => resolve(s),
      error: (err: any) => reject("Erro ao consultar Prolog: " + err.toString()),
    });
  });
}

function getAllAnimals(s: any): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const animals: string[] = [];

    // s.query(...) verifica se a estrutura da consulta está correta
    // Caso sim, executa success, caso não, executa error
    s.query("animal(Nome, _, _, _, _, _, _, _, _, _).", {
      success: () => {

        // Buscar fatos e adicioná-los em um array
        const collect = (answer: any) => { // answer é um objeto do Prolog que pode ser acessado apenas dentro do success
          if (answer === false) return resolve(animals);
          if (pl.type.is_error(answer)) return reject("Erro Prolog: " + answer.args[0].toString());
          animals.push(answer.lookup("Nome").id);
          s.answer(collect);
        };

        // Recursividade
        s.answer(collect);
      },
      error: (err: any) => reject("Erro ao criar query getAllAnimals: " + err.toString()),
    });
  });
}

interface AnimalData {
  // Pistas iniciais (sempre mostradas)
  color: string;
  diet: string;
  habitat: string;
  // Dicas extras (liberadas pelo jogador)
  height: string;
  weight: string;
  lifespan: string;
  speed: string;
  predators: string;
  countries: string;
}

function getAnimalData(s: any, name: string): Promise<AnimalData> {
  return new Promise((resolve, reject) => {
    // animal(Nome, Altura, Peso, Cor, ExpVida, Dieta, Habitat, Predadores, Velocidade, Paises)
    s.query(`animal('${name}', Altura, Peso, Cor, ExpVida, Dieta, Habitat, Predadores, Velocidade, Paises).`, {
      success: () => {
        s.answer((ans: any) => {
          if (!ans || ans === false || pl.type.is_error(ans)) {
            return reject("Animal não encontrado: " + name);
          }
          resolve({
            color:     ans.lookup("Cor").id,
            diet:      ans.lookup("Dieta").id,
            habitat:   ans.lookup("Habitat").id,
            height:    ans.lookup("Altura").toString(),
            weight:    ans.lookup("Peso").toString(),
            lifespan:  ans.lookup("ExpVida").toString(),
            speed:     ans.lookup("Velocidade").toString(),
            predators: ans.lookup("Predadores").id,
            countries: ans.lookup("Paises").id,
          });
        });
      },
      error: (err: any) => reject("Erro ao criar query getAnimalData: " + err.toString()),
    });
  });
}

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    if (req.method === "OPTIONS") return new Response(null, { headers });

    const url = new URL(req.url);

    if (url.pathname === "/api/quiz") {
      try {
        const s1 = await createSession();
        const allAnimals = await getAllAnimals(s1);

        if (allAnimals.length === 0)
          return new Response(JSON.stringify({ error: "Base Prolog vazia" }), { status: 500, headers });

        // Escolhe um animal para ser a resposta certa do quiz
        const correct = allAnimals[Math.floor(Math.random() * allAnimals.length)];

        const s2 = await createSession();
        const data = await getAnimalData(s2, correct);

        // Seleciona 3 alternativas que não são a correta
        const distractors = allAnimals
          .filter((a) => a !== correct)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [correct, ...distractors].sort(() => 0.5 - Math.random());

        return new Response(
          JSON.stringify({
            // 3 pistas iniciais
            clues: {
              predators:   data.predators,
              diet:    data.diet,
              habitat: data.habitat,
            },
            // 6 dicas extras (enviadas todas, o frontend controla a revelação)
            hints: [
              { label: "Altura",            value: `${data.height} cm` },
              { label: "Peso",              value: `${data.weight} kg` },
              { label: "Expectativa de vida", value: `${data.lifespan} anos` },
              { label: "Velocidade média",  value: `${data.speed} km/h` },
              { label: "Predadores",        value: data.predators },
              { label: "Países onde vive",  value: data.countries },
            ],
            options,
            correctAnswer: correct,
          }),
          { headers }
        );
      } catch (err) {
        console.error("Erro na rota /api/quiz:", err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers });
      }
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers });
  },
});

console.log(`🚀 Backend rodando em http://localhost:${server.port}`);
