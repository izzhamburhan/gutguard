
export interface FoodItem {
  name: string;
  category: 'Karbo' | 'Protein' | 'Buah' | 'Sayur' | 'Ulam';
  note?: string;
}

export interface MealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  tips: string;
  category: 'Utama' | 'Sarapan' | 'Sayur';
}

export interface RegimenStep {
  title: string;
  items: string[];
}
