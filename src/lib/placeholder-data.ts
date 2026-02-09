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
  sec: string[] = []
): Exercise => {
  const basePrompt = `3D realistic anatomical human body performing ${name} with ${equip}. Clean studio, neutral background, bright lighting, fixed camera, 4 seconds, perfect loop, full range of motion, professional fitness style.`;
  
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
    gifPrincipalUrl: '',
    gifVariationUrl: '',
    gifErrorUrl: '',
    thumbnailUrl: '',
    promptGifExecucaoCorreta: basePrompt,
    promptGifVariacao: `${basePrompt} Alternative angle from the side, highlighting muscle activation.`,
    defaultTrainerNotes: 'Priorize a técnica perfeita antes de progredir carga.',
    sets: '4',
    reps: '12',
    rest: '60'
  };
};

export const exercises: Record<string, Exercise[]> = {
  peito: [
    createEx('supino-reto-barra', 'Supino Reto com Barra', 'peito', 'Barra', 'Empurrar', 'Intermediário', ['Tríceps', 'Ombro']),
    createEx('supino-inclinado-halter', 'Supino Inclinado com Halteres', 'peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('peck-deck', 'Crucifixo na Máquina (Peck Deck)', 'peito', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('crossover-polia-media', 'Crossover na Polia Média', 'peito', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('flexao-braço', 'Flexão de Braço', 'peito', 'Peso do corpo', 'Empurrar', 'Iniciante'),
    createEx('supino-maquina', 'Supino na Máquina Horizontal', 'peito', 'Máquina', 'Empurrar', 'Iniciante'),
    createEx('crucifixo-reto-halter', 'Crucifixo Reto com Halteres', 'peito', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('supino-smith', 'Supino Reto no Smith', 'peito', 'Smith', 'Empurrar', 'Intermediário'),
    createEx('chest-press-inclinado', 'Chest Press Inclinado Máquina', 'peito', 'Máquina', 'Empurrar', 'Iniciante'),
  ],
  costas: [
    createEx('puxada-frontal', 'Puxada Frontal Aberta', 'costas', 'Máquina', 'Puxar', 'Iniciante', ['Bíceps']),
    createEx('remada-baixa', 'Remada Baixa com Triângulo', 'costas', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('remada-curvada-barra', 'Remada Curvada com Barra', 'costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('pull-up', 'Barra Fixa (Pull Up)', 'costas', 'Peso do corpo', 'Puxar', 'Avançado'),
    createEx('remada-unilateral-halter', 'Remada Unilateral (Serrote)', 'costas', 'Halteres', 'Puxar', 'Iniciante'),
    createEx('pulldown-corda', 'Pulldown com Corda', 'costas', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('remada-cavalo', 'Remada Cavalo (T-Bar)', 'costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('puxada-supinada', 'Puxada Frontal com Pegada Supinada', 'costas', 'Máquina', 'Puxar', 'Iniciante'),
  ],
  trapezio: [
    createEx('encolhimento-halter', 'Encolhimento com Halteres', 'trapezio', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('encolhimento-barra', 'Encolhimento com Barra', 'trapezio', 'Barra', 'Isolar', 'Iniciante'),
    createEx('encolhimento-smith', 'Encolhimento no Smith', 'trapezio', 'Smith', 'Isolar', 'Iniciante'),
    createEx('remada-alta-barra', 'Remada Alta com Barra', 'trapezio', 'Barra', 'Puxar', 'Intermediário'),
    createEx('remada-alta-polia', 'Remada Alta na Polia', 'trapezio', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('face-pull', 'Face Pull com Corda', 'trapezio', 'Cabo/Polia', 'Puxar', 'Intermediário'),
    createEx('high-pull-barra', 'High Pull com Barra (Explosivo)', 'trapezio', 'Barra', 'Puxar', 'Avançado'),
    createEx('encolhimento-por-tras', 'Encolhimento por Trás com Barra', 'trapezio', 'Barra', 'Isolar', 'Avançado'),
    createEx('clean-shrug', 'Clean Shrug (Variação de LPO)', 'trapezio', 'Barra', 'Puxar', 'Avançado'),
    createEx('encolhimento-maquina-ombro', 'Encolhimento na Máquina de Ombro', 'trapezio', 'Máquina', 'Isolar', 'Iniciante'),
  ],
  lombar: [
    createEx('hiperextensao-lombar', 'Hiperextensão Lombar 45°', 'lombar', 'Máquina', 'Core', 'Iniciante'),
    createEx('levantamento-terra', 'Levantamento Terra Convencional', 'lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('good-morning', 'Good Morning com Barra', 'lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('superman-solo', 'Superman (Extensão de Tronco no Solo)', 'lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('stiff-barra', 'Stiff com Barra', 'lombar', 'Barra', 'Hinge', 'Intermediário'),
    createEx('terra-sumo', 'Levantamento Terra Sumô', 'lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('ponte-gluteo-lombar', 'Ponte para Glúteos e Lombar', 'lombar', 'Peso do corpo', 'Core', 'Iniciante'),
  ],
  pernas: [
    createEx('agachamento-livre', 'Agachamento Livre com Barra', 'pernas', 'Barra', 'Agachar', 'Avançado'),
    createEx('leg-press-45', 'Leg Press 45°', 'pernas', 'Máquina', 'Empurrar', 'Intermediário'),
    createEx('cadeira-extensora', 'Cadeira Extensora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('mesa-flexora', 'Mesa Flexora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('hack-squat', 'Hack Squat na Máquina', 'pernas', 'Máquina', 'Agachar', 'Intermediário'),
    createEx('afundo-halter', 'Afundo com Halteres', 'pernas', 'Halteres', 'Agachar', 'Iniciante'),
    createEx('agachamento-bulgaro', 'Agachamento Búlgaro', 'pernas', 'Halteres', 'Agachar', 'Avançado'),
    createEx('cadeira-abdutora', 'Cadeira Abdutora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('cadeira-adutora', 'Cadeira Adutora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
  ],
  panturrilha: [
    createEx('panturrilha-em-pe', 'Panturrilha em Pé na Máquina', 'panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-sentado', 'Panturrilha Sentado (Gêmeos)', 'panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-leg-press', 'Panturrilha no Leg Press', 'panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-burrinho', 'Panturrilha no Smith (Burrinho)', 'panturrilha', 'Smith', 'Isolar', 'Intermediário'),
  ],
  biceps: [
    createEx('rosca-direta-barra', 'Rosca Direta com Barra EZ', 'biceps', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-alternada', 'Rosca Alternada com Halteres', 'biceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-martelo', 'Rosca Martelo com Halteres', 'biceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-scott', 'Rosca Scott com Barra', 'biceps', 'Barra', 'Isolar', 'Intermediário'),
    createEx('rosca-concentrada', 'Rosca Concentrada', 'biceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-polia-baixa', 'Rosca Direta na Polia Baixa', 'biceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
  ],
  triceps: [
    createEx('triceps-pulley', 'Tríceps Pulley (Barra Reta)', 'triceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-corda', 'Tríceps Corda na Polia', 'triceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-testa', 'Tríceps Testa com Barra EZ', 'triceps', 'Barra', 'Isolar', 'Intermediário'),
    createEx('mergulho-paralelas', 'Mergulho em Paralelas', 'triceps', 'Peso do corpo', 'Empurrar', 'Avançado'),
    createEx('triceps-frances-halter', 'Tríceps Francês com Halter', 'triceps', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('triceps-coice', 'Tríceps Coice na Polia', 'triceps', 'Cabo/Polia', 'Isolar', 'Intermediário'),
  ],
  ombros: [
    createEx('desenvolvimento-halter', 'Desenvolvimento com Halteres', 'ombros', 'Halteres', 'Empurrar', 'Iniciante'),
    createEx('elevacao-lateral', 'Elevação Lateral com Halteres', 'ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('desenvolvimento-militar', 'Desenvolvimento Militar (Barra)', 'ombros', 'Barra', 'Empurrar', 'Avançado'),
    createEx('elevacao-frontal', 'Elevação Frontal com Halteres', 'ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('crucifixo-inverso', 'Crucifixo Inverso com Halteres', 'ombros', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('elevacao-lateral-polia', 'Elevação Lateral na Polia', 'ombros', 'Cabo/Polia', 'Isolar', 'Intermediário'),
  ],
  antebreaco: [
    createEx('rosca-punho-barra', 'Rosca Punho com Barra', 'antebreaco', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-punho-inversa', 'Rosca Punho Inversa', 'antebreaco', 'Barra', 'Isolar', 'Iniciante'),
    createEx('farmer-walk', 'Farmer Walk (Caminhada do Fazendeiro)', 'antebreaco', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('rosca-inversa-barra', 'Rosca Inversa com Barra EZ', 'antebreaco', 'Barra', 'Isolar', 'Intermediário'),
  ],
  abdomen: [
    createEx('abdominal-supra', 'Abdominal Supra (Crunch)', 'abdomen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('abdominal-infra', 'Abdominal Infra (Elevação de Pernas)', 'abdomen', 'Peso do corpo', 'Core', 'Intermediário'),
    createEx('prancha-abdominal', 'Prancha Abdominal Isométrica', 'abdomen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('abdominal-roda', 'Abdominal com Roda', 'abdomen', 'Livre', 'Core', 'Avançado'),
    createEx('abdominal-obliquo', 'Abdominal Oblíquo Solo', 'abdomen', 'Peso do corpo', 'Core', 'Iniciante'),
  ]
};

export const nutritionTips = {
  emagrecimento: {
    title: 'Estratégias para Emagrecimento',
    tips: [
      { title: 'Déficit Calórico', content: 'Consuma menos calorias do que gasta, priorizando densidade nutricional.' },
      { title: 'Proteína e Saciedade', content: 'Aumente o consumo proteico para preservar massa magra e reduzir a fome.' },
      { title: 'Fibras Alimentares', content: 'Vegetais e grãos integrais ajudam no controle do apetite.' }
    ]
  },
  hipertrofia: {
    title: 'Pilares da Hipertrofia',
    tips: [
      { title: 'Superávit Calórico', content: 'Consuma energia extra para suportar o crescimento muscular.' },
      { title: 'Timing de Nutrientes', content: 'Carboidratos pré e pós treino maximizam a performance.' },
      { title: 'Descanso de Qualidade', content: 'O músculo cresce durante o sono reparador.' }
    ]
  },
  energia: {
    title: 'Máxima Performance',
    tips: [
      { title: 'Hidratação', content: 'A desidratação prejudica a força e a cognição no treino.' },
      { title: 'Creatina', content: 'Auxilia na regeneração de ATP para exercícios de alta intensidade.' }
    ]
  },
  'pre-treino': {
    title: 'Combustível Pré-Treino',
    tips: [
      { title: 'Carboidratos Complexos', content: 'Batata doce ou aveia 1-2h antes do treino.' },
      { title: 'Foco na Digestão', content: 'Evite gorduras pesadas logo antes de treinar.' }
    ]
  },
  'pos-treino': {
    title: 'Recuperação Pós-Treino',
    tips: [
      { title: 'Reposição de Glicogênio', content: 'Carboidratos rápidos para recuperar as reservas de energia.' },
      { title: 'Aminoácidos', content: 'Proteína de rápida absorção para iniciar o reparo muscular.' }
    ]
  }
};
