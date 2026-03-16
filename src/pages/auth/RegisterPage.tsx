import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register', {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
      });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#F9FAFB]">Create an account</h2>
        <p className="text-[#9CA3AF] mt-2">Start automating your ML pipelines today.</p>
      </div>

      <Card className="shadow-2xl shadow-black/50 border-[#1f2937]/80 bg-[#0b1020]/90 backdrop-blur-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="First name" 
                placeholder="Jane" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
              />
              <Input 
                label="Last name" 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
              />
            </div>
            
            <Input 
              label="Email address" 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="Create a strong password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            
            <Button type="submit" className="w-full mt-4" size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-2 text-sm">
            <span className="text-[#9CA3AF]">Already have an account?</span>
            <Link to="/login" className="font-semibold text-[#F9FAFB] hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <p className="mt-6 text-center text-xs text-[#9CA3AF]">
        By signing up, you agree to our{' '}
        <Link to="#" className="text-[#F9FAFB] hover:underline">Terms of Service</Link> and{' '}
        <Link to="#" className="text-[#F9FAFB] hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
};
