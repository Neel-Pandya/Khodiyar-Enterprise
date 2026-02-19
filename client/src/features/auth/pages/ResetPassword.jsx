import { useState } from 'react';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import AuthLayout from '../components/AuthLayout';
import { Link } from 'react-router';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Create a strong password"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Enter Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPassword;
