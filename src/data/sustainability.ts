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
    id: 'renewable_storage',
    title: 'Smart Grids, Home Batteries, & Peaker Mitigation',
    category: 'energy',
    icon: 'Sun',
    summary: 'Learn how decentralized home battery banks, vehicle-to-grid tech, and peak shaving shield grids from polluting fossil fuel peaker plants.',
    content: [
      'While solar panels capture clean photons, generation curves rarely align with peak energy demands, which surge between 5 PM and 9 PM. During these tight intervals, grids turn to carbon-heavy peaker plants to prevent blackouts.',
      'Implementing residential battery storage (such as lithium-iron-phosphate packs) enables homeowners to store excess afternoon clean power and utilize it at night.',
      'This paradigm shift—known as peak demand shaving—lowers baseline grid volatility, avoids costly transmission expansions, and transforms standard households from passive energy consumers into active clean grid stabilization units.'
    ],
    tips: [
      'Program heavier thermal appliances (dishwashers, heat pump cycles) to trigger during midday peak solar generation.',
      'Investigate if your local utility offers peer-to-peer virtual power plant (VPP) credits for grid discharging.',
      'Upgrade your home panel with dynamic load managers that automatically shed background loads during extreme demand cycles.'
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
    id: 'ewaste_circularity',
    title: 'Electronic Waste & The Rare Earth Dilemma',
    category: 'recycling',
    icon: 'RefreshCw',
    summary: 'Explore the compounding impact of discarded circuitry, lithium cell extraction, and methods to safely recover tech minerals.',
    content: [
      'Electronic waste is growing three times faster than other domestic waste streams. Circuits are packed with valuable gold, copper, and critical rare-earth metals whose core mining processes damage virgin ecosystems.',
      'When thrown into standard garbage bins, lead, cadmium, and mercury chemicals leak from circuit boards and batteries, contaminating local aquifers and natural food chains.',
      'Closing the electronics loop requires robust take-back designs, recycling batteries at dedicated thermal depots, and practicing "Right to Repair" principles to extend device lifecycles before recycling.'
    ],
    tips: [
      'Never dump discarded smartphones, rechargeable batteries, or cable cords in standard trash bins.',
      'Utilize manufacturer trade-in recycle portals or regional hazardous hardware deposit depots.',
      'Seek refurbished models when buying replacement hardware to lessen upstream mining demands.'
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
    id: 'aquatic_blue_carbon',
    title: 'Marine Blue Carbon & Regenerative Aquatic Food',
    category: 'food',
    icon: 'Apple',
    summary: 'How shifting protein sourcing from livestock to low-trophic shellfish and sea kelp heals our biological carbon sinks.',
    content: [
      'Our oceans absorb about 25% of all anthropogenic CO2 emissions, yet intensive industrial commercial fishing and bottom-trawling release huge carbon deposits trapped in deep seabed sediments.',
      'Moving toward a plant-forward or bivalve-centric diet—such as kelp, seaweeds, local mussels, and wild oysters—provides stellar nutritional profiles with active ecosystem advantages.',
      'These zero-input aquaculture organisms filter regional waterways, require no synthetic fertilizers, and play a pivotal role in bio-carbon storage by sinking active carbons long-term.'
    ],
    tips: [
      'Incorporate edible kelp, spirulina, and sustainably-farmed sea vegetables into meal rotations.',
      'Choose low-trophic shellfish (mussels, oysters, clams) which act as active net-carbon filter feeds.',
      'Check marine conservation certificates on seafood packages to ensure bottom-trawling methods were avoided.'
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
  },
  {
    id: 'q5',
    category: 'energy',
    question: 'What is meant by the "embodied carbon" of a consumer product (like a smartphone or laptop)?',
    options: [
      'The thermal carbon released when a product is incinerated.',
      'The amount of pure carbon contained within the physical chemical alloys.',
      'The sum of all greenhouse gas emissions generated during resource mining, manufacturing, assembly, and ocean transportation.',
      'The static state electricity a product absorbs while sleeping in the retail store box.'
    ],
    correctAnswer: 2,
    expertExplanation: 'Embodied carbon captures the entire lifecycle emission total of products before they are turned on for the first time. For gadgets, up to 80% of their lifecycle footprint occurs during initial resource mining and assembly processes.',
    pointsAwarded: 25
  },
  {
    id: 'q6',
    category: 'recycling',
    question: 'Which material can be recycled indefinitely without experiencing any loss in its structural quality, purity, or strength?',
    options: [
      'Oily cardboard and pizza boxes',
      'High-density polyethylene (HDPE) milk cartons',
      'Elemental Aluminum and standard Glass container vessels',
      'Bleached white office paper pulp sheets'
    ],
    correctAnswer: 2,
    expertExplanation: 'Metals like Aluminum and silicate Glass keep their pristine atomic properties when melted down during reprocessing cycles, saving vast upstream energy outputs indefinitely. Paper and plastics undergo active polymer degradation and can only be downcycled a few times.',
    pointsAwarded: 30
  },
  {
    id: 'q7',
    category: 'food',
    question: 'Which potent greenhouse gas is emitted on a large scale during flooded rice cultivation due to anaerobic soil conditions?',
    options: [
      'Sulfur Hexafluoride (SF6)',
      'Biogenic Methane (CH4)',
      'Sub-surface Ozone (O3)',
      'Chlorofluorocarbon particles (CFC)'
    ],
    correctAnswer: 1,
    expertExplanation: 'Continually flooded rice paddies create an oxygen-depleted sub-surface soil habitat where archaea organisms generate biogenic methane. Shaking up drainage habits like "Alternate Wetting and Drying" (AWD) cuts methane outputs by 50%.',
    pointsAwarded: 30
  },
  {
    id: 'q8',
    category: 'transport',
    question: 'What is the physical mechanical benefit of keeping highway speed around 90-100 km/h (55-60 mph) rather than 120-130 km/h (75-80 mph)?',
    options: [
      'It allows mechanical cooling systems to dump heat through active exhaust fans.',
      'It prevents raw motor oil from thinning during combustion phases.',
      'It respects aerodynamic drag ratios—slashing fuel consumption and tailpipe outputs by up to 20%.',
      'It keeps the tires at optimized temperatures to absorb low-altitude atmospheric carbons.'
    ],
    correctAnswer: 2,
    expertExplanation: 'Aerodynamic resistance increases exponentially with speed. Slowing down slightly lowers regional drag forces, maximizing standard motor fuel yields and cutting heavy exhaust rates.',
    pointsAwarded: 25
  },
  {
    id: 'q9',
    category: 'circular economy',
    question: 'What is the core principle of a "Circular Economy" compared to the traditional "Linear Economy"?',
    options: [
      'Using products once and placing them in deep trash bins to isolate them.',
      'Designing out waste and pollution, keeping products and materials in high-value use, and regenerating natural systems.',
      'Transferring physical manufacturing plants to alternative geographic locations.',
      'Converting all consumer physical paper booklets into clean digital tablets.'
    ],
    correctAnswer: 1,
    expertExplanation: 'While linear workflows rely on a "take-make-waste" model, circular design aims to eliminate waste from the start by designing products for durability, reuse, disassembly, and premium composting.',
    pointsAwarded: 30
  },
  {
    id: 'q10',
    category: 'water',
    question: 'Approximately what percentage of the Earth\'s water is freshwater and easily accessible for human use?',
    options: [
      'About 30% of total ocean water.',
      'Slightly less than 1%.',
      'Exactly 10%.',
      'Almost 75% due to deep melting glaciers.'
    ],
    correctAnswer: 1,
    expertExplanation: 'About 97% of Earth\'s water is saltwater, and of the remaining 3% freshwater, most is trapped in glaciers or deep underground aquifers. Accessible surface freshwater accounts for less than 1%, rendering deep conservation essential.',
    pointsAwarded: 25
  },
  {
    id: 'q11',
    category: 'biodiversity',
    question: 'How does maintaining rich plant and species biodiversity directly support planetary climate resilience?',
    options: [
      'Wild species absorb noise pollution from regional highways.',
      'Diverse ecosystems create complex feedback loops that regulate temperatures, filter rivers, pollinate crops, and store more secure carbon than monocultures.',
      'Animals actively clear landfill waste via consumption.',
      'Biodiversity has no direct relation to carbon or climate indexes.'
    ],
    correctAnswer: 1,
    expertExplanation: 'Biodiverse ecosystems (like diverse wetlands and old-growth forests) are far more resilient to pests, droughts, and environmental stress. Their complex, layered biomass operates as a highly stable, long-term carbon sink.',
    pointsAwarded: 30
  },
  {
    id: 'q12',
    category: 'circular economy',
    question: 'What is "Planned Obsolescence" and how does it impact natural resource extraction rates?',
    options: [
      'The scheduled upgrade of regional public transit schedules.',
      'The intentional design of products to have a limited useful life, forcing consumers to purchase replacements frequently.',
      'Selecting recycled raw materials before beginning physical assembly.',
      'The automatic cooling of high-temperature servers during off-peak night hours.'
    ],
    correctAnswer: 1,
    expertExplanation: 'Planned obsolescence results in excessive electronic waste and escalates resource mining for metals like cobalt, lithium, and rare-earth materials. Fighting this involves choosing modular, upgradeable devices and supporting Right to Repair.',
    pointsAwarded: 25
  },
  {
    id: 'q13',
    category: 'water',
    question: 'Which day-to-day household habit consumes the most "virtual" or "indirect" freshwater, far exceeding physical tap water use?',
    options: [
      'Leaving the sink running while brushing teeth.',
      'Taking short 5-minute warm showers.',
      'The food we consume, particularly livestock products requiring thousands of liters of intensive feed irrigation.',
      'Running the kitchen dishwasher twice a day.'
    ],
    correctAnswer: 2,
    expertExplanation: 'Virtual water represents the hidden water used to produce crops and livestock. Producing a single beef loin requires massive amounts of irrigated crop feed, making our diet choices our single largest virtual water driver.',
    pointsAwarded: 30
  },
  {
    id: 'q14',
    category: 'biodiversity',
    question: 'What is a "Keystone Species" and what happens to its native ecosystem if it is lost?',
    options: [
      'Any common species with a high localized population count.',
      'A species that has a disproportionately large effect on its natural environment, whose removal can cause an entire ecosystem structure to collapse.',
      'A migratory bird species that nests strictly on artificial building ledges.',
      'Exotic plants cultivated exclusively in commercial glass greenhouses.'
    ],
    correctAnswer: 1,
    expertExplanation: 'Keystone species—such as sea otters regulating sea urchins or wolves structuring riverbank flora—hold the food web together. Their disappearance triggers a destructive trophic cascade, eroding overall biodiversity and carbon-offset potential.',
    pointsAwarded: 30
  },
  {
    id: 'q15',
    category: 'circular economy',
    question: 'What is the primary difference between "Recycling" and "Upcycling"?',
    options: [
      'Recycling is performed at home, while upcycling requires professional industrial incinerators.',
      'Recycling breaks a material back down to its raw state for reprocessing, while Upcycling refashions an intact item into a higher-value product.',
      'Upcycling is only applicable to clothing, while recycling handles aluminum cans.',
      'Upcycling is highly carbon-intensive, and recycling is carbon-neutral.'
    ],
    correctAnswer: 1,
    expertExplanation: 'Upcycling avoids the massive energy expenditure and carbon footprint needed to melt down, grind, or chemically alter raw materials—it relies on creative design to extend life-extension.',
    pointsAwarded: 25
  },
  {
    id: 'q16',
    category: 'water',
    question: 'How does planting native grass and local shrubs (Xeriscaping) instead of exotic lawns conserve regional freshwater?',
    options: [
      'Native plants extract moisture from passing cloud banks.',
      'Native species are pre-adapted to regional rainfall cycles, requiring little to no supplemental watering or synthetic chemical treatments.',
      'Grass lawns actively evaporate groundwater into the atmosphere.',
      'Local shrubs physically absorb water from heavy regional sewage grids.'
    ],
    correctAnswer: 1,
    expertExplanation: 'Unlike non-native grasses that depend on daily irrigation, native plants possess deep root networks adapted to local soils and rainfall climates, completely eliminating the need for clean drinking water for landscaping.',
    pointsAwarded: 25
  },
  {
    id: 'q17',
    category: 'biodiversity',
    question: 'How do healthy coastal Mangrove wetlands protect coastlines and capture carbon compared to tropical rainforests on land?',
    options: [
      'They reflect ambient sunlight using glossy leaf coatings.',
      'Their interlocking waterlogged roots store carbon up to 4x faster per acre than land-based tropical forests while buffering coastlines from storms.',
      'They convert incoming ocean salt directly into soil carbon.',
      'Mangroves consume invasive seaweed varieties that otherwise outgas methane.'
    ],
    correctAnswer: 1,
    expertExplanation: 'Mangroves are exceptional "blue carbon" reservoirs. Because their root ecosystems sit in wet, oxygen-poor soils, decomposed organic carbon is sealed underwater for thousands of years instead of decomposing.',
    pointsAwarded: 30
  },
  {
    id: 'q18',
    category: 'circular economy',
    question: 'Which practice is a key element of the "Sharing Economy" that lowers overall material carbon footprints?',
    options: [
      'Giving away single-use fast-fashion items to peers after one event.',
      'Using regional tool libraries, public bike sharing, and coworking rentals to lower total hardware production cycles.',
      'Ordering individual home-delivered takeaway meals with disposable cutlery.',
      'Purchasing duplicate gadgets to ensure backup hardware is always secure.'
    ],
    correctAnswer: 1,
    expertExplanation: 'The sharing economy shifts focus from ownership to access. Sharing heavy tools, vehicle fleets, and workspaces maximizes the usage efficiency of manufactured assets, radically cutting down the raw resources needed for duplicate production lines.',
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
  },
  {
    id: 'water_guardian',
    title: 'Water Guardian',
    description: 'Committed to water conservation, eco laundry, and checking organic composting habits.',
    iconName: 'Droplet',
    unlockedLabel: 'Aquatic Hydrology Steward'
  },
  {
    id: 'plant_pioneer',
    title: 'Plant Pioneer',
    description: 'Avoided heavy meat-based carbon meals by checking plant-forward daily habits.',
    iconName: 'Apple',
    unlockedLabel: 'Vegetation Path Finder'
  },
  {
    id: 'circular_champion',
    title: 'Circular Champion',
    description: 'Refused single-use plastic cups and terminated standby phantom electric vamp loads.',
    iconName: 'RefreshCw',
    unlockedLabel: 'Zero-Waste Guild Master'
  },
  {
    id: 'super_emissions_saver',
    title: 'Emissions Saver',
    description: 'Reduced monthly carbon footprint below 250 kg or accumulated 180+ environment points.',
    iconName: 'Sparkles',
    unlockedLabel: 'Atmospheric Restorer'
  }
];
