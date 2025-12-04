import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { MFASetup } from './MFASetup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

type ProjectRow = {
  id: number;
  name: string;
};

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [data, setData] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMFASetup, setShowMFASetup] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .limit(10);

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setData(data);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {showMFASetup && <MFASetup onClose={() => setShowMFASetup(false)} />}
      
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Willkommen, {user?.email}</span>
            <Button onClick={() => setShowMFASetup(true)} variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              2FA
            </Button>
            <Button onClick={signOut} variant="default" size="sm">
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Deine Projekte</CardTitle>
            <CardDescription>Verwalte deine Projekte und Einstellungen</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-3 rounded-md text-sm bg-destructive/10 text-destructive border border-destructive/20">
                Fehler: {error}
              </div>
            )}
            {!error && !data && <p className="text-muted-foreground">Lade...</p>}
            {data && data.length === 0 && <p className="text-muted-foreground">Keine Projekte gefunden.</p>}
            {data && data.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {data.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>ID: {project.id}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
