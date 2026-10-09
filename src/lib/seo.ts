import { AppItem, developer } from "@/data/apps";
import { ArticleItem } from "@/data/articles";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: developer.name,
    url: developer.website,
    logo: `${developer.website}/images/logo.png`,
    sameAs: [developer.playStoreUrl],
    description: developer.tagline,
    email: developer.email,
  };
}

export function generateSoftwareAppSchema(app: AppItem) {
  const isGame = app.category === "game";
  return {
    "@context": "https://schema.org",
    "@type": isGame ? "VideoGame" : "SoftwareApplication",
    name: app.name,
    operatingSystem: "Android",
    applicationCategory: isGame ? "GameApplication" : "EducationalApplication",
    description: app.description,
    image: `${developer.website}${app.icon}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: developer.name,
      url: developer.website,
    },
    ...(app.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: app.rating.toString(),
            ratingCount: "100",
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    installUrl: app.playUrl,
  };
}

export function generateArticleSchema(
  article: ArticleItem,
  app?: AppItem,
  lang: "id" | "en" = "id"
) {
  const isEn = lang === "en";
  const headline = isEn ? article.titleEn : article.title;
  const description = isEn ? article.metaDescriptionEn : article.metaDescription;
  const keywords = isEn ? article.keywordsEn.join(", ") : article.keywords.join(", ");
  const pageUrl = isEn
    ? `${developer.website}/en/blog/${article.slug}/`
    : `${developer.website}/blog/${article.slug}/`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    image: `${developer.website}${article.coverImage}`,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      "@type": "Organization",
      name: developer.name,
      url: developer.website,
    },
    publisher: {
      "@type": "Organization",
      name: developer.name,
      url: developer.website,
      logo: {
        "@type": "ImageObject",
        url: `${developer.website}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    keywords,
    inLanguage: isEn ? "en" : "id",
    ...(app
      ? {
          about: {
            "@type": app.category === "game" ? "VideoGame" : "SoftwareApplication",
            name: app.name,
            operatingSystem: "Android",
            installUrl: app.playUrl,
          },
        }
      : {}),
  };
}

export function generateFaqSchema(faq: { q: string; a: string }[]) {
  if (!faq || faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: developer.name,
    url: developer.website,
    description: developer.tagline,
    publisher: {
      "@type": "Organization",
      name: developer.name,
      logo: {
        "@type": "ImageObject",
        url: `${developer.website}/images/logo.png`,
      },
    },
    inLanguage: ["id", "en"],
  };
}

export function generateAppsItemListSchema(items: AppItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "D Lucky X Android Games & Applications",
    description: "Koleksi resmi game dan aplikasi Android oleh D Lucky X",
    itemListElement: items.map((app, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: app.name,
      url: `${developer.website}/apps/${app.slug}/`,
      image: `${developer.website}${app.icon}`,
      description: app.tagline,
    })),
  };
}
