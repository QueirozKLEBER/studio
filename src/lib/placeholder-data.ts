export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipmentType: 'Máquina' | 'Barra' | 'Halteres' | 'Livre' | 'Peso do corpo' | 'Cabo/Polia';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  sets: string;
  reps: string;
  rest: string;
  videoUrl: string;
  description: string;
  tips: string[];
  commonErrors: string[];
  safetyTips: string[];
  variations: string[];
};

export const muscleGroups = [
  { id: 'peito', name: 'Peito', icon: 'Chest' },
  { id: 'costas', name: 'Costas', icon: 'Back' },
  { id: 'ombros', name: 'Ombros', icon: 'Shoulders' },
  { id: 'biceps', name: 'Bíceps', icon: 'Biceps' },
  { id: 'triceps', name: 'Tríceps', icon: 'Triceps' },
  { id: 'pernas', name: 'Pernas', icon: 'Legs' },
  { id: 'gluteos', name: 'Glúteos', icon: 'Glutes' },
  { id: 'abdomen', name: 'Abdômen', icon: 'Abs' },
  { id: 'panturrilha', name: 'Panturrilha', icon: 'Calves' },
  { id: 'antebreaco', name: 'Antebraço', icon: 'Forearms' },
  { id: 'trapezio', name: 'Trapézio', icon: 'Traps' },
  { id: 'lombar', name: 'Lombar', icon: 'LowerBack' },
];

const generateExercise = (id: string, name: string, muscle: string, equipment: any, difficulty: any = 'Iniciante'): Exercise => ({
  id,
  name,
  muscleGroup: muscle,
  secondaryMuscles: [],
  equipmentType: equipment,
  difficulty: difficulty,
  sets: '3',
  reps: '12',
  rest: '60s',
  videoUrl: '',
  description: `Exercício focado no desenvolvimento de ${muscle}.`,
  tips: ['Mantenha a postura.', 'Controle a respiração.'],
  commonErrors: ['Execução rápida demais.', 'Uso de carga excessiva.'],
  safetyTips: ['Mantenha a coluna neutra.'],
  variations: [],
});

export const exercises: Record<string, Exercise[]> = {
  peito: [
    generateExercise('supino-reto-barra', 'Supino Reto com Barra', 'Peito', 'Barra', 'Intermediário'),
    generateExercise('supino-reto-halter', 'Supino Reto com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    generateExercise('supino-inclinado-barra', 'Supino Inclinado com Barra', 'Peito', 'Barra', 'Intermediário'),
    generateExercise('supino-inclinado-halter', 'Supino Inclinado com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    generateExercise('supino-declinado-barra', 'Supino Declinado com Barra', 'Peito', 'Barra', 'Avançado'),
    generateExercise('supino-declinado-halter', 'Supino Declinado com Halteres', 'Peito', 'Halteres', 'Avançado'),
    generateExercise('supino-maquina', 'Supino na Máquina', 'Peito', 'Máquina', 'Iniciante'),
    generateExercise('crucifixo-reto-halter', 'Crucifixo Reto com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    generateExercise('peck-deck', 'Peck Deck (Voador)', 'Peito', 'Máquina', 'Iniciante'),
    generateExercise('crossover-alto', 'Crossover Polia Alta', 'Peito', 'Cabo/Polia', 'Intermediário'),
    generateExercise('flexao-tradicional', 'Flexão de Braço Tradicional', 'Peito', 'Peso do corpo', 'Iniciante'),
    generateExercise('pullover-halter', 'Pullover com Halter', 'Peito', 'Halteres', 'Intermediário'),
  ],
  costas: [
    generateExercise('barra-fixa-pronada', 'Barra Fixa Pronada', 'Costas', 'Peso do corpo', 'Avançado'),
    generateExercise('puxada-frontal-aberta', 'Puxada Frontal Aberta', 'Costas', 'Máquina', 'Iniciante'),
    generateExercise('remada-curvada-barra', 'Remada Curvada com Barra', 'Costas', 'Barra', 'Intermediário'),
    generateExercise('remada-unilateral-halter', 'Remada Unilateral com Halter', 'Costas', 'Halteres', 'Iniciante'),
    generateExercise('remada-baixa-cabo', 'Remada Baixa no Cabo', 'Costas', 'Cabo/Polia', 'Iniciante'),
    generateExercise('levantamento-terra', 'Levantamento Terra', 'Costas', 'Barra', 'Avançado'),
    generateExercise('puxada-triangulo', 'Puxada com Triângulo', 'Costas', 'Máquina', 'Iniciante'),
    generateExercise('remada-cavalinho', 'Remada Cavalinho (T-Bar)', 'Costas', 'Barra', 'Intermediário'),
  ],
  pernas: [
    generateExercise('agachamento-livre', 'Agachamento Livre', 'Pernas', 'Barra', 'Avançado'),
    generateExercise('leg-press-45', 'Leg Press 45°', 'Pernas', 'Máquina', 'Intermediário'),
    generateExercise('cadeira-extensora', 'Cadeira Extensora', 'Pernas', 'Máquina', 'Iniciante'),
    generateExercise('mesa-flexora', 'Mesa Flexora', 'Pernas', 'Máquina', 'Iniciante'),
    generateExercise('stiff', 'Stiff', 'Pernas', 'Barra', 'Intermediário'),
    generateExercise('afundo', 'Afundo', 'Pernas', 'Livre', 'Iniciante'),
    generateExercise('agachamento-sumo', 'Agachamento Sumô', 'Pernas', 'Halteres', 'Intermediário'),
    generateExercise('cadeira-abdutora', 'Cadeira Abdutora', 'Pernas', 'Máquina', 'Iniciante'),
  ],
  ombros: [
    generateExercise('desenvolvimento-halter', 'Desenvolvimento com Halteres', 'Ombros', 'Halteres', 'Intermediário'),
    generateExercise('eleva-lateral-halter', 'Elevação Lateral com Halteres', 'Ombros', 'Halteres', 'Iniciante'),
    generateExercise('arnold-press', 'Arnold Press', 'Ombros', 'Halteres', 'Avançado'),
    generateExercise('desenvolvimento-barra', 'Desenvolvimento com Barra', 'Ombros', 'Barra', 'Intermediário'),
    generateExercise('eleva-frontal-anilha', 'Elevação Frontal com Anilha', 'Ombros', 'Livre', 'Iniciante'),
    generateExercise('face-pull', 'Face Pull', 'Ombros', 'Cabo/Polia', 'Iniciante'),
  ],
  biceps: [
    generateExercise('rosca-direta-barra', 'Rosca Direta com Barra', 'Bíceps', 'Barra', 'Iniciante'),
    generateExercise('rosca-alternada', 'Rosca Alternada com Halteres', 'Bíceps', 'Halteres', 'Iniciante'),
    generateExercise('rosca-martelo', 'Rosca Martelo', 'Bíceps', 'Halteres', 'Iniciante'),
    generateExercise('rosca-scott-barra', 'Rosca Scott com Barra', 'Bíceps', 'Barra', 'Intermediário'),
    generateExercise('rosca-concentrada', 'Rosca Concentrada', 'Bíceps', 'Halteres', 'Iniciante'),
    generateExercise('rosca-cabo', 'Rosca no Cabo', 'Bíceps', 'Cabo/Polia', 'Iniciante'),
  ],
  triceps: [
    generateExercise('triceps-testa-barra', 'Tríceps Testa com Barra', 'Tríceps', 'Barra', 'Intermediário'),
    generateExercise('triceps-corda', 'Tríceps Corda', 'Tríceps', 'Cabo/Polia', 'Iniciante'),
    generateExercise('mergulho-paralelas', 'Mergulho em Paralelas', 'Tríceps', 'Peso do corpo', 'Avançado'),
    generateExercise('triceps-frances', 'Tríceps Francês', 'Tríceps', 'Halteres', 'Intermediário'),
    generateExercise('triceps-pulley', 'Tríceps Pulley', 'Tríceps', 'Cabo/Polia', 'Iniciante'),
    generateExercise('supino-fechado', 'Supino Fechado', 'Tríceps', 'Barra', 'Avançado'),
  ],
  abdomen: [
    generateExercise('abdominal-crunch', 'Abdominal Crunch', 'Abdômen', 'Peso do corpo', 'Iniciante'),
    generateExercise('plancha', 'Prancha Isométrica', 'Abdômen', 'Peso do corpo', 'Iniciante'),
    generateExercise('eleva-pernas-suspenso', 'Elevação de Pernas Suspenso', 'Abdômen', 'Peso do corpo', 'Avançado'),
    generateExercise('abdominal-cabo', 'Abdominal no Cabo', 'Abdômen', 'Cabo/Polia', 'Intermediário'),
  ],
  panturrilha: [
    generateExercise('panturrilha-em-pe', 'Panturrilha em Pé', 'Panturrilha', 'Máquina', 'Iniciante'),
    generateExercise('panturrilha-sentado', 'Panturrilha Sentado', 'Panturrilha', 'Máquina', 'Iniciante'),
    generateExercise('panturrilha-legpress', 'Panturrilha no Leg Press', 'Panturrilha', 'Máquina', 'Intermediário'),
  ],
  antebreaco: [
    generateExercise('rosca-inversa', 'Rosca Inversa', 'Antebraço', 'Barra', 'Iniciante'),
    generateExercise('rosca-punho', 'Rosca Punho', 'Antebraço', 'Barra', 'Iniciante'),
    generateExercise('farmers-walk', 'Farmer\'s Walk', 'Antebraço', 'Halteres', 'Intermediário'),
  ],
  trapezio: [
    generateExercise('encolhimento-barra', 'Encolhimento com Barra', 'Trapézio', 'Barra', 'Iniciante'),
    generateExercise('encolhimento-halter', 'Encolhimento com Halteres', 'Trapézio', 'Halteres', 'Iniciante'),
    generateExercise('remada-alta-barra', 'Remada Alta com Barra', 'Trapézio', 'Barra', 'Intermediário'),
  ],
  lombar: [
    generateExercise('hiperextensao', 'Hiperextensão Lombar', 'Lombar', 'Máquina', 'Iniciante'),
    generateExercise('superman', 'Superman', 'Lombar', 'Peso do corpo', 'Iniciante'),
    generateExercise('bird-dog', 'Bird Dog', 'Lombar', 'Peso do corpo', 'Iniciante'),
  ]
};

export const weeklyProgress = [
  { day: 'Dom', volume: 1800 },
  { day: 'Seg', volume: 3200 },
  { day: 'Ter', volume: 2500 },
  { day: 'Qua', volume: 3800 },
  { day: 'Qui', volume: 2900 },
  { day: 'Sex', volume: 4100 },
  { day: 'Sáb', volume: 0 },
];

export const dailyWorkout = {
  focus: 'Peito e Tríceps',
  muscleId: 'peito',
  exercises: [
    { name: 'Supino Reto Barra', sets: '4', reps: '10' },
    { name: 'Peck Deck', sets: '3', reps: '12' },
    { name: 'Flexão de Braços', sets: '3', reps: 'Fadiga' },
    { name: 'Tríceps Pulley', sets: '4', reps: '12' },
    { name: 'Mergulho no Banco', sets: '3', reps: '15' },
  ],
};

export const nutritionTips = {
  emagrecimento: {
    category: 'Emagrecimento',
    tips: [
      { title: 'Hidratação é Chave', content: 'Beba pelo menos 2 litros de água por dia. Muitas vezes, a sede é confundida com fome.' },
      { title: 'Priorize Proteínas', content: 'Proteínas aumentam a saciedade e ajudam a manter a massa muscular durante a perda de peso.' },
    ],
  },
  hipertrofia: {
    category: 'Hipertrofia',
    tips: [
      { title: 'Superávit Calórico', content: 'Para construir músculos, você precisa consumir mais calorias do que gasta.' },
    ],
  },
  energia: { category: 'Energia', tips: [] },
  'pre-treino': { category: 'Pré-Treino', tips: [] },
  'pos-treino': { category: 'Pós-Treino', tips: [] },
};

export { placeHolderImages } from './placeholder-images';
