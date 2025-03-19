import { supabase } from "./supabaseClient";

export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  
  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
  
  return data || [];
};

export const getPrograms = async (leaderId = null) => {
  let query = supabase.from("church_programs").select("*");
  
  if (leaderId) {
    query = query.eq("leader_id", leaderId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching programs:", error);
    throw error;
  }
  
  return data || [];
};

export const createProgram = async (programData) => {
  const { data, error } = await supabase
    .from("church_programs")
    .insert([programData]);
  
  if (error) {
    console.error("Error creating program:", error);
    throw error;
  }
  
  return data;
};

export const volunteerForProgram = async (eventId, volunteerId) => {
  const { data, error } = await supabase
    .from("event_volunteers")
    .insert([
      {
        event_id: eventId,
        volunteer_id: volunteerId,
        status: "pendente"
      }
    ]);
  
  if (error) {
    console.error("Error volunteering for program:", error);
    throw error;
  }
  
  return data;
};

export const updateVolunteerStatus = async (volunteerId, status) => {
  const { data, error } = await supabase
    .from("event_volunteers")
    .update({ status })
    .eq("id", volunteerId);
  
  if (error) {
    console.error("Error updating volunteer status:", error);
    throw error;
  }
  
  return data;
};

export const getVolunteersForProgram = async (programId) => {
  const { data, error } = await supabase
    .from("event_volunteers")
    .select(`
      id,
      status,
      notified_at,
      volunteer_id,
      users:volunteer_id (id, name, email)
    `)
    .eq("event_id", programId);
  
  if (error) {
    console.error("Error fetching volunteers:", error);
    throw error;
  }
  
  // Transform the data to match our Volunteer interface
  return data.map(item => ({
    id: item.id,
    name: item.users.name,
    email: item.users.email,
    status: item.status,
    notified_at: item.notified_at
  }));
};
