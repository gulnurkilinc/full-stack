const multer = require('multer');

const storage = multer.memoryStorage();

const uploadExcel = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];
        if (allowed.includes(file.mimetype) || file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece Excel (.xlsx) veya CSV dosyası yükleyebilirsiniz'));
        }
    }
});

module.exports = uploadExcel;