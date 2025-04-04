import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NotificationProvider } from './contexts/NotificationContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import VolunteerList from './pages/volunteers/VolunteerList'
import NewVolunteer from './pages/volunteers/NewVolunteer'
import VolunteerDetails from './pages/volunteers/VolunteerDetails'
import EventList from './pages/events/EventList'
import NewEvent from './pages/events/NewEvent'
import EventDetails from './pages/events/EventDetails'
import ReportDashboard from './pages/reports/ReportDashboard'
import Settings from './pages/settings/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            
            {/* Volunteer Routes */}
            <Route path="volunteers" element={<VolunteerList />} />
            <Route path="volunteers/new" element={<NewVolunteer />} />
            <Route path="volunteers/:id" element={<VolunteerDetails />} />
            
            {/* Event Routes */}
            <Route path="events" element={<EventList />} />
            <Route path="events/new" element={<NewEvent />} />
            <Route path="events/:id" element={<EventDetails />} />
            
            {/* Report Routes */}
            <Route path="reports" element={<ReportDashboard />} />
            
            {/* Settings Route */}
            <Route path="settings" element={<Settings />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </NotificationProvider>
  )
}

export default App