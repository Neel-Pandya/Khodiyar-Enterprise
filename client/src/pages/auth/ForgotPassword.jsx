import { useState } from 'react';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import AuthLayout from '../../components/Layout/AuthLayout';
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
      title="Forgot Password" 
      subtitle="Enter your email address and we'll send you instruction to reset your password."
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="Enter Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" className="mt-2">
          Submit
        </Button>
      </form>

      {/* Footer Section */}
      <div className="mt-2 text-center text-sm">
        <p className="text-slate-600">
          Back to ?{' '}
          <Link to="/login" className="text-blue-900 font-bold hover:cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
