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
  return String(answer);
}

function buildFields(questions, submission) {
  const titles = {};
  for (const q of questions) titles[q.id] = (q.title || "").toLowerCase();
  return (submission.responses || []).map(r => ({
    title: titles[r.questionId] || "",
    value: toText(r.answer)
  }));
}

function matches(title, keys) {
  return keys.some(k => title.includes(k));
}

function findText(fields, keys) {
  const f = fields.find(f => matches(f.title, keys) && f.value);
  return f ? f.value : null;
}

function findNumber(fields, keys) {
  for (const f of fields) {
    if (!matches(f.title, keys)) continue;
    const n = parseFloat(String(f.value).replace(",", "."));
    if (!isNaN(n)) return n;
  }
  return 0;
}

function findBoolean(fields, keys) {
  const v = (findText(fields, keys) || "").toLowerCase();
  return v === "yes" || v === "true" || v === "sim";
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const apiKey = process.env.TALLY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ responses: [], errors: ["A variável TALLY_API_KEY não está configurada no Vercel"] });
  }

  const debug = req.query && req.query.debug === "1";
  const responses = [], errors = [], forms = [];

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
          responses.push({
            type,
            questionnaire,
            workshop: findText(f, ["group", "workshop"]) || "Unknown",
            country: findText(f, ["country"]) || "Unknown",
            sector: findText(f, ["organization", "organisation", "sector"]) || "Unknown",
            age: findText(f, ["age"]) || "Unknown",
            role: findText(f, ["role", "position"]) || "Unknown",
            concern: findText(f, ["concern"]) || "Unknown",
            mobility: findBoolean(f, ["mobility"]),
            selfCare: findBoolean(f, ["self-care", "selfcare", "self care"]),
            daily: findBoolean(f, ["daily", "usual activities"]),
            pain: findBoolean(f, ["pain"]),
            anxiety: findBoolean(f, ["anxiety"]),
            health: findNumber(f, ["health"]),
            weight: findNumber(f, ["weight"]),
            height: findNumber(f, ["height"])
          });
        }
      } catch (e) {
        errors.push(`${type} / ${questionnaire}: ${e.message}`);
      }
    }
  }

  res.status(200).json(debug ? { errors, forms } : { responses, errors });
}
