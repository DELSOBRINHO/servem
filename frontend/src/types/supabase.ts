export type Database = {
  public: {
    Tables: {
      // Defina suas tabelas aqui
      programas: {
        Row: {
          id: string
          nome: string
          descricao: string
          categoria: string
          dia_semana: string
          horario: string
          created_at: string
          // outros campos...
        }
        Insert: {
          // campos para inserção
          nome: string
          descricao: string
          categoria: string
          dia_semana: string
          horario: string
          // outros campos...
        }
        Update: {
          // campos para atualização
          nome?: string
          descricao?: string
          categoria?: string
          dia_semana?: string
          horario?: string
          // outros campos...
        }
      }
      voluntarios: {
        // estrutura similar...
        Row: { /* ... */ }
        Insert: { /* ... */ }
        Update: { /* ... */ }
      }
      // outras tabelas...
    }
    // Funções, Views, etc.
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
  }
}
