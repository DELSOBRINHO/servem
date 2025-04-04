import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useLoading } from '../hooks/useLoading';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { resetPassword } = useAuth();
  const { success, error } = useNotificationContext();
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      error('Por favor, informe seu e-mail');
      return;
    }

    await withLoading(
      resetPassword(email)
        .then(({ error: resetError }) => {
          if (resetError) {
            error(resetError.message || 'Erro ao enviar e-mail de redefinição de senha');
          } else {
            success('E-mail de redefinição de senha enviado com sucesso');
            setResetSent(true);
          }
        })
        .catch((err) => {
          console.error('Reset password error:', err);
          error('Ocorreu um erro ao enviar o e-mail de redefinição de senha');
        })
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-servem-primary">SerVem</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Redefinir senha</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Informe seu e-mail para receber um link de redefinição de senha
          </p>
        </div>
        
        {resetSent ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">E-mail enviado</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <Link
                      to="/login"
                      className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Voltar para o login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  E-mail
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-servem-primary focus:border-servem-primary focus:z-10 sm:text-sm"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-servem-primary hover:bg-servem-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : null}
                Enviar link de redefinição
              </button>
            </div>

            <div className="text-center">
              <Link to="/login" className="font-medium text-servem-primary hover:text-servem-secondary">
                Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
