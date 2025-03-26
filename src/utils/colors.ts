import { theme } from '@/styles/theme';

const categoryColors: Record<string, string> = {
  spirits: theme.colors.spirits,
  wines: theme.colors.wines,
  mixers: theme.colors.mixers,
};

export function getCategoryColor(category: string): string {
  // Return predefined color if exists, otherwise generate one based on string
  if (categoryColors[category]) {
    return categoryColors[category];
  }
  
  // Generate consistent color based on category string
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}
