import { MetadataRoute } from "next";
import { apps } from "@/data/apps";
import { articles } from "@/data/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dluckyx.cloud";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: {
          id: `${baseUrl}/blog/`,
          en: `${baseUrl}/en/blog/`,
        },
      },
    },
    {
      url: `${baseUrl}/en/blog/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/blog/`,
          id: `${baseUrl}/blog/`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const appRoutes: MetadataRoute.Sitemap = apps.map((app) => ({
    url: `${baseUrl}/apps/${app.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Indonesian Blog Articles (35 Articles)
  const blogRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}/`,
    lastModified: new Date(article.publishedDate),
    changeFrequency: "weekly",
    priority: 0.8,
    alternates: {
      languages: {
        id: `${baseUrl}/blog/${article.slug}/`,
        en: `${baseUrl}/en/blog/${article.slug}/`,
      },
    },
  }));

  // English Blog Articles (35 Articles for International SEO)
  const englishBlogRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/en/blog/${article.slug}/`,
    lastModified: new Date(article.publishedDate),
    changeFrequency: "weekly",
    priority: 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}/en/blog/${article.slug}/`,
        id: `${baseUrl}/blog/${article.slug}/`,
      },
    },
  }));

  const privacyRoutes: MetadataRoute.Sitemap = apps.map((app) => ({
    url: `${baseUrl}/privacy/${app.slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const termsRoutes: MetadataRoute.Sitemap = apps.map((app) => ({
    url: `${baseUrl}/terms/${app.slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...appRoutes,
    ...blogRoutes,
    ...englishBlogRoutes,
    ...privacyRoutes,
    ...termsRoutes,
  ];
}
