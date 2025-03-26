import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { InventoryAnalysis } from '@/types/inventory';

export async function exportToExcel(analysis: InventoryAnalysis) {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create items worksheet
  const itemsData = analysis.items.map(item => ({
    Name: item.name,
    Category: item.category,
    Confidence: Math.round(item.confidence * 100) + '%'
  }));
  const itemsWs = XLSX.utils.json_to_sheet(itemsData);
  XLSX.utils.book_append_sheet(wb, itemsWs, "Items");

  // Create categories worksheet
  const categoriesData = Object.entries(analysis.categories).map(([category, count]) => ({
    Category: category,
    Count: count
  }));
  const categoriesWs = XLSX.utils.json_to_sheet(categoriesData);
  XLSX.utils.book_append_sheet(wb, categoriesWs, "Categories");

  // Generate Excel file
  const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `inventory-${timestamp}.xlsx`;
  const filepath = `${FileSystem.documentDirectory}${fileName}`;

  // Save and share file
  await FileSystem.writeAsStringAsync(filepath, wbout, {
    encoding: FileSystem.EncodingType.Base64
  });

  await Sharing.shareAsync(filepath, {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    dialogTitle: 'Export Inventory'
  });
}
