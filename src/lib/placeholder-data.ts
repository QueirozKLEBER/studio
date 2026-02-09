export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipmentType: 'Máquina' | 'Barra' | 'Halteres' | 'Livre' | 'Peso do corpo' | 'Cabo/Polia' | 'Kettlebell' | 'Elástico' | 'Smith' | 'Outros';
  movement: 'Empurrar' | 'Puxar' | 'Agachar' | 'Hinge' | 'Core' | 'Isolar';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  executionInstructions: string;
  description: string;
  tips: string[];
  commonErrors: string[];
  safetyTips: string[];
  variations: string[];
  tags: string[];
  gifPrincipalUrl: string;
  gifVariationUrl: string;
  gifErrorUrl: string;
  thumbnailUrl: string;
  promptGifExecucaoCorreta: string;
  promptGifVariacao: string;
  defaultTrainerNotes: string;
  sets: string;
  reps: string;
  rest: string;
  contraindications?: string;
};

export const muscleGroups = [
  { id: 'peito', name: 'Peito', icon: 'Chest' },
  { id: 'costas', name: 'Costas', icon: 'Back' },
  { id: 'ombros', name: 'Ombros', icon: 'Shoulders' },
  { id: 'biceps', name: 'Bíceps', icon: 'Biceps' },
  { id: 'triceps', name: 'Tríceps', icon: 'Triceps' },
  { id: 'pernas', name: 'Pernas', icon: 'Legs' },
  { id: 'panturrilha', name: 'Panturrilha', icon: 'Calves' },
  { id: 'trapezio', name: 'Trapézio', icon: 'Traps' },
  { id: 'abdomen', name: 'Abdômen', icon: 'Abs' },
  { id: 'antebreaco', name: 'Antebraço', icon: 'Forearms' },
  { id: 'lombar', name: 'Lombar', icon: 'LowerBack' },
];

const createEx = (
  id: string, 
  name: string, 
  muscle: string, 
  equip: Exercise['equipmentType'], 
  move: Exercise['movement'],
  diff: Exercise['difficulty'] = 'Iniciante', 
  sec: string[] = [],
  gifUrl: string = ''
): Exercise => {
  const basePrompt = `3D realistic anatomical human body performing ${name} with ${equip}. Clean studio background, neutral grey setting, bright clear lighting, fixed camera angle, 4 seconds duration, perfect seamless loop, full range of motion, professional fitness demonstration style, no text, no music.`;
  
  return {
    id,
    name,
    muscleGroup: muscle,
    secondaryMuscles: sec,
    equipmentType: equip,
    movement: move,
    difficulty: diff,
    executionInstructions: `1. Posicione-se corretamente no equipamento.\n2. Mantenha o core contraído e a coluna neutra.\n3. Execute o movimento de ${move.toLowerCase()} de forma controlada.\n4. Retorne à posição inicial mantendo a tensão muscular.`,
    description: `Exercício de elite focado no desenvolvimento de ${muscle}.`,
    tips: ['Mantenha a cadência controlada.', 'Foco na contração muscular.', 'Não use impulso.'],
    commonErrors: ['Carga excessiva.', 'Amplitude limitada.', 'Má postura.'],
    safetyTips: ['Mantenha as articulações seguras.', 'Verifique as travas.', 'Respire corretamente.'],
    variations: ['Unilateral', 'Com pausa', 'Explosivo'],
    tags: [muscle.toLowerCase(), move.toLowerCase(), equip.toLowerCase(), 'elite', 'mfit'],
    gifPrincipalUrl: gifUrl,
    gifVariationUrl: '',
    gifErrorUrl: '',
    thumbnailUrl: '',
    promptGifExecucaoCorreta: basePrompt,
    promptGifVariacao: `${basePrompt} Alternative side-view angle highlighting muscle contraction.`,
    defaultTrainerNotes: 'Priorize a técnica perfeita antes de progredir carga.',
    sets: '4',
    reps: '12',
    rest: '60'
  };
};

export const exercises: Record<string, Exercise[]> = {
  peito: [
    createEx('supino-reto-com-barra', 'Supino Reto com Barra', 'peito', 'Barra', 'Empurrar', 'Intermediário', ['Tríceps', 'Ombro'], 'https://res.cloudinary.com/dih8ff2oi/image/upload/v1770663853/supino-reto-com-barra_elkdmq.gif'),
    createEx('supino-inclinado-halter', 'Supino Inclinado com Halteres', 'peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('peck-deck', 'Crucifixo na Máquina (Peck Deck)', 'peito', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('crossover-polia-media', 'Crossover na Polia Média', 'peito', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('flexao-braço', 'Flexão de Braço', 'peito', 'Peso do corpo', 'Empurrar', 'Iniciante'),
    createEx('supino-maquina', 'Supino na Máquina Horizontal', 'peito', 'Máquina', 'Empurrar', 'Iniciante'),
    createEx('crucifixo-reto-halter', 'Crucifixo Reto com Halteres', 'peito', 'Halteres', 'Isolar', 'Intermediário'),
  ],
  costas: [
    createEx('puxada-frontal', 'Puxada Frontal Aberta', 'costas', 'Máquina', 'Puxar', 'Iniciante', ['Bíceps']),
    createEx('remada-baixa', 'Remada Baixa com Triângulo', 'costas', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('remada-curvada-barra', 'Remada Curvada com Barra', 'costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('pull-up', 'Barra Fixa (Pull Up)', 'costas', 'Peso do corpo', 'Puxar', 'Avançado'),
    createEx('remada-unilateral-halter', 'Remada Unilateral (Serrote)', 'costas', 'Halteres', 'Puxar', 'Iniciante'),
    createEx('lat-pulldown-frente', 'Puxada na Frente (Lat Pulldown)', 'costas', 'Máquina', 'Puxar', 'Iniciante'),
  ],
  trapezio: [
    createEx('encolhimento-halter', 'Encolhimento com Halteres', 'trapezio', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('encolhimento-barra', 'Encolhimento com Barra', 'trapezio', 'Barra', 'Isolar', 'Iniciante'),
    createEx('encolhimento-smith', 'Encolhimento no Smith', 'trapezio', 'Smith', 'Isolar', 'Iniciante'),
    createEx('remada-alta-barra', 'Remada Alta com Barra', 'trapezio', 'Barra', 'Puxar', 'Intermediário'),
    createEx('face-pull', 'Face Pull com Corda', 'trapezio', 'Cabo/Polia', 'Puxar', 'Intermediário'),
    createEx('high-pull-barra', 'High Pull com Barra', 'trapezio', 'Barra', 'Puxar', 'Avançado'),
    createEx('clean-shrug', 'Clean Shrug', 'trapezio', 'Barra', 'Puxar', 'Avançado'),
    createEx('encolhimento-por-tras', 'Encolhimento por trás com Barra', 'trapezio', 'Barra', 'Isolar', 'Intermediário'),
  ],
  lombar: [
    createEx('hiperextensao-lombar', 'Hiperextensão Lombar 45°', 'lombar', 'Máquina', 'Core', 'Iniciante'),
    createEx('levantamento-terra', 'Levantamento Terra Convencional', 'lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('good-morning', 'Good Morning com Barra', 'lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('superman-solo', 'Superman no Solo', 'lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('stiff-barra', 'Stiff com Barra', 'lombar', 'Barra', 'Hinge', 'Intermediário'),
    createEx('ponte-gluteo', 'Ponte para Glúteo e Lombar', 'lombar', 'Peso do corpo', 'Core', 'Iniciante'),
  ],
  pernas: [
    createEx('agachamento-livre', 'Agachamento Livre com Barra', 'pernas', 'Barra', 'Agachar', 'Avançado'),
    createEx('leg-press-45', 'Leg Press 45°', 'pernas', 'Máquina', 'Empurrar', 'Intermediário'),
    createEx('cadeira-extensora', 'Cadeira Extensora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('mesa-flexora', 'Mesa Flexora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('hack-squat', 'Hack Squat', 'pernas', 'Máquina', 'Agachar', 'Intermediário'),
    createEx('afundo-halter', 'Afundo com Halteres', 'pernas', 'Halteres', 'Agachar', 'Intermediário'),
  ],
  abdomen: [
    createEx('abdominal-supra', 'Abdominal Supra (Crunch)', 'abdomen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('abdominal-infra', 'Abdominal Infra', 'abdomen', 'Peso do corpo', 'Core', 'Intermediário'),
    createEx('prancha-abdominal', 'Prancha Isométrica', 'abdomen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('russian-twist', 'Russian Twist', 'abdomen', 'Livre', 'Core', 'Intermediário'),
  ],
  antebreaco: [
    createEx('rosca-punho-barra', 'Rosca Punho com Barra', 'antebreaco', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-inversa-barra', 'Rosca Inversa com Barra', 'antebreaco', 'Barra', 'Isolar', 'Intermediário'),
    createEx('rosca-martelo-halter', 'Rosca Martelo com Halteres', 'antebreaco', 'Halteres', 'Isolar', 'Iniciante'),
  ]
};