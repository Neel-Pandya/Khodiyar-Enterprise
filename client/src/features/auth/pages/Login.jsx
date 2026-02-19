import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import AuthLayout from '../components/AuthLayout';
import { Link } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
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
      title="Welcome Back" 
      subtitle="Log in to your account"
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

        <motion.div variants={itemVariants} className="flex flex-col">
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end mt-2">
            <Link to="/forgot-password" 
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="shadow-lg shadow-primary/20">
            Log In
          </Button>
        </motion.div>

        {/* Footer Section */}
        <motion.div variants={itemVariants} className=" text-center text-sm">
          <p className="text-slate-500 font-medium">
            Don't have an account ?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default Login;
