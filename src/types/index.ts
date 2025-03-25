export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  church: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  department: string;
  status: string;
  volunteers: VolunteerAssignment[];
}

export interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: string;
  address?: string;
  birthdate?: string;
  joinDate?: string;
  skills?: string[];
  availability?: string[];
  notes?: string;
}

export interface VolunteerAssignment {
  id: number;
  name: string;
  role: string;
  confirmed: boolean;
}

export interface Department {
  code: string;
  name: string;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalVolunteers: number;
  activeVolunteers: number;
  departmentStats: {
    department: string;
    events: number;
    volunteers: number;
  }[];
}
