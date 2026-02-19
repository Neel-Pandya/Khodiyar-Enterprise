import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import AuthLayout from '../components/AuthLayout';
import { Link, useNavigate } from 'react-router';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/reset-password');
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
      title="Reset Password" 
      subtitle="Enter your email to receive a reset link"
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
            id="email"
            label="Email address"
            type="email"
            placeholder="Enter Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="shadow-lg shadow-primary/20">
            Send Reset Link
          </Button>
        </motion.div>

        {/* Footer Section */}
        <motion.div variants={itemVariants} className="text-center text-sm">
          <p className="text-slate-500 font-medium">
            Remember your password ?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Login
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default ForgotPassword;
