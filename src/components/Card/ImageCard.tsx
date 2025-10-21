"use client";

import { useState } from "react";

interface ImageCardProps {
    images: File[];
    title?: string;
}

function ImageCard({ images, title = "첨부된 이미지" }: ImageCardProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <>
            <div className="bg-white rounded-[12px] p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
                <div className="grid grid-cols-3 gap-3">
                    {images.map((file: File, index: number) => {
                        return (
                            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                    onClick={() => setSelectedImageIndex(index)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 이미지 확대 모달 */}
            {selectedImageIndex !== null && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh] p-4">
                        <img
                            src={URL.createObjectURL(images[selectedImageIndex])}
                            alt={images[selectedImageIndex].name}
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
        </>
    );
}

export default ImageCard;
