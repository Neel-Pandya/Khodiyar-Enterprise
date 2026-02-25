import AuthLayout from '../components/AuthLayout';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import { Link } from 'react-router';

const Signup = () => {
  return (
    <AuthLayout title="Create Account" subtitle="Join Khodiyar Enterprise today">
      <form 
        className="w-full flex flex-col gap-6"
      >
        <div>
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="Enter Name"
            required
          />
        </div>
        
        <div>
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="Enter Address"
            required
          />
        </div>

        <div>
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter Password"
            required
          />
        </div>

        <div>
          <Input
            id="confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="Enter Confirm Password"
            required
          />
        </div>

        <div>
          <Button type="submit" className="shadow-lg shadow-primary/20">
            Sign Up
          </Button>
        </div>

        {/* Footer Section */}
        <div className="text-center text-sm">
          <p className="text-slate-500 font-medium">
            Already have an account ?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Signup;
