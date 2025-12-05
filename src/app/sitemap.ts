import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baro.dooring.kr';

    // 정적 페이지들
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/start`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/cart`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/mypage`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/order-history`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/shopping-cart`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/address-check`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/customer-service`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/customer-service/license`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
    ];

    // 제품 카테고리 페이지들
    const productCategories: MetadataRoute.Sitemap = [
        // 문짝 (Door)
        {
            url: `${baseUrl}/door`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/door/color`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/door/type/flap`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/door/type/drawer`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/door/type/standard`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // 캐비닛 (Cabinet)
        {
            url: `${baseUrl}/cabinet`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/cabinet/color`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/cabinet/type/flap`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/cabinet/type/drawer`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/cabinet/type/open`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/cabinet/type/lower`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/cabinet/type/upper`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/cabinet/type/tall`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // 마감재 (Finish)
        {
            url: `${baseUrl}/finish`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/finish/color`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/finish/type/ep`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/finish/type/galle`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/finish/type/molding`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // 하드웨어 (Hardware)
        {
            url: `${baseUrl}/hardware`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/hardware/type/hinge`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/hardware/type/rail`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/hardware/type/piece`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // 액세서리 (Accessory)
        {
            url: `${baseUrl}/accessory`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/accessory/type/cooktop`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/accessory/type/hood`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/accessory/type/sinkbowl`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    return [...staticPages, ...productCategories];
}

