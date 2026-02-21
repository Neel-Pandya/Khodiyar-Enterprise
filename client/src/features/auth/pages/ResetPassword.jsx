import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import AuthLayout from '../components/AuthLayout';
import { Link } from 'react-router';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset password attempt');
  };

  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Ensure your account is secure with a new password"
    >
      <motion.form 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit} 
        className="w-full flex flex-col gap-6"
      >
        <div>
          <Input
            id="password"
            label="New Password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Input
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Enter Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Button type="submit" className="shadow-lg shadow-primary/20">
            Reset Password
          </Button>
        </div>

        {/* Footer Section */}
        <div className="text-center text-sm">
          <p className="text-slate-500 font-medium">
            Want to go back ?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </motion.form>
    </AuthLayout>
  );
};

export default ResetPassword;
