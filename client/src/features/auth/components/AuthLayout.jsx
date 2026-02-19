import logo from '../../../assets/Khodiyar_Enterprise.svg';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 font-sans selection:bg-blue-50 selection:text-blue-900">
      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E5E7EB] p-8 flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="mb-6">
          <img 
            src={logo} 
            alt="Khodiyar Enterprise Logo" 
            className="h-20 w-auto"
          />
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
          {subtitle && <p className="text-secondary text-sm">{subtitle}</p>}
        </div>

        {/* Dynamic Content */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
