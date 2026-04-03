import { useForm } from 'react-hook-form';
import Input from '@common/Input';
import Button from '@common/Button';
import AuthLayout from '../components/AuthLayout';
import { Link } from 'react-router';
import { useForgotPasswordMutation } from '@/hooks/useAuthQueries';
import * as toast from '@/utils/toast';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutateAsync: forgotPassword, isPending } = useForgotPasswordMutation();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      toast.success("Reset email sent");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive a reset link"
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

        <div>
          <Button type="submit" className="shadow-lg shadow-primary/20" loading={isPending} disabled={isPending}>
            Send Reset Link
          </Button>
        </div>

        {/* Footer Section */}
        <div className="text-center text-sm">
          <p className="text-slate-500 font-medium">
            Remember your password ?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
