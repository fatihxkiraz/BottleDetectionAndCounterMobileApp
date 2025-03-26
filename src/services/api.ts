const API_URL = 'http://40.113.164.108:8048';

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

export const detectItems = async (imageUri: string, selections: string[] = []): Promise<InventoryAnalysis> => {
  try {
    const base64 = await getBase64FromUri(imageUri);
    
    const response = await fetch(`${API_URL}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64,
        selections: selections
      }),
    });

    if (!response.ok) {
    throw new Error('Detection failed');
  }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

async function getBase64FromUri(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
