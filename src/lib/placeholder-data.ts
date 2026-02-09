export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipmentType: 'Máquina' | 'Barra' | 'Halteres' | 'Livre' | 'Peso do corpo' | 'Cabo/Polia' | 'Kettlebell' | 'Elástico' | 'Smith';
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
  { id: 'panturrilha', name: 'Panturrilha', icon: 'Calves' },
  { id: 'abdomen', name: 'Abdômen', icon: 'Abs' },
  { id: 'antebreaco', name: 'Antebraço', icon: 'Forearms' },
  { id: 'trapezio', name: 'Trapézio', icon: 'Traps' },
  { id: 'lombar', name: 'Lombar', icon: 'LowerBack' },
];

const createEx = (id: string, name: string, muscle: string, equip: any, diff: any = 'Iniciante', sec: string[] = []): Exercise => ({
  id,
  name,
  muscleGroup: muscle,
  secondaryMuscles: sec,
  equipmentType: equip,
  difficulty: diff,
  sets: '3 a 4',
  reps: '10 a 12',
  rest: '60s',
  videoUrl: '',
  description: `Exercício técnico focado no desenvolvimento de ${muscle} com ênfase em ${name}.`,
  tips: ['Mantenha a cadência controlada.', 'Foco na contração muscular máxima.', 'Mantenha o core ativado.'],
  commonErrors: ['Uso de impulso (roubo).', 'Amplitude de movimento reduzida.', 'Postura incorreta da coluna.'],
  safetyTips: ['Mantenha a coluna em posição neutra.', 'Não bloqueie as articulações no final do movimento.'],
  variations: ['Variação de pegada', 'Variação de ângulo'],
});

export const exercises: Record<string, Exercise[]> = {
  peito: [
    createEx('supino-reto-barra', 'Supino Reto com Barra', 'Peito', 'Barra', 'Intermediário', ['Tríceps', 'Ombros']),
    createEx('supino-reto-halter', 'Supino Reto com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    createEx('supino-inc-barra', 'Supino Inclinado com Barra', 'Peito', 'Barra', 'Intermediário'),
    createEx('supino-inc-halter', 'Supino Inclinado com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    createEx('supino-dec-barra', 'Supino Declinado com Barra', 'Peito', 'Barra', 'Avançado'),
    createEx('crucifixo-maq', 'Crucifixo na Máquina (Peck Deck)', 'Peito', 'Máquina', 'Iniciante'),
    createEx('flexao-braço', 'Flexão de Braço', 'Peito', 'Peso do corpo', 'Iniciante'),
    createEx('crossover-cabo', 'Crossover no Cabo', 'Peito', 'Cabo/Polia', 'Intermediário'),
  ],
  costas: [
    createEx('puxada-frontal', 'Puxada Frontal Aberta', 'Costas', 'Máquina', 'Iniciante', ['Bíceps']),
    createEx('barra-fixa', 'Barra Fixa', 'Costas', 'Peso do corpo', 'Avançado'),
    createEx('remada-curvada', 'Remada Curvada com Barra', 'Costas', 'Barra', 'Intermediário'),
    createEx('remada-unilateral', 'Remada Unilateral com Halter', 'Costas', 'Halteres', 'Iniciante'),
    createEx('remada-baixa', 'Remada Baixa', 'Costas', 'Cabo/Polia', 'Iniciante'),
    createEx('pullover-cabo', 'Pullover no Cabo', 'Costas', 'Cabo/Polia', 'Intermediário'),
  ],
  pernas: [
    createEx('agachamento-livre', 'Agachamento Livre', 'Pernas', 'Barra', 'Avançado', ['Glúteos', 'Lombar']),
    createEx('leg-press-45', 'Leg Press 45°', 'Pernas', 'Máquina', 'Intermediário'),
    createEx('cadeira-extensora', 'Cadeira Extensora', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('mesa-flexora', 'Mesa Flexora', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('stiff-barra', 'Stiff com Barra', 'Pernas', 'Barra', 'Intermediário'),
    createEx('afundo-halter', 'Afundo com Halteres', 'Pernas', 'Halteres', 'Iniciante'),
    createEx('panturrilha-pe', 'Panturrilha em Pé', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('panturrilha-leg', 'Panturrilha no Leg Press', 'Pernas', 'Máquina', 'Iniciante'),
  ],
  ombros: [
    createEx('desenv-barra', 'Desenvolvimento com Barra', 'Ombros', 'Barra', 'Intermediário', ['Tríceps']),
    createEx('eleva-lateral', 'Elevação Lateral', 'Ombros', 'Halteres', 'Iniciante'),
    createEx('eleva-frontal', 'Elevação Frontal', 'Ombros', 'Halteres', 'Iniciante'),
    createEx('desenv-maq', 'Desenvolvimento em Máquina', 'Ombros', 'Máquina', 'Iniciante'),
    createEx('arnold-press', 'Arnold Press', 'Ombros', 'Halteres', 'Avançado'),
  ],
  biceps: [
    createEx('rosca-direta', 'Rosca Direta com Barra', 'Bíceps', 'Barra', 'Iniciante'),
    createEx('rosca-alt', 'Rosca Alternada com Halteres', 'Bíceps', 'Halteres', 'Iniciante'),
    createEx('rosca-scott', 'Rosca Scott', 'Bíceps', 'Barra', 'Intermediário'),
    createEx('rosca-conc', 'Rosca Concentrada', 'Bíceps', 'Halteres', 'Iniciante'),
    createEx('rosca-cabo', 'Rosca no Cabo', 'Bíceps', 'Cabo/Polia', 'Iniciante'),
  ],
  triceps: [
    createEx('triceps-testa', 'Tríceps Testa', 'Tríceps', 'Barra', 'Intermediário'),
    createEx('triceps-corda', 'Tríceps Corda', 'Tríceps', 'Cabo/Polia', 'Iniciante'),
    createEx('triceps-banco', 'Tríceps no Banco', 'Tríceps', 'Peso do corpo', 'Iniciante'),
    createEx('triceps-frances', 'Tríceps Francês', 'Tríceps', 'Halteres', 'Intermediário'),
    createEx('mergulho-paralela', 'Mergulho em Paralelas', 'Tríceps', 'Peso do corpo', 'Avançado'),
  ],
  abdomen: [
    createEx('crunch', 'Abdominal Crunch', 'Abdômen', 'Peso do corpo', 'Iniciante'),
    createEx('prancha', 'Prancha Isométrica', 'Abdômen', 'Peso do corpo', 'Iniciante'),
    createEx('eleva-perna', 'Elevação de Pernas', 'Abdômen', 'Peso do corpo', 'Intermediário'),
    createEx('abd-cabo', 'Abdominal no Cabo', 'Abdômen', 'Cabo/Polia', 'Intermediário'),
  ],
  antebreaco: [
    createEx('rosca-punho', 'Rosca Punho', 'Antebraço', 'Barra', 'Iniciante'),
    createEx('farmer-walk', 'Farmer’s Walk', 'Antebraço', 'Halteres', 'Intermediário'),
  ],
  trapezio: [
    createEx('encolhe-barra', 'Encolhimento com Barra', 'Trapézio', 'Barra', 'Iniciante'),
    createEx('encolhe-halter', 'Encolhimento com Halteres', 'Trapézio', 'Halteres', 'Iniciante'),
    createEx('encolhe-smith', 'Encolhimento no Smith', 'Trapézio', 'Smith', 'Iniciante'),
    createEx('encolhe-cabo', 'Encolhimento no Cabo', 'Trapézio', 'Cabo/Polia', 'Iniciante'),
    createEx('remada-alta-barra', 'Remada Alta com Barra', 'Trapézio', 'Barra', 'Intermediário'),
    createEx('remada-alta-cabo', 'Remada Alta no Cabo', 'Trapézio', 'Cabo/Polia', 'Intermediário'),
    createEx('shrug-atras', 'Encolhimento Atrás (Barra)', 'Trapézio', 'Barra', 'Avançado'),
    createEx('shrug-uni', 'Encolhimento Unilateral', 'Trapézio', 'Halteres', 'Intermediário'),
    createEx('face-pull-trap', 'Face Pull (Foco Superior)', 'Trapézio', 'Cabo/Polia', 'Intermediário'),
    createEx('high-pull', 'High Pull', 'Trapézio', 'Barra', 'Avançado'),
    createEx('rack-pull-trap', 'Rack Pull', 'Trapézio', 'Barra', 'Avançado'),
  ],
  lombar: [
    createEx('hiperextensao', 'Hiperextensão Lombar', 'Lombar', 'Máquina', 'Iniciante'),
    createEx('lev-terra', 'Levantamento Terra', 'Lombar', 'Barra', 'Avançado'),
    createEx('good-morning', 'Good Morning', 'Lombar', 'Barra', 'Avançado'),
    createEx('superman', 'Superman', 'Lombar', 'Peso do corpo', 'Iniciante'),
    createEx('bird-dog', 'Bird Dog', 'Lombar', 'Peso do corpo', 'Iniciante'),
    createEx('reverse-hyper', 'Reverse Hyper', 'Lombar', 'Máquina', 'Avançado'),
  ],
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