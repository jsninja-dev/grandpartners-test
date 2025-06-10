import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EmailAuth from './pages/EmailAuth';
import Reg from './pages/Reg';
import RegCode from './pages/RegCode';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/email" element={<EmailAuth />} />
      <Route path="/reg" element={<Reg />} />
      <Route path="/reg/code" element={<RegCode />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
