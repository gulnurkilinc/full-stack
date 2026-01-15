/**
 * Okuma süresi hesaplama
 * Ortalama okuma hızı: 200 kelime/dakika (Türkçe)
 */

/**
 * Metin içeriğinden okuma süresini hesaplar
 * @param {string} content - Blog içeriği
 * @returns {string} - Okuma süresi (örn: "5 dk okuma")
 */
export const calculateReadingTime = (content) => {
  if (!content) return '1 dk okuma';

  // Kelimeleri say (boşluklara göre böl)
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} dk okuma`;
};