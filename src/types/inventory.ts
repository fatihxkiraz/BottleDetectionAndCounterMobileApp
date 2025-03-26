export interface DetectedItem {
  id: string;
  name: string;
  category: string;
  confidence: number;
}

export interface InventoryAnalysis {
  totalCount: number;
  categories: Record<string, number>;
  items: DetectedItem[];
  image: string;
  error?: string;
}