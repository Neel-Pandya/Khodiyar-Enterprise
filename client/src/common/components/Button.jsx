
const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false,
  variant = 'primary'
}) => {
  const baseStyles = "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#1e3a5f] hover:bg-[#162d4a] text-white focus:ring-[#1e3a5f]/50 hover:cursor-pointer",
    outline: "bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-700 focus:ring-slate-200 hover:cursor-pointer"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
