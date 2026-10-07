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

async function fetchTallyResponses(formId, type, questionnaire) {
  const apiKey = process.env.TALLY_API_KEY;
  if (!apiKey) throw new Error("API key não configurada");

  const response = await fetch(`https://api.tally.so/api/v1/forms/${formId}/responses`, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) return [];

  const data = await response.json();
  return (data.data || []).map(r => ({
    type,
    questionnaire,
    workshop: extractField(r.fields, "group") || "Unknown",
    country: extractField(r.fields, "country") || "Unknown",
    sector: extractField(r.fields, "organization") || "Unknown",
    age: extractField(r.fields, "age") || "Unknown",
    role: extractField(r.fields, "role") || "Unknown",
    concern: extractField(r.fields, "concern") || "Unknown",
    mobility: extractBoolean(r.fields, "mobility"),
    selfCare: extractBoolean(r.fields, "selfcare"),
    daily: extractBoolean(r.fields, "daily"),
    pain: extractBoolean(r.fields, "pain"),
    anxiety: extractBoolean(r.fields, "anxiety"),
    health: extractNumber(r.fields, "health") || 0,
    weight: extractNumber(r.fields, "weight") || 0,
    height: extractNumber(r.fields, "height") || 0
  }));
}

function extractField(fields, key) {
  const field = fields.find(f => f.key.toLowerCase().includes(key.toLowerCase()));
  return field ? field.value : null;
}

function extractNumber(fields, key) {
  const value = extractField(fields, key);
  return value ? parseFloat(value) : 0;
}

function extractBoolean(fields, key) {
  const value = extractField(fields, key);
  return value && (value === true || value.toLowerCase() === "yes" || value.toLowerCase() === "true");
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let responses = [];

    for (const [type, questionnaires] of Object.entries(TALLY_FORMS)) {
      for (const [questionnaire, formId] of Object.entries(questionnaires)) {
        const data = await fetchTallyResponses(formId, type, questionnaire);
        responses = responses.concat(data);
      }
    }

    res.status(200).json({ responses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
