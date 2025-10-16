import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import { useUser } from '@clerk/clerk-react'
import Header from './components/custom/Header'
import { ToastProvider } from './components/custom/Toast'

function App() {
  const { user, isSignedIn, isLoaded } = useUser()

  if (!isSignedIn && isLoaded) {
    return <Navigate to='/auth/sign-in' />
  }

  return (
    <>
      <ToastProvider>
        <Header />
        <Outlet />
      </ToastProvider>
    </>
  )
}

export default App
