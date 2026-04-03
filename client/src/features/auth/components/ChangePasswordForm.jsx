import { useForm } from 'react-hook-form';
import { Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import Input from '@common/Input';
import Button from '@common/Button';
import { useChangePasswordMutation } from '@/hooks/useAuthQueries';
import useAuthStore from '../../../store/useAuthStore';
import * as toast from '@/utils/toast';

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { mutateAsync: changePassword, isPending } = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      const { currentPassword, newPassword } = data;
      await changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully! Please log in again.');
      logout();
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (error.response?.status === 401) {
        toast.error('Current password is incorrect');
      } else {
        toast.error(errorMessage || 'Failed to change password');
      }
    }
  };

  return (
    <div className="bg-white w-full max-w-[480px] rounded-3xl shadow-2xl shadow-primary/10 px-10 py-10 border border-slate-50">
      {/* Shield Icon Header */}
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary transition-transform duration-500 hover:scale-110">
          <Shield size={32} strokeWidth={2} />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Change Password
        </h2>
        <p className="text-slate-400 text-sm mt-2 font-medium">
          Update your password to keep your account secure
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Password */}
        <Input
          id="currentPassword"
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          icon={Lock}
          register={register('currentPassword', {
            required: 'Current password is required',
          })}
          error={errors.currentPassword?.message}
        />

        {/* New Password */}
        <Input
          id="newPassword"
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          icon={Lock}
          register={register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
              message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            },
          })}
          error={errors.newPassword?.message}
        />

        {/* Confirm Password */}
        <Input
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="Confirm your new password"
          icon={Lock}
          register={register('confirmPassword', {
            required: 'Please confirm your new password',
            validate: (value) =>
              value === newPassword || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
        />

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            loading={isPending}
            disabled={isPending}
            className="w-full h-12 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
