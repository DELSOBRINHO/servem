export interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  department?: string;
  role?: string;
  status: 'Ativo' | 'Inativo' | 'Afastado' | 'Em treinamento';
  address?: string;
  skills?: string[];
  availability?: string[];
  join_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
