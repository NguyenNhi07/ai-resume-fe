import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Preview from './pages/Preview'
import ResumeBuilder from './pages/ResumeBuilder'
import Login from './pages/Login'
import SettingLayout from './pages/SettingLayout'
import ProfileManagement from './pages/ProfileManagement'
import ChangePassword from './pages/ChangePassword'
import Language from './pages/Language'
import PreviewResume from './pages/PreviewResume'
import ForgotPassword from './pages/ForgotPassword'
import AuthLayout from './pages/AuthLayout'
import VeirifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import MockInterview from './pages/MockInterview'
import CoverLetter from './pages/CoverLetter'
import TailorByJD from './pages/TailorByJD'
import { Toaster } from 'sonner';
import ResumeDetail from './pages/ResumeDetail'

function App() {

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeDetail />} />
          <Route path='builder/:resumeId/edit' element={<ResumeBuilder />} />
          <Route path='preview/:resumeId' element={<PreviewResume />} />
          <Route path='tailor/:resumeId' element={<TailorByJD />} />
          <Route path='mock-interview/:resumeId' element={<MockInterview />} />
          <Route path='cover-letter/:resumeId' element={<CoverLetter />} />
        </Route>

        <Route path='setting' element={<SettingLayout />}>
          <Route index element={<ProfileManagement />} />
          <Route path='changePassword' element={<ChangePassword />} />
          <Route path='language' element={<Language />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />

        <Route path='auth' element={<AuthLayout />}>
          <Route path='login' element={<Login />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='verify-email' element={<VeirifyEmail />} />
          <Route path='reset-password' element={<ResetPassword />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
