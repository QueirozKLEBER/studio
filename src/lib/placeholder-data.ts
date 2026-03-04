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

const TEST_GIF_URL = "https://res.cloudinary.com/dih8ff2oi/image/upload/v1770663853/supino-reto-com-barra_elkdmq.gif";

const createEx = (
  id: string, 
  name: string, 
  muscle: string, 
  equip: Exercise['equipmentType'], 
  move: Exercise['movement'],
  diff: Exercise['difficulty'] = 'Iniciante', 
  sec: string[] = []
): Exercise => {
  const basePrompt = `3D realistic anatomical human body performing ${name} with ${equip}.`;
  
  return {
    id,
    name,
    muscleGroup: muscle,
    secondaryMuscles: sec,
    equipmentType: equip,
    movement: move,
    difficulty: diff,
    executionInstructions: `1. Posicione-se corretamente.\n2. Execute o movimento de ${move.toLowerCase()} de forma controlada.\n3. Mantenha a postura.`,
    description: `Exercício de elite focado no desenvolvimento de ${muscle}.`,
    tips: ['Mantenha a cadência controlada.', 'Foco na contração muscular.'],
    commonErrors: ['Carga excessiva.', 'Má postura.'],
    safetyTips: ['Verifique as travas.', 'Respire corretamente.'],
    variations: ['Unilateral', 'Com pausa'],
    tags: [muscle.toLowerCase(), move.toLowerCase(), equip.toLowerCase()],
    gifPrincipalUrl: TEST_GIF_URL,
    gifVariationUrl: '',
    gifErrorUrl: '',
    thumbnailUrl: '',
    promptGifExecucaoCorreta: basePrompt,
    promptGifVariacao: basePrompt,
    defaultTrainerNotes: 'Priorize a técnica perfeita.',
    sets: '4',
    reps: '12',
    rest: '60'
  };
};

export const exercises: Record<string, Exercise[]> = {
  peito: [
    createEx('supino-reto-com-barra', 'Supino Reto com Barra', 'peito', 'Barra', 'Empurrar', 'Intermediário'),
    createEx('supino-inclinado-halter', 'Supino Inclinado com Halteres', 'peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('peck-deck', 'Peck Deck', 'peito', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('crossover-polia-media', 'Crossover Polia Média', 'peito', 'Cabo/Polia', 'Isolar', 'Intermediário'),
  ],
  costas: [
    createEx('puxada-frontal', 'Puxada Frontal Aberta', 'costas', 'Máquina', 'Puxar', 'Iniciante'),
    createEx('remada-baixa', 'Remada Baixa', 'costas', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('remada-curvada-barra', 'Remada Curvada com Barra', 'costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('pull-up', 'Barra Fixa', 'costas', 'Peso do corpo', 'Puxar', 'Avançado'),
  ],
  ombros: [
    createEx('desenvolvimento-halter', 'Desenvolvimento com Halteres', 'ombros', 'Halteres', 'Empurrar', 'Iniciante'),
    createEx('elevacao-lateral', 'Elevação Lateral', 'ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('elevacao-frontal', 'Elevação Frontal', 'ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('desenvolvimento-militar', 'Desenvolvimento Militar', 'ombros', 'Barra', 'Empurrar', 'Avançado'),
  ],
  biceps: [
    createEx('rosca-direta-barra', 'Rosca Direta com Barra', 'biceps', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-alternada', 'Rosca Alternada', 'biceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-scott', 'Rosca Scott', 'biceps', 'Máquina', 'Isolar', 'Intermediário'),
    createEx('rosca-martelo', 'Rosca Martelo', 'biceps', 'Halteres', 'Isolar', 'Iniciante'),
  ],
  triceps: [
    createEx('triceps-pulley', 'Tríceps Pulley', 'triceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-testa', 'Tríceps Testa', 'triceps', 'Barra', 'Isolar', 'Intermediário'),
    createEx('triceps-banco', 'Mergulho no Banco', 'triceps', 'Peso do corpo', 'Empurrar', 'Iniciante'),
    createEx('triceps-corda', 'Tríceps Corda', 'triceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
  ],
  pernas: [
    createEx('agachamento-livre-com-barra', 'Agachamento Livre com Barra', 'pernas', 'Barra', 'Agachar', 'Avançado'),
    createEx('leg-press-45', 'Leg Press 45°', 'pernas', 'Máquina', 'Empurrar', 'Intermediário'),
    createEx('cadeira-extensora', 'Cadeira Extensora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('mesa-flexora', 'Mesa Flexora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
  ],
  panturrilha: [
    createEx('panturrilha-em-pe', 'Panturrilha em Pé', 'panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-sentado', 'Panturrilha Sentado', 'panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
  ],
  trapezio: [
    createEx('encolhimento-halter', 'Encolhimento com Halteres', 'trapezio', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('face-pull', 'Face Pull', 'trapezio', 'Cabo/Polia', 'Puxar', 'Intermediário'),
  ],
  abdomen: [
    createEx('abdominal-supra', 'Abdominal Supra', 'abdomen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('prancha-isometrica', 'Prancha Isométrica', 'abdomen', 'Peso do corpo', 'Core', 'Iniciante'),
  ],
  antebreaco: [
    createEx('rosca-punho', 'Rosca Punho', 'antebreaco', 'Barra', 'Isolar', 'Iniciante'),
  ],
  lombar: [
    createEx('levantamento-terra', 'Levantamento Terra', 'lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('hiperextensao-lombar', 'Hiperextensão Lombar', 'lombar', 'Máquina', 'Core', 'Iniciante'),
  ]
};