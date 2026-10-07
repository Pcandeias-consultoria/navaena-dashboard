const TALLY_FORMS = {
  "Self-Check": {
    "Quality of Life (Start)": "9q5Eo4",
    "Eat": "EkaqZL",
    "Move": "2ERzOA",
    "Rest": "2ERYyg",
    "Connect": "PdPQO0",
    "Hormonal Flow": "GxVokL",
    "Quality of Life (End)": "QKyvqG"
  },
  "Feedback": {
    "Eat": "aQXAl2",
    "Move": "GxVQkk",
    "Rest": "rjQkNp",
    "Connect": "EkGMDN",
    "Hormonal Flow": "zxALdZ"
  }
};

// Traduções para inglês (escritas em minúsculas à esquerda)
const TRANSLATIONS = {
  // Região
  "europe": "Europe",
  "europa": "Europe",

  // Setor
  "financial services & insurance": "Financial Services & Insurance",
  "serviços financeiros e seguros": "Financial Services & Insurance",
  "services financiers et assurances": "Financial Services & Insurance",
  "public sector & non-profit": "Public Sector & Non-profit",
  "secteur public et organisations à but non lucratif": "Public Sector & Non-profit",
  "setor público e organizações sem fins lucrativos": "Public Sector & Non-profit",

  // Idade
  "18–24 years": "18–24", "18–24 anos": "18–24", "18–24 ans": "18–24",
  "25–34 years": "25–34", "25–34 anos": "25–34", "25–34 ans": "25–34",
  "35–44 years": "35–44", "35–44 anos": "35–44", "35–44 ans": "35–44",
  "45–54 years": "45–54", "45–54 anos": "45–54", "45–54 ans": "45–54",
  "55–64 years": "55–64", "55–64 anos": "55–64", "55–64 ans": "55–64",
  "65+ years": "65+", "65+ anos": "65+", "65+ ans": "65+",

  // Cargo
  "débutante / collaboratrice": "Entry level",
  "especialista intermédio": "Mid-level specialist",
  "spécialiste de niveau intermédiaire": "Mid-level specialist",
  "especialista sénior / líder de equipa": "Senior specialist",
  "spécialiste senior / cheffe d’équipe": "Senior specialist",
  "management / executive": "Executive / Director",
  "gestão / executivo": "Executive / Director",
  "direction / cadre exécutif": "Executive / Director",

  // Tema que mais preocupa
  "hormonal flow": "Hormone Balance",
  "fluxo hormonal": "Hormone Balance",
  "équilibre hormonal": "Hormone Balance",
  "eat": "Nutrition",
  "alimentação": "Nutrition",
  "manger": "Nutrition",
  "rest": "Sleep / Rest",
  "descanso / sono": "Sleep / Rest",
  "repos / sommeil": "Sleep / Rest",
  "move": "Movement",
  "movimento": "Movement",
  "bouger": "Movement",
  "connect": "Connection",
  "conexão": "Connection",
  "se connecter": "Connection"
};

   // País de cada grupo
   const GROUP_COUNTRY = {
     "Group 1": "Belgium",
     "Group 2": "Portugal"
   };

   // Tipo de organização de cada grupo
   const GROUP_SECTOR = {
     "Group 1": "Public Sector & Non-profit",
     "Group 2": "Financial Services & Insurance"
   };

const KEYS = {
  group:    ["select your group", "votre groupe", "seu grupo"],
  country:  ["which region", "quelle région", "que região"],
  sector:   ["industry", "secteur d", "indústria"],
  age:      ["age group", "tranche d", "faixa etária"],
  role:     ["role level", "votre poste", "cargo atual"],
  concern:  ["topics concerns you", "sujet vous préoccupe", "maior desafio pessoal"],
  mobility: ["mobility", "mobilité", "mobilidade"],
  selfCare: ["self-care", "soins personnels", "cuidados pessoais"],
  daily:    ["routine &", "activités quotidiennes", "rotina e vida"],
  pain:     ["pain / discomfort", "douleur", "dor / desconforto"],
  anxiety:  ["anxiety / depression", "anxiété / dépression", "ansiedade / depressão"],
  health:   ["define your health", "évaluez-vous votre santé", "nível de saúde"],
  weight:   ["your weight", "votre poids", "seu peso"],
  height:   ["how tall", "votre taille", "sua altura"]
};

const PROBLEM_WORDS = [
  "slight", "some", "moderate", "severe", "extreme", "unable",
  "léger", "légère", "quelque", "modéré", "sévère", "extrême", "incapable",
  "ligeir", "algum", "alguns", "moderad", "grave", "extrem", "incapaz"
];

async function getSubmissions(formId, apiKey) {
  let page = 1, questions = [], submissions = [];
  while (true) {
    const r = await fetch(`https://api.tally.so/forms/${formId}/submissions?page=${page}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!r.ok) throw new Error(`o Tally respondeu com o erro ${r.status}`);
    const data = await r.json();
    if (page === 1) questions = data.questions || [];
    submissions = submissions.concat(data.submissions || []);
    if (!data.hasMore) break;
    page++;
  }
  return { questions, submissions };
}

function toText(answer) {
  if (answer === null || answer === undefined) return "";
  if (Array.isArray(answer)) return answer.map(toText).join(", ");
  if (typeof answer === "object") return answer.name || answer.label || answer.value || JSON.stringify(answer);
  return String(answer).trim();
}

function buildFields(questions, submission) {
  const titles = {};
  for (const q of questions) titles[q.id] = (q.title || "").toLowerCase().replace(/’/g, "'");
  return (submission.responses || []).map(r => ({
    title: titles[r.questionId] || "",
    value: toText(r.answer)
  }));
}

function matches(title, keys) {
  return keys.some(k => title.includes(k.replace(/’/g, "'")));
}

function findText(fields, keys) {
  const f = fields.find(f => matches(f.title, keys) && f.value);
  return f ? f.value : null;
}

function tr(value) {
  if (!value) return null;
  const k = value.trim().toLowerCase();
  return TRANSLATIONS[k] || value.trim();
}

function findNumber(fields, keys) {
  for (const f of fields) {
    if (!matches(f.title, keys)) continue;
    const n = parseFloat(String(f.value).replace(",", "."));
    if (!isNaN(n)) return n;
  }
  return 0;
}

function hasProblem(fields, keys) {
  const v = (findText(fields, keys) || "").toLowerCase();
  if (!v) return false;
  const n = parseFloat(v);
  if (!isNaN(n)) return n > 1;
  return PROBLEM_WORDS.some(w => v.includes(w));
}

function normalizeGroup(g) {
  if (!g) return "Unknown";
  return g.replace(/^(groupe|grupo|group)\s*/i, "Group ").trim();
}

function normalizeHeight(h) {
  if (h > 3) return Math.round(h) / 100;
  return h;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const apiKey = process.env.TALLY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ responses: [], errors: ["A variável TALLY_API_KEY não está configurada no Vercel"] });
  }

  const debug = req.query && req.query.debug === "1";
  const valuesMode = req.query && req.query.values === "1";
  const responses = [], errors = [], forms = [];
  const values = {};
  const VALUE_FIELDS = ["country", "sector", "age", "role", "concern", "mobility", "selfCare", "daily", "pain", "anxiety", "health"];

  for (const [type, questionnaires] of Object.entries(TALLY_FORMS)) {
    for (const [questionnaire, formId] of Object.entries(questionnaires)) {
      try {
        const { questions, submissions } = await getSubmissions(formId, apiKey);
        if (debug) {
          forms.push({ type, questionnaire, formId, submissions: submissions.length, questions: questions.map(q => q.title) });
        }
        for (const s of submissions) {
          if (s.isCompleted === false) continue;
          const f = buildFields(questions, s);

          if (valuesMode && questionnaire.startsWith("Quality of Life")) {
            for (const key of VALUE_FIELDS) {
              const v = findText(f, KEYS[key]);
              if (!v) continue;
              values[key] = values[key] || [];
              if (!values[key].includes(v)) values[key].push(v);
            }
          }

          responses.push({
            type,
            questionnaire,
            workshop: normalizeGroup(findText(f, KEYS.group)),
            country:  GROUP_COUNTRY[normalizeGroup(findText(f, KEYS.group))] || "Unknown",
            sector:   GROUP_SECTOR[normalizeGroup(findText(f, KEYS.group))] || "Unknown",
            age:      tr(findText(f, KEYS.age)) || "Unknown",
            role:     tr(findText(f, KEYS.role)) || "Unknown",
            concern:  tr(findText(f, KEYS.concern)) || "Unknown",
            mobility: hasProblem(f, KEYS.mobility),
            selfCare: hasProblem(f, KEYS.selfCare),
            daily:    hasProblem(f, KEYS.daily),
            pain:     hasProblem(f, KEYS.pain),
            anxiety:  hasProblem(f, KEYS.anxiety),
            health:   findNumber(f, KEYS.health),
            weight:   findNumber(f, KEYS.weight),
            height:   normalizeHeight(findNumber(f, KEYS.height))
          });
        }
      } catch (e) {
        errors.push(`${type} / ${questionnaire}: ${e.message}`);
      }
    }
  }

  if (valuesMode) return res.status(200).json({ errors, values });
  res.status(200).json(debug ? { errors, forms } : { responses, errors });
}
