export interface Article {
  id: string;
  title: string;
  category: 'energy' | 'recycling' | 'food' | 'transport';
  icon: string;
  summary: string;
  content: string[];
  tips: string[];
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of options
  expertExplanation: string;
  pointsAwarded: number;
}

export interface EcoChallenge {
  day: number;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'food' | 'lifestyle';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  co2Savings: number; // kg saved
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedLabel: string;
}

export const ARTICLES: Article[] = [
  {
    id: 'renewable_energy',
    title: 'The Roadmap to Renewable Energy at Home',
    category: 'energy',
    icon: 'Sun',
    summary: 'Discover how switching to clean power, optimizing appliance usage, and upgrading insulation can cut up to 40% of home emissions.',
    content: [
      'Residential energy use is one of the leading contributors to individual carbon footprints. Most electrical grids still rely heavily on burning fossil fuels like coal and gas.',
      'To mitigate this impact, transition strategies include both structural changes—like installing rooftop photovoltaic solar panels or signing up for green energy tariffs with utility providers—and operational efficiency upgrades.',
      'Small shifts like switching to LED lighting, sealing windows and attic gaps, and smart thermostat scheduling drastically reduce standby electricity loss (vampire load).'
    ],
    tips: [
      'Switch off devices at the wall to prevent standby "phantom" loads.',
      'Adjust your thermostat by just 1–2°C to save up to 10% on energy costs.',
      'Verify if your regional power provider offers a Certified renewable or 100% Green electricity standard.'
    ]
  },
  {
    id: 'recycling_secrets',
    title: 'The Circular Economy & Intelligent Recycling',
    category: 'recycling',
    icon: 'RefreshCw',
    summary: 'Move beyond standard bin sorting. Learn about composting organic waste, refusing single-use packages, and the real footprint of materials.',
    content: [
      'Traditional waste structures emit methane—a greenhouse gas 25 times more potent than carbon dioxide—as materials decay anaerobically in dense landfills.',
      'Unrefined plastics require petroleum extraction to produce, whereas aluminum and cardboard recycling saves up to 95% and 60% of the energy needed for virgin processing respectively.',
      'Prioritize refusing over recycling. Upcycling, using beeswax wraps, and keeping high-quality products in circulation longer are core tactics of modern green living.'
    ],
    tips: [
      'Clean food residues from plastics and paper before sorting, as oily scraps ruin raw recycling batches.',
      'Decline plastic cutlery and synthetic packing bags, substituting with sturdy reusable fabrics.',
      'Initiate raw organic food scrap composting to slash household landfill contributions by half.'
    ]
  },
  {
    id: 'sustainable_food',
    title: 'Plant Forward: Transforming Your Carbon Plate',
    category: 'food',
    icon: 'Apple',
    summary: 'An honest look at food production. Understand why red meat breeds high emissions and how buying locally preserves soil carbon.',
    content: [
      'Agricultural food production represents roughly 26% of global carbon emissions. The primary driver of high footprint density is beef production, demanding extensive land clearing and producing high enteric fermentation (methane).',
      'Producing 1 kg of beef releases approximately 27-60 kg of CO2 equivalent, while vegetables and grains stay well under 2 kg.',
      'Local seasonal consumption has double-sided benefits: it minimizes cold-freight shipping emissions (food-miles) while actively funding regenerative farming practices.'
    ],
    tips: [
      'Dedicate at least two days a week to completely organic, plant-based vegan nutrition.',
      'Map your grocery buy to seasonal, nearby harvests to limit long-distance cooling logistics.',
      'Track pantry items deliberately to prevent food spoilage, which silently accounts for roughly 8% of global emissions.'
    ]
  },
  {
    id: 'green_transportation',
    title: 'Active Travel & Decarbonized Mobility',
    category: 'transport',
    icon: 'Navigation',
    summary: 'From micro-mobility to electric vehicles. How sharing transit, standard biking, and strategic route plotting can clear city air waves.',
    content: [
      'Internal combustion engine vehicles are highly inefficient, wasting up to 70% of energy as friction heating instead of vehicle movement.',
      'By utilizing active transportation (biking, walking) or electric micro-mobility (e-bikes, electric scooters), you entirely eliminate tailpipe emissions.',
      'When driving is unavoidable, maintaining proper tire inflation, avoiding rapid acceleration bursts, and carpooling can easily boost fuel efficiency by 20% to 30%.'
    ],
    tips: [
      'Combine multiple minor car errands into a single circular trip to prevent starting cold engines.',
      'Replace all individual vehicle journeys under 3 km with walking or a bicycle trip.',
      'Prefer rail train travel over regional flight connections whenever schedules allow.'
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'energy',
    question: 'Which home appliance typically consumes the highest percentage of electrical energy in standard residential homes?',
    options: ['LED Lighting sets', 'Heating, Ventilation, and Air Conditioning (HVAC)', 'Microwaves & Smart ovens', 'Double-door Refrigerators'],
    correctAnswer: 1,
    expertExplanation: 'HVAC systems represent roughly 40-50% of typical home energy bills. Optimizing temperature controls and checking duct insulation yields the fastest carbon reductions.',
    pointsAwarded: 25
  },
  {
    id: 'q2',
    category: 'recycling',
    question: 'Why does throwing raw food waste into standard landfill trash bins lead to elevated greenhouse gas intensity?',
    options: [
      'Food waste solidifies plastic containers.',
      'It decays under anaerobic conditions in landfills, producing mass methane (CH4) gas.',
      'Food releases aggressive chemical acids that corrode landfills.',
      'It attracts local wild animals, which decreases native ecosystem carbon sinks.'
    ],
    correctAnswer: 1,
    expertExplanation: 'In dense, oxygen-depleted landfills, organic waste is broken down by anaerobic bacteria, emitting large amounts of methane which is highly potent at trapping ambient planetary heat.',
    pointsAwarded: 25
  },
  {
    id: 'q3',
    category: 'food',
    question: 'Approximately how much more carbon-intensive is 1kg of beef compared to 1kg of standard soy-based tofu?',
    options: ['Soy and Beef have equal footprint tags', 'Beef is twice as intensive', 'Beef is about 15 to 20 times more intensive', 'Tofu is actually slightly higher'],
    correctAnswer: 2,
    expertExplanation: 'Beef production creates huge carbon outputs due to enteric methane emissions from cows, massive water needs, and deforestation to grow cattle grazing pasture. Plant options like tofu produce a minor fraction of that footprint.',
    pointsAwarded: 25
  },
  {
    id: 'q4',
    category: 'transport',
    question: 'Standard regional airline flight emissions are calculated per passenger. How does flying compare to taking high-speed electric trains?',
    options: [
      'High-speed trains emit about 80-90% less CO2 per passenger than regional flights.',
      'Flights are cleaner because planes carry items faster.',
      'Both have identical footprint totals since grids charge trains.',
      'Trains consume more fossil fuel than modern airliners.'
    ],
    correctAnswer: 0,
    expertExplanation: 'Electric trains rely on electric grids which are increasingly powered by sustainable energy sources, making rail the cleanest travel choice alongside active mobility.',
    pointsAwarded: 25
  }
];

export const SEVEN_DAY_CHALLENGE: EcoChallenge[] = [
  {
    day: 1,
    title: 'Active Mobility Debut',
    description: 'Avoid unnecessary single-passenger car trips today. Walk, cycle, or use the bus/metro for any journeys under 5km.',
    category: 'transport',
    difficulty: 'Easy',
    co2Savings: 5.2
  },
  {
    day: 2,
    title: 'Phantom Power Lockdown',
    description: 'Identify and turn off "vampire" energy users. Unplug television adapters, phone chargers, and desk electronics before bedtime.',
    category: 'energy',
    difficulty: 'Easy',
    co2Savings: 1.8
  },
  {
    day: 3,
    title: 'Herbivore Feast',
    description: 'Eat 100% plant-based today. Substitute meat and processed dairy with fresh legumes, nuts, oats, and organic local vegetables.',
    category: 'food',
    difficulty: 'Medium',
    co2Savings: 8.5
  },
  {
    day: 4,
    title: 'Circular Zero Waste',
    description: 'Avoid single-use plastics altogether. Bring reusable bags, cups, and food boxes. Clean and compost organic waste.',
    category: 'lifestyle',
    difficulty: 'Medium',
    co2Savings: 2.1
  },
  {
    day: 5,
    title: 'Natural Thermo Mode',
    description: 'Limit AC running time. Keep cooling strictly at or above 24°C, utilizing curtains or cross-breezes of windows.',
    category: 'energy',
    difficulty: 'Medium',
    co2Savings: 4.5
  },
  {
    day: 6,
    title: 'Apparel Reset & Mend',
    description: 'Avoid quick retail shopping online. Inspect, iron, mend, or donate existing garments. Choose a second-hand look.',
    category: 'lifestyle',
    difficulty: 'Medium',
    co2Savings: 12.0
  },
  {
    day: 7,
    title: 'Solar & Carbon Inspection',
    description: 'Conduct a personal or household carbon inventory. Write down goals to cut your overall monthly footprint.',
    category: 'lifestyle',
    difficulty: 'Hard',
    co2Savings: 15.0
  }
];

export const BADGES: Badge[] = [
  {
    id: 'car_free_day',
    title: 'Car-Free Day',
    description: 'Logged less than 5km of driving on a weekly entry or marked public transport habit active.',
    iconName: 'Bike',
    unlockedLabel: 'Green Mobility Trailblazer'
  },
  {
    id: 'energy_saver',
    title: 'Energy Saver',
    description: 'Kept residential electricity below 100 kWh or registered renewable offsets.',
    iconName: 'ZapOff',
    unlockedLabel: 'Grid Decarbonization Envoy'
  },
  {
    id: 'zero_waste_hero',
    title: 'Zero Waste Hero',
    description: 'Reported minimal waste bags, composting habits, and zero unnecessary food discards.',
    iconName: 'Trash',
    unlockedLabel: 'Circular Steward'
  },
  {
    id: 'quiz_wizard',
    title: 'Quiz Wizard',
    description: 'Answered all Quiz Hub questions correctly and loaded the scientific database insights.',
    iconName: 'GraduationCap',
    unlockedLabel: 'Ecosystem Authority'
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Achieved an eco-friendly streak of 5 days or more on your habit tracking checklist.',
    iconName: 'Flame',
    unlockedLabel: 'Climate Sentinel'
  },
  {
    id: 'family_captain',
    title: 'Family Captain',
    description: 'Registered multi-member family emissions and calculated aggregate saving steps.',
    iconName: 'Users',
    unlockedLabel: 'Community Green Leader'
  }
];
