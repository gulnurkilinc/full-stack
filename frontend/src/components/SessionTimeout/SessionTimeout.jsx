import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../../redux/authSlice';

const SessionTimeout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 dakika
  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    // Token'dan süreyi al
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = decoded.exp * 1000; // ms
      const now = Date.now();
      const timeLeft = expiresAt - now;
      const warningTime = 5 * 60 * 1000; // 5 dakika kala uyar

      if (timeLeft <= 0) {
        handleLogout();
        return;
      }

      clearAllTimers();

      if (timeLeft <= warningTime) {
        // Zaten 5 dakika içinde → hemen uyar
        setCountdown(Math.floor(timeLeft / 1000));
        setShowWarning(true);
        startCountdown();
      } else {
        // 5 dakika kala uyar
        warningTimerRef.current = setTimeout(() => {
          setCountdown(300);
          setShowWarning(true);
          startCountdown();
        }, timeLeft - warningTime);
      }

      // Token dolunca logout
      logoutTimerRef.current = setTimeout(() => {
        handleLogout();
      }, timeLeft);

    } catch (e) {
      // Token parse hatası
    }

    return () => clearAllTimers();
  }, [isAuthenticated, token]);

  const clearAllTimers = () => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const startCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogout = async () => {
    clearAllTimers();
    setShowWarning(false);
    await dispatch(logout());
    toast.info('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
    navigate('/login');
  };

  const handleStayLoggedIn = () => {
    // Sayfayı yenileyerek token'ı yenile
    window.location.reload();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '20px',
        padding: '36px 32px', maxWidth: '400px', width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* İkon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          backgroundColor: '#fef3c7', border: '2px solid #fcd34d',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: '32px'
        }}>
          ⏱️
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>
          Oturum Süresi Dolmak Üzere
        </h3>

        <p style={{ color: '#4a5568', fontSize: '15px', lineHeight: '1.6', marginBottom: '8px' }}>
          Güvenliğiniz için oturumunuz
        </p>

        {/* Geri sayım */}
        <div style={{
          fontSize: '42px', fontWeight: '800', color: countdown <= 60 ? '#ef4444' : '#f59e0b',
          marginBottom: '8px', fontVariantNumeric: 'tabular-nums',
          transition: 'color 0.3s ease'
        }}>
          {formatTime(countdown)}
        </div>

        <p style={{ color: '#4a5568', fontSize: '15px', marginBottom: '28px' }}>
          sonra sona erecek.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleLogout}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              fontSize: '14px', fontWeight: '600',
              backgroundColor: '#f1f5f9', color: '#4a5568',
              border: 'none', cursor: 'pointer'
            }}
          >
            Çıkış Yap
          </button>
          <button
            onClick={handleStayLoggedIn}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              fontSize: '14px', fontWeight: '600',
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              color: 'white', border: 'none', cursor: 'pointer'
            }}
          >
            Oturumu Uzat
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;