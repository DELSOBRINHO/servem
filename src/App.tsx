import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NotificationProvider } from './contexts/NotificationContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import VolunteerList from './pages/volunteers/VolunteerList'
import VolunteerDetails from './pages/volunteers/VolunteerDetails'
import VolunteerForm from './pages/volunteers/VolunteerForm'
import EventList from './pages/events/EventList'
import EventDetails from './pages/events/EventDetails'
import EventForm from './pages/events/EventForm'
import Settings from './pages/Settings'
import Reports from './pages/Reports'

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="volunteers" element={<VolunteerList />} />
            <Route path="volunteers/new" element={<VolunteerForm />} />
            <Route path="volunteers/:id" element={<VolunteerDetails />} />
            <Route path="volunteers/:id/edit" element={<VolunteerForm />} />
            <Route path="events" element={<EventList />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="events/:id/edit" element={<EventForm />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </NotificationProvider>
  )
}

export default App