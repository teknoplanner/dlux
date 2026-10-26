import { AppItem, apps, developer } from "@/data/apps";
import { ArticleItem } from "@/data/articles";
import { AmazonProduct } from "@/data/amazonProducts";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${developer.website}/#organization`,
        name: developer.name,
        alternateName: ["D Lucky X Studio", "D Lucky X Android Games & Apps"],
        url: developer.website,
        logo: {
          "@type": "ImageObject",
          "@id": `${developer.website}/#logo`,
          url: `${developer.website}/images/logo.png`,
          contentUrl: `${developer.website}/images/logo.png`,
          caption: "D Lucky X Studio Logo",
          width: "512",
          height: "512",
        },
        image: {
          "@id": `${developer.website}/#logo`,
        },
        sameAs: [
          developer.playStoreUrl,
          "https://github.com/teknoplanner",
        ],
        email: developer.email,
        description: developer.description,
        knowsAbout: [
          "Android Game Development",
          "Casual and Sports Mobile Games",
          "Offline PDF Utility and Security",
          "Kids Math Educational Games",
          "Android Software Engineering",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: developer.email,
          contactType: "technical support",
          url: `${developer.website}/contact/`,
        },
        owns: apps.map((app) => ({
          "@type": app.category === "game" ? "VideoGame" : "SoftwareApplication",
          name: app.name,
          operatingSystem: "Android",
          applicationCategory:
            app.category === "game"
              ? "GameApplication"
              : app.category === "education"
              ? "EducationalApplication"
              : "BusinessApplication",
          url: `${developer.website}/apps/${app.slug}/`,
          installUrl: app.playUrl,
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${developer.website}/#website`,
        url: developer.website,
        name: "D Lucky X",
        alternateName: "D Lucky X Games & Apps",
        description: developer.tagline,
        publisher: {
          "@id": `${developer.website}/#organization`,
        },
        inLanguage: ["id-ID", "en-US"],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${developer.website}/blog/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function generateSoftwareAppSchema(app: AppItem) {
  const isGame = app.category === "game";
  return {
    "@context": "https://schema.org",
    "@type": isGame ? "VideoGame" : "SoftwareApplication",
    "@id": `${developer.website}/apps/${app.slug}/#app`,
    name: app.name,
    operatingSystem: "Android",
    applicationCategory:
      app.category === "game"
        ? "GameApplication"
        : app.category === "education"
        ? "EducationalApplication"
        : "BusinessApplication",
    description: app.description,
    image: `${developer.website}${app.icon}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      "@id": `${developer.website}/#organization`,
      name: developer.name,
      url: developer.website,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${developer.website}/#organization`,
      name: developer.name,
      url: developer.website,
    },
    downloadUrl: app.playUrl,
    installUrl: app.playUrl,
    sameAs: [app.playUrl],
    // Only real Play Store counts: a made-up ratingCount is misleading markup to Google.
    ...(app.rating && app.reviewsCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: app.rating.toString(),
            ratingCount: app.reviewsCount.toString(),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
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
    ? `${developer.website}/en/blog/${article.slugEn}/`
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
      "@type": "Person",
      name: article.author || developer.name,
      url: `${developer.website}/contact/`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${developer.website}/#organization`,
      name: developer.name,
      url: developer.website,
      logo: {
        "@type": "ImageObject",
        "@id": `${developer.website}/#logo`,
        url: `${developer.website}/images/logo.png`,
      },
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${developer.website}/#website`,
      name: "D Lucky X",
      url: developer.website,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    keywords,
    inLanguage: isEn ? "en-US" : "id-ID",
    isAccessibleForFree: true,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".ai-summary", "h1", "article header p"],
    },
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

export function generateHardwareItemListSchema(
  products: AmazonProduct[],
  lang: "id" | "en" = "id"
) {
  const isEn = lang === "en";
  const pageUrl = `${developer.website}/${isEn ? "en/gear" : "gear"}/`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn
      ? "Field-Tested Smartphone & Tablet Hardware Gear"
      : "Koleksi Gear & Aksesoris Fisik Smartphone Teruji",
    description: isEn
      ? "Curated hardware accessories tested for mobile gaming, child safety, and precision PDF e-signatures."
      : "Aksesoris fisik pilihan yang diuji untuk kenyamanan gaming mobile, proteksi tablet anak, dan tanda tangan digital PDF.",
    url: pageUrl,
    numberOfItems: products.length,
    itemListElement: products.map((prod, index) => {
      const name = isEn ? prod.nameEn : prod.name;
      const tagline = isEn ? prod.taglineEn : prod.tagline;
      return {
        "@type": "ListItem",
        position: index + 1,
        name,
        description: tagline,
        image: `${developer.website}${prod.image}`,
        url: `${pageUrl}#gear-${prod.id}`,
      };
    }),
  };
}


// Search results cut titles near 60 and descriptions near 155 characters; queued copy often runs longer.
const clip = (t: string, max: number) => {
  t = t.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,:;&|-]+$/, "") + "…";
};
export function seoTitle(raw: string) {
  const base = raw.replace(/\s*\|.*$/, "").trim();
  return clip(base, 60);
}
export function seoDescription(raw: string) {
  return clip(raw, 155);
}
