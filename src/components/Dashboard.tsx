import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './Dashboard.css';

type ProjectRow = {
  id: number;
  name: string;
};

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [data, setData] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Willkommen, {user?.email}</span>
          <button onClick={signOut} className="logout-btn">
            Abmelden
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="data-section">
          <h2>Deine Projekte</h2>
          {error && <p className="error">Fehler: {error}</p>}
          {!error && !data && <p>Lade...</p>}
          {data && data.length === 0 && <p>Keine Projekte gefunden.</p>}
          {data && data.length > 0 && (
            <div className="projects-list">
              {data.map((project) => (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <p>ID: {project.id}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
