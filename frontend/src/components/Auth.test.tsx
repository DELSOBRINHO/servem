import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Auth from './Auth';

// Mock do Supabase
vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    })),
  },
}));

describe('Auth Component', () => {
  it('renderiza o formulário de login por padrão', () => {
    render(<Auth />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('alterna para o formulário de cadastro ao clicar no link', () => {
    render(<Auth />);
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Função')).toBeInTheDocument();
  });

  it('volta para o formulário de login ao clicar no link', () => {
    render(<Auth />);
    // Primeiro vamos para o cadastro
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));
    // Depois voltamos para o login
    fireEvent.click(screen.getByText('Já tem uma conta? Faça login'));
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
