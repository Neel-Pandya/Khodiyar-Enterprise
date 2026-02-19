import { motion } from 'framer-motion';
import logo from '../../../assets/Khodiyar_Enterprise.svg';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 font-sans selection:bg-primary/10 selection:text-primary relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -ml-64 -mb-64 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-8 md:p-10 flex flex-col items-center relative z-10"
      >
        
        {/* Logo Section */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <img 
            src={logo} 
            alt="Khodiyar Enterprise Logo" 
            className="h-20 w-auto"
          />
        </motion.div>

        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-black text-slate-900 mb-2 tracking-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-slate-500 font-medium"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Dynamic Content */}
        <div className="w-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
