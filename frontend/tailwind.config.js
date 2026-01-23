/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Semantic palette: app (page bg), surface/surface-muted (cards), border (strokes),
            // ink/ink-muted/ink-soft (text tiers), brand (primary), accent (support), danger (errors), *-ring (focus).
            colors: {
                // Surfaces
                app: 'var(--color-app)',
                surface: {
                    DEFAULT: 'var(--color-surface)',
                    muted: 'var(--color-surface-muted)',
                },

                // Text
                ink: {
                    DEFAULT: 'var(--color-ink)',
                    muted: 'var(--color-ink-muted)',
                    soft: 'var(--color-ink-soft)',
                },

                // Brand (primary)
                brand: {
                    DEFAULT: 'var(--color-brand)',
                    strong: 'var(--color-brand-strong)',
                    muted: 'var(--color-brand-muted)',
                    soft: 'var(--color-brand-soft)',
                    ring: 'var(--color-brand-ring)',
                },

                // Accent (support)
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    soft: 'var(--color-accent-soft)',
                },

                // Errors
                danger: {
                    DEFAULT: 'var(--color-danger)',
                    strong: 'var(--color-danger-strong)',
                    muted: 'var(--color-danger-muted)',
                    ring: 'var(--color-danger-ring)',
                },

                // Borders
                border: 'var(--color-border)',
            },
            fontFamily: {
                body: 'var(--font-body)',
                display: 'var(--font-display)',
            },
        },
    },
    plugins: [],
}
