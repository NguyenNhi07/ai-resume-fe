import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignInPage from './auth/sign-in/index.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/auth/sign-in',
    element: <SignInPage/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
