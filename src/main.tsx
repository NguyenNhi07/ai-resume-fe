import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignInPage from './auth/sign-in/index.tsx'
import Home from './home/index.tsx'
import Dashboard from './dashboard/index.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import EditResume from './dashboard/resume/[id]/edit/index.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const router = createBrowserRouter([
  {
    element: <App/>,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/dashboard/resume/:id/edit',
        element: <EditResume/>
      }
    ]
  },
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/auth/sign-in',
    element: <SignInPage/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)
