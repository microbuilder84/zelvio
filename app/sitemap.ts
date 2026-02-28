import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://zelvioapp.com";

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/termini`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/cookie`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/legal`,
            lastModified: new Date(),
        },
    ];
}