export type Exercise = {
  id: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  videoUrl: string;
  description: string;
  tips: string[];
};

export const muscleGroups = [
  { id: 'peito', name: 'Peito', icon: 'Chest' },
  { id: 'costas', name: 'Costas', icon: 'Back' },
  { id: 'ombros', name: 'Ombros', icon: 'Shoulders' },
  { id: 'biceps', name: 'Bíceps', icon: 'Biceps' },
  { id: 'triceps', name: 'Tríceps', icon: 'Triceps' },
  { id: 'pernas', name: 'Pernas', icon: 'Legs' },
  { id: 'gluteos', name: 'Glúteos', icon: 'Glutes' },
  { id: 'abdomen', name: 'Abdômen', icon: 'Abs' },
  { id: 'panturrilha', name: 'Panturrilha', icon: 'Calves' },
];

export const exercises: Record<string, Exercise[]> = {
  peito: [
    {
      id: 'supino-reto',
      name: 'Supino Reto',
      sets: '4',
      reps: '8-12',
      rest: '60s',
      videoUrl: '',
      description: 'Deitado em um banco reto, segure a barra com as mãos um pouco mais afastadas que a largura dos ombros. Desça a barra até tocar o peito e empurre de volta à posição inicial.',
      tips: [
        'Mantenha os pés firmes no chão.',
        'Não arqueie as costas excessivamente.',
        'Controle o movimento na descida e na subida.'
      ],
    },
    {
      id: 'crucifixo-halteres',
      name: 'Crucifixo com Halteres',
      sets: '3',
      reps: '10-15',
      rest: '60s',
      videoUrl: '',
      description: 'Deitado em um banco reto, segure um halter em cada mão com os braços estendidos acima do peito. Abra os braços lentamente até sentir o peitoral alongar e retorne à posição inicial.',
      tips: [
        'Mantenha uma leve flexão nos cotovelos.',
        'Concentre-se em "abraçar uma árvore" para ativar o peito.',
        'Evite deixar os halteres caírem muito baixo.'
      ],
    },
  ],
  costas: [
    {
      id: 'puxada-frente',
      name: 'Puxada Frontal',
      sets: '4',
      reps: '10-12',
      rest: '60s',
      videoUrl: '',
      description: 'Sentado na máquina, segure a barra com uma pegada aberta. Puxe a barra em direção ao peito, contraindo os músculos das costas, e retorne lentamente.',
      tips: [
        'Mantenha o peito estufado e as costas retas.',
        'Puxe com os cotovelos, não com os braços.',
        'Evite balançar o corpo para ajudar no movimento.'
      ],
    },
  ],
  pernas: [
    {
      id: 'agachamento-livre',
      name: 'Agachamento Livre',
      sets: '4',
      reps: '8-12',
      rest: '90s',
      videoUrl: '',
      description: 'Com a barra apoiada nos ombros, agache como se fosse sentar em uma cadeira, mantendo as costas retas. Desça até os joelhos formarem um ângulo de 90 graus e retorne.',
      tips: [
        'Mantenha os joelhos alinhados com os pés.',
        'Olhe para a frente, não para baixo.',
        'Mantenha o abdômen contraído durante todo o movimento.'
      ],
    },
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
    { name: 'Supino Reto', sets: '4', reps: '10' },
    { name: 'Crucifixo Inclinado', sets: '3', reps: '12' },
    { name: 'Flexão de Braços', sets: '3', reps: 'Até a falha' },
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
      { title: 'Cuidado com Calorias Líquidas', content: 'Refrigerantes, sucos industrializados e bebidas alcoólicas são ricos em calorias e pobres em nutrientes.' },
    ],
  },
  hipertrofia: {
    category: 'Hipertrofia',
    tips: [
      { title: 'Superávit Calórico', content: 'Para construir músculos, você precisa consumir mais calorias do que gasta. Aumente a ingestão de forma controlada.' },
      { title: 'Proteína em Todas as Refeições', content: 'Consuma fontes de proteína em todas as suas refeições para otimizar a síntese proteica muscular.' },
      { title: 'Carboidratos Complexos', content: 'Carboidratos são a principal fonte de energia para treinos intensos. Escolha fontes como batata doce, arroz integral e aveia.' },
    ],
  },
  energia: {
    category: 'Energia para Treino',
    tips: [
      { title: 'Não Pule o Café da Manhã', content: 'Uma refeição balanceada pela manhã fornece a energia inicial para as atividades do dia.' },
      { title: 'Lanches Inteligentes', content: 'Faça pequenos lanches entre as refeições principais para manter os níveis de energia estáveis.' },
      { title: 'Durma Bem', content: 'O sono é fundamental para a recuperação e para garantir que você tenha energia para treinar no dia seguinte.' },
    ],
  },
  'pre-treino': {
    category: 'Pré-Treino',
    tips: [
      { title: 'Carboidrato e Proteína', content: 'Consuma uma refeição leve de 1 a 2 horas antes do treino, contendo carboidratos de fácil digestão e uma fonte de proteína.' },
      { title: 'Exemplo de Refeição', content: 'Banana com pasta de amendoim ou uma porção de iogurte com aveia são ótimas opções.' },
      { title: 'Evite Gorduras e Fibras', content: 'Alimentos ricos em gordura ou fibras podem causar desconforto gástrico durante o treino.' },
    ],
  },
  'pos-treino': {
    category: 'Pós-Treino',
    tips: [
      { title: 'Janela de Oportunidade', content: 'Consuma uma refeição rica em proteínas e carboidratos até 2 horas após o treino para otimizar a recuperação e o crescimento muscular.' },
      { title: 'Shake de Proteína', content: 'Um shake de whey protein com uma fonte de carboidrato rápido, como maltodextrina ou uma fruta, é uma opção prática e eficiente.' },
      { title: 'Refeição Sólida', content: 'Se preferir, uma refeição como frango grelhado com arroz branco também é uma excelente escolha para o pós-treino.' },
    ],
  },
};

export { placeHolderImages } from './placeholder-images';
