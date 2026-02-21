import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactInfo = ({ fadeUp }) => {
  return (
    <motion.div 
      variants={fadeUp}
      className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col"
    >
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Contact Information</h2>
        <p className="text-slate-500 leading-relaxed text-sm md:text-base">
          Connect with us directly using the information below. We aim to respond to all inquiries within 24 hours.
        </p>
      </div>

      <div className="flex flex-col gap-8 flex-grow">
        
        {/* Phone Info */}
        <div className="flex items-start gap-5 group">
          <div className="w-14 h-14 bg-[#1E3A5F]/5 group-hover:bg-[#1E3A5F] flex items-center justify-center rounded-2xl text-[#1E3A5F] group-hover:text-white transition-all duration-300 shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div className="pt-1">
            <p className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Phone</p>
            <p className="text-slate-900 font-medium text-lg">+91 12345 67890</p>
          </div>
        </div>

        {/* Email Info */}
        <div className="flex items-start gap-5 group">
          <div className="w-14 h-14 bg-[#F39C12]/10 group-hover:bg-[#F39C12] flex items-center justify-center rounded-2xl text-[#F39C12] group-hover:text-white transition-all duration-300 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div className="pt-1">
            <p className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Email</p>
            <p className="text-slate-900 font-medium text-lg">info@khodiyarsolar.com</p>
          </div>
        </div>

        {/* Address Info */}
        <div className="flex items-start gap-5 group">
          <div className="w-14 h-14 bg-[#27AE60]/10 group-hover:bg-[#27AE60] flex items-center justify-center rounded-2xl text-[#27AE60] group-hover:text-white transition-all duration-300 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="pt-1">
            <p className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Location</p>
            <p className="text-slate-900 font-medium text-lg">Rajkot, Gujarat, India</p>
          </div>
        </div>

        {/* Visiting Hours */}
        <div className="flex items-start gap-5 group">
          <div className="w-14 h-14 bg-slate-100 group-hover:bg-slate-800 flex items-center justify-center rounded-2xl text-slate-600 group-hover:text-white transition-all duration-300 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="pt-1">
            <p className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Visiting Hours</p>
            <p className="text-slate-900 font-medium text-lg">Mon - Sat, 9:00 AM – 6:00 PM</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ContactInfo;
