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
): Exercise => ({
  id,
  name,
  muscleGroup: muscle,
  secondaryMuscles: sec,
  equipmentType: equip,
  movement: move,
  difficulty: diff,
  executionInstructions: `1. Posicione-se corretamente no equipamento.\n2. Mantenha o core contraído e a coluna neutra.\n3. Execute o movimento de ${move.toLowerCase()} de forma controlada.\n4. Retorne à posição inicial mantendo a tensão muscular.`,
  description: `Exercício focado no desenvolvimento de ${muscle}.`,
  tips: ['Mantenha a cadência controlada.', 'Foco na contração muscular.', 'Não use impulso.'],
  commonErrors: ['Carga excessiva.', 'Amplitude limitada.', 'Má postura.'],
  safetyTips: ['Mantenha as articulações seguras.', 'Verifique as travas.', 'Respire corretamente.'],
  variations: ['Unilateral', 'Com pausa', 'Explosivo'],
  tags: [muscle.toLowerCase(), move.toLowerCase(), equip.toLowerCase()],
  gifPrincipalUrl: '',
  gifVariationUrl: '',
  gifErrorUrl: '',
  thumbnailUrl: '',
  defaultTrainerNotes: 'Priorize a técnica perfeita.',
  sets: '4',
  reps: '12',
  rest: '60'
});

export const exercises: Record<string, Exercise[]> = {
  peito: [
    createEx('supino-reto-barra', 'Supino Reto com Barra', 'peito', 'Barra', 'Empurrar', 'Intermediário', ['Tríceps', 'Ombro']),
    createEx('supino-inclinado-halter', 'Supino Inclinado com Halteres', 'peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('peck-deck', 'Crucifixo na Máquina (Peck Deck)', 'peito', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('crossover-polia-media', 'Crossover na Polia Média', 'peito', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('flexao-braço', 'Flexão de Braço', 'peito', 'Peso do corpo', 'Empurrar', 'Iniciante'),
    createEx('supino-declinado-barra', 'Supino Declinado com Barra', 'peito', 'Barra', 'Empurrar', 'Avançado'),
    createEx('crucifixo-reto-halter', 'Crucifixo Reto com Halteres', 'peito', 'Halteres', 'Isolar', 'Iniciante'),
  ],
  costas: [
    createEx('puxada-frontal', 'Puxada Frontal Aberta', 'costas', 'Máquina', 'Puxar', 'Iniciante', ['Bíceps']),
    createEx('remada-baixa', 'Remada Baixa com Triângulo', 'costas', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('remada-curvada-barra', 'Remada Curvada com Barra', 'costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('pull-up', 'Barra Fixa (Pull Up)', 'costas', 'Peso do corpo', 'Puxar', 'Avançado'),
    createEx('remada-unilateral-halter', 'Remada Unilateral (Serrote)', 'costas', 'Halteres', 'Puxar', 'Iniciante'),
    createEx('pulldown-corda', 'Pulldown com Corda', 'costas', 'Cabo/Polia', 'Isolar', 'Intermediário'),
  ],
  ombros: [
    createEx('desenvolvimento-halter', 'Desenvolvimento com Halteres', 'ombros', 'Halteres', 'Empurrar', 'Iniciante'),
    createEx('elevacao-lateral-halter', 'Elevação Lateral com Halteres', 'ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('desenvolvimento-militar', 'Desenvolvimento Militar', 'ombros', 'Barra', 'Empurrar', 'Avançado'),
    createEx('elevacao-frontal-halter', 'Elevação Frontal', 'ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('crucifixo-inverso-maquina', 'Crucifixo Inverso na Máquina', 'ombros', 'Máquina', 'Isolar', 'Iniciante'),
  ],
  trapezio: [
    createEx('encolhimento-halter', 'Encolhimento com Halteres', 'trapezio', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('encolhimento-barra', 'Encolhimento com Barra', 'trapezio', 'Barra', 'Isolar', 'Iniciante'),
    createEx('encolhimento-smith', 'Encolhimento no Smith', 'trapezio', 'Smith', 'Isolar', 'Iniciante'),
    createEx('high-pull-barra', 'High Pull com Barra', 'trapezio', 'Barra', 'Puxar', 'Avançado'),
    createEx('remada-alta-cabo', 'Remada Alta no Cabo', 'trapezio', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('encolhimento-por-tras', 'Encolhimento por trás com Barra', 'trapezio', 'Barra', 'Isolar', 'Avançado'),
    createEx('face-pull', 'Face Pull', 'trapezio', 'Cabo/Polia', 'Puxar', 'Intermediário'),
  ],
  lombar: [
    createEx('hiperextensao-lombar', 'Hiperextensão Lombar', 'lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('levantamento-terra', 'Levantamento Terra', 'lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('good-morning', 'Good Morning com Barra', 'lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('superman-solo', 'Superman no Solo', 'lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('stiff-barra', 'Stiff com Barra', 'lombar', 'Barra', 'Hinge', 'Intermediário'),
  ],
  pernas: [
    createEx('agachamento-livre', 'Agachamento Livre com Barra', 'pernas', 'Barra', 'Agachar', 'Avançado'),
    createEx('leg-press-45', 'Leg Press 45°', 'pernas', 'Máquina', 'Empurrar', 'Intermediário'),
    createEx('cadeira-extensora', 'Cadeira Extensora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('mesa-flexora', 'Mesa Flexora', 'pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('stiff-halter', 'Stiff com Halteres', 'pernas', 'Halteres', 'Hinge', 'Intermediário'),
    createEx('afundo-halter', 'Afundo com Halteres', 'pernas', 'Halteres', 'Agachar', 'Iniciante'),
    createEx('agachamento-sumo', 'Agachamento Sumô', 'pernas', 'Halteres', 'Agachar', 'Iniciante'),
  ],
  biceps: [
    createEx('rosca-direta-barra', 'Rosca Direta com Barra', 'biceps', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-alternada', 'Rosca Alternada com Halteres', 'biceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-martelo', 'Rosca Martelo com Halteres', 'biceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-scott', 'Rosca Scott', 'biceps', 'Máquina', 'Isolar', 'Intermediário'),
    createEx('rosca-concentrada', 'Rosca Concentrada', 'biceps', 'Halteres', 'Isolar', 'Iniciante'),
  ],
  triceps: [
    createEx('triceps-pulley', 'Tríceps Pulley', 'triceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-corda', 'Tríceps Corda', 'triceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-testa', 'Tríceps Testa', 'triceps', 'Barra', 'Isolar', 'Intermediário'),
    createEx('mergulho-paralelas', 'Mergulho em Paralelas', 'triceps', 'Peso do corpo', 'Empurrar', 'Avançado'),
    createEx('triceps-frances', 'Tríceps Francês', 'triceps', 'Halteres', 'Isolar', 'Intermediário'),
  ],
  abdomen: [
    createEx('crunch-abdominal', 'Crunch Abdominal', 'abdomen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('elevacao-pernas', 'Elevação de Pernas', 'abdomen', 'Peso do corpo', 'Core', 'Intermediário'),
    createEx('prancha-isometrica', 'Prancha Isométrica', 'abdomen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('abdominal-roda', 'Abdominal com Roda', 'abdomen', 'Livre', 'Core', 'Avançado'),
  ],
  antebreaco: [
    createEx('rosca-punho', 'Rosca Punho', 'antebreaco', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-inversa', 'Rosca Inversa com Barra', 'antebreaco', 'Barra', 'Isolar', 'Intermediário'),
    createEx('farmer-walk', 'Farmer Walk', 'antebreaco', 'Halteres', 'Isolar', 'Intermediário'),
  ],
  panturrilha: [
    createEx('panturrilha-em-pe', 'Panturrilha em Pé na Máquina', 'panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-sentado', 'Panturrilha Sentado', 'panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-leg-press', 'Panturrilha no Leg Press', 'panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
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
