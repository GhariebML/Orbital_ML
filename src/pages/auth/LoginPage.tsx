import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      const res = await apiClient.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#F9FAFB]">Sign in to your account</h2>
        <p className="text-[#9CA3AF] mt-2">Enter your credentials to access the studio.</p>
      </div>

      <Card className="shadow-2xl shadow-black/50 border-[#1f2937]/80 bg-[#0b1020]/90 backdrop-blur-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}
            <Input 
              label="Email address" 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[#F9FAFB]">Password</label>
                <Link to="#" className="text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5]">
                  Forgot password?
                </Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-2 text-sm">
            <span className="text-[#9CA3AF]">Don't have an account?</span>
            <Link to="/register" className="font-semibold text-[#F9FAFB] hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1f2937]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#050816] px-2 text-[#9CA3AF]">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full border border-[#374151] hover:bg-[#374151]/50 text-[#F9FAFB]">
            Google
          </Button>
          <Button variant="secondary" className="w-full border border-[#374151] hover:bg-[#374151]/50 text-[#F9FAFB]">
            GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};
