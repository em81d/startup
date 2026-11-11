// Starter vocab lists. When a user signs up, a copy of these is saved as their
// progress in the database (see createUser in index.js).

const knownWords = [
  { spanish: 'hola', english: 'hello' },
  { spanish: 'adiós', english: 'goodbye' },
  { spanish: 'gracias', english: 'thank you' },
  { spanish: 'por favor', english: 'please' },
  { spanish: 'sí', english: 'yes' },
  { spanish: 'no', english: 'no' },
  { spanish: 'el agua', english: 'water' },
  { spanish: 'la comida', english: 'food' },
  { spanish: 'la casa', english: 'house' },
  { spanish: 'el perro', english: 'dog' },
  { spanish: 'el gato', english: 'cat' },
  { spanish: 'el libro', english: 'book' },
  { spanish: 'grande', english: 'big' },
  { spanish: 'pequeño', english: 'small' },
  { spanish: 'bueno', english: 'good' },
  { spanish: 'malo', english: 'bad' },
  { spanish: 'hablar', english: 'to speak' },
  { spanish: 'comer', english: 'to eat' },
  { spanish: 'beber', english: 'to drink' },
  { spanish: 'vivir', english: 'to live' },
];

const learningWords = [
  { spanish: 'el maestro', english: 'teacher' },
  { spanish: 'el médico', english: 'doctor' },
  { spanish: 'el abogado', english: 'lawyer' },
  { spanish: 'la enfermera', english: 'nurse' },
  { spanish: 'el cocinero', english: 'cook' },
  { spanish: 'el bombero', english: 'firefighter' },
  { spanish: 'el trabajo', english: 'job' },
  { spanish: 'la empresa', english: 'company' },
  { spanish: 'la reunión', english: 'meeting' },
  { spanish: 'el sueldo', english: 'salary' },
  { spanish: 'ayer', english: 'yesterday' },
  { spanish: 'anoche', english: 'last night' },
  { spanish: 'la semana pasada', english: 'last week' },
  { spanish: 'fui', english: 'I went' },
  { spanish: 'hice', english: 'I did' },
  { spanish: 'tuve', english: 'I had' },
  { spanish: 'trabajé', english: 'I worked' },
  { spanish: 'estudié', english: 'I studied' },
  { spanish: 'aprender', english: 'to learn' },
  { spanish: 'enseñar', english: 'to teach' },
];

const futureWords = [
  { spanish: 'el ingeniero', english: 'engineer' },
  { spanish: 'el contador', english: 'accountant' },
  { spanish: 'el arquitecto', english: 'architect' },
  { spanish: 'el periodista', english: 'journalist' },
  { spanish: 'el carpintero', english: 'carpenter' },
  { spanish: 'el agricultor', english: 'farmer' },
  { spanish: 'la entrevista', english: 'interview' },
  { spanish: 'el horario', english: 'schedule' },
  { spanish: 'el ascenso', english: 'promotion' },
  { spanish: 'la jubilación', english: 'retirement' },
  { spanish: 'el desarrollo', english: 'development' },
  { spanish: 'la investigación', english: 'research' },
  { spanish: 'el presupuesto', english: 'budget' },
  { spanish: 'la herramienta', english: 'tool' },
  { spanish: 'el taller', english: 'workshop' },
  { spanish: 'emprender', english: 'to undertake' },
  { spanish: 'lograr', english: 'to achieve' },
  { spanish: 'resolver', english: 'to solve' },
  { spanish: 'dirigir', english: 'to manage' },
  { spanish: 'contratar', english: 'to hire' },
];

// Returns the starter lists for a new user
function getStarterProgress() {
  return { known: knownWords, learning: learningWords, future: futureWords };
}

module.exports = { getStarterProgress };
