import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import CampaignsPage from './pages/CampaignsPage'
import CampaignDetailPage from './pages/CampaignDetailPage'
import DashboardPage from './pages/DashboardPage'
import MyDonationsPage from './pages/MyDonationsPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Layout>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaign/:id" element={<CampaignDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-donations" element={<MyDonationsPage />} />
          <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
  )
}

export default App
