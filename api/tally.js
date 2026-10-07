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
