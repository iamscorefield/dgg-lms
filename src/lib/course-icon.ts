// src/lib/course-icon.ts

// Map categories (or partial matches) to icon paths in /public/course-icons/*
// Make sure you actually have these files in your public folder:
// public/course-icons/digital-literacy.svg
// public/course-icons/ui-ux.svg
// public/course-icons/data.svg
// public/course-icons/cyber.svg
// public/course-icons/marketing.svg
// public/course-icons/branding.svg
// public/course-icons/graphics.svg
// public/course-icons/3d.svg
// public/course-icons/coding.svg
// public/course-icons/web.svg
// public/course-icons/mobile.svg
// public/course-icons/social.svg
// public/course-icons/ai.svg
// public/course-icons/project.svg
// public/course-icons/money.svg
// public/course-icons/cloud.svg
// public/course-icons/business.svg
// public/course-icons/default.svg

export function getCourseIcon(category: string | null | undefined): string {
  if (!category) return "/course-icons/default.svg";

  const c = category.toLowerCase();

  if (c.includes("digital literacy")) return "/course-icons/digital-literacy.svg";

  if (c.includes("ui/ux") || c.includes("ui ux") || c.includes("ux design"))
    return "/course-icons/ui-ux.svg";

  if (c.includes("data analytics")) return "/course-icons/data.svg";
  if (c.includes("data science")) return "/course-icons/data.svg";

  if (c.includes("cyber")) return "/course-icons/cyber.svg";

  if (c.includes("digital marketing") || c.includes("marketing"))
    return "/course-icons/marketing.svg";

  if (c.includes("branding")) return "/course-icons/branding.svg";

  if (c.includes("graphics")) return "/course-icons/graphics.svg";

  if (c.includes("3d") || c.includes("animation"))
    return "/course-icons/3d.svg";

  if (c.includes("coding") || c.includes("programming"))
    return "/course-icons/coding.svg";

  if (c.includes("web design") || c.includes("web development"))
    return "/course-icons/web.svg";

  if (c.includes("mobile app")) return "/course-icons/mobile.svg";

  if (c.includes("social media")) return "/course-icons/social.svg";

  if (c.includes("ai") || c.includes("crm")) return "/course-icons/ai.svg";

  if (c.includes("project management")) return "/course-icons/project.svg";

  if (
    c.includes("monetization") ||
    c.includes("e-commerce") ||
    c.includes("ecommerce") ||
    c.includes("online store") ||
    c.includes("funding") ||
    c.includes("income")
  )
    return "/course-icons/money.svg";

  if (c.includes("cloud")) return "/course-icons/cloud.svg";

  if (
    c.includes("business") ||
    c.includes("startup") ||
    c.includes("legal") ||
    c.includes("tax")
  )
    return "/course-icons/business.svg";

  return "/course-icons/default.svg";
}
