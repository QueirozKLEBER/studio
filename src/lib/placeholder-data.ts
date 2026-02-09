
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
  executionInstructions: `1. Posicione-se corretamente.\n2. Mantenha o core contraído.\n3. Execute o movimento de ${move.toLowerCase()} de forma controlada.\n4. Retorne à posição inicial mantendo a tensão muscular.`,
  description: `Exercício de ${move.toLowerCase()} focado no desenvolvimento de ${muscle}.`,
  tips: ['Mantenha a cadência controlada.', 'Foco na conexão mente-músculo.'],
  commonErrors: ['Uso de carga excessiva.', 'Amplitude incompleta.'],
  safetyTips: ['Verifique as travas de segurança.', 'Mantenha a coluna neutra.'],
  variations: ['Unilateral', 'Com pausa'],
  tags: [muscle.toLowerCase(), move.toLowerCase(), equip.toLowerCase()],
  gifPrincipalUrl: '',
  gifVariationUrl: '',
  gifErrorUrl: '',
  thumbnailUrl: '',
  defaultTrainerNotes: 'Focar na técnica antes de progredir carga.',
  sets: '4',
  reps: '12',
  rest: '60'
});

export const exercises: Record<string, Exercise[]> = {
  peito: [
    createEx('supino-reto-barra', 'Supino Reto com Barra', 'Peito', 'Barra', 'Empurrar', 'Intermediário', ['Tríceps', 'Ombro']),
    createEx('supino-inclinado-halter', 'Supino Inclinado com Halteres', 'Peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('peck-deck', 'Crucifixo na Máquina (Peck Deck)', 'Peito', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('flexao-braco', 'Flexão de Braço', 'Peito', 'Peso do corpo', 'Empurrar', 'Iniciante'),
    createEx('crossover-polia-media', 'Crossover na Polia Média', 'Peito', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('supino-reto-halter', 'Supino Reto com Halteres', 'Peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('supino-inclinado-barra', 'Supino Inclinado com Barra', 'Peito', 'Barra', 'Empurrar', 'Intermediário'),
    createEx('supino-declinado-barra', 'Supino Declinado com Barra', 'Peito', 'Barra', 'Empurrar', 'Avançado'),
    createEx('crucifixo-reto-halter', 'Crucifixo Reto com Halteres', 'Peito', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('chest-press-maquina', 'Chest Press Vertical (Máquina)', 'Peito', 'Máquina', 'Empurrar', 'Iniciante'),
  ],
  costas: [
    createEx('puxada-frontal', 'Puxada Frontal Aberta', 'Costas', 'Máquina', 'Puxar', 'Iniciante', ['Bíceps']),
    createEx('remada-baixa', 'Remada Baixa (Triângulo)', 'Costas', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('remada-curvada-barra', 'Remada Curvada com Barra', 'Costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('pull-up', 'Barra Fixa (Pull Up)', 'Costas', 'Peso do corpo', 'Puxar', 'Avançado'),
    createEx('puxada-supinada', 'Puxada Frontal Supinada', 'Costas', 'Máquina', 'Puxar', 'Iniciante'),
    createEx('remada-unilateral-halter', 'Remada Unilateral com Halter (Serrote)', 'Costas', 'Halteres', 'Puxar', 'Iniciante'),
    createEx('remada-cavalinho', 'Remada Cavalinho', 'Costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('pulldown-corda', 'Pulldown com Corda', 'Costas', 'Cabo/Polia', 'Isolar', 'Intermediário'),
  ],
  ombros: [
    createEx('desenvolvimento-halter', 'Desenvolvimento com Halteres', 'Ombros', 'Halteres', 'Empurrar', 'Iniciante'),
    createEx('elevacao-lateral-halter', 'Elevação Lateral com Halteres', 'Ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('desenvolvimento-militar', 'Desenvolvimento Militar (Barra)', 'Ombros', 'Barra', 'Empurrar', 'Avançado'),
    createEx('elevacao-frontal-halter', 'Elevação Frontal com Halteres', 'Ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('crucifixo-inverso-maquina', 'Crucifixo Inverso na Máquina', 'Ombros', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('arnold-press', 'Arnold Press', 'Ombros', 'Halteres', 'Empurrar', 'Avançado'),
    createEx('elevacao-lateral-cabo', 'Elevação Lateral no Cabo', 'Ombros', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('face-pull', 'Face Pull', 'Ombros', 'Cabo/Polia', 'Puxar', 'Intermediário'),
  ],
  biceps: [
    createEx('rosca-direta-barra', 'Rosca Direta com Barra', 'Bíceps', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-alternada-halter', 'Rosca Alternada com Halteres', 'Bíceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-scott', 'Rosca Scott (Máquina/Banco)', 'Bíceps', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('rosca-martelo-halter', 'Rosca Martelo com Halteres', 'Bíceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-concentrada', 'Rosca Concentrada', 'Bíceps', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('rosca-direta-cabo', 'Rosca Direta no Cabo', 'Bíceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('rosca-inclinada-45', 'Rosca Inclinada 45°', 'Bíceps', 'Halteres', 'Isolar', 'Intermediário'),
  ],
  triceps: [
    createEx('triceps-pulley', 'Tríceps Pulley (Barra Reta)', 'Tríceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-corda', 'Tríceps Corda', 'Tríceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-testa', 'Tríceps Testa com Barra EZ', 'Tríceps', 'Barra', 'Isolar', 'Intermediário'),
    createEx('mergulho-paralelas', 'Mergulho em Paralelas', 'Tríceps', 'Peso do corpo', 'Empurrar', 'Avançado'),
    createEx('triceps-frances-halter', 'Tríceps Francês com Halter', 'Tríceps', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('supino-fechado', 'Supino Pegada Fechada', 'Tríceps', 'Barra', 'Empurrar', 'Avançado'),
    createEx('triceps-coice-halter', 'Tríceps Coice com Halter', 'Tríceps', 'Halteres', 'Isolar', 'Iniciante'),
  ],
  pernas: [
    createEx('agachamento-livre', 'Agachamento Livre com Barra', 'Pernas', 'Barra', 'Agachar', 'Avançado'),
    createEx('leg-press-45', 'Leg Press 45°', 'Pernas', 'Máquina', 'Empurrar', 'Intermediário'),
    createEx('cadeira-extensora', 'Cadeira Extensora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('mesa-flexora', 'Mesa Flexora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('afundo-halter', 'Afundo com Halteres', 'Pernas', 'Halteres', 'Agachar', 'Intermediário'),
    createEx('stiff-barra', 'Stiff com Barra', 'Pernas', 'Barra', 'Hinge', 'Intermediário'),
    createEx('agachamento-hack', 'Agachamento Hack', 'Pernas', 'Máquina', 'Agachar', 'Intermediário'),
    createEx('cadeira-abdutora', 'Cadeira Abdutora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('cadeira-adutora', 'Cadeira Adutora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
  ],
  trapezio: [
    createEx('encolhimento-halter', 'Encolhimento com Halteres', 'Trapézio', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('encolhimento-barra', 'Encolhimento com Barra', 'Trapézio', 'Barra', 'Isolar', 'Iniciante'),
    createEx('remada-alta-cabo', 'Remada Alta no Cabo', 'Trapézio', 'Cabo/Polia', 'Puxar', 'Intermediário'),
    createEx('encolhimento-smith', 'Encolhimento no Smith', 'Trapézio', 'Smith', 'Isolar', 'Iniciante'),
    createEx('high-pull-barra', 'High Pull com Barra', 'Trapézio', 'Barra', 'Puxar', 'Avançado'),
    createEx('clean-shrug-barra', 'Clean Shrug (Encolhimento Explosivo)', 'Trapézio', 'Barra', 'Isolar', 'Avançado'),
    createEx('encolhimento-por-tras-barra', 'Encolhimento por trás com Barra', 'Trapézio', 'Barra', 'Isolar', 'Avançado'),
    createEx('face-pull-alto', 'Face Pull Foco Trapézio', 'Trapézio', 'Cabo/Polia', 'Puxar', 'Intermediário'),
  ],
  lombar: [
    createEx('levantamento-terra', 'Levantamento Terra Convencional', 'Lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('hiperextensao-lombar', 'Hiperextensão Lombar (Banco Romano)', 'Lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('good-morning-barra', 'Good Morning com Barra', 'Lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('superman-solo', 'Superman (Extensão de Tronco no Solo)', 'Lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('deadlift-sumo', 'Levantamento Terra Sumô', 'Lombar', 'Barra', 'Hinge', 'Avançado'),
  ],
  panturrilha: [
    createEx('panturrilha-em-pe-maquina', 'Panturrilha em Pé (Máquina)', 'Panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-sentado-maquina', 'Panturrilha Sentado (Cavalinho)', 'Panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-leg-press', 'Panturrilha no Leg Press', 'Panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
  ],
  abdomen: [
    createEx('abdominal-crunch', 'Crunch Abdominal', 'Abdômen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('elevacao-pernas-suspenso', 'Elevação de Pernas Suspenso', 'Abdômen', 'Peso do corpo', 'Core', 'Avançado'),
    createEx('prancha-isometrica', 'Prancha Isométrica', 'Abdômen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('abdominal-roda', 'Abdominal com Roda', 'Abdômen', 'Livre', 'Core', 'Avançado'),
    createEx('abdominal-infra-solo', 'Abdominal Infra no Solo', 'Abdômen', 'Peso do corpo', 'Core', 'Iniciante'),
  ],
  antebreaco: [
    createEx('rosca-punho-barra', 'Rosca Punho com Barra', 'Antebraço', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-inversa-barra', 'Rosca Inversa com Barra', 'Antebraço', 'Barra', 'Isolar', 'Intermediário'),
    createEx('farmer-walk', 'Caminhada do Fazendeiro (Farmer Walk)', 'Antebraço', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('rosca-martelo-corda', 'Rosca Martelo com Corda', 'Antebraço', 'Cabo/Polia', 'Isolar', 'Iniciante'),
  ]
};

export const nutritionTips = {
  emagrecimento: {
    title: 'Emagrecimento Saudável',
    tips: [
      { title: 'Déficit Calórico', content: 'Consuma menos calorias do que gasta. Foque em vegetais e proteínas magras.' },
      { title: 'Proteína e Saciedade', content: 'Proteínas levam mais tempo para digerir, mantendo você saciado por mais tempo.' },
      { title: 'Evite Calorias Líquidas', content: 'Sucos e refrigerantes não trazem saciedade. Prefira a fruta inteira e água.' },
      { title: 'Ciclo de Carboidratos', content: 'Consuma mais carboidratos nos dias de treino intenso e menos nos dias de descanso.' }
    ]
  },
  hipertrofia: {
    title: 'Ganho de Massa Muscular',
    tips: [
      { title: 'Superávit Calórico', content: 'Músculos precisam de energia extra. Coma cerca de 300-500 kcal acima do seu gasto diário.' },
      { title: 'Aporte Proteico', content: 'Mantenha entre 1.6g a 2.2g de proteína por kg de peso corporal para reparação tecidual.' },
      { title: 'Carboidratos Complexos', content: 'Aveia, arroz e batatas são fundamentais para dar energia ao treino e poupar proteína.' },
      { title: 'Descanso Anabólico', content: 'O crescimento ocorre durante o sono. Garanta pelo menos 7 a 8 horas de sono de qualidade.' }
    ]
  },
  energia: {
    title: 'Energia e Performance',
    tips: [
      { title: 'Hidratação Constante', content: 'Apenas 2% de desidratação reduz drasticamente sua força e foco no treino.' },
      { title: 'Gorduras Saudáveis', content: 'Abacate e nozes são excelentes fontes de energia duradoura e regulação hormonal.' },
      { title: 'Micronutrientes', content: 'Vitaminas do complexo B são essenciais para o metabolismo energético.' }
    ]
  },
  'pre-treino': {
    title: 'Refeição Pré-Treino',
    tips: [
      { title: 'Janela de Tempo', content: 'Faça uma refeição sólida 1h a 2h antes, ou uma líquida/leve 30min antes.' },
      { title: 'Carboidratos de Fácil Digestão', content: 'Banana com mel ou pasta de amendoim são ótimas opções rápidas.' },
      { title: 'Cafeína Estratégica', content: 'Um café expresso 30 min antes pode aumentar a performance e a queima de gordura.' }
    ]
  },
  'pos-treino': {
    title: 'Recuperação Pós-Treino',
    tips: [
      { title: 'Reposição de Glicogênio', content: 'Consuma carboidratos logo após o treino para repor os estoques de energia.' },
      { title: 'Proteína Rápida', content: 'Whey protein ou ovos ajudam a iniciar o processo de reconstrução muscular imediata.' },
      { title: 'Eletrólitos', content: 'Reponha sódio e potássio perdidos no suor para evitar cãibras e fadiga extrema.' }
    ]
  }
};
