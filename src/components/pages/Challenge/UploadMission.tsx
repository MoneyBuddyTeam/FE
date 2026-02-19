interface UploadMissionProps {
  type: 'image' | 'video';
  files: File[];
  max: number;
  onChange: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export default function UploadMission({
  type,
  files,
  max,
  onChange,
  onRemove,
}: UploadMissionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).slice(0, max - files.length);
    onChange([...files, ...selected]);
  };

  return (
    <div className="mb-6">
      <div className="mb-3 flex gap-2">
        <div className="w-[64px] h-[48px] border border-gray-200 rounded-md flex flex-col items-center justify-center text-xs">
          <span className="text-black font-medium">
            {type === 'image' ? '사진' : '영상'}
          </span>
          <span className="text-[#3B4EFF] font-semibold">
            {files.length}/{max}
          </span>
        </div>
      </div>

      <input
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        multiple
        onChange={handleFileChange}
        className="mb-2"
      />

      <div className="flex flex-wrap gap-2">
        {files.map((file, idx) => (
          <div key={idx} className="relative w-20 h-20">
            {type === 'image' ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                className="w-full h-full object-cover rounded"
              />
            )}
            <button
              type="button"
              className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full px-1"
              onClick={() => onRemove(idx)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
