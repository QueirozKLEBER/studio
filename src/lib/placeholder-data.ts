export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipmentType: 'Máquina' | 'Barra' | 'Halteres' | 'Livre' | 'Peso do corpo' | 'Cabo/Polia';
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
  { id: 'gluteos', name: 'Glúteos', icon: 'Glutes' },
  { id: 'abdomen', name: 'Abdômen', icon: 'Abs' },
  { id: 'panturrilha', name: 'Panturrilha', icon: 'Calves' },
];

export const exercises: Record<string, Exercise[]> = {
  peito: [
    {
      id: 'supino-reto-barra',
      name: 'Supino Reto com Barra',
      muscleGroup: 'Peito',
      secondaryMuscles: ['Tríceps', 'Deltóide Anterior'],
      equipmentType: 'Barra',
      difficulty: 'Intermediário',
      sets: '4',
      reps: '8-12',
      rest: '60-90s',
      videoUrl: '',
      description: 'Deitado em um banco reto, segure a barra com as mãos um pouco mais afastadas que a largura dos ombros. Desça a barra até tocar levemente o peito e empurre de volta à posição inicial.',
      tips: [
        'Mantenha os pés firmes no chão.',
        'Retraia as escápulas antes de iniciar o movimento.',
        'Mantenha os cotovelos a cerca de 45-75 graus do tronco.'
      ],
      commonErrors: [
        'Bater a barra no peito.',
        'Retirar os glúteos do banco.',
        'Estender os cotovelos bruscamente no topo.'
      ],
      safetyTips: [
        'Sempre use um assistente (spotter) ao carregar pesos pesados.',
        'Certifique-se de que a barra está travada corretamente nos suportes.'
      ],
      variations: ['Supino com Halteres', 'Supino com Pegada Fechada', 'Supino no Smith']
    },
    {
      id: 'peck-deck',
      name: 'Peck Deck (Voador)',
      muscleGroup: 'Peito',
      secondaryMuscles: ['Deltóide Anterior'],
      equipmentType: 'Máquina',
      difficulty: 'Iniciante',
      sets: '3',
      reps: '12-15',
      rest: '60s',
      videoUrl: '',
      description: 'Sentado na máquina, apoie as costas no encosto. Segure as manoplas e feche os braços à frente do corpo, contraindo o peitoral. Retorne lentamente sentindo o alongamento.',
      tips: [
        'Mantenha o peito estufado.',
        'Não deixe os braços irem muito atrás da linha do tronco para proteger os ombros.',
        'Concentre-se na contração máxima no centro.'
      ],
      commonErrors: [
        'Usar impulso exagerado.',
        'Encolher os ombros durante o movimento.',
        'Amplitude de movimento muito curta.'
      ],
      safetyTips: [
        'Ajuste a altura do banco para que as mãos fiquem na linha do peito.',
        'Evite cargas que não permitem o controle total.'
      ],
      variations: ['Crucifixo com Halteres', 'Crossover polia média']
    },
    {
      id: 'flexao-braço',
      name: 'Flexão de Braço',
      muscleGroup: 'Peito',
      secondaryMuscles: ['Tríceps', 'Core'],
      equipmentType: 'Peso do corpo',
      difficulty: 'Iniciante',
      sets: '3',
      reps: 'Até a falha',
      rest: '60s',
      videoUrl: '',
      description: 'Em posição de prancha, desça o corpo mantendo o tronco reto até o peito quase tocar o chão. Empurre de volta à posição inicial.',
      tips: [
        'Mantenha o abdômen contraído.',
        'Olhe ligeiramente à frente para alinhar a coluna.',
        'Cotovelos devem apontar para trás, não para os lados.'
      ],
      commonErrors: [
        'Deixar o quadril cair ou subir demais.',
        'Movimento incompleto.',
        'Posição das mãos desalinhada.'
      ],
      safetyTips: [
        'Se for iniciante, comece com os joelhos no chão.',
        'Pare se sentir dor aguda nos punhos ou ombros.'
      ],
      variations: ['Flexão Inclinada', 'Flexão Diamante', 'Flexão com Palmas']
    }
  ],
  pernas: [
    {
      id: 'agachamento-livre',
      name: 'Agachamento Livre',
      muscleGroup: 'Pernas',
      secondaryMuscles: ['Glúteos', 'Lombar', 'Core'],
      equipmentType: 'Barra',
      difficulty: 'Avançado',
      sets: '4',
      reps: '8-10',
      rest: '90-120s',
      videoUrl: '',
      description: 'Com a barra nos ombros, agache como se fosse sentar em uma cadeira, mantendo o calcanhar firme no chão e o peito aberto. Desça até as coxas ficarem paralelas ao chão.',
      tips: [
        'Mantenha a coluna neutra.',
        'Inicie o movimento jogando o quadril para trás.',
        'Joelhos devem seguir a direção da ponta dos pés.'
      ],
      commonErrors: [
        'Projetar os joelhos excessivamente para dentro (valgo dinâmico).',
        'Tirar os calcanhares do chão.',
        'Arredondar a coluna lombar.'
      ],
      safetyTips: [
        'Sempre use a trava de segurança no rack.',
        'Mantenha o olhar no horizonte.'
      ],
      variations: ['Agachamento Frontal', 'Agachamento Sumô', 'Agachamento Búlgaro']
    },
    {
      id: 'leg-press-45',
      name: 'Leg Press 45°',
      muscleGroup: 'Pernas',
      secondaryMuscles: ['Glúteos', 'Panturrilha'],
      equipmentType: 'Máquina',
      difficulty: 'Intermediário',
      sets: '4',
      reps: '10-12',
      rest: '90s',
      videoUrl: '',
      description: 'Sentado na máquina, apoie os pés na plataforma na largura dos ombros. Destrave o peso e desça lentamente até as coxas aproximarem-se do tronco. Empurre de volta sem bloquear os joelhos.',
      tips: [
        'Não tire o quadril do banco durante a descida.',
        'Mantenha a pressão no meio do pé e calcanhares.',
        'Respire durante o esforço.'
      ],
      commonErrors: [
        'Estender totalmente (bloquear) os joelhos no topo.',
        'Amplitude muito curta.',
        'Mãos nos joelhos para ajudar.'
      ],
      safetyTips: [
        'Nunca retire as mãos das travas de segurança enquanto o peso estiver em movimento.',
        'Verifique se os pés estão bem posicionados e secos.'
      ],
      variations: ['Leg Press Horizontal', 'Leg Press Unilateral']
    }
  ],
  costas: [
    {
      id: 'puxada-frontal',
      name: 'Puxada Frontal',
      muscleGroup: 'Costas',
      secondaryMuscles: ['Bíceps', 'Deltóide Posterior'],
      equipmentType: 'Máquina',
      difficulty: 'Iniciante',
      sets: '4',
      reps: '10-12',
      rest: '60s',
      videoUrl: '',
      description: 'Sentado na máquina, puxe a barra em direção ao peito, focando em trazer os cotovelos para baixo e para trás. Retorne controladamente.',
      tips: [
        'Mantenha o peito inclinado levemente para cima.',
        'Imagine que suas mãos são apenas ganchos, puxe com os cotovelos.',
        'Contraia as escápulas na parte baixa do movimento.'
      ],
      commonErrors: [
        'Balançar o corpo para trás para ganhar impulso.',
        'Puxar a barra atrás da nuca (risco para ombros).',
        'Não estender totalmente os braços na subida.'
      ],
      safetyTips: [
        'Ajuste o apoio das coxas para que você fique firme no banco.',
        'Não use uma carga que te obrigue a perder a postura.'
      ],
      variations: ['Puxada com Triângulo', 'Puxada com Pegada Supinada', 'Puxada Unilateral']
    }
  ],
  ombros: [
    {
      id: 'desenvolvimento-halteres',
      name: 'Desenvolvimento com Halteres',
      muscleGroup: 'Ombros',
      secondaryMuscles: ['Tríceps'],
      equipmentType: 'Halteres',
      difficulty: 'Intermediário',
      sets: '4',
      reps: '8-12',
      rest: '60-90s',
      videoUrl: '',
      description: 'Sentado ou em pé, leve os halteres à altura dos ombros. Empurre-os para cima até que os braços estejam quase estendidos e retorne lentamente.',
      tips: [
        'Mantenha o core contraído para estabilizar a coluna.',
        'Não bata os halteres no topo.',
        'Mantenha os cotovelos ligeiramente à frente da linha dos ombros.'
      ],
      commonErrors: [
        'Arquear excessivamente a lombar.',
        'Usar impulso com as pernas (a menos que seja um Push Press).',
        'Amplitude incompleta.'
      ],
      safetyTips: [
        'Se fizer em pé, mantenha os joelhos levemente flexionados.',
        'Cuidado ao colocar e retirar os halteres do chão.'
      ],
      variations: ['Desenvolvimento com Barra', 'Arnold Press', 'Desenvolvimento na Máquina']
    },
    {
      id: 'elevacao-lateral',
      name: 'Elevação Lateral',
      muscleGroup: 'Ombros',
      secondaryMuscles: ['Trapézio Superior'],
      equipmentType: 'Halteres',
      difficulty: 'Intermediário',
      sets: '3',
      reps: '12-15',
      rest: '60s',
      videoUrl: '',
      description: 'Em pé, com um halter em cada mão, eleve os braços lateralmente até a altura dos ombros. Mantenha os braços ligeiramente flexionados e retorne lentamente.',
      tips: [
        'O foco deve ser o deltoide lateral.',
        'Mantenha o punho firme.',
        'Pense em "afastar" o peso do corpo, não apenas subir.'
      ],
      commonErrors: [
        'Subir o peso acima da linha dos ombros.',
        'Usar o trapézio para "dar de ombros".',
        'Balançar o tronco.'
      ],
      safetyTips: [
        'Use pesos moderados; este é um exercício de isolamento.',
        'Evite movimentos bruscos.'
      ],
      variations: ['Elevação Lateral no Cabo', 'Elevação Lateral Sentado']
    }
  ],
  biceps: [
    {
      id: 'rosca-direta-barra',
      name: 'Rosca Direta com Barra',
      muscleGroup: 'Bíceps',
      secondaryMuscles: ['Antebraço'],
      equipmentType: 'Barra',
      difficulty: 'Iniciante',
      sets: '3',
      reps: '10-12',
      rest: '60s',
      videoUrl: '',
      description: 'Em pé, segure a barra com as palmas voltadas para cima. Flexione os cotovelos levando a barra em direção aos ombros e retorne controladamente.',
      tips: [
        'Mantenha os cotovelos fixos ao lado do corpo.',
        'Não use o balanço do corpo.',
        'Estenda quase totalmente os braços na descida.'
      ],
      commonErrors: [
        'Mover os cotovelos para frente durante a subida.',
        'Encurtar a amplitude na descida.',
        'Pulso "quebrado" ou frouxo.'
      ],
      safetyTips: [
        'Mantenha os joelhos relaxados.',
        'Cuidado com a carga para não sobrecarregar a lombar.'
      ],
      variations: ['Rosca com Barra W', 'Rosca Alternada com Halteres', 'Rosca Martelo']
    }
  ],
  triceps: [
    {
      id: 'triceps-pulley',
      name: 'Tríceps Pulley (Corda ou Barra)',
      muscleGroup: 'Tríceps',
      secondaryMuscles: [],
      equipmentType: 'Cabo/Polia',
      difficulty: 'Iniciante',
      sets: '3',
      reps: '12-15',
      rest: '60s',
      videoUrl: '',
      description: 'Na polia alta, empurre a barra ou corda para baixo até estender totalmente os braços, focando na contração do tríceps. Retorne lentamente.',
      tips: [
        'Mantenha os ombros para baixo e cotovelos fixos.',
        'Se usar corda, abra as pontas no final do movimento para contração extra.',
        'Mantenha o peito estufado.'
      ],
      commonErrors: [
        'Usar o peso do corpo para empurrar.',
        'Abrir os cotovelos para os lados.',
        'Deixar os ombros subirem em direção às orelhas.'
      ],
      safetyTips: [
        'Mantenha uma base estável com os pés.',
        'Controle a velocidade, especialmente na volta (fase excêntrica).'
      ],
      variations: ['Tríceps Testa', 'Tríceps Francês', 'Mergulho no Banco']
    }
  ],
  abdomen: [
    {
      id: 'abdominal-crunch',
      name: 'Abdominal Crunch',
      muscleGroup: 'Abdômen',
      secondaryMuscles: [],
      equipmentType: 'Peso do corpo',
      difficulty: 'Iniciante',
      sets: '3',
      reps: '15-20',
      rest: '45s',
      videoUrl: '',
      description: 'Deitado de costas, flexione as pernas. Eleve apenas a parte superior das costas, focando na contração do abdômen, e retorne.',
      tips: [
        'Não puxe o pescoço com as mãos.',
        'Solte o ar na subida.',
        'Mantenha o queixo longe do peito.'
      ],
      commonErrors: [
        'Usar os braços para puxar a cabeça.',
        'Subir o tronco inteiro (o foco é apenas a flexão da coluna).',
        'Movimento muito rápido.'
      ],
      safetyTips: [
        'Mantenha a lombar encostada no chão.',
        'Se tiver dor no pescoço, olhe para um ponto fixo no teto.'
      ],
      variations: ['Abdominal no Cabo', 'Prancha Isométrica', 'Elevação de Pernas']
    }
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
