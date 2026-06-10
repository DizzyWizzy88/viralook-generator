import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './app/login/page.tsx';
import DashboardPage from './app/dashboard/page.tsx';
import SignupPage from './app/signup/page.tsx';
import ProfilePage from './app/profile/page.tsx';
import './app/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Force the base path to load up your login layout cleanly */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Set up client-side path targets for your navigation calls */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Fallback anchor: if a path doesn't match, bounce back safely */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;