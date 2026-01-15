/**
 * XSS saldırılarına karşı HTML temizleme
 * DOMPurify kullanmak daha güvenli olur (npm install dompurify)
 * Basit çözüm için tehlikeli etiketleri kaldırma
 */

/**
 * HTML içeriğini güvenli hale getirir
 * @param {string} html - Temizlenecek HTML
 * @returns {string} - Temizlenmiş HTML
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';

  // Tehlikeli etiketleri kaldır
  const dangerousTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi;
  
  return html.replace(dangerousTags, '');
};

/**
 * Metni düz metin olarak göster (HTML etiketlerini kaldır)
 * @param {string} html - HTML içerik
 * @returns {string} - Düz metin
 */

// src/utils/sanitizeHtml.js
export const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};