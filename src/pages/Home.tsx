import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-servem-primary sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Organize seu</span>{' '}
                  <span className="block text-servem-secondary xl:inline">voluntariado com eficiência</span>
                </h1>
                <p className="mt-3 text-base text-servem-neutral sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  O Servem é uma plataforma que ajuda igrejas a organizar seus voluntários, 
                  criar escalas e gerenciar eventos de forma simples e eficiente.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/login">
                      <Button variant="primary" className="w-full">
                        Começar Agora
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/about">
                      <Button variant="outline" className="w-full">
                        Saiba Mais
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1556484687-30636164638b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            alt="Voluntários em ação"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-servem-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-servem-secondary font-semibold tracking-wide uppercase">Recursos</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-servem-primary sm:text-4xl">
              Uma maneira melhor de gerenciar voluntários
            </p>
            <p className="mt-4 max-w-2xl text-xl text-servem-neutral lg:mx-auto">
              Simplifique a organização da sua igreja com nossas ferramentas intuitivas.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-servem-primary text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-servem-primary">Gestão de Voluntários</h3>
                  <p className="mt-2 text-base text-servem-neutral">
                    Cadastre voluntários, organize por departamentos e acompanhe a participação de cada um.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-servem-primary text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-servem-primary">Criação de Escalas</h3>
                  <p className="mt-2 text-base text-servem-neutral">
                    Crie escalas de forma rápida e eficiente, evitando conflitos e sobrecargas.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-servem-primary text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-servem-primary">Notificações</h3>
                  <p className="mt-2 text-base text-servem-neutral">
                    Envie lembretes automáticos para os voluntários sobre suas escalas e eventos.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-servem-primary text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-servem-primary">Relatórios</h3>
                  <p className="mt-2 text-base text-servem-neutral">
                    Acompanhe o desempenho dos departamentos e a participação dos voluntários com relatórios detalhados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-servem-secondary font-semibold tracking-wide uppercase">Depoimentos</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-servem-primary sm:text-4xl">
              O que nossas igrejas estão dizendo
            </p>
          </div>
          <div className="mt-10">
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8">
              <div className="bg-servem-light p-6 rounded-lg shadow-md">
                <p className="text-servem-neutral italic mb-4">
                  "O Servem transformou a maneira como organizamos nossos voluntários. Economizamos horas de trabalho toda semana!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                    <span>PR</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-servem-primary">Pastor Ricardo</h4>
                    <p className="text-xs text-servem-neutral">Igreja Adventista Central</p>
                  </div>
                </div>
              </div>

              <div className="bg-servem-light p-6 rounded-lg shadow-md">
                <p className="text-servem-neutral italic mb-4">
                  "Nossos voluntários adoram receber as notificações e saber exatamente quando precisam servir."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                    <span>MC</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-servem-primary">Maria Cristina</h4>
                    <p className="text-xs text-servem-neutral">Coordenadora de Música</p>
                  </div>
                </div>
              </div>

              <div className="bg-servem-light p-6 rounded-lg shadow-md">
                <p className="text-servem-neutral italic mb-4">
                  "A criação de escalas se tornou muito mais simples e conseguimos distribuir melhor as responsabilidades."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                    <span>JL</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-servem-primary">João Lima</h4>
                    <p className="text-xs text-servem-neutral">Diretor de Jovens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-servem-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
            <span className="block text-servem-accent">Experimente o Servem hoje mesmo.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/signup">
                <Button variant="accent" className="px-5 py-3 text-base font-medium">
                  Criar Conta Gratuita
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/contact">
                <Button variant="outline" className="px-5 py-3 text-base font-medium bg-white text-servem-primary">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link to="/about" className="text-base text-servem-neutral hover:text-servem-primary">
                Sobre
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/features" className="text-base text-servem-neutral hover:text-servem-primary">
                Recursos
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/pricing" className="text-base text-servem-neutral hover:text-servem-primary">
                Preços
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/blog" className="text-base text-servem-neutral hover:text-servem-primary">
                Blog
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact" className="text-base text-servem-neutral hover:text-servem-primary">
                Contato
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-servem-neutral">
            © 2023 Servem. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
