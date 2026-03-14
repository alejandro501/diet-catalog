export const defaultDietTypes = [
  {
    id: 'lyme-friendly',
    name: 'Lyme Friendly',
    names: {
      en: 'Lyme Friendly',
      hu: 'Lyme-barát',
      es: 'Amigable para Lyme',
      it: 'Compatibile con Lyme',
    },
    visible: true,
    descriptions: {
      en: 'A Lyme-friendly eating pattern usually emphasizes minimally processed foods, steady protein, colorful vegetables and lower added sugar. Many people use it as a gentler anti-inflammatory template while managing symptoms with clinical care.',
      hu: 'A Lyme-barát étrend általában a minimálisan feldolgozott ételekre, az egyenletes fehérjebevitelre, a színes zöldségekre és az alacsonyabb hozzáadott cukorra épít. Sokan egy kíméletesebb gyulladáscsökkentő alapmintaként használják a tünetkezelés mellett.',
      es: 'Una alimentación amigable para Lyme suele priorizar ingredientes mínimamente procesados, proteína constante, verduras coloridas y menos azúcar añadido. Muchas personas la usan como una base antiinflamatoria más suave mientras manejan los síntomas con atención clínica.',
      it: 'Un’alimentazione compatibile con Lyme di solito privilegia cibi minimamente lavorati, proteine regolari, verdure colorate e meno zuccheri aggiunti. Molte persone la usano come base antinfiammatoria più delicata insieme alla gestione clinica dei sintomi.',
    },
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    names: {
      en: 'Mediterranean',
      hu: 'Mediterrán',
      es: 'Mediterránea',
      it: 'Mediterranea',
    },
    visible: true,
    descriptions: {
      en: 'Mediterranean eating centers on vegetables, legumes, whole grains, olive oil and fish. It is often used as a heart-friendly, sustainable pattern for long-term metabolic and cardiovascular health.',
      hu: 'A mediterrán étrend középpontjában a zöldségek, hüvelyesek, teljes gabonák, az olívaolaj és a hal állnak. Gyakran szívbarát, hosszú távon is fenntartható mintaként használják az anyagcsere- és szív- és érrendszeri egészség támogatására.',
      es: 'La alimentación mediterránea se centra en verduras, legumbres, cereales integrales, aceite de oliva y pescado. Suele usarse como un patrón sostenible y saludable para el corazón a largo plazo.',
      it: 'L’alimentazione mediterranea si basa su verdure, legumi, cereali integrali, olio d’oliva e pesce. Viene spesso usata come modello sostenibile e favorevole al cuore per la salute metabolica e cardiovascolare.',
    },
  },
  {
    id: 'paleo',
    name: 'Paleo',
    names: { en: 'Paleo', hu: 'Paleo', es: 'Paleo', it: 'Paleo' },
    visible: true,
    descriptions: {
      en: 'Paleo emphasizes minimally processed foods such as vegetables, fruit, eggs, fish and meat while excluding grains and most legumes. People often use it to simplify food choices and reduce ultra-processed foods.',
      hu: 'A paleo étrend a minimálisan feldolgozott ételekre, például zöldségekre, gyümölcsökre, tojásra, halra és húsra helyezi a hangsúlyt, miközben kizárja a gabonákat és a legtöbb hüvelyest. Sokan azért választják, hogy egyszerűsítsék az étkezést és csökkentsék az ultrafeldolgozott ételeket.',
      es: 'La dieta paleo prioriza alimentos mínimamente procesados como verduras, fruta, huevos, pescado y carne, excluyendo cereales y la mayoría de legumbres. Muchas personas la usan para simplificar sus comidas y reducir los ultraprocesados.',
      it: 'La dieta paleo mette al centro alimenti minimamente lavorati come verdure, frutta, uova, pesce e carne, escludendo cereali e gran parte dei legumi. Spesso viene scelta per semplificare le scelte alimentari e ridurre gli ultra-processati.',
    },
  },
  {
    id: 'ketogenic',
    name: 'Ketogenic',
    names: {
      en: 'Ketogenic',
      hu: 'Ketogén',
      es: 'Cetogénica',
      it: 'Chetogenica',
    },
    visible: true,
    descriptions: {
      en: 'Ketogenic eating is very low in carbohydrates and higher in fat, with the goal of shifting the body toward ketosis. It is usually structured around non-starchy vegetables, fats and protein-rich foods.',
      hu: 'A ketogén étrend nagyon alacsony szénhidrát- és magasabb zsírtartalmú, azzal a céllal, hogy a szervezetet ketózis felé terelje. Általában nem keményítőtartalmú zöldségekre, zsiradékokra és fehérjedús ételekre épül.',
      es: 'La alimentación cetogénica es muy baja en carbohidratos y más alta en grasas, con el objetivo de llevar al cuerpo hacia la cetosis. Suele estructurarse en torno a verduras bajas en almidón, grasas y alimentos ricos en proteína.',
      it: 'L’alimentazione chetogenica è molto povera di carboidrati e più ricca di grassi, con l’obiettivo di portare il corpo verso la chetosi. Di solito ruota attorno a verdure non amidacee, grassi e cibi ricchi di proteine.',
    },
  },
  {
    id: 'low-gi',
    name: 'Low GI',
    names: {
      en: 'Low GI',
      hu: 'Alacsony GI',
      es: 'Bajo IG',
      it: 'Basso IG',
    },
    visible: true,
    descriptions: {
      en: 'A low-GI diet favors carbohydrate foods that cause a slower rise in blood sugar, such as legumes, intact grains and many vegetables. It is often used for steadier energy and glucose management.',
      hu: 'Az alacsony glikémiás indexű étrend azokat a szénhidrátforrásokat részesíti előnyben, amelyek lassabban emelik a vércukorszintet, például a hüvelyeseket, a teljes gabonákat és sok zöldséget. Gyakran használják egyenletesebb energiaszint és glükózkezelés érdekében.',
      es: 'Una dieta de bajo índice glucémico prioriza carbohidratos que elevan el azúcar en sangre más lentamente, como legumbres, granos enteros y muchas verduras. Suele usarse para mantener una energía más estable y un mejor manejo de la glucosa.',
      it: 'Una dieta a basso indice glicemico privilegia carboidrati che fanno salire più lentamente la glicemia, come legumi, cereali integrali e molte verdure. Viene spesso usata per un’energia più stabile e una migliore gestione del glucosio.',
    },
  },
  {
    id: 'adhd',
    name: 'ADHD',
    names: { en: 'ADHD', hu: 'ADHD', es: 'TDAH', it: 'ADHD' },
    visible: true,
    descriptions: {
      en: 'An ADHD-focused eating pattern prioritizes consistent meals, protein, fiber-rich carbohydrates and minimally processed foods. It is not a cure, but some people find stable meals and omega-3-rich foods supportive alongside clinical care.',
      hu: 'Az ADHD-fókuszú étrend a rendszeres étkezéseket, a fehérjét, a rostban gazdag szénhidrátokat és a minimálisan feldolgozott ételeket helyezi előtérbe. Nem gyógyítja az ADHD-t, de sokan támogatóbbnak érzik a stabil étkezést és az omega-3-ban gazdag ételeket a kezelés mellett.',
      es: 'Un patrón alimentario enfocado en TDAH prioriza comidas regulares, proteína, carbohidratos ricos en fibra y alimentos mínimamente procesados. No es una cura, pero algunas personas encuentran útiles las comidas estables y los alimentos ricos en omega-3 junto con la atención clínica.',
      it: 'Un’alimentazione orientata all’ADHD dà priorità a pasti regolari, proteine, carboidrati ricchi di fibre e cibi minimamente lavorati. Non è una cura, ma alcune persone trovano utili pasti stabili e alimenti ricchi di omega-3 insieme al percorso clinico.',
    },
  },
  {
    id: 'dash',
    name: 'DASH',
    names: { en: 'DASH', hu: 'DASH', es: 'DASH', it: 'DASH' },
    visible: true,
    descriptions: {
      en: 'DASH emphasizes fruits, vegetables, whole grains, low-fat dairy, beans, nuts and lean proteins while limiting sodium and saturated fat. It was designed to help support healthy blood pressure.',
      hu: 'A DASH étrend a gyümölcsökre, zöldségekre, teljes gabonákra, alacsony zsírtartalmú tejtermékekre, babfélékre, diófélékre és sovány fehérjékre épít, miközben korlátozza a nátriumot és a telített zsírokat. Eredetileg az egészséges vérnyomás támogatására dolgozták ki.',
      es: 'La dieta DASH enfatiza frutas, verduras, cereales integrales, lácteos bajos en grasa, legumbres, frutos secos y proteínas magras, limitando el sodio y las grasas saturadas. Fue diseñada para ayudar a mantener una presión arterial saludable.',
      it: 'La dieta DASH punta su frutta, verdura, cereali integrali, latticini magri, legumi, frutta secca e proteine magre, limitando sodio e grassi saturi. È stata progettata per sostenere una pressione arteriosa sana.',
    },
  },
  {
    id: 'anti-inflammatory',
    name: 'Anti-Inflammatory',
    names: {
      en: 'Anti-Inflammatory',
      hu: 'Gyulladáscsökkentő',
      es: 'Antiinflamatoria',
      it: 'Antinfiammatoria',
    },
    visible: true,
    descriptions: {
      en: 'An anti-inflammatory pattern leans on colorful plants, beans, nuts, olive oil and fatty fish while cutting back on heavily processed foods. It is commonly used to support overall cardiometabolic health.',
      hu: 'A gyulladáscsökkentő étrend a színes növényekre, hüvelyesekre, diófélékre, olívaolajra és zsíros halakra támaszkodik, miközben visszafogja az erősen feldolgozott ételeket. Gyakran használják az általános kardiometabolikus egészség támogatására.',
      es: 'Un patrón antiinflamatorio se apoya en vegetales coloridos, legumbres, frutos secos, aceite de oliva y pescados grasos, reduciendo los alimentos muy procesados. Suele utilizarse para apoyar la salud cardiometabólica general.',
      it: 'Un modello antinfiammatorio punta su piante colorate, legumi, frutta secca, olio d’oliva e pesce grasso, riducendo gli alimenti molto processati. È comunemente usato per sostenere la salute cardiometabolica generale.',
    },
  },
];

export const sectionNames = ['foods', 'drinks', 'smoothies', 'spices', 'vitamins'];
export const defaultFoodCategories = [
  {
    id: 'fruits',
    name: 'Fruits',
    names: { en: 'Fruits', hu: 'Gyümölcsök', es: 'Frutas', it: 'Frutta' },
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    names: { en: 'Vegetables', hu: 'Zöldségek', es: 'Verduras', it: 'Verdure' },
  },
  {
    id: 'side-dish',
    name: 'Side Dish',
    names: { en: 'Side Dish', hu: 'Köret', es: 'Guarnición', it: 'Contorno' },
  },
  {
    id: 'protein',
    name: 'Protein',
    names: { en: 'Protein', hu: 'Fehérje', es: 'Proteína', it: 'Proteine' },
  },
  {
    id: 'grains',
    name: 'Grains',
    names: { en: 'Grains', hu: 'Gabonafélék', es: 'Cereales', it: 'Cereali' },
  },
];
export const fadeLimit = 5;

export const filterOptions = {
  foods: ['All', ...defaultFoodCategories.map((category) => category.name)],
  drinks: ['All', 'Water', 'Tea', 'Juice', 'Coffee'],
  smoothies: ['All'],
  vitamins: ['All', 'Omega-3', 'Mineral', 'Vitamin', 'Probiotic', 'Electrolyte'],
  spices: ['All', 'Herb', 'Pepper', 'Root'],
};

export const languageOptions = ['en', 'hu', 'es', 'it'];

const commonSpices = [
  ['Oregano', 'Herb'],
  ['Basil', 'Herb'],
  ['White Pepper', 'Pepper'],
  ['Turmeric', 'Root'],
  ['Parsley', 'Herb'],
];

const seedPresets = {
  'Lyme Friendly': {
    foods: [
      ['White Onion', 'Vegetables'],
      ['Quinoa', 'Grains'],
      ['Apple', 'Fruits'],
      ['Pear', 'Fruits'],
      ['Carrot', 'Vegetables'],
      ['Cucumber', 'Vegetables'],
      ['Acacia Honey', 'Fruits'],
      ['Blackberry', 'Fruits'],
      ['Ginger', 'Vegetables'],
      ['Chicken Breast', 'Protein'],
      ['Cod Fillet', 'Protein'],
      ['Potato', 'Side Dish'],
      ['Broccoli', 'Vegetables'],
      ['Beetroot', 'Vegetables'],
      ['Head Lettuce', 'Vegetables'],
      ['Garlic', 'Vegetables'],
      ['Zucchini', 'Vegetables'],
      ['Pumpkin', 'Vegetables'],
    ],
    drinks: [
      ['Cucumber Water', 'Water'],
      ['Fresh Ginger Tea', 'Tea'],
      ['Pear Water Kefir', 'Juice'],
    ],
    smoothies: [
      ['Pear Ginger Recovery Smoothie', ['Pear', 'Fresh ginger', 'Cucumber', 'Coconut water']],
      ['Blackberry Quinoa Smoothie', ['Blackberries', 'Cooked quinoa', 'Cucumber', 'Unsweetened almond milk']],
    ],
    vitamins: [
      ['Quercetin', 'Vitamin'],
      ['Vitamin D3 + K2', 'Vitamin'],
      ['Magnesium Glycinate', 'Mineral'],
      ['Saccharomyces boulardii', 'Probiotic'],
      ['Trace Mineral Electrolytes', 'Electrolyte'],
    ],
    spices: commonSpices,
  },
  Mediterranean: {
    foods: [
      ['Tomato Cucumber Salad', 'Vegetables'],
      ['Sardines in Olive Oil', 'Protein'],
      ['Herbed Chickpeas', 'Protein'],
      ['Farro Pilaf', 'Grains'],
      ['Roasted Eggplant', 'Vegetables'],
    ],
    drinks: [
      ['Sparkling Citrus Water', 'Water'],
      ['Mint Verbena Tea', 'Tea'],
      ['Pomegranate Spritzer', 'Juice'],
    ],
    smoothies: [
      ['Fig Tahini Smoothie', ['Fresh figs', 'Tahini', 'Greek yogurt', 'Cinnamon']],
      ['Orange Olive Smoothie', ['Orange', 'Carrot', 'Greek yogurt', 'Olive oil']],
    ],
    vitamins: [
      ['Omega-3 Fish Oil', 'Omega-3'],
      ['Magnesium Glycinate', 'Mineral'],
      ['Vitamin D3', 'Vitamin'],
      ['Lactobacillus Probiotic', 'Probiotic'],
      ['Potassium Citrate', 'Mineral'],
    ],
    spices: commonSpices,
  },
  Paleo: {
    foods: [
      ['Pasture-Raised Eggs', 'Protein'],
      ['Grass-Fed Sirloin', 'Protein'],
      ['Roasted Sweet Potato Wedges', 'Side Dish'],
      ['Blackberries', 'Fruits'],
      ['Garlic Asparagus', 'Vegetables'],
    ],
    drinks: [
      ['Lime Spring Water', 'Water'],
      ['Rooibos Cinnamon Tea', 'Tea'],
      ['Cold Brew Coffee', 'Coffee'],
    ],
    smoothies: [
      ['Berry Coconut Paleo Smoothie', ['Blackberries', 'Coconut milk', 'Collagen peptides', 'Chia seeds']],
      ['Mango Cashew Smoothie', ['Mango', 'Cashew butter', 'Coconut water', 'Turmeric']],
    ],
    vitamins: [
      ['Vitamin D3', 'Vitamin'],
      ['Magnesium Malate', 'Mineral'],
      ['Electrolyte Minerals', 'Electrolyte'],
      ['Cod Liver Oil', 'Omega-3'],
      ['Soil-Based Probiotic', 'Probiotic'],
    ],
    spices: commonSpices,
  },
  Ketogenic: {
    foods: [
      ['Avocado', 'Fruits'],
      ['Smoked Salmon', 'Protein'],
      ['Cauliflower Mash', 'Side Dish'],
      ['Sauteed Spinach', 'Vegetables'],
      ['Zucchini Noodles', 'Vegetables'],
    ],
    drinks: [
      ['Electrolyte Water', 'Water'],
      ['Espresso', 'Coffee'],
      ['Iced Matcha', 'Tea'],
    ],
    smoothies: [
      ['Avocado Cacao Keto Smoothie', ['Avocado', 'Unsweetened cocoa', 'Coconut milk', 'MCT oil']],
      ['Vanilla Chia Keto Smoothie', ['Vanilla protein', 'Chia seeds', 'Unsweetened almond milk', 'Spinach']],
    ],
    vitamins: [
      ['Magnesium Bisglycinate', 'Mineral'],
      ['Sodium Potassium Electrolytes', 'Electrolyte'],
      ['Vitamin D3', 'Vitamin'],
      ['Algae Omega-3', 'Omega-3'],
      ['Broad-Spectrum Probiotic', 'Probiotic'],
    ],
    spices: commonSpices,
  },
  'Low GI': {
    foods: [
      ['Steel-Cut Oats', 'Grains'],
      ['Green Lentils', 'Protein'],
      ['Pink Lady Apple', 'Fruits'],
      ['Roasted Brussels Sprouts', 'Vegetables'],
      ['Pearl Barley', 'Grains'],
    ],
    drinks: [
      ['Cucumber Water', 'Water'],
      ['Unsweetened Green Tea', 'Tea'],
      ['Fresh Tomato Juice', 'Juice'],
    ],
    smoothies: [
      ['Berry Flax Balance Smoothie', ['Raspberries', 'Ground flaxseed', 'Kefir', 'Spinach']],
      ['Pear Oat Smoothie', ['Pear', 'Steel-cut oat milk', 'Greek yogurt', 'Cinnamon']],
    ],
    vitamins: [
      ['Chromium Picolinate', 'Mineral'],
      ['Vitamin D3', 'Vitamin'],
      ['Psyllium Fiber Complex', 'Vitamin'],
      ['Omega-3 Capsules', 'Omega-3'],
      ['Multi-Strain Probiotic', 'Probiotic'],
    ],
    spices: commonSpices,
  },
  ADHD: {
    foods: [
      ['Pasture-Raised Eggs', 'Protein'],
      ['Wild Salmon', 'Protein'],
      ['Baby Spinach', 'Vegetables'],
      ['Blueberries', 'Fruits'],
      ['Slow-Cooked Oat Groats', 'Grains'],
    ],
    drinks: [
      ['Electrolyte Water', 'Water'],
      ['Unsweetened Peppermint Tea', 'Tea'],
      ['Cacao Almond Drink', 'Juice'],
    ],
    smoothies: [
      ['Blueberry Focus Smoothie', ['Blueberries', 'Greek yogurt', 'Pumpkin seeds', 'Baby spinach']],
      ['Cherry Cacao Smoothie', ['Tart cherries', 'Cacao nibs', 'Protein powder', 'Unsweetened almond milk']],
    ],
    vitamins: [
      ['High-DHA Omega-3', 'Omega-3'],
      ['Magnesium Glycinate', 'Mineral'],
      ['Vitamin D3', 'Vitamin'],
      ['Zinc Bisglycinate', 'Mineral'],
      ['Bifidobacterium Probiotic', 'Probiotic'],
    ],
    spices: commonSpices,
  },
  DASH: {
    foods: [
      ['Banana', 'Fruits'],
      ['Low-Fat Greek Yogurt', 'Protein'],
      ['Black Beans', 'Protein'],
      ['Brown Rice', 'Grains'],
      ['Roasted Beet Medley', 'Vegetables'],
    ],
    drinks: [
      ['Lemon Water', 'Water'],
      ['Hibiscus Tea', 'Tea'],
      ['Beet Berry Juice', 'Juice'],
    ],
    smoothies: [
      ['Berry Kefir Smoothie', ['Blueberries', 'Kefir', 'Oats', 'Ground flaxseed']],
      ['Banana Beet Smoothie', ['Banana', 'Cooked beet', 'Greek yogurt', 'Cinnamon']],
    ],
    vitamins: [
      ['Potassium Citrate', 'Mineral'],
      ['Calcium Citrate', 'Mineral'],
      ['Vitamin D3', 'Vitamin'],
      ['Omega-3 Fish Oil', 'Omega-3'],
      ['Lactobacillus Probiotic', 'Probiotic'],
    ],
    spices: commonSpices,
  },
  'Anti-Inflammatory': {
    foods: [
      ['Turmeric Roasted Cauliflower', 'Vegetables'],
      ['Walnuts', 'Protein'],
      ['Wild Salmon', 'Protein'],
      ['Blackberries', 'Fruits'],
      ['Buckwheat Groats', 'Grains'],
    ],
    drinks: [
      ['Lemon Ginger Water', 'Water'],
      ['Green Tea with Jasmine', 'Tea'],
      ['Pomegranate Tart Cherry Blend', 'Juice'],
    ],
    smoothies: [
      ['Golden Ginger Smoothie', ['Mango', 'Fresh ginger', 'Turmeric', 'Coconut milk']],
      ['Berry Walnut Smoothie', ['Blackberries', 'Walnuts', 'Kefir', 'Cinnamon']],
    ],
    vitamins: [
      ['Curcumin Complex', 'Vitamin'],
      ['Omega-3 Fish Oil', 'Omega-3'],
      ['Magnesium Glycinate', 'Mineral'],
      ['Vitamin D3', 'Vitamin'],
      ['Multi-Strain Probiotic', 'Probiotic'],
    ],
    spices: commonSpices,
  },
};

export const defaultSeedItems = Object.entries(seedPresets).flatMap(([dietName, sections]) => [
  ...sections.foods.map(([itemName, category]) => ({ dietName, sectionName: 'foods', itemName, category })),
  ...sections.drinks.map(([itemName, category]) => ({ dietName, sectionName: 'drinks', itemName, category })),
  ...sections.smoothies.map(([itemName, ingredients]) => ({
    dietName,
    sectionName: 'smoothies',
    itemName,
    category: 'Smoothie',
    ingredients,
  })),
  ...sections.vitamins.map(([itemName, category]) => ({ dietName, sectionName: 'vitamins', itemName, category })),
  ...sections.spices.map(([itemName, category]) => ({ dietName, sectionName: 'spices', itemName, category })),
]);

export function canonicalDietName(name) {
  return name === 'Lyme' ? 'Lyme Friendly' : name;
}

export function createEmptyCatalog(dietTypes = defaultDietTypes) {
  return dietTypes.reduce((catalog, dietType) => {
    catalog[canonicalDietName(dietType.name)] = sectionNames.reduce((sections, sectionName) => {
      sections[sectionName] = [];
      return sections;
    }, {});
    return catalog;
  }, {});
}

export function buildCatalog(rows, dietTypes = defaultDietTypes) {
  const catalog = createEmptyCatalog(dietTypes);

  for (const row of rows) {
    const dietName = canonicalDietName(row.dietName);

    if (!catalog[dietName]) {
      continue;
    }

    if (!catalog[dietName][row.sectionName]) {
      catalog[dietName][row.sectionName] = [];
    }

    catalog[dietName][row.sectionName].push({
      id: row.id,
      name: row.itemName,
      category: row.category,
      ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    });
  }

  return catalog;
}
