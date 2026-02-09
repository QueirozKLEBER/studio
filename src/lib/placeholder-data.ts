
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
  executionInstructions: `1. Posicione-se corretamente no equipamento.\n2. Mantenha o core contraído e a coluna neutra.\n3. Execute o movimento de ${move.toLowerCase()} de forma controlada, focando no músculo alvo.\n4. Retorne à posição inicial mantendo a tensão muscular em todo o trajeto.`,
  description: `Exercício de ${move.toLowerCase()} focado no desenvolvimento e fortalecimento de ${muscle}.`,
  tips: ['Mantenha a cadência de 2s na subida e 3s na descida.', 'Foco total na contração de pico.', 'Não use o balanço do corpo para mover a carga.'],
  commonErrors: ['Uso de carga excessiva que prejudica a técnica.', 'Amplitude de movimento limitada.', 'Respiração inadequada (não bloquear o ar).'],
  safetyTips: ['Mantenha as articulações ligeiramente flexionadas no final do movimento.', 'Verifique sempre as travas de segurança.', 'Em caso de dor articular, interrompa imediatamente.'],
  variations: ['Unilateral para correção de assimetrias', 'Com pausa isométrica no ponto de maior contração', 'Excêntrica lenta'],
  tags: [muscle.toLowerCase(), move.toLowerCase(), equip.toLowerCase(), diff.toLowerCase()],
  gifPrincipalUrl: '',
  gifVariationUrl: '',
  gifErrorUrl: '',
  thumbnailUrl: '',
  defaultTrainerNotes: 'Priorize a técnica perfeita antes de tentar aumentar a carga de trabalho.',
  sets: '4',
  reps: '12',
  rest: '60'
});

export const exercises: Record<string, Exercise[]> = {
  peito: [
    createEx('supino-reto-barra', 'Supino Reto com Barra', 'Peito', 'Barra', 'Empurrar', 'Intermediário', ['Tríceps', 'Ombro']),
    createEx('supino-inclinado-halter', 'Supino Inclinado com Halteres', 'Peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('peck-deck', 'Crucifixo na Máquina (Peck Deck)', 'Peito', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('flexao-braco', 'Flexão de Braço Tradicional', 'Peito', 'Peso do corpo', 'Empurrar', 'Iniciante'),
    createEx('crossover-polia-media', 'Crossover na Polia Média', 'Peito', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('supino-reto-halter', 'Supino Reto com Halteres', 'Peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('supino-inclinado-barra', 'Supino Inclinado com Barra', 'Peito', 'Barra', 'Empurrar', 'Intermediário'),
    createEx('crucifixo-reto-halter', 'Crucifixo Reto com Halteres', 'Peito', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('chest-press-maquina', 'Chest Press Vertical (Máquina)', 'Peito', 'Máquina', 'Empurrar', 'Iniciante'),
    createEx('paralelas-foco-peito', 'Mergulho em Paralelas (Foco Peitoral)', 'Peito', 'Peso do corpo', 'Empurrar', 'Avançado'),
  ],
  costas: [
    createEx('puxada-frontal', 'Puxada Frontal Aberta', 'Costas', 'Máquina', 'Puxar', 'Iniciante', ['Bíceps']),
    createEx('remada-baixa', 'Remada Baixa com Triângulo', 'Costas', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('remada-curvada-barra', 'Remada Curvada com Barra', 'Costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('pull-up', 'Barra Fixa (Pull Up)', 'Costas', 'Peso do corpo', 'Puxar', 'Avançado'),
    createEx('remada-unilateral-halter', 'Remada Unilateral com Halter (Serrote)', 'Costas', 'Halteres', 'Puxar', 'Iniciante'),
    createEx('remada-cavalinho', 'Remada Cavalinho com Barra', 'Costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('pulldown-corda', 'Pulldown com Corda na Polia Alta', 'Costas', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('face-pull-costas', 'Face Pull para Deltoide Posterior', 'Costas', 'Cabo/Polia', 'Puxar', 'Iniciante'),
  ],
  ombros: [
    createEx('desenvolvimento-halter', 'Desenvolvimento com Halteres Sentado', 'Ombros', 'Halteres', 'Empurrar', 'Iniciante'),
    createEx('elevacao-lateral-halter', 'Elevação Lateral com Halteres', 'Ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('desenvolvimento-militar', 'Desenvolvimento Militar em Pé', 'Ombros', 'Barra', 'Empurrar', 'Avançado'),
    createEx('elevacao-frontal-halter', 'Elevação Frontal com Halteres', 'Ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('arnold-press', 'Arnold Press', 'Ombros', 'Halteres', 'Empurrar', 'Avançado'),
    createEx('elevacao-lateral-cabo', 'Elevação Lateral no Cabo (Unilateral)', 'Ombros', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('desenvolvimento-smith', 'Desenvolvimento no Smith', 'Ombros', 'Smith', 'Empurrar', 'Intermediário'),
  ],
  trapezio: [
    createEx('encolhimento-halter', 'Encolhimento com Halteres (Shrug)', 'Trapézio', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('encolhimento-barra', 'Encolhimento com Barra à Frente', 'Trapézio', 'Barra', 'Isolar', 'Iniciante'),
    createEx('encolhimento-smith', 'Encolhimento no Smith', 'Trapézio', 'Smith', 'Isolar', 'Iniciante'),
    createEx('high-pull-barra', 'High Pull com Barra (Puxada Alta)', 'Trapézio', 'Barra', 'Puxar', 'Avançado'),
    createEx('clean-shrug-barra', 'Clean Shrug (Encolhimento Explosivo)', 'Trapézio', 'Barra', 'Isolar', 'Avançado'),
    createEx('encolhimento-por-tras-barra', 'Encolhimento por trás com Barra (Haney Shrug)', 'Trapézio', 'Barra', 'Isolar', 'Avançado'),
    createEx('remada-alta-cabo', 'Remada Alta na Polia Baixa', 'Trapézio', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('face-pull-alto', 'Face Pull (Foco Trapézio Superior)', 'Trapézio', 'Cabo/Polia', 'Puxar', 'Intermediário'),
    createEx('encolhimento-unilateral-halter', 'Encolhimento Unilateral com Halter', 'Trapézio', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('encolhimento-maquina', 'Encolhimento na Máquina de Panturrilha', 'Trapézio', 'Máquina', 'Isolar', 'Intermediário'),
  ],
  lombar: [
    createEx('levantamento-terra', 'Levantamento Terra Convencional', 'Lombar', 'Barra', 'Hinge', 'Avançado', ['Pernas', 'Glúteos']),
    createEx('hiperextensao-lombar', 'Hiperextensão Lombar (Banco Romano)', 'Lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('good-morning-barra', 'Good Morning com Barra (Bom Dia)', 'Lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('superman-solo', 'Superman (Extensão de Tronco no Solo)', 'Lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('deadlift-sumo', 'Levantamento Terra Sumô', 'Lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('ponte-pelvica', 'Ponte Pélvica (Elevação de Quadril)', 'Lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('bird-dog', 'Bird Dog (Perdigueiro)', 'Lombar', 'Peso do corpo', 'Core', 'Iniciante'),
  ],
  pernas: [
    createEx('agachamento-livre', 'Agachamento Livre com Barra', 'Pernas', 'Barra', 'Agachar', 'Avançado'),
    createEx('leg-press-45', 'Leg Press 45°', 'Pernas', 'Máquina', 'Empurrar', 'Intermediário'),
    createEx('cadeira-extensora', 'Cadeira Extensora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('mesa-flexora', 'Mesa Flexora (Flexora Deitada)', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('afundo-halter', 'Afundo com Halteres', 'Pernas', 'Halteres', 'Agachar', 'Intermediário'),
    createEx('stiff-barra', 'Stiff com Barra', 'Pernas', 'Barra', 'Hinge', 'Intermediário'),
    createEx('agachamento-sumo-halter', 'Agachamento Sumô com Halter', 'Pernas', 'Halteres', 'Agachar', 'Iniciante'),
    createEx('cadeira-abdutora', 'Cadeira Abdutora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('cadeira-adutora', 'Cadeira Adutora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
  ],
  panturrilha: [
    createEx('panturrilha-em-pe-maquina', 'Panturrilha em Pé na Máquina', 'Panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-sentado-maquina', 'Panturrilha Sentado (Cavalinho)', 'Panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-leg-press', 'Panturrilha no Leg Press', 'Panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-solo', 'Panturrilha no Solo (Peso Corporal)', 'Panturrilha', 'Peso do corpo', 'Isolar', 'Iniciante'),
  ],
  biceps: [
    createEx('rosca-direta-barra', 'Rosca Direta com Barra Reta/EZ', 'Bíceps', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-alternada-halter', 'Rosca Alternada com Halteres', 'Bíceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-scott', 'Rosca Scott (Banco/Máquina)', 'Bíceps', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('rosca-martelo-halter', 'Rosca Martelo com Halteres', 'Bíceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-concentrada', 'Rosca Concentrada com Halter', 'Bíceps', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('rosca-direta-cabo', 'Rosca Direta na Polia Baixa', 'Bíceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
  ],
  triceps: [
    createEx('triceps-pulley', 'Tríceps Pulley (Barra Reta)', 'Tríceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-corda', 'Tríceps Corda na Polia Alta', 'Tríceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-testa', 'Tríceps Testa com Barra EZ', 'Tríceps', 'Barra', 'Isolar', 'Intermediário'),
    createEx('mergulho-paralelas-triceps', 'Mergulho em Paralelas (Foco Tríceps)', 'Tríceps', 'Peso do corpo', 'Empurrar', 'Avançado'),
    createEx('triceps-frances-halter', 'Tríceps Francês com Halter (Unilateral)', 'Tríceps', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('supino-fechado-triceps', 'Supino com Pegada Fechada', 'Tríceps', 'Barra', 'Empurrar', 'Avançado'),
  ],
  abdomen: [
    createEx('abdominal-crunch-solo', 'Crunch Abdominal no Solo', 'Abdômen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('elevacao-pernas-suspenso', 'Elevação de Pernas Suspenso na Barra', 'Abdômen', 'Peso do corpo', 'Core', 'Avançado'),
    createEx('prancha-abdominal', 'Prancha Abdominal Isométrica', 'Abdômen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('abdominal-roda', 'Abdominal com Roda (Power Wheel)', 'Abdômen', 'Livre', 'Core', 'Avançado'),
    createEx('abdominal-infra-banco', 'Abdominal Infra no Banco Inclinado', 'Abdômen', 'Peso do corpo', 'Core', 'Intermediário'),
  ],
  antebreaco: [
    createEx('rosca-punho-barra', 'Rosca Punho com Barra (Flexão)', 'Antebraço', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-inversa-barra', 'Rosca Inversa com Barra EZ', 'Antebraço', 'Barra', 'Isolar', 'Intermediário'),
    createEx('farmer-walk-antebreaco', 'Caminhada do Fazendeiro (Farmer Walk)', 'Antebraço', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('rosca-martelo-corda-antebreaco', 'Rosca Martelo com Corda no Cabo', 'Antebraço', 'Cabo/Polia', 'Isolar', 'Iniciante'),
  ]
};

export const nutritionTips = {
  emagrecimento: {
    title: 'Estratégias para Emagrecimento',
    tips: [
      { title: 'Déficit Calórico Inteligente', content: 'Para emagrecer, você deve consumir cerca de 300 a 500 kcal a menos do que gasta. Foque em volume alimentar com vegetais.' },
      { title: 'A Importância das Proteínas', content: 'Proteínas têm alto efeito térmico e preservam a massa muscular durante o déficit. Consuma em todas as refeições.' },
      { title: 'Fibras e Saciedade', content: 'Fibras retardam o esvaziamento gástrico. Coma frutas com casca e cereais integrais para evitar picos de fome.' },
      { title: 'Hidratação e Fome', content: 'Muitas vezes o cérebro confunde sede com fome. Beba pelo menos 35ml de água por kg de peso corporal.' }
    ]
  },
  hipertrofia: {
    title: 'Pilares da Hipertrofia',
    tips: [
      { title: 'Superávit Calórico Controlado', content: 'Para crescer, você precisa de energia. Coma levemente acima do seu gasto, focando na qualidade dos macronutrientes.' },
      { title: 'Timing de Carboidratos', content: 'Carboidratos são o combustível do treino. Concentre-os no pré e pós-treino para máxima performance e recuperação.' },
      { title: 'Janela de Sono', content: 'O músculo não cresce na academia, ele cresce no sono profundo. Garanta de 7 a 9 horas de descanso de qualidade.' },
      { title: 'Gorduras Boas e Hormônios', content: 'Gorduras saudáveis (azeite, abacate, nozes) são fundamentais para a produção de testosterona e saúde hormonal.' }
    ]
  },
  energia: {
    title: 'Máxima Performance',
    tips: [
      { title: 'Eletrólitos e Performance', content: 'Sódio, potássio e magnésio são cruciais para a contração muscular. Reponha-os especialmente em treinos longos.' },
      { title: 'Creatina: O Suplemento Ouro', content: 'A creatina aumenta a ressintese de ATP, permitindo mais força e explosão em exercícios intensos.' },
      { title: 'Cafeína Estratégica', content: 'A cafeína reduz a percepção de esforço. Use 30-45 minutos antes do treino mais difícil do dia.' }
    ]
  },
  'pre-treino': {
    title: 'Combustível Pré-Treino',
    tips: [
      { title: 'Digestão e Tempo', content: 'Refeições sólidas 2h antes. Lanches leves (frutas) 30-60 min antes. Evite gorduras pesadas pré-treino.' },
      { title: 'Carboidratos Simples', content: 'Bananas, mel ou pão branco com geleia fornecem energia rápida sem pesar no estômago.' }
    ]
  },
  'pos-treino': {
    title: 'Recuperação Pós-Treino',
    tips: [
      { title: 'Sinalização Anabólica', content: 'Consuma uma fonte de proteína de rápida absorção com carboidratos para cessar o catabolismo do treino.' },
      { title: 'Ovos e Whey', content: 'Fontes de alto valor biológico garantem que os aminoácidos cheguem rápido às fibras lesionadas.' }
    ]
  }
};
