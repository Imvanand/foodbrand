import { Metadata } from "next";
import HomeClient from "@/components/HomeClient/HomeClient";
import { getHomePageData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kalsa Foods Spice Mix Masala, Authentic Indian Spice Blend, Kitchen King Masala for Sabzi Paneer and Curry, No Added Colors, 100g",
  description: "Kalsa Foods Spice Mix Masala is your kitchen's secret weapon for creating authentic Indian dishes with ease. This versatile all-purpose blend brings together carefully selected, hygienically processed spices for rich aroma and bold flavor.",
  openGraph: {
    title: "Kalsa Foods Spice Mix Masala, Authentic Indian Spice Blend, Kitchen King Masala for Sabzi Paneer and Curry, No Added Colors, 100g",
    description: "Kalsa Foods Spice Mix Masala is your kitchen's secret weapon for creating authentic Indian dishes with ease. This versatile all-purpose blend brings together carefully selected, hygienically processed spices for rich aroma and bold flavor.",
    url: "https://kalsafoods.com",
    siteName: "Kalsa Foods",
    images: [
      {
        url: "https://kalsafoods.com/share-preview.png",
        width: 1200,
        height: 630,
        alt: "Kalsa Foods Spice Mix Masala 100g",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalsa Foods Spice Mix Masala | Authentic Indian Spices",
    description: "Premium All-Purpose Spice Blend with No Added Colors. Perfect for Sabzi, Paneer & Curry.",
    images: ["https://kalsafoods.com/share-preview.png"],
  },
};

export const revalidate = 600; // Revalidate every 10 minutes

export default async function Home() {
  const data = await getHomePageData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Kalsa Foods Spice Mix Masala, Authentic Indian Spice Blend, Kitchen King Masala for Sabzi Paneer and Curry, No Added Colors, 100g",
    "image": "https://kalsafoods.com/Front.png",
    "description": "Premium All-Purpose Indian Spice Blend for Sabzi, Paneer & Curry. Rich Aroma & Authentic Taste with No Added Colors.",
    "brand": {
      "@type": "Brand",
      "name": "Kalsa Foods"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://kalsafoods.com",
      "priceCurrency": "INR",
      "price": "89.00",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Kalsa Foods",
    "image": "https://kalsafoods.com/logo/logo.png",
    "@id": "https://kalsafoods.com",
    "url": "https://kalsafoods.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "K R Puram",
      "addressLocality": "Bangalore",
      "postalCode": "560036",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 12.9866,
      "longitude": 77.7011
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <HomeClient data={data} />
    </>
  );
}
