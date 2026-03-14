export const defaultDietTypes = [
  {
    id: 'lyme-friendly',
    name: 'Lyme Friendly',
    visible: true,
    description:
      'A Lyme-friendly eating pattern usually emphasizes minimally processed foods, steady protein, colorful vegetables and lower added sugar. Many people use it as a gentler anti-inflammatory template while managing symptoms with clinical care.',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    visible: true,
    description:
      'Mediterranean eating centers on vegetables, legumes, whole grains, olive oil and fish. It is often used as a heart-friendly, sustainable pattern for long-term metabolic and cardiovascular health.',
  },
  {
    id: 'paleo',
    name: 'Paleo',
    visible: true,
    description:
      'Paleo emphasizes minimally processed foods such as vegetables, fruit, eggs, fish and meat while excluding grains and most legumes. People often use it to simplify food choices and reduce ultra-processed foods.',
  },
  {
    id: 'ketogenic',
    name: 'Ketogenic',
    visible: true,
    description:
      'Ketogenic eating is very low in carbohydrates and higher in fat, with the goal of shifting the body toward ketosis. It is usually structured around non-starchy vegetables, fats and protein-rich foods.',
  },
  {
    id: 'low-gi',
    name: 'Low GI',
    visible: true,
    description:
      'A low-GI diet favors carbohydrate foods that cause a slower rise in blood sugar, such as legumes, intact grains and many vegetables. It is often used for steadier energy and glucose management.',
  },
  {
    id: 'adhd',
    name: 'ADHD',
    visible: true,
    description:
      'An ADHD-focused eating pattern prioritizes consistent meals, protein, fiber-rich carbohydrates and minimally processed foods. It is not a cure, but some people find stable meals and omega-3-rich foods supportive alongside clinical care.',
  },
  {
    id: 'dash',
    name: 'DASH',
    visible: true,
    description:
      'DASH emphasizes fruits, vegetables, whole grains, low-fat dairy, beans, nuts and lean proteins while limiting sodium and saturated fat. It was designed to help support healthy blood pressure.',
  },
  {
    id: 'anti-inflammatory',
    name: 'Anti-Inflammatory',
    visible: true,
    description:
      'An anti-inflammatory pattern leans on colorful plants, beans, nuts, olive oil and fatty fish while cutting back on heavily processed foods. It is commonly used to support overall cardiometabolic health.',
  },
];
export const sectionNames = ['foods', 'drinks', 'vitamins'];

export const filterOptions = {
  foods: ['All', 'Fruits', 'Vegetables', 'Side Dish', 'Protein', 'Grains'],
  drinks: ['All', 'Water', 'Tea', 'Juice', 'Smoothie', 'Coffee'],
  vitamins: ['All', 'Omega-3', 'Mineral', 'Vitamin', 'Probiotic', 'Electrolyte'],
};

export const languageOptions = ['en', 'hu', 'es', 'it'];

export const defaultSeedItems = [
  { dietName: 'Lyme Friendly', sectionName: 'foods', itemName: 'Wild Blueberries', category: 'Fruits' },
  { dietName: 'Lyme Friendly', sectionName: 'foods', itemName: 'Spinach', category: 'Vegetables' },
  { dietName: 'Lyme Friendly', sectionName: 'foods', itemName: 'Grilled Salmon', category: 'Protein' },
  { dietName: 'Lyme Friendly', sectionName: 'foods', itemName: 'Quinoa', category: 'Grains' },
  { dietName: 'Lyme Friendly', sectionName: 'drinks', itemName: 'Lemon Water', category: 'Water' },
  { dietName: 'Lyme Friendly', sectionName: 'drinks', itemName: 'Ginger Tea', category: 'Tea' },
  { dietName: 'Lyme Friendly', sectionName: 'vitamins', itemName: 'Omega-3', category: 'Omega-3' },
  { dietName: 'Lyme Friendly', sectionName: 'vitamins', itemName: 'Vitamin D', category: 'Vitamin' },

  { dietName: 'Mediterranean', sectionName: 'foods', itemName: 'Tomato Cucumber Salad', category: 'Vegetables' },
  { dietName: 'Mediterranean', sectionName: 'foods', itemName: 'Chickpeas', category: 'Protein' },
  { dietName: 'Mediterranean', sectionName: 'foods', itemName: 'Sardines', category: 'Protein' },
  { dietName: 'Mediterranean', sectionName: 'foods', itemName: 'Farro', category: 'Grains' },
  { dietName: 'Mediterranean', sectionName: 'drinks', itemName: 'Sparkling Water', category: 'Water' },
  { dietName: 'Mediterranean', sectionName: 'drinks', itemName: 'Mint Tea', category: 'Tea' },
  { dietName: 'Mediterranean', sectionName: 'vitamins', itemName: 'Omega-3 Fish Oil', category: 'Omega-3' },
  { dietName: 'Mediterranean', sectionName: 'vitamins', itemName: 'Magnesium Glycinate', category: 'Mineral' },

  { dietName: 'Paleo', sectionName: 'foods', itemName: 'Eggs', category: 'Protein' },
  { dietName: 'Paleo', sectionName: 'foods', itemName: 'Grass-Fed Beef', category: 'Protein' },
  { dietName: 'Paleo', sectionName: 'foods', itemName: 'Sweet Potato', category: 'Side Dish' },
  { dietName: 'Paleo', sectionName: 'foods', itemName: 'Blueberries', category: 'Fruits' },
  { dietName: 'Paleo', sectionName: 'drinks', itemName: 'Water with Lime', category: 'Water' },
  { dietName: 'Paleo', sectionName: 'drinks', itemName: 'Herbal Tea', category: 'Tea' },
  { dietName: 'Paleo', sectionName: 'vitamins', itemName: 'Vitamin D3', category: 'Vitamin' },
  { dietName: 'Paleo', sectionName: 'vitamins', itemName: 'Electrolyte Mix', category: 'Electrolyte' },

  { dietName: 'Ketogenic', sectionName: 'foods', itemName: 'Avocado', category: 'Fruits' },
  { dietName: 'Ketogenic', sectionName: 'foods', itemName: 'Spinach', category: 'Vegetables' },
  { dietName: 'Ketogenic', sectionName: 'foods', itemName: 'Salmon', category: 'Protein' },
  { dietName: 'Ketogenic', sectionName: 'foods', itemName: 'Cauliflower Mash', category: 'Side Dish' },
  { dietName: 'Ketogenic', sectionName: 'drinks', itemName: 'Electrolyte Water', category: 'Water' },
  { dietName: 'Ketogenic', sectionName: 'drinks', itemName: 'Black Coffee', category: 'Coffee' },
  { dietName: 'Ketogenic', sectionName: 'vitamins', itemName: 'Magnesium', category: 'Mineral' },
  { dietName: 'Ketogenic', sectionName: 'vitamins', itemName: 'Sodium / Potassium Electrolytes', category: 'Electrolyte' },

  { dietName: 'Low GI', sectionName: 'foods', itemName: 'Lentils', category: 'Protein' },
  { dietName: 'Low GI', sectionName: 'foods', itemName: 'Steel-Cut Oats', category: 'Grains' },
  { dietName: 'Low GI', sectionName: 'foods', itemName: 'Apples', category: 'Fruits' },
  { dietName: 'Low GI', sectionName: 'foods', itemName: 'Broccoli', category: 'Vegetables' },
  { dietName: 'Low GI', sectionName: 'drinks', itemName: 'Water', category: 'Water' },
  { dietName: 'Low GI', sectionName: 'drinks', itemName: 'Unsweetened Green Tea', category: 'Tea' },
  { dietName: 'Low GI', sectionName: 'vitamins', itemName: 'Chromium', category: 'Mineral' },
  { dietName: 'Low GI', sectionName: 'vitamins', itemName: 'Fiber Supplement', category: 'Vitamin' },

  { dietName: 'ADHD', sectionName: 'foods', itemName: 'Eggs', category: 'Protein' },
  { dietName: 'ADHD', sectionName: 'foods', itemName: 'Dark Leafy Greens', category: 'Vegetables' },
  { dietName: 'ADHD', sectionName: 'foods', itemName: 'Greek Yogurt', category: 'Protein' },
  { dietName: 'ADHD', sectionName: 'foods', itemName: 'Berries', category: 'Fruits' },
  { dietName: 'ADHD', sectionName: 'drinks', itemName: 'Water', category: 'Water' },
  { dietName: 'ADHD', sectionName: 'drinks', itemName: 'Low-Sugar Smoothie', category: 'Smoothie' },
  { dietName: 'ADHD', sectionName: 'vitamins', itemName: 'Omega-3', category: 'Omega-3' },
  { dietName: 'ADHD', sectionName: 'vitamins', itemName: 'Vitamin D', category: 'Vitamin' },

  { dietName: 'DASH', sectionName: 'foods', itemName: 'Bananas', category: 'Fruits' },
  { dietName: 'DASH', sectionName: 'foods', itemName: 'Low-Fat Yogurt', category: 'Protein' },
  { dietName: 'DASH', sectionName: 'foods', itemName: 'Black Beans', category: 'Protein' },
  { dietName: 'DASH', sectionName: 'foods', itemName: 'Brown Rice', category: 'Grains' },
  { dietName: 'DASH', sectionName: 'drinks', itemName: 'Water', category: 'Water' },
  { dietName: 'DASH', sectionName: 'drinks', itemName: 'Low-Fat Milk', category: 'Juice' },
  { dietName: 'DASH', sectionName: 'vitamins', itemName: 'Potassium', category: 'Mineral' },
  { dietName: 'DASH', sectionName: 'vitamins', itemName: 'Calcium', category: 'Mineral' },

  { dietName: 'Anti-Inflammatory', sectionName: 'foods', itemName: 'Walnuts', category: 'Protein' },
  { dietName: 'Anti-Inflammatory', sectionName: 'foods', itemName: 'Salmon', category: 'Protein' },
  { dietName: 'Anti-Inflammatory', sectionName: 'foods', itemName: 'Turmeric Roasted Vegetables', category: 'Vegetables' },
  { dietName: 'Anti-Inflammatory', sectionName: 'foods', itemName: 'Berries', category: 'Fruits' },
  { dietName: 'Anti-Inflammatory', sectionName: 'drinks', itemName: 'Green Tea', category: 'Tea' },
  { dietName: 'Anti-Inflammatory', sectionName: 'drinks', itemName: 'Water', category: 'Water' },
  { dietName: 'Anti-Inflammatory', sectionName: 'vitamins', itemName: 'Omega-3', category: 'Omega-3' },
  { dietName: 'Anti-Inflammatory', sectionName: 'vitamins', itemName: 'Curcumin', category: 'Vitamin' },
];

export function createEmptyCatalog(dietTypes = defaultDietTypes) {
  return dietTypes.reduce((catalog, dietType) => {
    catalog[dietType.name] = sectionNames.reduce((sections, sectionName) => {
      sections[sectionName] = [];
      return sections;
    }, {});
    return catalog;
  }, {});
}

export function buildCatalog(rows, dietTypes = defaultDietTypes) {
  const catalog = createEmptyCatalog(dietTypes);

  for (const row of rows) {
    if (!catalog[row.dietName] || !catalog[row.dietName][row.sectionName]) {
      continue;
    }

    if (!catalog[row.dietName][row.sectionName]) {
      catalog[row.dietName][row.sectionName] = [];
    }

    catalog[row.dietName][row.sectionName].push({
      id: row.id,
      name: row.itemName,
      category: row.category,
    });
  }

  return catalog;
}
