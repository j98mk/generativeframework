import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { ResetPassword } from './components/ResetPassword';
import './App.css';

function App() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    // Überprüfe, ob die URL den Reset-Password-Pfad enthält
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type === 'recovery') {
      setIsResetPassword(true);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <p>Lädt...</p>
      </div>
    );
  }

  // Zeige Reset-Password-Seite
  if (isResetPassword) {
    return <ResetPassword />;
  }

  // Zeige Dashboard wenn eingeloggt
  if (user) {
    return <Dashboard />;
  }

  // Zeige Auth-Modal wenn Login geklickt wurde
  if (showAuth) {
    return <Auth />;
  }

  // Zeige Landing-Page
  return <LandingPage onLoginClick={() => setShowAuth(true)} />;
}

export default App;
