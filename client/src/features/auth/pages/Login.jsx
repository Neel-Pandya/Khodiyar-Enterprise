import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Input from '@common/Input';
import Button from '@common/Button';
import AuthLayout from '../components/AuthLayout';
import { Link, useNavigate } from 'react-router';
import { useLoginMutation } from '@/hooks/useAuthQueries';
import useAuthStore from '@/store/useAuthStore';
import { authApi } from '@/api/authApi';
import * as toast from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { mutateAsync: login, isPending } = useLoginMutation();
  const [isSendingVerificationEmail, setIsSendingVerificationEmail] = useState(false);
  const email = watch('email');

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Login successful!');
      
      // Get the updated user from store after login
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      // Handle inactive email status
      if (error.statusCode === 403 && error.message === 'Email not verified') {
        const metadata = error.metadata;
        
        if (metadata?.verificationExists && !metadata?.isExpired) {
          // Verification link exists and is still valid
          toast.error('A verification link has already been sent to your email');
        } else {
          // Verification link expired or doesn't exist - auto-send new email
          try {
            setIsSendingVerificationEmail(true);
            await authApi.initiateLoginVerification(data.email);
            toast.success('Verification email sent to your email address');
          } catch (emailError) {
            toast.error(emailError.message || 'Failed to send verification email. Please try again.');
          } finally {
            setIsSendingVerificationEmail(false);
          }
        }
      } else {
        toast.error(error?.message || 'Something went wrong');
      }
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Log in to your account"
    >
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full flex flex-col gap-6"
      >
        <div>
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="Enter Address"
            register={register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />
        </div>

        <div className="flex flex-col">
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter Password"
            register={register('password', { required: 'Password is required' })}
            error={errors.password?.message}
          />
          <div className="flex justify-end mt-2">
            <Link to="/forgot-password" 
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div>
          <Button type="submit" className="shadow-lg shadow-primary/20" loading={isPending || isSendingVerificationEmail} disabled={isPending || isSendingVerificationEmail}>
            Log In
          </Button>
        </div>

        {/* Footer Section */}
        <div className=" text-center text-sm">
          <p className="text-slate-500 font-medium">
            Don't have an account ?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
