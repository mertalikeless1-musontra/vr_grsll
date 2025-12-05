import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, Image as ImageIcon, Music } from 'lucide-react';

const FileUpload = ({ onFileUpload, onImageUpload, onAudioUpload }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files) {
            Array.from(files).forEach(file => {
                if (file.name.match(/\.(csv|xlsx|xls)$/i)) {
                    onFileUpload(file);
                } else if (file.type.startsWith('image/')) {
                    onImageUpload(file);
                } else if (file.type.startsWith('audio/')) {
                    onAudioUpload(file);
                }
            });
        }
    }, [onFileUpload, onImageUpload, onAudioUpload]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'data') onFileUpload(e.target.files[0]);
        }
    };

    return (
        <div
            className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => handleFileChange(e, 'data')}
                className="hidden"
                id="file-upload"
            />
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full z-10">
                <div className="upload-icon-wrapper">
                    {isDragging ? <FileSpreadsheet size={32} /> : <Upload size={32} />}
                </div>
                <h3 className="upload-title">
                    {isDragging ? 'Yüklemek için Bırakın' : 'Veri Seti Yükle'}
                </h3>
                <p className="upload-subtitle">
                    Sürükleyip bırakın veya seçmek için tıklayın
                </p>
                <p className="upload-hint">
                    .CSV ve .XLSX desteklenir (Görsel ve Ses dosyaları sürüklenebilir)
                </p>
            </label>
        </div>
    );
};

export default FileUpload;
