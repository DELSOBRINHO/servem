import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import App from "./App";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import ProgramForm from "./components/ProgramForm";
import VolunteerManagement from "./components/VolunteerManagement";

const AppRoutes = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const fetchUserProfile = async (userId) => {
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
    return <div>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!session ? <Auth /> : <Navigate to="/" />} />
        <Route path="/" element={session ? <App user={user} /> : <Navigate to="/login" />} />
        <Route path="/programas/novo" element={
          session && user?.role === 'líder' ? <ProgramForm userId={user.id} /> : <Navigate to="/" />
        } />
        <Route path="/programas/:id/voluntarios" element={
          session && user?.role === 'líder' ? <VolunteerManagement /> : <Navigate to="/" />
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
