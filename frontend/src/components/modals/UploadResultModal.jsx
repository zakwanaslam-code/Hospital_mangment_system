import { useState } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

function UploadResultModal({ onUpload, onCancel, loading }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (selectedFile) => {
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) onUpload(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-dark-border'
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="text-primary" size={32} />
            <p className="text-dark-text text-sm font-medium">{file.name}</p>
            <p className="text-dark-muted text-xs">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-danger text-xs hover:underline mt-1"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="text-dark-muted mx-auto mb-3" size={32} />
            <p className="text-dark-text text-sm mb-1">Drag & drop file yahan, ya</p>
            <label className="text-primary text-sm font-medium cursor-pointer hover:underline">
              browse karein
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>
            <p className="text-dark-muted text-xs mt-2">PDF, JPG, PNG (max 5MB)</p>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-dark-muted hover:bg-dark-bg transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!file || loading}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-700 text-white text-sm font-semibold shadow-glow transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin" size={15} />}
          Upload Report
        </button>
      </div>
    </form>
  );
}

export default UploadResultModal;