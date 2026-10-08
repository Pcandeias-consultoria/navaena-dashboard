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
  "se connecter": "Connection",

  // Respostas das perguntas (Eat, Move, etc.)
  "never": "Never", "jamais": "Never", "nunca": "Never",
  "rarely": "Rarely", "rarement": "Rarely", "raramente": "Rarely",
  "sometimes": "Sometimes", "parfois": "Sometimes", "às vezes": "Sometimes", "as vezes": "Sometimes",
  "often": "Often", "souvent": "Often", "frequentemente": "Often", "muitas vezes": "Often",
  "always": "Always", "toujours": "Always", "sempre": "Always",
  "strongly disagree": "Strongly disagree", "pas du tout d'accord": "Strongly disagree", "discordo totalmente": "Strongly disagree",
  "disagree": "Disagree", "pas d'accord": "Disagree", "discordo": "Disagree",
  "neutral": "Neutral", "neutre": "Neutral", "neutro": "Neutral",
  "agree": "Agree", "d'accord": "Agree", "concordo": "Agree",
  "strongly agree": "Strongly agree", "tout à fait d'accord": "Strongly agree", "concordo totalmente": "Strongly agree",
  "yes": "Yes", "oui": "Yes", "sim": "Yes",
  "no": "No", "non": "No", "não": "No", "nao": "No",
  "maybe": "Maybe", "peut-être": "Maybe", "peut-etre": "Maybe", "talvez": "Maybe",

  // After today's session, how do you feel?
  "more informed": "More informed", "mais informada": "More informed", "mais informado": "More informed",
  "plus informée": "More informed", "plus informé": "More informed", "plus informé(e)": "More informed",
  "more motivated": "More motivated", "mais motivada": "More motivated", "mais motivado": "More motivated",
  "plus motivée": "More motivated", "plus motivé": "More motivated", "plus motivé(e)": "More motivated"
   };

// Perguntas do Feedback, pela ordem em que aparecem em cada língua (a seguir a "Date")
const FEEDBACK_KEYS = ["date", "facilitator", "energyBefore", "feelAfter", "sessionFelt", "resonated",
  "learn1", "learn2", "capable", "lessAlone", "comfortable", "recommend", "appreciated", "improve"];
const FEEDBACK_TEXT = ["resonated", "appreciated", "improve"];
const FEEDBACK_SKIP = ["date", "facilitator"];

// Modelo da Anthropic usado para os resumos
const SUMMARY_MODEL = "claude-haiku-5-5";
const summaryCache = new Map();

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
  const k = value.trim().toLowerCase().replace(/’/g, "'");
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
  const m = String(g).match(/\d+/);
  return m ? "Group " + m[0] : String(g).trim();
}

// Junta as perguntas das 3 línguas: cada pergunta em FR/PT fica com o título da pergunta em inglês
function cleanTitle(t) {
  return String(t || "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function buildStatementMap(questions) {
  const blocks = [[]];
  for (const q of questions) {
    if (!q.title) { blocks.push([]); continue; }
    blocks[blocks.length - 1].push(q);
  }
  const english = blocks[1] || [];
  const map = {};
  for (let b = 1; b < blocks.length; b++) {
    blocks[b].forEach((q, i) => {
      if (english[i]) map[q.id] = { i: i, q: cleanTitle(english[i].title) };
    });
  }
  return map;
}

function buildFeedbackMap(questions) {
  const blocks = [[]];
  for (const q of questions) {
    if (!q.title) continue;
    if (/^(date|data)\s*:?\s*$/i.test(cleanTitle(q.title))) blocks.push([]);
    blocks[blocks.length - 1].push(q);
  }
  const english = blocks[1] || [];
  const map = {};
  for (let b = 1; b < blocks.length; b++) {
    blocks[b].forEach((q, i) => {
      const key = FEEDBACK_KEYS[i];
      if (key && !FEEDBACK_SKIP.includes(key)) {
        map[q.id] = { key: key, q: cleanTitle(english[i] ? english[i].title : q.title) };
      }
    });
  }
  return map;
}

function normalizeHeight(h) {
  if (h > 3) return Math.round(h) / 100;
  return h;
}

async function processForm(type, questionnaire, formId, apiKey, opts) {
  const { questions, submissions } = await getSubmissions(formId, apiKey);
  if (opts.debug) {
    opts.forms.push({ type, questionnaire, formId, submissions: submissions.length, questions: questions.map(q => q.title) });
  }
  const isStatements = type === "Self-Check" && !questionnaire.startsWith("Quality of Life");
  const isFeedback = type === "Feedback";
  const statementMap = isStatements ? buildStatementMap(questions) : {};
  const feedbackMap = isFeedback ? buildFeedbackMap(questions) : {};
  const values = opts.values;
  const VALUE_FIELDS = ["country", "sector", "age", "role", "concern", "mobility", "selfCare", "daily", "pain", "anxiety", "health"];
  const out = [];

  for (const s of submissions) {
    if (s.isCompleted === false) continue;
    const f = buildFields(questions, s);

    const answers = [];
    if (isStatements) {
      for (const r of (s.responses || [])) {
        const m = statementMap[r.questionId];
        const raw = toText(r.answer);
        if (!m || !raw) continue;
        answers.push({ i: m.i, q: m.q, a: tr(raw) });
        if (opts.valuesMode) {
          const key = "answers: " + questionnaire;
          values[key] = values[key] || [];
          if (!values[key].includes(raw)) values[key].push(raw);
        }
      }
    }

    const fb = {};
    if (isFeedback) {
      for (const r of (s.responses || [])) {
        const m = feedbackMap[r.questionId];
        const raw = toText(r.answer);
        if (!m || !raw) continue;
        const isText = FEEDBACK_TEXT.includes(m.key);
        if (isText && !opts.withText) continue;
        fb[m.key] = { q: m.q, a: isText ? raw : tr(raw) };
        if (opts.valuesMode && !isText) {
          const key = "feedback: " + m.key;
          values[key] = values[key] || [];
          if (!values[key].includes(raw)) values[key].push(raw);
        }
      }
    }

    if (opts.valuesMode && questionnaire.startsWith("Quality of Life")) {
      for (const key of VALUE_FIELDS) {
        const v = findText(f, KEYS[key]);
        if (!v) continue;
        values[key] = values[key] || [];
        if (!values[key].includes(v)) values[key].push(v);
      }
    }

    const group = normalizeGroup(findText(f, KEYS.group));
    out.push({
      type,
      questionnaire,
      workshop: group,
      country:  GROUP_COUNTRY[group] || "Unknown",
      sector:   GROUP_SECTOR[group] || "Unknown",
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
      height:   normalizeHeight(findNumber(f, KEYS.height)),
      answers,
      fb
    });
  }
  return out;
}

// Resumo em inglês dos comentários abertos do Feedback (feito pelo Claude)
async function summarize(texts) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) return { available: false };

  const section = (title, list) => title + ":\n" + (list.length ? list.map(t => "- " + t.slice(0, 800)).join("\n") : "(no comments)");
  const prompt =
    "You are summarising anonymous participant feedback from a women's health and longevity programme session. " +
    "Comments may be written in English, French or Portuguese.\n\n" +
    "For each of the three groups of comments below, write 2 to 5 short bullet points in English with the main insights or recurring themes. " +
    "Do not quote people word for word, do not include names, and do not invent anything that is not in the comments. " +
    "If a group has no comments, return an empty list for it.\n\n" +
    "Reply ONLY with JSON in this exact format: {\"resonated\": [\"...\"], \"appreciated\": [\"...\"], \"improve\": [\"...\"]}\n\n" +
    section("RESONATED (What resonated most / biggest insight)", texts.resonated) + "\n\n" +
    section("APPRECIATED (What did you appreciate most)", texts.appreciated) + "\n\n" +
    section("IMPROVE (What could be improved)", texts.improve);

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({ model: SUMMARY_MODEL, max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
  });
  if (!r.ok) throw new Error("a API do Claude respondeu com o erro " + r.status);
  const data = await r.json();
  const text = ((data.content || []).find(c => c.type === "text") || {}).text || "";
  const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  return {
    available: true,
    resonated: json.resonated || [],
    appreciated: json.appreciated || [],
    improve: json.improve || []
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const apiKey = process.env.TALLY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ responses: [], errors: ["A variável TALLY_API_KEY não está configurada no Vercel"] });
  }

  const query = req.query || {};

  // Modo resumo: /api/tally?summary=1&questionnaire=Eat&workshop=all&country=all&sector=all
  if (query.summary === "1") {
    try {
      const questionnaire = String(query.questionnaire || "");
      const formId = TALLY_FORMS.Feedback[questionnaire];
      if (!formId) return res.status(400).json({ error: "Questionário desconhecido" });
      const rows = (await processForm("Feedback", questionnaire, formId, apiKey, { withText: true, values: {} }))
        .filter(r =>
          (!query.workshop || query.workshop === "all" || r.workshop === query.workshop) &&
          (!query.country || query.country === "all" || r.country === query.country) &&
          (!query.sector || query.sector === "all" || r.sector === query.sector));
      const texts = { resonated: [], appreciated: [], improve: [] };
      rows.forEach(r => FEEDBACK_TEXT.forEach(k => { if (r.fb[k]) texts[k].push(r.fb[k].a); }));
      const cacheKey = JSON.stringify(texts);
      if (summaryCache.has(cacheKey)) return res.status(200).json(summaryCache.get(cacheKey));
      const result = await summarize(texts);
      if (result.available) summaryCache.set(cacheKey, result);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(200).json({ available: false, error: e.message });
    }
  }

  const opts = {
    debug: query.debug === "1",
    valuesMode: query.values === "1",
    values: {},
    forms: [],
    withText: false
  };
  let responses = [];
  const errors = [];

  for (const [type, questionnaires] of Object.entries(TALLY_FORMS)) {
    for (const [questionnaire, formId] of Object.entries(questionnaires)) {
      try {
        responses = responses.concat(await processForm(type, questionnaire, formId, apiKey, opts));
      } catch (e) {
        errors.push(`${type} / ${questionnaire}: ${e.message}`);
      }
    }
  }

  if (opts.valuesMode) return res.status(200).json({ errors, values: opts.values });
  res.status(200).json(opts.debug ? { errors, forms: opts.forms } : { responses, errors });
}
