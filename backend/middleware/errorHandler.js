// 404 Handler
exports.notFound = (req, res, next) => {
  const error = new Error(`Route bulunamadı - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Merkezi hata yönetimi
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Mongoose hatalarını yakala
  
  // 1. CastError (Geçersiz ObjectId)
  if (err.name === 'CastError') {
    const message = 'Geçersiz ID formatı';
    error = { message, statusCode: 400 };
  }
  
  // 2. ValidationError (Mongoose validation)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }
  
  // 3. Duplicate Key Error (11000)
  if (err.code === 11000) {
    const message = 'Bu kayıt zaten mevcut';
    error = { message, statusCode: 400 };
  }
  
  // Console'a logla
  console.error('❌ Error:', err.message);
  
  // Response gönder
  res.status(error.statusCode || res.statusCode || 500).json({
    success: false,
    message: error.message || 'Sunucu hatası',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};