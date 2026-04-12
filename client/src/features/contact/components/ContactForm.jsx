import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, Mail, FileText, Send } from 'lucide-react';
import Input from '@common/Input';
import Button from '@common/Button';
import Textarea from '@common/Textarea';
import * as toast from '@/utils/toast';
import useAuthStore from '@/store/useAuthStore';
import { useNavigate } from 'react-router';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      full_name: user?.name || '',
      phone: '',
      email: user?.email || '',
      message: '',
    },
  });

  if (!user) {
    return (
      <div
        className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col items-center justify-center"
      >
        <div className="text-center">
          <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            Login to Contact Us
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed text-sm md:text-base">
            You need to be logged in to submit a contact form message. Please login to your account to get in touch with us.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="px-8 py-3 text-base"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = (data) => {
    setIsSubmitting(true);
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'neelpandya2601@gmail.com';

      // Create email subject with user name
      const subject = `New Contact Form Submission - ${data.full_name}`;

      // Create email body with formatted message
      const body = `
New Contact Form Submission

Name: ${data.full_name}
Phone: ${data.phone}
Email: ${data.email}
            
-----------------------
            
Message:
${data.message}
      `;

      // Create Gmail compose URL with prefilled details
      const mailtoUrl = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      toast.success('Opening your email client...');

      // Redirect to Gmail
      window.open(mailtoUrl, '_blank');
      

      setTimeout(() => {
        reset();
      }, 500);
    } catch (error) {
      toast.error('Failed to prepare message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full"
    >
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Send a Message</h2>
        <p className="text-slate-500 leading-relaxed text-sm md:text-base">
          Fill out the form below and we'll open Gmail with your message prefilled. Send directly from your email account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="full_name"
            label="Full Name"
            placeholder="John Doe"
            icon={User}
            register={register('full_name', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Full name must be at least 2 characters' },
              maxLength: { value: 100, message: 'Full name cannot exceed 100 characters' },
            })}
            error={errors.full_name?.message}
          />

          <Input
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="+91 12345 67890"
            icon={Phone}
            register={register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                message: 'Please enter a valid phone number',
              },
              maxLength: { value: 20, message: 'Phone number cannot exceed 20 characters' },
            })}
            error={errors.phone?.message}
          />
        </div>

        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          icon={Mail}
          readOnly
          register={register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
          error={errors.email?.message}
        />

        <Textarea
          id="message"
          label="Your Message"
          placeholder="How can we help you?"
          icon={FileText}
          rows={4}
          register={register('message', {
            required: 'Message is required',
            minLength: { value: 10, message: 'Message must be at least 10 characters' },
            maxLength: { value: 500, message: 'Message cannot exceed 500 characters' },
          })}
          error={errors.message?.message}
        />

        <Button
          type="submit"
          className="w-full mt-4 py-4 text-base flex items-center justify-center gap-2 group shadow-lg shadow-[#1E3A5F]/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Opening Gmail...' : 'Open Gmail'}
          {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
