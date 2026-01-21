import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems = 0,
  itemsPerPage = 15
}) => {
  // Sayfa numaralarını oluştur
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Gösterilecek maksimum sayfa sayısı

    if (totalPages <= maxVisible) {
      // Tüm sayfaları göster
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Akıllı sayfalama
      if (currentPage <= 3) {
        // Başlangıçta
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Sonda
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Ortada
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Gösterilen item aralığı
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div style={styles.container}>
      {/* Bilgi */}
      <div style={styles.info}>
        <span style={styles.infoText}>
          {totalItems > 0 ? (
            <>
              <strong>{startItem}-{endItem}</strong> arası gösteriliyor 
              (Toplam <strong>{totalItems}</strong> blog)
            </>
          ) : (
            'Blog bulunamadı'
          )}
        </span>
      </div>

      {/* Sayfa Butonları */}
      <div style={styles.buttonContainer}>
        {/* Önceki Sayfa */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...styles.button,
            ...styles.navButton,
            ...(currentPage === 1 ? styles.disabledButton : {})
          }}
          aria-label="Önceki sayfa"
        >
          <span style={styles.arrow}>←</span>
          <span style={styles.navText}>Önceki</span>
        </button>

        {/* Sayfa Numaraları */}
        <div style={styles.pageNumbers}>
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} style={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                style={{
                  ...styles.button,
                  ...styles.pageButton,
                  ...(currentPage === page ? styles.activeButton : {})
                }}
                aria-label={`Sayfa ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Sonraki Sayfa */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...styles.button,
            ...styles.navButton,
            ...(currentPage === totalPages ? styles.disabledButton : {})
          }}
          aria-label="Sonraki sayfa"
        >
          <span style={styles.navText}>Sonraki</span>
          <span style={styles.arrow}>→</span>
        </button>
      </div>

      {/* Mobil için Basit Navigasyon */}
      <div style={styles.mobileNav}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...styles.button,
            ...styles.mobileButton,
            ...(currentPage === 1 ? styles.disabledButton : {})
          }}
        >
          ← Önceki
        </button>
        
        <span style={styles.mobileInfo}>
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...styles.button,
            ...styles.mobileButton,
            ...(currentPage === totalPages ? styles.disabledButton : {})
          }}
        >
          Sonraki →
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '30px 20px',
    marginTop: '40px'
  },
  info: {
    textAlign: 'center'
  },
  infoText: {
    fontSize: '14px',
    color: '#666'
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  pageNumbers: {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    border: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  pageButton: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    color: '#333',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: 'white',
    fontWeight: '600',
    transform: 'scale(1.05)'
  },
  navButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    color: '#333',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  disabledButton: {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none'
  },
  arrow: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  navText: {
    fontSize: '14px'
  },
  ellipsis: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  mobileNav: {
    display: 'none',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    padding: '0 10px'
  },
  mobileButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    color: '#333',
    fontWeight: '500',
    fontSize: '14px'
  },
  mobileInfo: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  }
};

export default Pagination;