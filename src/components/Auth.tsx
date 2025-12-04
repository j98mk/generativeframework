import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ type: 'success', text: 'Erfolgreich eingeloggt!' });
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Registrierung erfolgreich! Bitte überprüfe deine E-Mail zur Bestätigung.' 
          });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Anmelden' : 'Registrieren'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Lädt...' : (isLogin ? 'Anmelden' : 'Registrieren')}
          </button>
        </form>

        <button 
          className="toggle-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
          }}
          disabled={isLoading}
        >
          {isLogin ? 'Noch kein Konto? Jetzt registrieren' : 'Bereits ein Konto? Anmelden'}
        </button>
      </div>
    </div>
  );
}
