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
    maxFiles?: number; // 최대 파일 개수
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
            maxSize = 5, // 5MB
            maxFiles = 5, // 최대 5개
        },
        ref
    ) => {
        const [isDragOver, setIsDragOver] = useState(false);
        const [uploadedFiles, setUploadedFiles] = useState<File[]>(value);
        const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
        const inputRef = useRef<HTMLInputElement>(null);
        const imageUrlsRef = useRef<string[]>([]);

        // value prop 변경 시 uploadedFiles 동기화
        React.useEffect(() => {
            setUploadedFiles(value);
            // 기존 URL들 정리
            Object.values(imageUrlsRef.current).forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
            // 새로운 URL 캐시 초기화
            imageUrlsRef.current = [];
        }, [value]);

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

            // 최대 파일 개수 체크
            if (newFiles.length > maxFiles) {
                console.warn(`최대 ${maxFiles}개까지만 업로드할 수 있습니다.`);
                const limitedFiles = newFiles.slice(0, maxFiles);
                setUploadedFiles(limitedFiles);
                onChange?.(limitedFiles);
            } else {
                console.log('새 파일 목록:', newFiles.length, '개');
                setUploadedFiles(newFiles);
                onChange?.(newFiles);
            }
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
            if (!disabled && uploadedFiles.length < maxFiles) {
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
                    className={`relative rounded-[12px] border transition-colors ${uploadedFiles.length >= maxFiles ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${error
                        ? "border-[2px] border-[#FCA5A5] py-[11px]"
                        : isDragOver
                            ? "border-[2px] border-brand-300 py-[11px]"
                            : "border border-gray-200 py-3 hover:border-[2px] hover:border-brand-100 hover:py-[11px]"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onDrop={uploadedFiles.length < maxFiles ? handleDrop : undefined}
                    onDragOver={uploadedFiles.length < maxFiles ? handleDragOver : undefined}
                    onDragLeave={uploadedFiles.length < maxFiles ? handleDragLeave : undefined}
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
                                JPG, PNG, GIF (최대 {maxSize}MB, {maxFiles}개)
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
                        <div className="grid grid-cols-3 gap-3">
                            {uploadedFiles.map((file, index) => {
                                console.log('미리보기 렌더링:', file.name, index);
                                return (
                                    <div key={index} className="relative group">
                                        {/* 이미지 미리보기 */}
                                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={createImageUrl(file, index)}
                                                alt={file.name}
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => setSelectedImageIndex(index)}
                                            />
                                            {/* 삭제 버튼 */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(index);
                                                }}
                                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 hover:bg-red-600 transition-colors duration-200"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {error && helperText && (
                    <div className="text-[15px] font-400 text-red-500">{helperText}</div>
                )}

                {/* 이미지 확대 모달 */}
                {selectedImageIndex !== null && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                        onClick={() => setSelectedImageIndex(null)}
                    >
                        <div className="relative max-w-[90vw] max-h-[90vh] p-4">
                            <img
                                src={createImageUrl(uploadedFiles[selectedImageIndex], selectedImageIndex)}
                                alt={uploadedFiles[selectedImageIndex].name}
                                className="max-w-full max-h-full object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* 닫기 버튼 */}
                            <button
                                type="button"
                                onClick={() => setSelectedImageIndex(null)}
                                className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

ImageUploadInput.displayName = "ImageUploadInput";

export default ImageUploadInput;
