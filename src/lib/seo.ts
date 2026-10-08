import { AppItem, developer } from "@/data/apps";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: developer.name,
    url: developer.website,
    logo: `${developer.website}/images/apps/stickman-penalty-rush/icon.webp`,
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
