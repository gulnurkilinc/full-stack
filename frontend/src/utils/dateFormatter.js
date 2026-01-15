/**
 * Tarih formatlama yardımcı fonksiyonları
 */

/**
 * ISO tarihini Türkçe formata çevirir
 * @param {string} isoDate - ISO formatında tarih
 * @returns {string} - Formatlanmış tarih (örn: "15 Ocak 2026")
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Göreceli zaman hesaplar
 * @param {string} isoDate - ISO formatında tarih
 * @returns {string} - Göreceli zaman (örn: "2 gün önce")
 */
export const getRelativeTime = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Az önce';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
  
  return formatDate(isoDate);
};