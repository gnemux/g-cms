export const siteConfig = {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Site Name',
    title: process.env.NEXT_PUBLIC_SITE_TITLE || 'Your Site Logo',
    hero: {
        title: process.env.NEXT_PUBLIC_HERO_TITLE || 'Enter Your Hero Title Here',
        subtitle: process.env.NEXT_PUBLIC_HERO_SUBTITLE || 'Your Hero Subtitle Here - Simon Xu'
    }
} as const 