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

export const sectionNames = ['foods', 'drinks', 'smoothies', 'vitamins'];
export const defaultFoodCategories = ['Fruits', 'Vegetables', 'Side Dish', 'Protein', 'Grains'];

export const filterOptions = {
  foods: ['All', ...defaultFoodCategories],
  drinks: ['All', 'Water', 'Tea', 'Juice', 'Coffee'],
  smoothies: ['All'],
  vitamins: ['All', 'Omega-3', 'Mineral', 'Vitamin', 'Probiotic', 'Electrolyte'],
};

export const languageOptions = ['en', 'hu', 'es', 'it'];

const seedPresets = {
  'Lyme Friendly': {
    foods: [
      ['Wild Blueberries', 'Fruits'],
      ['Pasture-Raised Eggs', 'Protein'],
      ['Steamed Broccoli', 'Vegetables'],
      ['Rainbow Carrots', 'Vegetables'],
      ['Tri-Color Quinoa', 'Grains'],
    ],
    drinks: [
      ['Lemon Mineral Water', 'Water'],
      ['Fresh Ginger Tulsi Tea', 'Tea'],
      ['Unsweetened Tart Cherry Juice', 'Juice'],
    ],
    smoothies: [
      ['Blueberry Hemp Smoothie', ['Wild blueberries', 'Hemp hearts', 'Unsweetened almond milk', 'Baby spinach']],
      ['Pear Ginger Recovery Smoothie', ['Pear', 'Fresh ginger', 'Collagen peptides', 'Coconut water']],
    ],
    vitamins: [
      ['Omega-3 Fish Oil', 'Omega-3'],
      ['Vitamin D3 + K2', 'Vitamin'],
      ['Magnesium Glycinate', 'Mineral'],
      ['Saccharomyces boulardii', 'Probiotic'],
      ['Trace Mineral Electrolytes', 'Electrolyte'],
    ],
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
  },
};

export const defaultSeedItems = Object.entries(seedPresets).flatMap(([dietName, sections]) => [
  ...sections.foods.map(([itemName, category]) => ({
    dietName,
    sectionName: 'foods',
    itemName,
    category,
  })),
  ...sections.drinks.map(([itemName, category]) => ({
    dietName,
    sectionName: 'drinks',
    itemName,
    category,
  })),
  ...sections.smoothies.map(([itemName, ingredients]) => ({
    dietName,
    sectionName: 'smoothies',
    itemName,
    category: 'Smoothie',
    ingredients,
  })),
  ...sections.vitamins.map(([itemName, category]) => ({
    dietName,
    sectionName: 'vitamins',
    itemName,
    category,
  })),
]);

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
    if (!catalog[row.dietName]) {
      continue;
    }

    if (!catalog[row.dietName][row.sectionName]) {
      catalog[row.dietName][row.sectionName] = [];
    }

    catalog[row.dietName][row.sectionName].push({
      id: row.id,
      name: row.itemName,
      category: row.category,
      ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    });
  }

  return catalog;
}
