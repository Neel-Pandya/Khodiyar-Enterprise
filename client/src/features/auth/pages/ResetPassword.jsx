import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router';
import * as toast from '@/utils/toast';
import AuthLayout from '../components/AuthLayout';
import Input from '@common/Input';
import Button from '@common/Button';
import useAuthStore from '../../../store/useAuthStore';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [step, setStep] = useState('otp'); // 'otp' or 'password'
  const { verifyResetOTP, resetPassword, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const onOTPSubmit = async (data) => {
    try {
      await verifyResetOTP({ token, otp: data.otp });
      toast.success('OTP verified successfully!');
      setStep('password');
    } catch (error) {
      toast.error(error.message || 'OTP verification failed');
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await resetPassword({ token, password: data.newPassword });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Password reset failed');
    }
  };

  if (!token) return null;

  return (
    <AuthLayout 
      title={step === 'otp' ? "Verify OTP" : "Set New Password"} 
      subtitle={step === 'otp' ? "Enter the OTP sent to your email" : "Ensure your account is secure with a new password"}
    >
      {step === 'otp' ? (
        <form 
          onSubmit={handleSubmit(onOTPSubmit)} 
          className="w-full flex flex-col gap-6"
        >
          <div>
            <Input
              label="OTP"
              register={register('otp', { 
                required: 'OTP is required', 
                pattern: { value: /^\d{6}$/, message: 'OTP must be 6 digits' } 
              })}
              error={errors.otp?.message}
              placeholder="Enter 6-digit OTP"
            />
          </div>

          <div>
            <Button type="submit" loading={isLoading} disabled={isLoading} className="shadow-lg shadow-primary/20">
              Verify OTP
            </Button>
          </div>

          <div className="text-center text-sm">
            <p className="text-slate-500 font-medium">
              If OTP expired, please{' '}
              <Link to="/forgot-password" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                request a new reset link
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <form 
          onSubmit={handleSubmit(onPasswordSubmit)} 
          className="w-full flex flex-col gap-6"
        >
          <div>
            <Input
              id="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter Password"
              register={register('newPassword', { 
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                }
              })}
              error={errors.newPassword?.message}
            />
          </div>

          <div>
            <Input
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Enter Confirm Password"
              register={register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === watch('newPassword') || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />
          </div>

          <div>
            <Button type="submit" loading={isLoading} disabled={isLoading} className="shadow-lg shadow-primary/20">
              Reset Password
            </Button>
          </div>
        </form>
      )}

      {/* Footer Section */}
      <div className="text-center text-sm">
        <p className="text-slate-500 font-medium">
          Want to go back ?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
