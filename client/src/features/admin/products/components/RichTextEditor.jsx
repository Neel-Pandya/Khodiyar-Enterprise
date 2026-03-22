import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ label, value, onChange, placeholder, helperText }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-[#1E3A5F]/5 focus-within:border-[#1E3A5F]/50 transition-all duration-200">
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          init={{
            height: 250,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; color: #334155; }',
            placeholder: placeholder,
            branding: false,
            statusbar: false,
          }}
          value={value}
          onEditorChange={(content) => onChange(content)}
        />
        
        {helperText && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-50 text-[10px] text-slate-400">
            {helperText}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
