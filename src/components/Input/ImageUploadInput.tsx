import React, { useRef, useState } from "react";

interface ImageUploadInputProps {
    label?: string;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    value?: File[];
    onChange?: (files: File[]) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string | null;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // MB 단위
}

const ImageUploadInput = React.forwardRef<HTMLInputElement, ImageUploadInputProps>(
    (
        {
            label,
            error,
            helperText,
            placeholder = "이미지를 첨부해주세요",
            value = [],
            onChange,
            required,
            disabled,
            className,
            accept = "image/*",
            multiple = true,
            maxSize = 10, // 10MB
        },
        ref
    ) => {
        const [isDragOver, setIsDragOver] = useState(false);
        const [uploadedFiles, setUploadedFiles] = useState<File[]>(value);
        const inputRef = useRef<HTMLInputElement>(null);
        const imageUrlsRef = useRef<string[]>([]);

        // value prop 동기화는 useState 초기값으로만 처리

        // 컴포넌트 언마운트 시 URL 정리
        React.useEffect(() => {
            return () => {
                // 컴포넌트가 언마운트될 때 URL 정리
                Object.values(imageUrlsRef.current).forEach(url => {
                    if (url) URL.revokeObjectURL(url);
                });
            };
        }, []);

        // 이미지 URL 생성 함수 (캐시 사용)
        const createImageUrl = (file: File, index: number): string => {
            // 이미 URL이 있으면 재사용
            if (imageUrlsRef.current[index]) {
                return imageUrlsRef.current[index];
            }

            const url = URL.createObjectURL(file);
            imageUrlsRef.current[index] = url;
            return url;
        };

        const handleFileSelect = (files: FileList | null) => {
            if (!files) return;

            console.log('파일 선택됨:', files.length, '개');
            const fileArray = Array.from(files);
            const validFiles: File[] = [];

            fileArray.forEach(file => {
                console.log('파일 정보:', {
                    name: file.name,
                    type: file.type,
                    size: file.size
                });

                // 파일 크기 체크
                if (file.size > maxSize * 1024 * 1024) {
                    console.warn(`파일 ${file.name}이 ${maxSize}MB를 초과합니다.`);
                    return;
                }

                // 이미지 파일 타입 체크
                if (!file.type.startsWith('image/')) {
                    console.warn(`파일 ${file.name}은 이미지 파일이 아닙니다.`);
                    return;
                }

                validFiles.push(file);
            });

            console.log('유효한 파일:', validFiles.length, '개');
            const newFiles = multiple ? [...uploadedFiles, ...validFiles] : validFiles;
            console.log('새 파일 목록:', newFiles.length, '개');
            setUploadedFiles(newFiles);
            onChange?.(newFiles);
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFileSelect(e.target.files);
        };

        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFileSelect(e.dataTransfer.files);
        };

        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragOver(true);
        };

        const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragOver(false);
        };

        const handleClick = () => {
            if (!disabled) {
                inputRef.current?.click();
            }
        };

        const removeFile = (index: number) => {
            // 해당 파일의 URL 정리
            if (imageUrlsRef.current[index]) {
                URL.revokeObjectURL(imageUrlsRef.current[index]);
                delete imageUrlsRef.current[index];
            }

            const newFiles = uploadedFiles.filter((_, i) => i !== index);
            setUploadedFiles(newFiles);
            onChange?.(newFiles);
        };

        // ref 우선순위: 외부 ref → 내부 ref
        const mergedRef = (node: HTMLInputElement) => {
            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
            inputRef.current = node;
        };

        return (
            <div className={`flex flex-col gap-2 cursor-pointer ${className ? ` ${className}` : ""}`}>
                {label && (
                    <label className="text-[14px] font-400 text-gray-600">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div
                    className={`relative rounded-[12px] border transition-colors cursor-pointer ${error
                        ? "border-[2px] border-[#FCA5A5] py-[11px]"
                        : isDragOver
                            ? "border-[2px] border-brand-300 py-[11px]"
                            : "border border-gray-200 py-3 hover:border-[2px] hover:border-brand-100 hover:py-[11px]"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={handleClick}
                >
                    <div className="px-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            <p className="text-sm text-gray-500">
                                {placeholder}
                            </p>
                            <p className="text-xs text-gray-400">
                                JPG, PNG, GIF (최대 {maxSize}MB)
                            </p>
                        </div>
                    </div>

                    <input
                        ref={mergedRef}
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={handleInputChange}
                        className="hidden"
                        disabled={disabled}
                        required={required}
                    />
                </div>

                {/* 업로드된 파일 미리보기 */}
                {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                            업로드된 파일: {uploadedFiles.length}개
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {uploadedFiles.map((file, index) => {
                                console.log('미리보기 렌더링:', file.name, index);
                                return (
                                    <div key={index} className="relative group">
                                        {/* 이미지 미리보기 */}
                                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={createImageUrl(file, index)}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* 삭제 버튼 */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(index);
                                                }}
                                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            {/* 파일 정보 오버레이 */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <p className="text-xs truncate">{file.name}</p>
                                                <p className="text-xs text-gray-300">
                                                    {(file.size / 1024 / 1024).toFixed(1)}MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 파일 목록 (컴팩트 버전) */}
                        <div className="space-y-1">
                            {uploadedFiles.map((file, index) => (
                                <div key={`list-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                        <span className="text-xs text-gray-500">
                                            ({(file.size / 1024 / 1024).toFixed(1)}MB)
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && helperText && (
                    <div className="text-[15px] font-400 text-red-500">{helperText}</div>
                )}
            </div>
        );
    }
);

ImageUploadInput.displayName = "ImageUploadInput";

export default ImageUploadInput;
