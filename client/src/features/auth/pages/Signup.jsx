import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import { Link } from 'react-router';

const Signup = () => {
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
    <AuthLayout title="Create Account" subtitle="Join Khodiyar Enterprise today">
      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col gap-6"
      >
        <motion.div variants={itemVariants}>
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="Enter Name"
            required
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="Enter Address"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter Password"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            id="confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="Enter Confirm Password"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="shadow-lg shadow-primary/20">
            Sign Up
          </Button>
        </motion.div>

        {/* Footer Section */}
        <motion.div variants={itemVariants} className="text-center text-sm">
          <p className="text-slate-500 font-medium">
            Already have an account ?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Login
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default Signup;
