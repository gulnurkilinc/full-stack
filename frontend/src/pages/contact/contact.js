import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Contact = () => {
  const { themeName } = useTheme();
  
  // Kategori seçimi state'i
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form data state'i
  const [formData, setFormData] = useState({
    // Ortak alanlar
    name: '',
    email: '',
    message: '',
    
    // Kategori özel alanlar
    company: '',
    position: '',
    researchTypes: [],
    researchTopic: '',
    targetAudience: '',
    timeRange: '',
    budgetRange: '',
    collaborationType: '',
    collaborationDescription: '',
    website: '',
    university: '',
    department: '',
    studyType: '',
    expectation: '',
    consultingArea: '',
    duration: '',
    mediaOrganization: '',
    requestType: '',
    publicationDate: '',
    topic: '',
    productPackage: '',
    issueDescription: '',
    
    // KVKK
    kvkkConsent: false
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Tema renkleri
  const pageBg = themeName === 'light' 
    ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    : themeName === 'dark'
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
  
  const blob1 = themeName === 'light'
    ? 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
    : themeName === 'dark'
      ? 'radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(212, 212, 212, 0.05) 0%, transparent 70%)';
  
  const blob2 = themeName === 'light'
    ? 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)'
    : themeName === 'dark'
      ? 'radial-gradient(circle, rgba(138, 43, 226, 0.12) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)';

  const heroTextColor = themeName === 'light' ? '#1a1a1a' : '#ffffff';
  const heroSubtextColor = themeName === 'light' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.9)';
  
  const cardBg = themeName === 'light' 
    ? 'rgba(255, 255, 255, 0.95)'
    : themeName === 'dark'
      ? 'rgba(30, 41, 59, 0.95)'
      : 'rgba(26, 26, 26, 0.95)';
  
  const cardShadow = themeName === 'light'
    ? '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 100px rgba(99, 102, 241, 0.05)'
    : themeName === 'dark'
      ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(0, 255, 255, 0.1)'
      : '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(255, 255, 255, 0.02)';
  
  const cardBorder = themeName === 'light'
    ? '1px solid rgba(99, 102, 241, 0.1)'
    : themeName === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.2)'
      : '1px solid rgba(255, 255, 255, 0.1)';

  const headingColor = themeName === 'light' ? '#1a1a1a' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const textColor = themeName === 'light' ? '#4a5568' : themeName === 'dark' ? '#cbd5e0' : '#a3a3a3';
  const labelColor = themeName === 'light' ? '#2d3748' : themeName === 'dark' ? '#e2e8f0' : '#d4d4d4';
  
  const inputBg = themeName === 'light' ? 'white' : themeName === 'dark' ? '#1e293b' : '#1a1a1a';
  const inputBorder = themeName === 'light' ? '#e2e8f0' : themeName === 'dark' ? '#334155' : '#2a2a2a';
  const inputText = themeName === 'light' ? '#2d3748' : themeName === 'dark' ? '#f1f5f9' : '#e5e5e5';
  const inputDisabledBg = themeName === 'light' ? '#f7fafc' : themeName === 'dark' ? '#0f172a' : '#0a0a0a';
  const inputFocusBorder = themeName === 'light' ? '#6366f1' : themeName === 'dark' ? '#00ffff' : '#d4d4d4';
  const inputFocusShadow = themeName === 'light' 
    ? '0 0 0 3px rgba(99, 102, 241, 0.1)'
    : themeName === 'dark'
      ? '0 0 0 3px rgba(0, 255, 255, 0.1)'
      : '0 0 0 3px rgba(212, 212, 212, 0.1)';

  // Kategoriler - Modern SVG iconlar ile
  const categories = [
    { 
      id: 'research', 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v12M6 12h12"/>
        </svg>
      ),
      title: 'Araştırma / Analiz Talebi',
      description: 'Veri analizi, kamuoyu araştırması, medya analizi'
    },
    { 
      id: 'corporate', 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      title: 'Kurumsal İş Birliği',
      description: 'Stratejik iş birlikleri, ortak projeler'
    },
    { 
      id: 'academic', 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      title: 'Akademik Çalışma / Proje',
      description: 'Tez, makale, akademik araştırma desteği'
    },
    { 
      id: 'consulting', 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      title: 'Danışmanlık Talebi',
      description: 'Medya stratejisi, veri okuryazarlığı, araştırma tasarımı'
    },
    { 
      id: 'media', 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      title: 'Basın & Medya',
      description: 'Röportaj, görüş, veri talebi'
    },
    { 
      id: 'product', 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      title: 'Teknik / Ürün (ANALYTICA)',
      description: 'Demo, teknik destek, entegrasyon'
    },
    { 
      id: 'other', 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: 'Diğer',
      description: 'Genel sorularınız için'
    }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // Form data'yı sıfırla
    setFormData({
      name: '',
      email: '',
      message: '',
      company: '',
      position: '',
      researchTypes: [],
      researchTopic: '',
      targetAudience: '',
      timeRange: '',
      budgetRange: '',
      collaborationType: '',
      collaborationDescription: '',
      website: '',
      university: '',
      department: '',
      studyType: '',
      expectation: '',
      consultingArea: '',
      duration: '',
      mediaOrganization: '',
      requestType: '',
      publicationDate: '',
      topic: '',
      productPackage: '',
      issueDescription: '',
      kvkkConsent: false
    });
    setUploadedFile(null);
    setSubmitSuccess(false);
  };

  // ESC tuşu ile geri dönme
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && selectedCategory && !submitSuccess) {
        setSelectedCategory(null);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [selectedCategory, submitSuccess]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.kvkkConsent) {
      alert('❌ KVKK ve Gizlilik Politikasını kabul etmelisiniz.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('📤 Form gönderiliyor:', {
        category: selectedCategory,
        ...formData,
        file: uploadedFile?.name
      });

      // FormData oluştur (dosya yükleme için)
      const submitData = new FormData();
      submitData.append('category', selectedCategory);
      submitData.append('adSoyad', formData.name);
      submitData.append('email', formData.email);
      submitData.append('mesaj', formData.message);
      
      // Kategori özel alanları ekle
      Object.keys(formData).forEach(key => {
        if (key !== 'name' && key !== 'email' && key !== 'message' && key !== 'kvkkConsent') {
          if (Array.isArray(formData[key])) {
            submitData.append(key, JSON.stringify(formData[key]));
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      if (uploadedFile) {
        submitData.append('file', uploadedFile);
      }

      const response = await fetch('http://localhost:4000/api/contact', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();
      console.log('✅ Yanıt:', data);

      if (data.success) {
        setSubmitSuccess(true);
        // Form'u sıfırla
        setFormData({
          name: '',
          email: '',
          message: '',
          company: '',
          position: '',
          researchTypes: [],
          researchTopic: '',
          targetAudience: '',
          timeRange: '',
          budgetRange: '',
          collaborationType: '',
          collaborationDescription: '',
          website: '',
          university: '',
          department: '',
          studyType: '',
          expectation: '',
          consultingArea: '',
          duration: '',
          mediaOrganization: '',
          requestType: '',
          publicationDate: '',
          topic: '',
          productPackage: '',
          issueDescription: '',
          kvkkConsent: false
        });
        setUploadedFile(null);
        
        // 3 saniye sonra kategori seçimine geri dön
        setTimeout(() => {
          setSubmitSuccess(false);
          setSelectedCategory(null);
        }, 5000);
      } else {
        alert('❌ Hata: ' + (data.message || 'Mesaj gönderilemedi'));
      }
    } catch (error) {
      console.error('❌ Hata:', error);
      alert('❌ Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input style helper
  const getInputStyle = (disabled = false) => ({
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: `1.5px solid ${inputBorder}`,
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: disabled ? inputDisabledBg : inputBg,
    color: inputText,
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  });

  return (
    <div style={{ 
      minHeight: '100vh',
      background: pageBg,
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '350px',
        height: '350px',
        background: blob1,
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 7s ease-in-out infinite',
        transition: 'background 0.4s ease'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: blob2,
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 9s ease-in-out infinite reverse',
        transition: 'background 0.4s ease'
      }}></div>

      {/* Hero Section */}
      <section style={{
        color: heroTextColor,
        padding: '140px 0 60px',
        textAlign: 'center',
        position: 'relative',
        transition: 'color 0.4s ease'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            fontWeight: '700',
            letterSpacing: '-1px',
            textShadow: themeName === 'light' ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.3)',
            color: heroTextColor,
            transition: 'color 0.4s ease'
          }}>
            İletişim
          </h1>
          <p style={{ 
            fontSize: '20px', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: '1.6',
            opacity: '0.9',
            fontWeight: '400',
            color: heroSubtextColor,
            transition: 'color 0.4s ease'
          }}>
            {!selectedCategory 
              ? 'Hangi konuda yardımcı olabiliriz? Lütfen bir kategori seçin.'
              : 'Talebinizi detaylı olarak açıklayın, size en kısa sürede dönüş yapalım.'
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '40px 0 80px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          {/* KATEGORİ SEÇİMİ - selectedCategory null ise göster */}
          {!selectedCategory && !submitSuccess && (
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: headingColor,
                textAlign: 'center',
                marginBottom: '40px',
                letterSpacing: '-0.5px'
              }}>
                Bizimle ne için iletişime geçiyorsunuz?
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    style={{
                      backgroundColor: cardBg,
                      backdropFilter: 'blur(10px)',
                      padding: '28px 24px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: `1px solid ${cardBorder}`,
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                      e.currentTarget.style.borderColor = inputFocusBorder;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.borderColor = cardBorder;
                    }}
                  >
                    <div style={{ 
                      color: inputFocusBorder,
                      marginBottom: '16px',
                      opacity: 0.9
                    }}>
                      {cat.icon}
                    </div>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '600',
                      color: headingColor,
                      marginBottom: '8px',
                      letterSpacing: '-0.3px',
                      lineHeight: '1.3'
                    }}>
                      {cat.title}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: textColor,
                      lineHeight: '1.5',
                      margin: 0,
                      opacity: 0.85
                    }}>
                      {cat.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BAŞARI MESAJI */}
          {submitSuccess && (
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              backgroundColor: cardBg,
              backdropFilter: 'blur(10px)',
              padding: '60px 40px',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${cardBorder}`,
              textAlign: 'center'
            }}>
              <div style={{ 
                marginBottom: '24px',
                color: '#10b981'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: headingColor,
                marginBottom: '12px',
                letterSpacing: '-0.5px'
              }}>
                Talebiniz Alınmıştır
              </h2>
              <p style={{
                fontSize: '15px',
                color: textColor,
                lineHeight: '1.7',
                marginBottom: '32px'
              }}>
                İlgili ekibimiz sizinle en kısa sürede iletişime geçecektir.
                <br />
                İlginiz için teşekkür ederiz.
              </p>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setSelectedCategory(null);
                }}
                className="emerald-btn"
                style={{ padding: '14px 32px', fontSize: '15px' }}
              >
                Yeni Talep Oluştur
              </button>
            </div>
          )}

          {/* DİNAMİK FORM - Kategori seçildiyse göster */}
          {selectedCategory && !submitSuccess && (
            <div style={{
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {/* Geri butonu */}
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  marginBottom: '24px',
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  color: textColor,
                  border: `1px solid ${inputBorder}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = inputBg;
                  e.target.style.borderColor = inputFocusBorder;
                  e.target.style.transform = 'translateX(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = inputBorder;
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Kategori Seçimine Dön
                <span style={{ 
                  fontSize: '11px', 
                  opacity: 0.6,
                  marginLeft: '4px',
                  fontWeight: '400'
                }}>
                  (ESC)
                </span>
              </button>

              <div style={{
                backgroundColor: cardBg,
                backdropFilter: 'blur(10px)',
                padding: '48px 40px',
                borderRadius: '20px',
                boxShadow: cardShadow,
                border: cardBorder,
                transition: 'all 0.4s ease'
              }}>
                <h2 style={{ 
                  fontSize: '28px', 
                  marginBottom: '12px',
                  color: headingColor,
                  fontWeight: '700',
                  letterSpacing: '-0.5px',
                  transition: 'color 0.4s ease'
                }}>
                  {categories.find(c => c.id === selectedCategory)?.title}
                </h2>
                <p style={{ 
                  color: textColor,
                  marginBottom: '32px',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  transition: 'color 0.4s ease'
                }}>
                  {categories.find(c => c.id === selectedCategory)?.description}
                </p>

                <form onSubmit={handleSubmit}>
                  {/* ORTAK ALANLAR - Ad Soyad, Email */}
                  <FormField label="Ad Soyad *" required>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Adınız ve soyadınız"
                      disabled={isSubmitting}
                      style={getInputStyle(isSubmitting)}
                      onFocus={(e) => {
                        e.target.style.borderColor = inputFocusBorder;
                        e.target.style.boxShadow = inputFocusShadow;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = inputBorder;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </FormField>

                  <FormField label="E-posta *" required>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ornek@email.com"
                      disabled={isSubmitting}
                      style={getInputStyle(isSubmitting)}
                      onFocus={(e) => {
                        e.target.style.borderColor = inputFocusBorder;
                        e.target.style.boxShadow = inputFocusShadow;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = inputBorder;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </FormField>

                  {/* KATEGORİYE ÖZEL ALANLAR */}
                  {renderCategoryFields(selectedCategory, formData, handleChange, handleMultiSelect, handleFileUpload, uploadedFile, isSubmitting, getInputStyle, inputFocusBorder, inputFocusShadow, inputBorder, textColor, labelColor)}

                  {/* ORTAK MESAJ ALANI */}
                  <FormField label="Mesajınız *" required>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Detaylı açıklama..."
                      disabled={isSubmitting}
                      style={{
                        ...getInputStyle(isSubmitting),
                        resize: 'vertical',
                        lineHeight: '1.6'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = inputFocusBorder;
                        e.target.style.boxShadow = inputFocusShadow;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = inputBorder;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </FormField>

                  {/* KVKK ONAYI */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: textColor
                    }}>
                      <input
                        type="checkbox"
                        name="kvkkConsent"
                        checked={formData.kvkkConsent}
                        onChange={handleChange}
                        required
                        style={{
                          marginTop: '2px',
                          cursor: 'pointer'
                        }}
                      />
                      <span>
                        <strong style={{ color: labelColor }}>KVKK ve Gizlilik Politikası'nı</strong> okudum ve kabul ediyorum. *
                      </span>
                    </label>
                  </div>

                  {/* GÖNDER BUTONU */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="emerald-btn"
                    style={{ 
                      width: '100%', 
                      padding: '14px 20px',
                      fontSize: '15px',
                      opacity: isSubmitting ? 0.6 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                          <path d="M8 1.5V4.5M8 11.5V14.5M14.5 8H11.5M4.5 8H1.5M12.7 12.7L10.6 10.6M5.4 5.4L3.3 3.3M12.7 3.3L10.6 5.4M5.4 10.6L3.3 12.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Gönderiliyor...
                      </span>
                    ) : (
                      'Talebimi Gönder'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* İLETİŞİM BİLGİLERİ - Alt Kısım */}
      <section style={{ 
        padding: '60px 0 80px', 
        position: 'relative', 
        zIndex: 1,
        borderTop: `1px solid ${themeName === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`
      }}>
        <div className="container">
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: headingColor,
              marginBottom: '32px',
              letterSpacing: '-0.3px'
            }}>
              Diğer İletişim Kanallarımız
            </h3>

            {/* Email */}
            <div style={{
              backgroundColor: cardBg,
              backdropFilter: 'blur(10px)',
              padding: '24px 32px',
              borderRadius: '12px',
              border: `1px solid ${cardBorder}`,
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a 
                href="mailto:gulnurkilinc@gmail.com"
                style={{
                  color: headingColor,
                  fontSize: '15px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = inputFocusBorder}
                onMouseLeave={(e) => e.target.style.color = headingColor}
              >
                gulnurkilinc@gmail.com
              </a>
            </div>

            {/* Sosyal Medya */}
            <div>
              <p style={{
                fontSize: '14px',
                color: textColor,
                marginBottom: '20px',
                fontWeight: '500'
              }}>
                Sosyal Medyada Bizi Takip Edin
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '16px',
                justifyContent: 'center'
              }}>
                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    color: textColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = inputFocusBorder;
                    e.currentTarget.style.color = inputFocusBorder;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = cardBorder;
                    e.currentTarget.style.color = textColor;
                  }}
                  title="Instagram"
                >
                  <svg 
                    width="22" 
                    height="22" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                
                {/* X (Twitter) */}
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    color: textColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    fontSize: '18px',
                    fontWeight: '700',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = inputFocusBorder;
                    e.currentTarget.style.color = inputFocusBorder;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = cardBorder;
                    e.currentTarget.style.color = textColor;
                  }}
                  title="X (Twitter)"
                >
                  𝕏
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .emerald-btn {
          display: inline-block;
          background: linear-gradient(135deg, #1f2937 0%, #111827 45%, #0a0e18 100%);
          color: #ffffff;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: 
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            background 0.35s ease;
          box-shadow: 
            0 4px 18px rgba(17, 24, 39, 0.45),
            0 1px 3px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          letter-spacing: -0.2px;
        }

        .emerald-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -110%;
          width: 80%;
          height: 100%;
          background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.18) 40%,
            rgba(255, 255, 255, 0.22) 50%,
            rgba(255, 255, 255, 0.18) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          transition: left 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 1;
        }

        .emerald-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #374151 0%, #1f2937 45%, #111827 100%);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 
            0 8px 28px rgba(17, 24, 39, 0.55),
            0 2px 6px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .emerald-btn:hover:not(:disabled)::before {
          left: 120%;
        }

        .emerald-btn:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: 
            0 2px 10px rgba(17, 24, 39, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.06),
            inset 0 2px 4px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

// Helper component - Form Field
const FormField = ({ label, required, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      fontSize: '14px'
    }}>
      {label}
    </label>
    {children}
  </div>
);

// Kategori özel alanları render eden fonksiyon
const renderCategoryFields = (category, formData, handleChange, handleMultiSelect, handleFileUpload, uploadedFile, isSubmitting, getInputStyle, inputFocusBorder, inputFocusShadow, inputBorder, textColor, labelColor) => {
  
  // 1️⃣ ARAŞTIRMA / ANALİZ TALEBİ
  if (category === 'research') {
    return (
      <>
        <FormField label="Kurum / Şirket Adı">
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Kurum veya şirket adınız"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Araştırma Türü (Çoklu Seçim Yapabilirsiniz)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Kamuoyu araştırması', 'Medya analizi', 'Sosyal medya analizi', 'Söylem / İçerik analizi', 'Özel çalışma'].map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: textColor }}>
                <input
                  type="checkbox"
                  checked={formData.researchTypes.includes(type)}
                  onChange={() => handleMultiSelect('researchTypes', type)}
                  disabled={isSubmitting}
                  style={{ cursor: 'pointer' }}
                />
                {type}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Araştırma Konusu *" required>
          <textarea
            name="researchTopic"
            value={formData.researchTopic}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Araştırma konunuzu kısaca açıklayın"
            disabled={isSubmitting}
            style={{...getInputStyle(isSubmitting), resize: 'vertical', lineHeight: '1.6'}}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Hedef Kitle">
          <input
            type="text"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="Örn: 18-35 yaş arası kentli gençler"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Zaman Aralığı">
          <input
            type="text"
            name="timeRange"
            value={formData.timeRange}
            onChange={handleChange}
            placeholder="Örn: Son 6 ay, 2023-2024"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Bütçe Aralığı">
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
          >
            <option value="">Seçiniz...</option>
            <option value="0-10k">0 - 10.000 TL</option>
            <option value="10k-25k">10.000 - 25.000 TL</option>
            <option value="25k-50k">25.000 - 50.000 TL</option>
            <option value="50k+">50.000 TL+</option>
          </select>
        </FormField>

        <FormField label="Ek Dosya (Brief, Örnek Rapor vb.)">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={isSubmitting}
            style={{...getInputStyle(isSubmitting), padding: '8px 12px'}}
            accept=".pdf,.doc,.docx,.txt"
          />
          {uploadedFile && <p style={{fontSize: '13px', color: textColor, marginTop: '8px'}}>📎 {uploadedFile.name}</p>}
        </FormField>
      </>
    );
  }

  // 2️⃣ KURUMSAL İŞ BİRLİĞİ
  if (category === 'corporate') {
    return (
      <>
        <FormField label="Kurum Adı *" required>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="Kurum adı"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Pozisyonunuz">
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Örn: İK Müdürü, CEO"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="İş Birliği Türü">
          <select
            name="collaborationType"
            value={formData.collaborationType}
            onChange={handleChange}
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
          >
            <option value="">Seçiniz...</option>
            <option value="long-term">Uzun dönemli analiz</option>
            <option value="data-sharing">Veri paylaşımı</option>
            <option value="joint-project">Ortak proje</option>
            <option value="sponsored">Sponsorlu çalışma</option>
          </select>
        </FormField>

        <FormField label="İş Birliği Açıklaması *" required>
          <textarea
            name="collaborationDescription"
            value={formData.collaborationDescription}
            onChange={handleChange}
            required
            rows="4"
            placeholder="İş birliği detaylarını açıklayın"
            disabled={isSubmitting}
            style={{...getInputStyle(isSubmitting), resize: 'vertical', lineHeight: '1.6'}}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Kurum Web Sitesi / LinkedIn">
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://..."
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>
      </>
    );
  }

  // 3️⃣ AKADEMİK ÇALIŞMA
  if (category === 'academic') {
    return (
      <>
        <FormField label="Üniversite / Enstitü *" required>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            required
            placeholder="Üniversite adı"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Bölüm">
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Örn: Sosyoloji, İletişim"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Çalışma Türü">
          <select
            name="studyType"
            value={formData.studyType}
            onChange={handleChange}
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
          >
            <option value="">Seçiniz...</option>
            <option value="masters">Yüksek lisans tezi</option>
            <option value="phd">Doktora</option>
            <option value="article">Makale</option>
            <option value="project">Proje</option>
          </select>
        </FormField>

        <FormField label="Araştırma Konusu *" required>
          <textarea
            name="researchTopic"
            value={formData.researchTopic}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Çalışma konunuzu açıklayın"
            disabled={isSubmitting}
            style={{...getInputStyle(isSubmitting), resize: 'vertical', lineHeight: '1.6'}}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="ANALYTICA'dan Beklentiniz">
          <select
            name="expectation"
            value={formData.expectation}
            onChange={handleChange}
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
          >
            <option value="">Seçiniz...</option>
            <option value="method">Yöntem desteği</option>
            <option value="data-analysis">Veri analizi</option>
            <option value="literature">Literatür desteği</option>
          </select>
        </FormField>

        <FormField label="Dosya (Taslak, Proposal vb.)">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={isSubmitting}
            style={{...getInputStyle(isSubmitting), padding: '8px 12px'}}
            accept=".pdf,.doc,.docx"
          />
          {uploadedFile && <p style={{fontSize: '13px', color: textColor, marginTop: '8px'}}>📎 {uploadedFile.name}</p>}
        </FormField>
      </>
    );
  }

  // 4️⃣ DANIŞMANLIK
  if (category === 'consulting') {
    return (
      <>
        <FormField label="Kurum">
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Kurum adı (varsa)"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Danışmanlık Alanı">
          <select
            name="consultingArea"
            value={formData.consultingArea}
            onChange={handleChange}
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
          >
            <option value="">Seçiniz...</option>
            <option value="media-strategy">Medya stratejisi</option>
            <option value="data-literacy">Veri okuryazarlığı</option>
            <option value="research-design">Araştırma tasarımı</option>
            <option value="digital-analysis">Dijital analiz</option>
          </select>
        </FormField>

        <FormField label="Süre">
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
          >
            <option value="">Seçiniz...</option>
            <option value="one-time">Tek seferlik</option>
            <option value="short-term">Kısa dönem</option>
            <option value="long-term">Uzun dönem</option>
          </select>
        </FormField>
      </>
    );
  }

  // 5️⃣ BASIN & MEDYA
  if (category === 'media') {
    return (
      <>
        <FormField label="Medya Kuruluşu *" required>
          <input
            type="text"
            name="mediaOrganization"
            value={formData.mediaOrganization}
            onChange={handleChange}
            required
            placeholder="Medya kuruluşu adı"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Pozisyon">
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Örn: Muhabir, Editör"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Talep Türü">
          <select
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
          >
            <option value="">Seçiniz...</option>
            <option value="interview">Röportaj</option>
            <option value="comment">Görüş / Yorum</option>
            <option value="data-request">Veri talebi</option>
          </select>
        </FormField>

        <FormField label="Yayın Tarihi (varsa)">
          <input
            type="date"
            name="publicationDate"
            value={formData.publicationDate}
            onChange={handleChange}
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
          />
        </FormField>

        <FormField label="Konu *" required>
          <textarea
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Haber/yazı konusu"
            disabled={isSubmitting}
            style={{...getInputStyle(isSubmitting), resize: 'vertical', lineHeight: '1.6'}}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>
      </>
    );
  }

  // 6️⃣ TEKNİK / ÜRÜN
  if (category === 'product') {
    return (
      <>
        <FormField label="Konu">
          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
          >
            <option value="">Seçiniz...</option>
            <option value="demo">Demo talebi</option>
            <option value="feedback">Ürün geri bildirimi</option>
            <option value="technical-issue">Teknik sorun</option>
            <option value="integration">Entegrasyon</option>
          </select>
        </FormField>

        <FormField label="Kullandığınız Paket (varsa)">
          <input
            type="text"
            name="productPackage"
            value={formData.productPackage}
            onChange={handleChange}
            placeholder="Örn: Pro, Enterprise"
            disabled={isSubmitting}
            style={getInputStyle(isSubmitting)}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Sorun / Talep Açıklaması *" required>
          <textarea
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Detaylı açıklama"
            disabled={isSubmitting}
            style={{...getInputStyle(isSubmitting), resize: 'vertical', lineHeight: '1.6'}}
            onFocus={(e) => {
              e.target.style.borderColor = inputFocusBorder;
              e.target.style.boxShadow = inputFocusShadow;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </FormField>

        <FormField label="Ekran Görüntüsü / Dosya">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={isSubmitting}
            style={{...getInputStyle(isSubmitting), padding: '8px 12px'}}
            accept=".png,.jpg,.jpeg,.pdf"
          />
          {uploadedFile && <p style={{fontSize: '13px', color: textColor, marginTop: '8px'}}>📎 {uploadedFile.name}</p>}
        </FormField>
      </>
    );
  }

  // 7️⃣ DİĞER - Basit form
  return null; // "Diğer" için ek alan yok
};

export default Contact;