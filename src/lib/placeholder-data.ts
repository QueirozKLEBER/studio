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
  description: `Exercício técnico de elite para ${muscle}. Foco total na contração e amplitude de movimento.`,
  tips: ['Controle a fase excêntrica.', 'Mantenha o core firme.', 'Foco na conexão mente-músculo.'],
  commonErrors: ['Uso de carga excessiva comprometendo a forma.', 'Amplitude incompleta.', 'Respiração inadequada.'],
  safetyTips: ['Mantenha a postura neutra.', 'Evite trancos articulares.'],
  variations: ['Unilateral', 'Pegada neutra', 'Com pausa isométrica'],
});

export const exercises: Record<string, Exercise[]> = {
  peito: [
    createEx('supino-reto-barra', 'Supino Reto com Barra', 'Peito', 'Barra', 'Intermediário', ['Tríceps', 'Ombros']),
    createEx('supino-reto-halter', 'Supino Reto com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    createEx('supino-inc-barra', 'Supino Inclinado com Barra', 'Peito', 'Barra', 'Intermediário'),
    createEx('supino-inc-halter', 'Supino Inclinado com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    createEx('supino-dec-barra', 'Supino Declinado com Barra', 'Peito', 'Barra', 'Avançado'),
    createEx('supino-maq', 'Supino na Máquina', 'Peito', 'Máquina', 'Iniciante'),
    createEx('crucifixo-reto', 'Crucifixo Reto com Halteres', 'Peito', 'Halteres', 'Intermediário'),
    createEx('crucifixo-maq', 'Crucifixo na Máquina (Peck Deck)', 'Peito', 'Máquina', 'Iniciante'),
    createEx('crossover-alto', 'Crossover Alto', 'Peito', 'Cabo/Polia', 'Intermediário'),
    createEx('flexao-trad', 'Flexão de Braço Tradicional', 'Peito', 'Peso do corpo', 'Iniciante'),
    createEx('flexao-inc', 'Flexão Inclinada', 'Peito', 'Peso do corpo', 'Iniciante'),
    createEx('flexao-dec', 'Flexão Declinada', 'Peito', 'Peso do corpo', 'Intermediário'),
    createEx('pullover-halter', 'Pullover com Halter', 'Peito', 'Halteres', 'Intermediário'),
    createEx('chest-press', 'Chest Press Máquina', 'Peito', 'Máquina', 'Iniciante'),
    createEx('supino-smith', 'Supino Guiado (Smith)', 'Peito', 'Smith', 'Intermediário'),
  ],
  costas: [
    createEx('barra-fixa-pronada', 'Barra Fixa Pronada', 'Costas', 'Peso do corpo', 'Avançado', ['Bíceps']),
    createEx('barra-fixa-supinada', 'Barra Fixa Supinada', 'Costas', 'Peso do corpo', 'Intermediário'),
    createEx('puxada-frontal', 'Puxada Frontal Aberta', 'Costas', 'Máquina', 'Iniciante'),
    createEx('puxada-triangulo', 'Puxada com Triângulo', 'Costas', 'Máquina', 'Iniciante'),
    createEx('remada-curvada', 'Remada Curvada com Barra', 'Costas', 'Barra', 'Intermediário'),
    createEx('remada-unilateral', 'Remada Unilateral (Serrote)', 'Costas', 'Halteres', 'Iniciante'),
    createEx('remada-baixa', 'Remada Baixa no Cabo', 'Costas', 'Cabo/Polia', 'Iniciante'),
    createEx('remada-cavalinho', 'Remada Cavalinho (T-Bar)', 'Costas', 'Barra', 'Intermediário'),
    createEx('pulldown-cabo', 'Pulldown no Cabo', 'Costas', 'Cabo/Polia', 'Intermediário'),
    createEx('lev-terra', 'Levantamento Terra', 'Costas', 'Barra', 'Avançado', ['Pernas', 'Lombar']),
    createEx('face-pull-costas', 'Face Pull', 'Costas', 'Cabo/Polia', 'Iniciante'),
  ],
  pernas: [
    createEx('agachamento-livre', 'Agachamento Livre', 'Pernas', 'Barra', 'Avançado', ['Glúteos', 'Lombar']),
    createEx('leg-press-45', 'Leg Press 45°', 'Pernas', 'Máquina', 'Intermediário'),
    createEx('cadeira-extensora', 'Cadeira Extensora', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('mesa-flexora', 'Mesa Flexora', 'Pernas', 'Máquina', 'Iniciante'),
    createEx('stiff', 'Stiff com Barra', 'Pernas', 'Barra', 'Intermediário'),
    createEx('afundo-halter', 'Afundo com Halteres', 'Pernas', 'Halteres', 'Iniciante'),
    createEx('passada', 'Passada (Walking Lunges)', 'Pernas', 'Livre', 'Intermediário'),
    createEx('hack-machine', 'Hack Machine', 'Pernas', 'Máquina', 'Intermediário'),
    createEx('hip-thrust', 'Elevação Pélvica (Hip Thrust)', 'Pernas', 'Barra', 'Intermediário', ['Glúteos']),
    createEx('bulgaro', 'Agachamento Búlgaro', 'Pernas', 'Halteres', 'Avançado'),
  ],
  ombros: [
    createEx('desenv-militar', 'Desenvolvimento Militar (Barra)', 'Ombros', 'Barra', 'Intermediário', ['Tríceps']),
    createEx('desenv-halter', 'Desenvolvimento com Halteres', 'Ombros', 'Halteres', 'Iniciante'),
    createEx('eleva-lateral', 'Elevação Lateral', 'Ombros', 'Halteres', 'Iniciante'),
    createEx('eleva-frontal', 'Elevação Frontal', 'Ombros', 'Halteres', 'Iniciante'),
    createEx('arnold-press', 'Arnold Press', 'Ombros', 'Halteres', 'Avançado'),
    createEx('eleva-lat-cabo', 'Elevação Lateral no Cabo', 'Ombros', 'Cabo/Polia', 'Intermediário'),
    createEx('crucifixo-inv', 'Crucifixo Inverso (Deltoide Post)', 'Ombros', 'Halteres', 'Intermediário'),
  ],
  biceps: [
    createEx('rosca-direta', 'Rosca Direta com Barra', 'Bíceps', 'Barra', 'Iniciante'),
    createEx('rosca-alternada', 'Rosca Alternada', 'Bíceps', 'Halteres', 'Iniciante'),
    createEx('rosca-martelo', 'Rosca Martelo', 'Bíceps', 'Halteres', 'Iniciante'),
    createEx('rosca-scott', 'Rosca Scott', 'Bíceps', 'Barra', 'Intermediário'),
    createEx('rosca-concentrada', 'Rosca Concentrada', 'Bíceps', 'Halteres', 'Iniciante'),
    createEx('rosca-cabo', 'Rosca no Cabo', 'Bíceps', 'Cabo/Polia', 'Iniciante'),
    createEx('rosca-21', 'Rosca 21', 'Bíceps', 'Barra', 'Avançado'),
  ],
  triceps: [
    createEx('triceps-testa', 'Tríceps Testa com Barra', 'Tríceps', 'Barra', 'Intermediário'),
    createEx('triceps-pulley', 'Tríceps no Pulley (Barra)', 'Tríceps', 'Cabo/Polia', 'Iniciante'),
    createEx('triceps-corda', 'Tríceps Corda', 'Tríceps', 'Cabo/Polia', 'Iniciante'),
    createEx('triceps-frances', 'Tríceps Francês', 'Tríceps', 'Halteres', 'Intermediário'),
    createEx('mergulho-paralela', 'Mergulho em Paralelas', 'Tríceps', 'Peso do corpo', 'Avançado'),
    createEx('supino-fechado', 'Supino Fechado', 'Tríceps', 'Barra', 'Intermediário'),
    createEx('triceps-coice', 'Tríceps Coice', 'Tríceps', 'Halteres', 'Iniciante'),
  ],
  abdomen: [
    createEx('crunch', 'Abdominal Crunch', 'Abdômen', 'Peso do corpo', 'Iniciante'),
    createEx('elev-pernas', 'Elevação de Pernas', 'Abdômen', 'Peso do corpo', 'Intermediário'),
    createEx('prancha', 'Prancha Isométrica', 'Abdômen', 'Peso do corpo', 'Iniciante'),
    createEx('abd-roda', 'Ab Wheel (Roda Abdominal)', 'Abdômen', 'Livre', 'Avançado'),
    createEx('abd-cabo', 'Abdominal no Cabo', 'Abdômen', 'Cabo/Polia', 'Iniciante'),
  ],
  antebreaco: [
    createEx('rosca-punho', 'Rosca Punho', 'Antebraço', 'Barra', 'Iniciante'),
    createEx('rosca-inversa', 'Rosca Inversa', 'Antebraço', 'Barra', 'Intermediário'),
    createEx('farmer-walk', 'Farmer’s Walk', 'Antebraço', 'Halteres', 'Intermediário'),
  ],
  trapezio: [
    createEx('encolhe-barra', 'Encolhimento com Barra', 'Trapézio', 'Barra', 'Iniciante'),
    createEx('encolhe-halter', 'Encolhimento com Halteres', 'Trapézio', 'Halteres', 'Iniciante'),
    createEx('encolhe-smith', 'Encolhimento no Smith', 'Trapézio', 'Smith', 'Iniciante'),
    createEx('encolhe-cabo', 'Encolhimento no Cabo', 'Trapézio', 'Cabo/Polia', 'Iniciante'),
    createEx('high-pull', 'High Pull', 'Trapézio', 'Barra', 'Avançado'),
    createEx('rack-pull', 'Rack Pull', 'Trapézio', 'Barra', 'Avançado'),
    createEx('remada-alta', 'Remada Alta com Barra', 'Trapézio', 'Barra', 'Intermediário'),
    createEx('shrug-atras', 'Shrug atrás (Smith)', 'Trapézio', 'Smith', 'Avançado'),
    createEx('shrug-uni', 'Encolhimento Unilateral', 'Trapézio', 'Halteres', 'Intermediário'),
    createEx('face-pull-trap', 'Face Pull (Foco Superior)', 'Trapézio', 'Cabo/Polia', 'Intermediário'),
    createEx('encolhe-maquina', 'Encolhimento na Máquina', 'Trapézio', 'Máquina', 'Iniciante'),
    createEx('encolhe-atras-barra', 'Encolhimento por trás com Barra', 'Trapézio', 'Barra', 'Avançado'),
  ],
  lombar: [
    createEx('hiperextensao', 'Hiperextensão Lombar', 'Lombar', 'Máquina', 'Iniciante'),
    createEx('lev-terra-romeno', 'Levantamento Terra Romeno', 'Lombar', 'Barra', 'Avançado'),
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
      { title: 'Déficit Calórico', content: 'A base da perda de peso é consumir menos do que gasta, mas sem passar fome. Foco em densidade nutricional.' },
      { title: 'Hidratação é Chave', content: 'Beba pelo menos 2 litros de água. Muitas vezes o cérebro confunde sede com fome.' },
      { title: 'Proteína em todas as refeições', content: 'Ajuda na saciedade e mantém a massa magra durante o processo de queima de gordura.' },
    ],
  },
  hipertrofia: {
    category: 'Hipertrofia',
    tips: [
      { title: 'Superávit Calórico', content: 'Você precisa de energia sobrando para construir tecido novo. Coma limpo, mas coma em abundância.' },
      { title: 'Descanso é Treino', content: 'O músculo cresce enquanto você dorme, não enquanto você levanta peso. Priorize 8h de sono.' },
      { title: 'Consistência no Treino', content: 'Hipertrofia exige tempo. Não pule treinos e foque na progressão de carga gradual.' },
    ],
  },
  energia: { 
    category: 'Energia', 
    tips: [
      { title: 'Carboidratos Complexos', content: 'Aveia, batata doce e arroz integral liberam energia gradualmente para o seu dia.' },
      { title: 'Magnésio e Zinco', content: 'Minerais essenciais para o metabolismo energético. Considere através de sementes e castanhas.' },
      { title: 'Café com Moderação', content: 'A cafeína ajuda, mas em excesso pode causar rebote de cansaço. Use estrategicamente.' },
    ] 
  },
  'pre-treino': { 
    category: 'Pré-Treino', 
    tips: [
      { title: 'O que comer 1h antes', content: 'Uma combinação de carboidrato rápido e proteína. Ex: Banana com aveia e whey ou pão com ovo.' },
      { title: 'Hidratação Antecipada', content: 'Não comece a beber água só na hora do treino. Esteja hidratado desde o momento que acorda.' },
      { title: 'Evite Gorduras', content: 'Gorduras lentificam a digestão e podem causar desconforto gástrico durante o esforço físico.' },
    ] 
  },
  'pos-treino': { 
    category: 'Pós-Treino', 
    tips: [
      { title: 'Janela de Recuperação', content: 'Priorize proteína de rápida absorção e carboidratos para repor o glicogênio muscular o quanto antes.' },
      { title: 'Antioxidantes', content: 'Frutas vermelhas ajudam a combater o estresse oxidativo causado pelo treino intenso.' },
      { title: 'Sódio e Eletrólitos', content: 'Reponha o que foi perdido no suor para evitar cãibras e manter o equilíbrio hídrico.' },
    ] 
  },
};

export { placeHolderImages } from './placeholder-images';