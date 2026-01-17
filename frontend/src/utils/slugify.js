export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Türkçe karakterleri değiştir
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    // Boşlukları tire ile değiştir
    .replace(/\s+/g, '-')
    // Özel karakterleri kaldır
    .replace(/[^\w\-]+/g, '')
    // Birden fazla tireyi tek tireye çevir
    .replace(/\-\-+/g, '-')
    // Baş ve sondaki tireleri kaldır
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};