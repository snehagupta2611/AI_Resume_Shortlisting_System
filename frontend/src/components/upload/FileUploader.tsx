import { Upload, FileCheck } from 'lucide-react';

/**
 * COMPONENT PROPS
 * @param label - Title for the upload section (e.g., "Job Description").
 * @param icon - The Lucide icon to display next to the title.
 * @param accept - Restricts file types (e.g., ".pdf").
 * @param multiple - Whether to allow selecting more than one file.
 * @param onChange - Callback function to send the file data back to the parent.
 * @param fileName - String to display once a file is chosen (acts as a 'success' state).
 * @param colorClass - Tailwind text color class (e.g., 'text-cyan-400') for consistent branding.
 */
interface FileUploaderProps {
  label: string;
  icon: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  fileName?: string;
  colorClass: string;
}

export const FileUploader = ({ 
  label, 
  icon, 
  accept, 
  multiple, 
  onChange, 
  fileName, 
  colorClass 
}: FileUploaderProps) => {
  return (
    <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
      {/* HEADER: Section Title and Icon */}
      <div className="flex items-center gap-3 mb-6">
        <span className={colorClass}>{icon}</span>
        <h2 className="text-lg font-semibold text-white">{label}</h2>
      </div>

      {/* DROPZONE: The interactive area for file selection */}
      <label className={`
        group relative flex flex-col items-center justify-center w-full h-32 
        border-2 border-dashed border-white/20 rounded-xl cursor-pointer 
        hover:bg-white/5 transition-all hover:border-current 
        ${colorClass.replace('text-', 'hover:text-')}
      `}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {/**
           * CONDITIONAL ICON:
           * If a fileName exists, show the 'FileCheck' (Success).
           * Otherwise, show the default 'Upload' icon.
           */}
          {fileName ? (
            <FileCheck className="w-8 h-8 mb-2 text-emerald-400 animate-in zoom-in" />
          ) : (
            <Upload className="w-8 h-8 mb-2 text-slate-400 group-hover:inherit transition-colors" />
          )}

          {/* DYNAMIC TEXT: Shows the file name or instructions */}
          <p className="text-sm text-slate-400 px-4 text-center truncate max-w-full">
            {fileName || `Upload ${multiple ? 'Files' : 'PDF'}`}
          </p>
        </div>

        {/**
         * HIDDEN INPUT: 
         * The actual <input type="file"> is invisible. 
         * Clicking the <label> triggers this input automatically.
         */}
        <input 
          type="file" 
          className="hidden" 
          accept={accept} 
          multiple={multiple} 
          onChange={(e) => onChange(e.target.files)} 
        />
      </label>
    </section>
  );
};