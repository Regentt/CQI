import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster }            from 'react-hot-toast'
import { AppLayout }          from './components/layout/AppLayout'
import { ProtectedRoute }     from './components/layout/ProtectedRoute'
import LoginPage              from './pages/LoginPage'
import HomePage               from './pages/HomePage' 
import UploadPage             from './pages/UploadPage'

function Protected({ children, roles }) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{ style: { fontSize: '13px' } }}
      />
      <Routes> 
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route path="/"  element={<Protected><HomePage /></Protected>} />
      
        <Route path="/upload"    element={<Protected><UploadPage /></Protected>} />
 
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  )
}