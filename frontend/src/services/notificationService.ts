import { supabase } from "../supabaseClient";

// Função para criar uma notificação no sistema
export const createNotification = async (userId: string, message: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        message
      }
    ]);
    
  if (error) {
    console.error('Erro ao criar notificação:', error);
    throw error;
  }
  
  return data;
};

// Função para enviar e-mail (usando uma API externa ou Supabase Edge Functions)
export const sendEmail = async (email: string, subject: string, body: string) => {
  // Em um ambiente real, você usaria um serviço de e-mail como SendGrid, Mailgun, etc.
  // Para este exemplo, vamos apenas simular o envio
  console.log(`Enviando e-mail para ${email}`);
  console.log(`Assunto: ${subject}`);
  console.log(`Corpo: ${body}`);
  
  // Simulação de sucesso
  return { success: true };
};

// Função para notificar um voluntário sobre aceitação/recusa
export const notifyVolunteer = async (
  volunteerId: string, 
  volunteerEmail: string,
  programName: string, 
  status: 'aceito' | 'recusado'
) => {
  const statusText = status === 'aceito' ? 'aceito' : 'recusado';
  const message = `Sua inscrição para o programa "${programName}" foi ${statusText}.`;
  
  // Criar notificação no sistema
  await createNotification(volunteerId, message);
  
  // Enviar e-mail
  const subject = `Atualização sobre sua inscrição em "${programName}"`;
  const body = `
    Olá,
    
    Gostaríamos de informar que sua inscrição para o programa "${programName}" foi ${statusText}.
    
    ${status === 'aceito' 
      ? 'Agradecemos sua disponibilidade e contamos com sua presença!' 
      : 'Agradecemos seu interesse e esperamos contar com você em outras oportunidades.'}
    
    Atenciosamente,
    Equipe Servem
  `;
  
  await sendEmail(volunteerEmail, subject, body);
};

// Função para notificar um líder sobre nova inscrição
export const notifyLeader = async (
  leaderId: string,
  leaderEmail: string,
  volunteerName: string,
  programName: string
) => {
  const message = `${volunteerName} se inscreveu para o programa "${programName}".`;
  
  // Criar notificação no sistema
  await createNotification(leaderId, message);
  
  // Enviar e-mail
  const subject = `Nova inscrição para "${programName}"`;
  const body = `
    Olá,
    
    ${volunteerName} se inscreveu como voluntário para o programa "${programName}".
    
    Acesse o sistema para aceitar ou recusar esta inscrição.
    
    Atenciosamente,
    Equipe Servem
  `;
  
  await sendEmail(leaderEmail, subject, body);
};
