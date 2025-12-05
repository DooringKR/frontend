import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baro.dooring.kr';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/auth/',
                    '/dev/',
                    '/order/',
                    '/order-history/*/',
                    '/customer-service/license/*/',
                    '/address-check/step/',
                    '/address-check/unavailable/',
                    '/order/delivery/address/',
                    '/order/delivery/phone/',
                    '/order/delivery/receive-request/',
                    '/order/delivery/confirm/',
                    '/order/pickup/phone/',
                    '/order/pickup/vehicle/',
                    '/order/pickup/confirm/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

