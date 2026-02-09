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

const createEx = (id: string, name: string, muscle: string, equip: any, diff: any = 'Iniciante'): Exercise => ({
  id,
  name,
  muscleGroup: muscle,
  secondaryMuscles: [],
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
    createEx('supino-reto-barra', 'Supino Reto com Barra', 'Peito', 'Barra', 'Intermediário'),
    createEx('supino-reto-halter', 'Supino Reto com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    createEx('supino-inc-barra', 'Supino Inclinado com Barra', 'Peito', 'Barra', 'Intermediário'),
    createEx('supino-inc-halter', 'Supino Inclinado com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    createEx('supino-dec-barra', 'Supino Declinado com Barra', 'Peito', 'Barra', 'Avançado'),
    createEx('supino-dec-halter', 'Supino Declinado com Halteres', 'Peito', 'Halteres', 'Avançado'),
    createEx('supino-maq', 'Supino na Máquina', 'Peito', 'Máquina', 'Iniciante'),
    createEx('crucifixo-reto', 'Crucifixo Reto com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    createEx('crucifixo-inc', 'Crucifixo Inclinado', 'Peito', 'Halteres', 'Intermediário'),
    createEx('crucifixo-dec', 'Crucifixo Declinado', 'Peito', 'Halteres', 'Avançado'),
    createEx('peck-deck', 'Crucifixo na Máquina (Peck Deck)', 'Peito', 'Máquina', 'Iniciante'),
    createEx('cross-alto', 'Crossover Alto', 'Peito', 'Cabo/Polia', 'Intermediário'),
    createEx('cross-medio', 'Crossover Médio', 'Peito', 'Cabo/Polia', 'Intermediário'),
    createEx('cross-baixo', 'Crossover Baixo', 'Peito', 'Cabo/Polia', 'Intermediário'),
    createEx('flexao-trad', 'Flexão de Braço Tradicional', 'Peito', 'Peso do corpo', 'Iniciante'),
    createEx('flexao-inc', 'Flexão Inclinada', 'Peito', 'Peso do corpo', 'Iniciante'),
    createEx('flexao-dec', 'Flexão Declinada', 'Peito', 'Peso do corpo', 'Intermediário'),
    createEx('flexao-fechada', 'Flexão Fechada', 'Peito', 'Peso do corpo', 'Intermediário'),
    createEx('pullover-halter', 'Pullover com Halter', 'Peito', 'Halteres', 'Intermediário'),
    createEx('pullover-barra', 'Pullover com Barra', 'Peito', 'Barra', 'Avançado'),
    createEx('chest-press', 'Chest Press Máquina', 'Peito', 'Máquina', 'Iniciante'),
    createEx('supino-smith', 'Supino Guiado (Smith)', 'Peito', 'Smith', 'Iniciante'),
    createEx('cross-unilateral', 'Crossover Unilateral', 'Peito', 'Cabo/Polia', 'Avançado'),
    createEx('press-elastico', 'Press com Elástico', 'Peito', 'Elástico', 'Iniciante'),
    createEx('flexao-argolas', 'Flexão em Argolas', 'Peito', 'Livre', 'Avançado'),
    createEx('supino-neutro', 'Supino com Pegada Neutra', 'Peito', 'Halteres', 'Intermediário'),
    createEx('fly-cabo-baixo', 'Fly no Cabo Baixo', 'Peito', 'Cabo/Polia', 'Intermediário'),
    createEx('fly-cabo-alto', 'Fly no Cabo Alto', 'Peito', 'Cabo/Polia', 'Intermediário'),
  ],
  costas: [
    createEx('barra-fixa-pro', 'Barra Fixa Pronada', 'Costas', 'Peso do corpo', 'Avançado'),
    createEx('barra-fixa-sup', 'Barra Fixa Supinada', 'Costas', 'Peso do corpo', 'Intermediário'),
    createEx('barra-fixa-neu', 'Barra Fixa Neutra', 'Costas', 'Peso do corpo', 'Intermediário'),
    createEx('puxada-frontal-ab', 'Puxada Frontal Aberta', 'Costas', 'Máquina', 'Iniciante'),
    createEx('puxada-frontal-fe', 'Puxada Frontal Fechada', 'Costas', 'Máquina', 'Iniciante'),
    createEx('puxada-triangulo', 'Puxada na Frente com Triângulo', 'Costas', 'Máquina', 'Iniciante'),
    createEx('remada-curvada', 'Remada Curvada com Barra', 'Costas', 'Barra', 'Intermediário'),
    createEx('remada-unilateral', 'Remada Unilateral com Halter', 'Costas', 'Halteres', 'Iniciante'),
    createEx('remada-baixa', 'Remada Baixa no Cabo', 'Costas', 'Cabo/Polia', 'Iniciante'),
    createEx('remada-alta-cabo', 'Remada Alta no Cabo', 'Costas', 'Cabo/Polia', 'Iniciante'),
    createEx('remada-cavalinho', 'Remada Cavalinho (T-bar)', 'Costas', 'Barra', 'Intermediário'),
    createEx('remada-maq', 'Remada na Máquina', 'Costas', 'Máquina', 'Iniciante'),
    createEx('pulldown-maq', 'Pulldown na Máquina', 'Costas', 'Máquina', 'Intermediário'),
    createEx('pullover-cabo', 'Pullover no Cabo', 'Costas', 'Cabo/Polia', 'Intermediário'),
    createEx('terra', 'Levantamento Terra', 'Costas', 'Barra', 'Avançado'),
    createEx('terra-romeno', 'Terra Romeno', 'Costas', 'Barra', 'Intermediário'),
    createEx('hiperextensao', 'Hiperextensão Lombar', 'Costas', 'Peso do corpo', 'Iniciante'),
    createEx('face-pull', 'Face Pull', 'Costas', 'Cabo/Polia', 'Iniciante'),
    createEx('barra-aus', 'Barra Australiana', 'Costas', 'Peso do corpo', 'Iniciante'),
    createEx('rack-pull', 'Rack Pull', 'Costas', 'Barra', 'Avançado'),
  ],
  pernas: [
    createEx('agachamento-livre', 'Agachamento Livre', 'Pernas', 'Barra', 'Avançado'),
    createEx('agachamento-front', 'Agachamento Frontal', 'Pernas', 'Barra', 'Avançado'),
    createEx('agachamento-sumo', 'Agachamento Sumô', 'Pernas', 'Halteres', 'Intermediário'),
    createEx('agachamento-bulg', 'Agachamento Búlgaro', 'Pernas', 'Halteres', 'Avançado'),
    createEx('leg-45', 'Leg Press 45°', 'Pernas', 'Máquina', 'Intermediário'),
    createEx('extensora', 'Cadeira Extensora', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('hack-maq', 'Hack Machine', 'Pernas', 'Máquina', 'Intermediário'),
    createEx('passada', 'Passada', 'Pernas', 'Peso do corpo', 'Iniciante'),
    createEx('afundo', 'Afundo', 'Pernas', 'Halteres', 'Iniciante'),
    createEx('stiff', 'Stiff', 'Pernas', 'Barra', 'Intermediário'),
    createEx('flexora-mesa', 'Mesa Flexora', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('flexora-cadeira', 'Cadeira Flexora', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('hip-thrust', 'Hip Thrust (Elevação Pélvica)', 'Pernas', 'Barra', 'Intermediário'),
    createEx('abdutora', 'Cadeira Abdutora', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('adutora', 'Cadeira Adutora', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('pistol', 'Pistol Squat', 'Pernas', 'Peso do corpo', 'Avançado'),
  ],
  ombros: [
    createEx('desenv-barra', 'Desenvolvimento com Barra', 'Ombros', 'Barra', 'Intermediário'),
    createEx('desenv-halter', 'Desenvolvimento com Halteres', 'Ombros', 'Halteres', 'Intermediário'),
    createEx('arnold-press', 'Arnold Press', 'Ombros', 'Halteres', 'Avançado'),
    createEx('eleva-lateral', 'Elevação Lateral com Halteres', 'Ombros', 'Halteres', 'Iniciante'),
    createEx('eleva-lateral-cabo', 'Elevação Lateral no Cabo', 'Ombros', 'Cabo/Polia', 'Intermediário'),
    createEx('eleva-frontal-barra', 'Elevação Frontal com Barra', 'Ombros', 'Barra', 'Iniciante'),
    createEx('eleva-frontal-halter', 'Elevação Frontal com Halteres', 'Ombros', 'Halteres', 'Iniciante'),
    createEx('press-militar', 'Press Militar', 'Ombros', 'Barra', 'Avançado'),
    createEx('y-raise', 'Y-Raise', 'Ombros', 'Halteres', 'Intermediário'),
    createEx('eleva-posterior', 'Elevação Posterior (Peck Deck)', 'Ombros', 'Máquina', 'Iniciante'),
  ],
  biceps: [
    createEx('rosca-direta-barra', 'Rosca Direta com Barra', 'Bíceps', 'Barra', 'Iniciante'),
    createEx('rosca-direta-halter', 'Rosca Direta com Halteres', 'Bíceps', 'Halteres', 'Iniciante'),
    createEx('rosca-alt', 'Rosca Alternada', 'Bíceps', 'Halteres', 'Iniciante'),
    createEx('rosca-martelo', 'Rosca Martelo', 'Bíceps', 'Halteres', 'Iniciante'),
    createEx('rosca-scott', 'Rosca Scott', 'Bíceps', 'Barra', 'Intermediário'),
    createEx('rosca-conc', 'Rosca Concentrada', 'Bíceps', 'Halteres', 'Iniciante'),
    createEx('rosca-cabo', 'Rosca no Cabo', 'Bíceps', 'Cabo/Polia', 'Iniciante'),
    createEx('rosca-21', 'Rosca 21', 'Bíceps', 'Barra', 'Intermediário'),
    createEx('rosca-inv', 'Rosca Inversa', 'Bíceps', 'Barra', 'Iniciante'),
    createEx('rosca-spider', 'Rosca Spider', 'Bíceps', 'Barra', 'Avançado'),
  ],
  triceps: [
    createEx('triceps-testa', 'Tríceps Testa com Barra', 'Tríceps', 'Barra', 'Intermediário'),
    createEx('triceps-corda', 'Tríceps Corda', 'Tríceps', 'Cabo/Polia', 'Iniciante'),
    createEx('triceps-pulley', 'Tríceps no Pulley', 'Tríceps', 'Cabo/Polia', 'Iniciante'),
    createEx('triceps-frances', 'Tríceps Francês', 'Tríceps', 'Halteres', 'Intermediário'),
    createEx('mergulho-paralelas', 'Mergulho em Paralelas', 'Tríceps', 'Peso do corpo', 'Avançado'),
    createEx('mergulho-banco', 'Mergulho em Banco', 'Tríceps', 'Peso do corpo', 'Iniciante'),
    createEx('supino-fechado', 'Supino Fechado', 'Tríceps', 'Barra', 'Avançado'),
    createEx('triceps-coice', 'Tríceps Coice', 'Tríceps', 'Halteres', 'Iniciante'),
  ],
  panturrilha: [
    createEx('pantu-pe', 'Elevação em Pé', 'Panturrilha', 'Máquina', 'Iniciante'),
    createEx('pantu-sentado', 'Elevação Sentado', 'Panturrilha', 'Máquina', 'Iniciante'),
    createEx('pantu-leg', 'Panturrilha no Leg Press', 'Panturrilha', 'Máquina', 'Intermediário'),
    createEx('pantu-unilateral', 'Panturrilha Unilateral', 'Panturrilha', 'Peso do corpo', 'Iniciante'),
  ],
  abdomen: [
    createEx('crunch', 'Abdominal Crunch', 'Abdômen', 'Peso do corpo', 'Iniciante'),
    createEx('abd-maq', 'Abdominal Máquina', 'Abdômen', 'Máquina', 'Iniciante'),
    createEx('abd-cabo', 'Abdominal no Cabo', 'Abdômen', 'Cabo/Polia', 'Intermediário'),
    createEx('eleva-perna-barra', 'Elevação de Pernas na Barra', 'Abdômen', 'Peso do corpo', 'Avançado'),
    createEx('prancha', 'Prancha Isométrica', 'Abdômen', 'Peso do corpo', 'Iniciante'),
    createEx('russian-twist', 'Russian Twist', 'Abdômen', 'Peso do corpo', 'Iniciante'),
    createEx('mountain-climber', 'Mountain Climber', 'Abdômen', 'Peso do corpo', 'Intermediário'),
  ],
  antebreaco: [
    createEx('rosca-inv-ante', 'Rosca Inversa', 'Antebraço', 'Barra', 'Iniciante'),
    createEx('rosca-punho', 'Rosca Punho', 'Antebraço', 'Barra', 'Iniciante'),
    createEx('farmers-walk', 'Farmer’s Walk', 'Antebraço', 'Halteres', 'Intermediário'),
    createEx('wrist-roller', 'Wrist Roller', 'Antebraço', 'Livre', 'Iniciante'),
  ],
  trapezio: [
    createEx('encolhe-barra', 'Encolhimento com Barra', 'Trapézio', 'Barra', 'Iniciante'),
    createEx('encolhe-halter', 'Encolhimento com Halteres', 'Trapézio', 'Halteres', 'Iniciante'),
    createEx('remada-alta', 'Remada Alta', 'Trapézio', 'Barra', 'Intermediário'),
  ],
  lombar: [
    createEx('hiperext-lombar', 'Hiperextensão', 'Lombar', 'Máquina', 'Iniciante'),
    createEx('superman', 'Superman', 'Lombar', 'Peso do corpo', 'Iniciante'),
    createEx('bird-dog', 'Bird Dog', 'Lombar', 'Peso do corpo', 'Iniciante'),
    createEx('reverse-hyper', 'Reverse Hyper', 'Lombar', 'Máquina', 'Avançado'),
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
