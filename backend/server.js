const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const pl = require("tau-prolog");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const FACTS_PATH = path.join(__dirname, "animal_facts.pl");
const RULES_PATH = path.join(__dirname, "rules.pl");

// Carrega o conteúdo dos arquivos uma vez só na inicialização
const prologProgram =
  fs.readFileSync(FACTS_PATH, "utf8") + "\n" +
  fs.readFileSync(RULES_PATH, "utf8");

console.log("📄 Prolog program loaded:", prologProgram.length, "chars");

// Cria uma sessão nova, consulta o programa e executa uma query
function runQuery(goal) {
  return new Promise((resolve, reject) => {
    const session = pl.create(100000);

    session.consult(prologProgram, {
      success: () => {
        session.query(goal, {
          success: () => {
            const results = [];
            function getNext() {
              session.answer({
                success: (answer) => {
                  results.push(answer);
                  getNext();
                },
                fail:  ()    => resolve(results),
                error: (err) => {
                  console.error("Answer error:", err);
                  resolve(results);
                },
                limit: ()    => resolve(results),
              });
            }
            getNext();
          },
          error: (err) => {
            console.error("Query error:", err);
            reject(new Error(String(err)));
          },
        });
      },
      error: (err) => {
        console.error("Consult error:", err);
        reject(new Error(String(err)));
      },
    });
  });
}

// Extrai o valor de uma variável ligada como string JS
function getString(answer, varName) {
  const term = answer.links[varName];
  if (!term) return "";
  if (typeof term.toJavaScript === "function") {
    const val = term.toJavaScript();
    if (val !== undefined && val !== null) return String(val);
  }
  if (term.id !== undefined) return String(term.id);
  return term.toString();
}

// Converte uma lista Prolog em array JS
function termListToArray(term) {
  const result = [];
  let cur = term;
  while (cur && cur.indicator !== "[]") {
    if (cur.args && cur.args.length >= 1) {
      const head = cur.args[0];
      const val = typeof head.toJavaScript === "function"
        ? head.toJavaScript()
        : head.id;
      if (val !== undefined) result.push(String(val));
      cur = cur.args[1];
    } else break;
  }
  return result;
}

// ── Routes ───────────────────────────────────────────────────────────────────

app.post("/api/search", async (req, res) => {
  try {
    const {
      kingdom = "", phylum = "", class: cls = "", order = "",
      family = "", genus = "", species = "", name = "",
    } = req.body;

    const toAtom = (v) =>
      v.trim() ? `'${v.trim().replace(/'/g, "\\'")}'` : "any";

    const K = toAtom(kingdom);
    const P = toAtom(phylum);
    const C = toAtom(cls);
    const O = toAtom(order);
    const F = toAtom(family);
    const G = toAtom(genus);
    const S = toAtom(species);

    const goal = `search_animals(${K},${P},${C},${O},${F},${G},${S},Name,AK,AP,AC,AO,AF,AG,AS,Lifespan,Behavior,Diet).`;
    console.log("🔍 Query:", goal);

    const answers = await runQuery(goal);

    let results = answers.map(a => ({
      name:     getString(a, "Name"),
      kingdom:  getString(a, "AK"),
      phylum:   getString(a, "AP"),
      class:    getString(a, "AC"),
      order:    getString(a, "AO"),
      family:   getString(a, "AF"),
      genus:    getString(a, "AG"),
      species:  getString(a, "AS"),
      lifespan: getString(a, "Lifespan"),
      behavior: getString(a, "Behavior"),
      diet:     getString(a, "Diet"),
    }));

    // Filtro de nome feito em JS
    if (name.trim()) {
      const needle = name.trim().toLowerCase();
      results = results.filter(r => r.name.toLowerCase().includes(needle));
    }

    res.json({ success: true, count: results.length, results });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get("/api/distinct/:rank", async (req, res) => {
  const { rank } = req.params;
  const validRanks = ["kingdom","phylum","class","order","family","genus","species"];
  if (!validRanks.includes(rank)) {
    return res.status(400).json({ success: false, error: "Invalid rank" });
  }
  try {
    const answers = await runQuery(`distinct_values(${rank}, Vs).`);
    const listTerm = answers[0]?.links?.Vs;
    const values = listTerm ? termListToArray(listTerm) : [];
    res.json({ success: true, values });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const answers = await runQuery(
      "findall(N, animal(N,_,_,_,_,_,_,_,_,_,_), Ns), length(Ns, Count)."
    );
    const countTerm = answers[0]?.links?.Count;
    const total = countTerm
      ? Number(typeof countTerm.toJavaScript === "function"
          ? countTerm.toJavaScript()
          : countTerm.id ?? 0)
      : 0;
    res.json({ success: true, totalAnimals: total });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
