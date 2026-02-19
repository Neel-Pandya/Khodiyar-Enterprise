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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Ensure your account is secure with a new password"
    >
      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit} 
        className="w-full flex flex-col gap-6"
      >
        <motion.div variants={itemVariants}>
          <Input
            id="password"
            label="New Password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Enter Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="shadow-lg shadow-primary/20">
            Reset Password
          </Button>
        </motion.div>

        {/* Footer Section */}
        <motion.div variants={itemVariants} className="text-center text-sm">
          <p className="text-slate-500 font-medium">
            Want to go back ?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Login
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default ResetPassword;
