import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ForgotPassword } from './ForgotPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

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
    <div className="flex justify-center items-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Anmelden' : 'Registrieren'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Melde dich mit deinem Konto an' : 'Erstelle ein neues Konto'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                E-Mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Passwort
              </label>
              <Input
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
              <div className={`p-3 rounded-md text-sm ${
                message.type === 'error' 
                  ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.text}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Lädt...' : (isLogin ? 'Anmelden' : 'Registrieren')}
            </Button>
          </form>

          {isLogin && (
            <Button 
              variant="ghost"
              className="w-full mt-2"
              onClick={() => setShowForgotPassword(true)}
              disabled={isLoading}
            >
              Passwort vergessen?
            </Button>
          )}

          <Button 
            variant="link"
            className="w-full mt-2"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage(null);
            }}
            disabled={isLoading}
          >
            {isLogin ? 'Noch kein Konto? Jetzt registrieren' : 'Bereits ein Konto? Anmelden'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
