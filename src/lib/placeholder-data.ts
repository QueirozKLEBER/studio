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
  executionInstructions: `1. Posicione-se corretamente no equipamento ${equip}.\n2. Mantenha o core contraído e a postura alinhada.\n3. Execute o movimento de ${move.toLowerCase()} de forma controlada.\n4. Sinta a contração no ${muscle} e retorne lentamente.`,
  description: `Exercício fundamental de ${move.toLowerCase()} para o desenvolvimento de ${muscle}.`,
  tips: ['Mantenha a cadência 2-0-2.', 'Foco na conexão mente-músculo.', 'Respire durante a fase concêntrica.'],
  commonErrors: ['Uso de carga excessiva.', 'Amplitude incompleta.', 'Falta de estabilidade no tronco.'],
  safetyTips: ['Verifique se as travas estão seguras.', 'Use cinturão se necessário.'],
  variations: ['Unilateral', 'Com pausa', 'Drop-set'],
  tags: [muscle.toLowerCase(), move.toLowerCase(), equip.toLowerCase()],
  gifPrincipalUrl: '',
  gifVariationUrl: '',
  gifErrorUrl: '',
  thumbnailUrl: '',
  defaultTrainerNotes: 'Focar na técnica antes de progredir carga.',
  sets: '4',
  reps: '12',
  rest: '60s'
});

export const exercises: Record<string, Exercise[]> = {
  peito: [
    createEx('supino-reto-barra', 'Supino Reto com Barra', 'Peito', 'Barra', 'Empurrar', 'Intermediário', ['Tríceps', 'Ombro Frontal']),
    createEx('supino-reto-halter', 'Supino Reto com Halteres', 'Peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('supino-inc-barra', 'Supino Inclinado com Barra', 'Peito', 'Barra', 'Empurrar', 'Intermediário'),
    createEx('supino-inc-halter', 'Supino Inclinado com Halteres', 'Peito', 'Halteres', 'Empurrar', 'Intermediário'),
    createEx('supino-dec-barra', 'Supino Declinado com Barra', 'Peito', 'Barra', 'Empurrar', 'Avançado'),
    createEx('supino-maq', 'Supino na Máquina', 'Peito', 'Máquina', 'Empurrar', 'Iniciante'),
    createEx('crucifixo-reto', 'Crucifixo Reto com Halteres', 'Peito', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('crucifixo-maq', 'Crucifixo na Máquina (Peck Deck)', 'Peito', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('crossover-alto', 'Crossover Alto', 'Peito', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('flexao-trad', 'Flexão de Braço Tradicional', 'Peito', 'Peso do corpo', 'Empurrar', 'Iniciante'),
    createEx('supino-smith', 'Supino no Smith', 'Peito', 'Smith', 'Empurrar', 'Intermediário'),
    createEx('pullover-halter', 'Pullover com Halter', 'Peito', 'Halteres', 'Puxar', 'Intermediário'),
  ],
  costas: [
    createEx('puxada-frontal', 'Puxada Frontal Aberta', 'Costas', 'Máquina', 'Puxar', 'Iniciante', ['Bíceps']),
    createEx('remada-baixa', 'Remada Baixa no Cabo', 'Costas', 'Cabo/Polia', 'Puxar', 'Iniciante'),
    createEx('remada-unilateral', 'Remada Unilateral com Halter (Serrote)', 'Costas', 'Halteres', 'Puxar', 'Iniciante'),
    createEx('barra-fixa', 'Barra Fixa Pronada', 'Costas', 'Peso do corpo', 'Puxar', 'Avançado'),
    createEx('puxada-triangulo', 'Puxada Frontal com Triângulo', 'Costas', 'Máquina', 'Puxar', 'Iniciante'),
    createEx('remada-curvada-barra', 'Remada Curvada com Barra', 'Costas', 'Barra', 'Puxar', 'Intermediário'),
    createEx('pulldown-cabo', 'Pulldown no Cabo (Braços Estendidos)', 'Costas', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('remada-cavalinho', 'Remada Cavalinho', 'Costas', 'Barra', 'Puxar', 'Intermediário'),
  ],
  ombros: [
    createEx('desenv-halter', 'Desenvolvimento com Halteres', 'Ombros', 'Halteres', 'Empurrar', 'Iniciante', ['Tríceps']),
    createEx('eleva-lateral-halter', 'Elevação Lateral com Halteres', 'Ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('eleva-frontal-halter', 'Elevação Frontal com Halteres', 'Ombros', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('desenv-barra-militar', 'Desenvolvimento Militar (Barra)', 'Ombros', 'Barra', 'Empurrar', 'Avançado'),
    createEx('eleva-posterior-peck-deck', 'Elevação Posterior (Peck Deck)', 'Ombros', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('arnold-press', 'Arnold Press', 'Ombros', 'Halteres', 'Empurrar', 'Avançado'),
    createEx('eleva-lateral-cabo', 'Elevação Lateral no Cabo', 'Ombros', 'Cabo/Polia', 'Isolar', 'Intermediário'),
    createEx('remada-alta-barra', 'Remada Alta com Barra', 'Ombros', 'Barra', 'Puxar', 'Intermediário'),
  ],
  biceps: [
    createEx('rosca-direta-barra', 'Rosca Direta com Barra', 'Bíceps', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-alternada-halter', 'Rosca Alternada com Halteres', 'Bíceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-martelo-halter', 'Rosca Martelo com Halteres', 'Bíceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-scott-barra', 'Rosca Scott com Barra EZ', 'Bíceps', 'Barra', 'Isolar', 'Intermediário'),
    createEx('rosca-concentrada', 'Rosca Concentrada', 'Bíceps', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('rosca-no-cabo', 'Rosca no Cabo (Polia Baixa)', 'Bíceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('rosca-inclinada-45', 'Rosca no Banco 45°', 'Bíceps', 'Halteres', 'Isolar', 'Intermediário'),
  ],
  triceps: [
    createEx('triceps-pulley-barra', 'Tríceps Pulley (Barra Reta)', 'Tríceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-corda', 'Tríceps Corda', 'Tríceps', 'Cabo/Polia', 'Isolar', 'Iniciante'),
    createEx('triceps-testa-barra', 'Tríceps Testa com Barra EZ', 'Tríceps', 'Barra', 'Isolar', 'Intermediário'),
    createEx('mergulho-paralelas', 'Mergulho em Paralelas', 'Tríceps', 'Peso do corpo', 'Empurrar', 'Avançado'),
    createEx('triceps-frances-halter', 'Tríceps Francês com Halter', 'Tríceps', 'Halteres', 'Isolar', 'Intermediário'),
    createEx('supino-fechado', 'Supino com Pegada Fechada', 'Tríceps', 'Barra', 'Empurrar', 'Avançado'),
    createEx('triceps-coice-cabo', 'Tríceps Coice no Cabo', 'Tríceps', 'Cabo/Polia', 'Isolar', 'Intermediário'),
  ],
  pernas: [
    createEx('agachamento-livre', 'Agachamento Livre com Barra', 'Pernas', 'Barra', 'Agachar', 'Avançado', ['Glúteos', 'Lombar']),
    createEx('leg-press-45', 'Leg Press 45°', 'Pernas', 'Máquina', 'Empurrar', 'Intermediário'),
    createEx('cadeira-extensora', 'Cadeira Extensora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('mesa-flexora', 'Mesa Flexora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('afundo-halter', 'Afundo com Halteres', 'Pernas', 'Halteres', 'Agachar', 'Intermediário'),
    createEx('stiff-barra', 'Stiff com Barra', 'Pernas', 'Barra', 'Hinge', 'Intermediário', ['Posterior']),
    createEx('cadeira-flexora', 'Cadeira Flexora', 'Pernas', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('agachamento-hack', 'Agachamento no Hack', 'Pernas', 'Máquina', 'Agachar', 'Intermediário'),
  ],
  trapezio: [
    createEx('encolhimento-halter', 'Encolhimento com Halteres', 'Trapézio', 'Halteres', 'Isolar', 'Iniciante'),
    createEx('encolhimento-barra', 'Encolhimento com Barra', 'Trapézio', 'Barra', 'Isolar', 'Iniciante'),
    createEx('remada-alta-cabo', 'Remada Alta no Cabo', 'Trapézio', 'Cabo/Polia', 'Puxar', 'Intermediário'),
    createEx('encolhimento-smith', 'Encolhimento no Smith', 'Trapézio', 'Smith', 'Isolar', 'Intermediário'),
    createEx('high-pull-barra', 'High Pull com Barra', 'Trapézio', 'Barra', 'Puxar', 'Avançado'),
    createEx('clean-shrug-barra', 'Clean Shrug com Barra', 'Trapézio', 'Barra', 'Isolar', 'Avançado'),
    createEx('encolhimento-por-tras', 'Encolhimento por trás (Barra/Smith)', 'Trapézio', 'Barra', 'Isolar', 'Avançado'),
  ],
  lombar: [
    createEx('hiperextensao-lombar', 'Hiperextensão Lombar (Banco Romano)', 'Lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('levantamento-terra', 'Levantamento Terra Convencional', 'Lombar', 'Barra', 'Hinge', 'Avançado', ['Pernas', 'Costas']),
    createEx('good-morning-barra', 'Good Morning com Barra', 'Lombar', 'Barra', 'Hinge', 'Avançado'),
    createEx('superman', 'Superman (Solo)', 'Lombar', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('perdigueiro', 'Perdigueiro (Bird-Dog)', 'Lombar', 'Peso do corpo', 'Core', 'Iniciante'),
  ],
  panturrilha: [
    createEx('panturrilha-em-pe', 'Panturrilha em Pé (Máquina)', 'Panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-sentado', 'Panturrilha Sentado (Cavalinho)', 'Panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
    createEx('panturrilha-no-leg', 'Panturrilha no Leg Press', 'Panturrilha', 'Máquina', 'Isolar', 'Iniciante'),
  ],
  abdomen: [
    createEx('crunch-abdominal', 'Crunch Abdominal Solo', 'Abdômen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('elevacao-pernas', 'Elevação de Pernas Suspenso', 'Abdômen', 'Peso do corpo', 'Core', 'Avançado'),
    createEx('prancha-isometrica', 'Prancha Isométrica', 'Abdômen', 'Peso do corpo', 'Core', 'Iniciante'),
    createEx('abdominal-na-polia', 'Abdominal na Polia Alta', 'Abdômen', 'Cabo/Polia', 'Core', 'Intermediário'),
  ],
  antebreaco: [
    createEx('rosca-punho-barra', 'Rosca Punho com Barra', 'Antebraço', 'Barra', 'Isolar', 'Iniciante'),
    createEx('rosca-inversa-barra', 'Rosca Inversa com Barra EZ', 'Antebraço', 'Barra', 'Isolar', 'Iniciante'),
    createEx('farmer-walk', 'Caminhada do Fazendeiro (Farmer Walk)', 'Antebraço', 'Halteres', 'Isolar', 'Intermediário'),
  ]
};

export const nutritionTips = {
  emagrecimento: {
    title: 'Emagrecimento Saudável',
    tips: [
      { title: 'Déficit Calórico', content: 'Para emagrecer, você precisa consumir menos calorias do que gasta. Foque em alimentos densos em nutrientes e baixos em calorias.' },
      { title: 'Proteína é Chave', content: 'Aumentar a ingestão de proteínas ajuda na saciedade e preserva a massa muscular durante a perda de peso.' },
      { title: 'Hidratação', content: 'Beba pelo menos 35ml de água por quilo de peso corporal. Muitas vezes a sede é confundida com fome.' },
      { title: 'Fibras', content: 'Consuma vegetais em todas as refeições. As fibras retardam a digestão e mantêm você satisfeito por mais tempo.' }
    ]
  },
  hipertrofia: {
    title: 'Ganho de Massa Muscular',
    tips: [
      { title: 'Superávit Calórico', content: 'Músculos precisam de energia extra para crescer. Coma um pouco mais do que gasta, priorizando carboidratos complexos.' },
      { title: 'Timing da Proteína', content: 'Distribua sua meta de proteína ao longo do dia em 4 a 6 refeições para manter a síntese proteica elevada.' },
      { title: 'Descanso e Sono', content: 'O músculo cresce no descanso. Durma de 7 a 9 horas por noite e evite treinar o mesmo grupo muscular todos os dias.' },
      { title: 'Progressão de Carga', content: 'Para hipertrofia, você deve desafiar seus músculos constantemente aumentando pesos ou repetições.' }
    ]
  },
  energia: {
    title: 'Energia e Performance',
    tips: [
      { title: 'Carboidratos Complexos', content: 'Aveia, batata doce e arroz integral fornecem energia sustentada para seus treinos mais intensos.' },
      { title: 'Gorduras Boas', content: 'Abacate, nozes e azeite são fontes excelentes de energia a longo prazo e fundamentais para a regulação hormonal.' },
      { title: 'Micronutrientes', content: 'Não foque apenas em macros. Vitaminas e minerais de frutas e legumes são os catalisadores da sua energia.' }
    ]
  },
  'pre-treino': {
    title: 'Refeição Pré-Treino',
    tips: [
      { title: 'Foco em Carboidratos', content: 'Coma carboidratos de fácil digestão 60-90 minutos antes do treino para garantir glicogênio muscular.' },
      { title: 'Evite Fibras em Excesso', content: 'Muita fibra logo antes do treino pode causar desconforto gástrico durante exercícios intensos.' },
      { title: 'Cafeína', content: 'Um café preto puro pode aumentar o foco e a queima de gordura se consumido 30 minutos antes da sessão.' }
    ]
  },
  'pos-treino': {
    title: 'Recuperação Pós-Treino',
    tips: [
      { title: 'Janela de Recuperação', content: 'Consuma uma combinação de proteínas e carboidratos logo após o treino para iniciar a reparação tecidual.' },
      { title: 'Reposição de Glicogênio', content: 'Carboidratos pós-treino ajudam a levar a proteína para dentro das células musculares mais rápido.' },
      { title: 'Eletrólitos', content: 'Se suou muito, reponha sódio, potássio e magnésio para evitar cãibras e fadiga excessiva.' }
    ]
  }
};
