import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './MFASetup.css';

export function MFASetup({ onClose }: { onClose: () => void }) {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingFactors, setExistingFactors] = useState<any[]>([]);

  const { enrollMFA, verifyMFA, unenrollMFA } = useAuth();

  useEffect(() => {
    loadMFAFactors();
  }, []);

  const loadMFAFactors = async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (!error && data) {
      setExistingFactors(data.totp || []);
    }
  };

  const handleEnrollMFA = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const { data, error } = await enrollMFA();
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else if (data) {
        setQrCode(data.totp.qr_code);
        setSecret(data.totp.secret);
        setFactorId(data.id);
        setStep('verify');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Einrichten der 2FA.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await verifyMFA(factorId, verificationCode);
      if (error) {
        setMessage({ type: 'error', text: 'Ungültiger Code. Bitte versuche es erneut.' });
      } else {
        setMessage({ type: 'success', text: '2FA erfolgreich aktiviert!' });
        setTimeout(() => {
          loadMFAFactors();
          onClose();
        }, 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Verifizieren.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async (factorId: string) => {
    if (!confirm('Möchtest du die 2FA wirklich deaktivieren?')) return;

    setIsLoading(true);
    try {
      const { error } = await unenrollMFA(factorId);
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: '2FA deaktiviert.' });
        loadMFAFactors();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Deaktivieren.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (existingFactors.length > 0) {
    return (
      <div className="mfa-overlay" onClick={onClose}>
        <div className="mfa-modal" onClick={(e) => e.stopPropagation()}>
          <h2>Zwei-Faktor-Authentifizierung</h2>
          <div className="mfa-status">
            <p style={{ color: '#3c3' }}>✓ 2FA ist aktiviert</p>
            {existingFactors.map((factor) => (
              <div key={factor.id} className="factor-item">
                <span>Faktor ID: {factor.id.slice(0, 8)}...</span>
                <button 
                  onClick={() => handleUnenroll(factor.id)}
                  className="danger-btn"
                  disabled={isLoading}
                >
                  Deaktivieren
                </button>
              </div>
            ))}
          </div>
          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          <button onClick={onClose} className="close-btn">
            Schließen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mfa-overlay" onClick={onClose}>
      <div className="mfa-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Zwei-Faktor-Authentifizierung einrichten</h2>
        
        {step === 'setup' && (
          <div className="mfa-setup">
            <p>
              Die Zwei-Faktor-Authentifizierung erhöht die Sicherheit deines Kontos erheblich.
              Du benötigst eine Authenticator-App wie Google Authenticator, Authy oder Microsoft Authenticator.
            </p>
            <button 
              onClick={handleEnrollMFA}
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Lädt...' : '2FA einrichten'}
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="mfa-verify">
            <p>Scanne diesen QR-Code mit deiner Authenticator-App:</p>
            {qrCode && (
              <div className="qr-container">
                <img src={qrCode} alt="QR Code" className="qr-code" />
              </div>
            )}
            <p className="secret-text">
              Oder gib diesen Code manuell ein:<br />
              <code>{secret}</code>
            </p>

            <form onSubmit={handleVerifyMFA}>
              <div className="form-group">
                <label htmlFor="code">Bestätigungscode (6 Ziffern)</label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  maxLength={6}
                  pattern="\d{6}"
                  disabled={isLoading}
                  className="code-input"
                />
              </div>

              {message && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Verifiziert...' : 'Verifizieren'}
              </button>
            </form>
          </div>
        )}

        <button onClick={onClose} className="close-btn" disabled={isLoading}>
          Abbrechen
        </button>
      </div>
    </div>
  );
}
