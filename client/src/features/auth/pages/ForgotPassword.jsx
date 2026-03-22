import { useState } from 'react';
import Input from '@common/Input';
import Button from '@common/Button';
import AuthLayout from '../components/AuthLayout';
import { Link, useNavigate } from 'react-router';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/reset-password');
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive a reset link"
    >
      <form 
        onSubmit={handleSubmit} 
        className="w-full flex flex-col gap-6"
      >
        <div>
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="Enter Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Button type="submit" className="shadow-lg shadow-primary/20">
            Send Reset Link
          </Button>
        </div>

        {/* Footer Section */}
        <div className="text-center text-sm">
          <p className="text-slate-500 font-medium">
            Remember your password ?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
