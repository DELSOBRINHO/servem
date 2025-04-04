import supabase from './supabase';

interface EmailData {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export const emailService = {
  /**
   * Sends an email using Supabase Edge Functions
   */
  sendEmail: async (emailData: EmailData): Promise<boolean> => {
    try {
      // Call Supabase Edge Function for sending emails
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData
      });

      if (error) {
        console.error('Error sending email:', error);
        return false;
      }

      return data?.success || false;
    } catch (err) {
      console.error('Error in email service:', err);
      return false;
    }
  },

  /**
   * Sends event notification to a volunteer
   */
  sendEventNotification: async (
    volunteerEmail: string,
    volunteerName: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string
  ): Promise<boolean> => {
    const subject = `Você foi escalado para o evento: ${eventTitle}`;
    
    const body = `
      <h2>Olá, ${volunteerName}!</h2>
      <p>Você foi escalado para o evento <strong>${eventTitle}</strong>.</p>
      <p><strong>Data:</strong> ${eventDate}</p>
      <p><strong>Horário:</strong> ${eventTime}</p>
      <p><strong>Local:</strong> ${eventLocation}</p>
      <p>Por favor, confirme sua presença respondendo a este e-mail.</p>
      <p>Atenciosamente,<br>Equipe de Coordenação</p>
    `;

    return emailService.sendEmail({
      to: volunteerEmail,
      subject,
      body
    });
  },

  /**
   * Sends a reminder to volunteers about upcoming events
   */
  sendEventReminder: async (
    volunteerEmail: string,
    volunteerName: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string
  ): Promise<boolean> => {
    const subject = `Lembrete: Evento ${eventTitle} amanhã`;
    
    const body = `
      <h2>Olá, ${volunteerName}!</h2>
      <p>Este é um lembrete para o evento <strong>${eventTitle}</strong> que acontecerá amanhã.</p>
      <p><strong>Data:</strong> ${eventDate}</p>
      <p><strong>Horário:</strong> ${eventTime}</p>
      <p><strong>Local:</strong> ${eventLocation}</p>
      <p>Contamos com sua presença!</p>
      <p>Atenciosamente,<br>Equipe de Coordenação</p>
    `;

    return emailService.sendEmail({
      to: volunteerEmail,
      subject,
      body
    });
  }
};
