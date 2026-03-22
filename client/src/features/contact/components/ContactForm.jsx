import { User, Phone, Mail, FileText, Send } from 'lucide-react';
import Input from '@common/Input';
import Button from '@common/Button';
import Textarea from '@common/Textarea';

const ContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <div 
      className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full"
    >
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Send a Message</h2>
        <p className="text-slate-500 leading-relaxed text-sm md:text-base">
          Fill out the form below and we'll get back to you as soon as possible. Your privacy is strictly protected.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            id="name"
            label="Full Name"
            placeholder="John Doe"
            icon={User}
            required
          />
          
          <Input 
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="+91 12345 67890"
            icon={Phone}
            required
          />
        </div>
        
        <Input 
          id="email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          icon={Mail}
          required
        />
        
        <Textarea 
          id="message"
          label="Your Message"
          placeholder="How can we help you?"
          icon={FileText}
          rows={4}
          required
        />

        <Button type="submit" className="w-full mt-4 py-4 text-base flex items-center justify-center gap-2 group shadow-lg shadow-[#1E3A5F]/20">
          Send Message
          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
