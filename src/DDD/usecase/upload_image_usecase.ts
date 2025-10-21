import { createClient } from '@supabase/supabase-js';

export interface UploadImageUsecase {
    uploadImages(files: File[]): Promise<string[]>;
    uploadSingleImage(file: File): Promise<string>;
}

export class SupabaseUploadImageUsecase implements UploadImageUsecase {
    private supabase;

    constructor() {
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }

    /**
     * 여러 이미지를 업로드하고 URL 배열을 반환
     */
    async uploadImages(files: File[], category: string = 'doors'): Promise<string[]> {
        if (!files || files.length === 0) {
            return [];
        }

        const uploadPromises = files.map(file => this.uploadSingleImage(file, category));
        const urls = await Promise.all(uploadPromises);

        return urls.filter(url => url !== null) as string[];
    }

    /**
     * 단일 이미지를 업로드하고 URL을 반환
     */
    async uploadSingleImage(file: File, category: string = 'doors'): Promise<string> {
        try {
            // 폴더 구조 생성
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const folderPath = `${category}/${year}/${month}`;

            // 파일명 생성 (타임스탬프 + 랜덤 문자열)
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileExtension = file.name.split('.').pop();
            const fileName = `${folderPath}/${timestamp}_${randomString}.${fileExtension}`;

            // Supabase Storage에 업로드
            const { data, error } = await this.supabase.storage
                .from('customer-input-image') // 버킷 이름
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('이미지 업로드 실패:', error);
                throw new Error(`이미지 업로드 실패: ${error.message}`);
            }

            // 공개 URL 생성
            const { data: publicUrlData } = this.supabase.storage
                .from('customer-input-image')
                .getPublicUrl(fileName);

            if (!publicUrlData?.publicUrl) {
                throw new Error('공개 URL 생성 실패');
            }

            console.log('이미지 업로드 성공:', publicUrlData.publicUrl);
            return publicUrlData.publicUrl;

        } catch (error) {
            console.error('이미지 업로드 중 오류:', error);
            throw error;
        }
    }

    /**
     * 이미지 삭제
     */
    async deleteImage(imageUrl: string): Promise<void> {
        try {
            // URL에서 파일명 추출
            const fileName = imageUrl.split('/').pop();
            if (!fileName) {
                throw new Error('유효하지 않은 이미지 URL');
            }

            const { error } = await this.supabase.storage
                .from('customer-input-image')
                .remove([fileName]);

            if (error) {
                console.error('이미지 삭제 실패:', error);
                throw new Error(`이미지 삭제 실패: ${error.message}`);
            }

            console.log('이미지 삭제 성공:', fileName);
        } catch (error) {
            console.error('이미지 삭제 중 오류:', error);
            throw error;
        }
    }

    /**
     * 여러 이미지 삭제
     */
    async deleteImages(imageUrls: string[]): Promise<void> {
        if (!imageUrls || imageUrls.length === 0) {
            return;
        }

        const deletePromises = imageUrls.map(url => this.deleteImage(url));
        await Promise.all(deletePromises);
    }
}
