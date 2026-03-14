export const dietNames = ['Lyme', 'Mediterranean'];
export const sectionNames = ['foods', 'drinks'];

export const filterOptions = {
  foods: ['All', 'Fruits', 'Vegetables', 'Side Dish', 'Protein', 'Grains'],
  drinks: ['All', 'Water', 'Tea', 'Juice', 'Smoothie', 'Coffee'],
};

export const languageOptions = ['en', 'hu', 'es'];

export const defaultSeedItems = [
  { dietName: 'Lyme', sectionName: 'foods', itemName: 'Blueberries', category: 'Fruits' },
  { dietName: 'Lyme', sectionName: 'foods', itemName: 'Spinach', category: 'Vegetables' },
  { dietName: 'Lyme', sectionName: 'foods', itemName: 'Quinoa Bowl', category: 'Side Dish' },
  { dietName: 'Lyme', sectionName: 'foods', itemName: 'Grilled Salmon', category: 'Protein' },
  { dietName: 'Lyme', sectionName: 'drinks', itemName: 'Lemon Water', category: 'Water' },
  { dietName: 'Lyme', sectionName: 'drinks', itemName: 'Ginger Tea', category: 'Tea' },
  { dietName: 'Mediterranean', sectionName: 'foods', itemName: 'Tomato Salad', category: 'Vegetables' },
  { dietName: 'Mediterranean', sectionName: 'foods', itemName: 'Oranges', category: 'Fruits' },
  { dietName: 'Mediterranean', sectionName: 'foods', itemName: 'Brown Rice', category: 'Grains' },
  { dietName: 'Mediterranean', sectionName: 'foods', itemName: 'Roasted Chickpeas', category: 'Protein' },
  { dietName: 'Mediterranean', sectionName: 'drinks', itemName: 'Mint Tea', category: 'Tea' },
  { dietName: 'Mediterranean', sectionName: 'drinks', itemName: 'Fresh Orange Juice', category: 'Juice' },
];

export function createEmptyCatalog() {
  return dietNames.reduce((catalog, dietName) => {
    catalog[dietName] = {
      foods: [],
      drinks: [],
    };
    return catalog;
  }, {});
}

export function buildCatalog(rows) {
  const catalog = createEmptyCatalog();

  for (const row of rows) {
    if (!catalog[row.dietName] || !catalog[row.dietName][row.sectionName]) {
      continue;
    }

    catalog[row.dietName][row.sectionName].push({
      id: row.id,
      name: row.itemName,
      category: row.category,
    });
  }

  return catalog;
}
