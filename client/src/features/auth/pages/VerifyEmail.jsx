import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router';
import * as toast from '@/utils/toast';
import AuthLayout from '../components/AuthLayout';
import Input from '@common/Input';
import Button from '@common/Button';
import { useVerifyOTPMutation, useResendOTPMutation } from '@/hooks/useAuthQueries';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutateAsync: verifyOTP, isPending: isVerifyPending } = useVerifyOTPMutation();
  const { mutateAsync: resendOTP, isPending: isResendPending } = useResendOTPMutation();
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    try {
      await verifyOTP({ token, otp: data.otp });
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await resendOTP({ token });
      toast.success('OTP sent again');
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout title="Verify Email" subtitle="Enter the OTP sent to your email">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Input
          label="OTP"
          register={register('otp', { required: 'OTP is required', pattern: { value: /^\d{6}$/, message: 'OTP must be 6 digits' } })}
          error={errors.otp?.message}
        />
        <Button type="submit" loading={isVerifyPending} disabled={isVerifyPending}>Verify</Button>
      </form>

      <div className="flex justify-end mt-4">
        <Link to="#" onClick={(e) => { e.preventDefault(); if (cooldown === 0) handleResend(); }} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          Resend OTP {cooldown > 0 && `(${cooldown}s)`} {isResendPending && 'Sending...'}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;