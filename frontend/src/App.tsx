import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ProgramForm from "./components/ProgramForm";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {!session ? (
        <Auth />
      ) : (
        <div className="container mx-auto p-4">
          <header className="bg-white p-4 mb-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Servem</h1>
              <div className="flex items-center gap-4">
                <span>Olá, {user?.name || 'Usuário'}</span>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sair
                </button>
              </div>
            </div>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Dashboard user={user} />
            </div>
            
            {user?.role === 'líder' && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Cadastrar Novo Programa</h2>
                <ProgramForm userId={user.id} />
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;