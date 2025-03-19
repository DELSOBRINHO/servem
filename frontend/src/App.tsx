import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ProgramForm from "./components/ProgramForm";
import VolunteerManagement from "./components/VolunteerManagement";
import UserProfile from "./components/UserProfile";
import ThemeToggle from "./components/ThemeToggle";
import Notifications from "./components/Notifications";

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
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Verificar sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Ouvir mudanças de autenticação
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
      console.error('Erro ao buscar perfil do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl text-gray-800 dark:text-gray-200">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Servem</h1>
          
          <div className="flex items-center space-x-4">
            {user && <Notifications userId={user.id} />}
            <ThemeToggle />
            
            <div className="flex items-center">
              <span className="mr-2">{user?.name || 'Usuário'}</span>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
        
        <nav className="container mx-auto px-4 py-2">
          <ul className="flex space-x-6">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-2 py-1 ${activeTab === "dashboard" ? "border-b-2 border-blue-500 font-medium" : ""}`}
              >
                Dashboard
              </button>
            </li>
            {user?.role === "líder" && (
              <li>
                <button
                  onClick={() => setActiveTab("new-program")}
                  className={`px-2 py-1 ${activeTab === "new-program" ? "border-b-2 border-blue-500 font-medium" : ""}`}
                >
                  Novo Programa
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-2 py-1 ${activeTab === "profile" ? "border-b-2 border-blue-500 font-medium" : ""}`}
              >
                Meu Perfil
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && <Dashboard user={user} />}
        {activeTab === "new-program" && user?.role === "líder" && <ProgramForm userId={user.id} />}
        {activeTab === "profile" && user && <UserProfile userId={user.id} />}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Servem - Sistema de Gerenciamento de Voluntários
        </div>
      </footer>
    </div>
  );
}

export default App;