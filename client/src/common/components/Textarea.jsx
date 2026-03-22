
const Textarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  id, 
  required = false,
  rows = 4,
  icon: Icon
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className={`w-full py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1E3A5F]/5 focus:border-[#1E3A5F]/50 transition-all duration-200 resize-y ${Icon ? 'pl-11 pr-4' : 'px-4'}`}
        />
        {Icon && (
          <div className="absolute left-4 top-4 text-slate-400">
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Textarea;
