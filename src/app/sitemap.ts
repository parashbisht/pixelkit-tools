
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pixelkitz.vercel.app";
  const routes = [
    "",
    "/compress",
    "/resize",
    "/convert",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
  ];

  return routes.map((route) => {
    let priority = 0.6;
    if (route === "") {
      priority = 1.0;
    } else if (
      route === "/compress" ||
      route === "/resize" ||
      route === "/convert"
    ) {
      priority = 0.9;
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
    };
  });
}
