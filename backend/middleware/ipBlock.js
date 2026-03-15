const blockedIPs = new Map(); // IP → { count, blockedUntil }

const IP_BLOCK_THRESHOLD = 10; // 10 farklı hesap denemesi
const IP_BLOCK_DURATION = 30 * 60 * 1000; // 30 dakika
const IP_WINDOW = 15 * 60 * 1000; // 15 dakika pencere

exports.ipBlockMiddleware = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || '';

    const record = blockedIPs.get(ip);

    if (record?.blockedUntil && record.blockedUntil > Date.now()) {
        const remainingMin = Math.ceil((record.blockedUntil - Date.now()) / 60000);
        return res.status(403).json({
            success: false,
            message: `IP adresiniz geçici olarak engellendi. ${remainingMin} dakika sonra tekrar deneyin.`
        });
    }

    next();
};

exports.trackFailedLogin = (ip) => {
    const now = Date.now();
    const record = blockedIPs.get(ip) || { count: 0, firstAttempt: now };

    // Pencere süresi geçmişse sıfırla
    if (now - record.firstAttempt > IP_WINDOW) {
        blockedIPs.set(ip, { count: 1, firstAttempt: now });
        return;
    }

    record.count += 1;

    if (record.count >= IP_BLOCK_THRESHOLD) {
        record.blockedUntil = now + IP_BLOCK_DURATION;
        console.log(`🚫 IP engellendi: ${ip}`);
    }

    blockedIPs.set(ip, record);
};

exports.clearFailedLogin = (ip) => {
    blockedIPs.delete(ip);
};