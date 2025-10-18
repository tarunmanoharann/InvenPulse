import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';
import MockBg from '../assets/bgbg.jpg';
import MiniNavbar from '../components/MiniNavbar';

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen relative">
      {/* Full-page background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${MockBg})`
        }}
      />
      
      <MiniNavbar />
      
      {/* Centered content */}
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Create an Account
            </h2>
            
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}