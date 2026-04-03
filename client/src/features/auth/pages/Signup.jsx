import AuthLayout from '../components/AuthLayout';
import Input from '@common/Input';
import Button from '@common/Button';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { useSignupMutation } from '@/hooks/useAuthQueries';
import * as toast from '@/utils/toast';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { mutateAsync: signup, isPending } = useSignupMutation();

  const onSubmit = async (data) => {
    delete data.confirmPassword;
    try {
      await signup(data);
      toast.success('Signup successful! Check your email.');
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join Khodiyar Enterprise today">
      <form 
        className="w-full flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="Enter Name"
            required
            register={register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
            error={errors.name?.message}
          />
        </div>
        
        <div>
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="Enter Address"
            required
            register={register('email', { 
              required: 'Email is required', 
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' } 
            })}
            error={errors.email?.message}
          />
        </div>

        <div>
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter Password"
            required
            register={register('password', { 
              required: 'Password is required', 
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: { 
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
              } 
            })}
            error={errors.password?.message}
          />
        </div>

        <div>
          <Input
            id="confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="Enter Confirm Password"
            required
            register={register('confirmPassword', { 
              required: 'Confirm Password is required', 
              validate: (value) => value === watch('password') || 'Passwords do not match' 
            })}
            error={errors.confirmPassword?.message}
          />
        </div>

        <div>
          <Button type="submit" className="shadow-lg shadow-primary/20" loading={isPending} disabled={isPending}>
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
