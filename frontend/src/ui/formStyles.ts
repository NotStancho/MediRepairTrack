export const inputBase = [
    'w-full h-10 px-3 text-sm',
    'rounded-lg border border-border',
    'bg-surface text-ink',
    'placeholder:text-ink-soft',
    'focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand',
].join(' ');

export const selectBase = [
    'w-full h-10 px-3 text-sm',
    'rounded-lg border border-border',
    'bg-surface text-ink',
    'focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand',
].join(' ');

export const primaryButton = [
    'inline-flex items-center justify-center h-10 px-4',
    'text-sm font-semibold rounded-lg',
    'bg-brand text-white',
    'shadow-sm shadow-black/10',
    'hover:bg-brand-strong',
    'disabled:bg-brand-muted disabled:text-white/70 disabled:cursor-not-allowed',
    'transition-[background-color,box-shadow,transform] duration-200 active:translate-y-[1px]',
].join(' ');

export const secondaryButton = [
    'inline-flex items-center justify-center h-10 px-4',
    'text-sm font-semibold rounded-lg',
    'border border-border text-ink',
    'hover:border-brand hover:text-brand',
    'hover:bg-brand-soft',
    'disabled:text-ink-muted disabled:border-border disabled:cursor-not-allowed',
    'transition-[background-color,border-color,color,transform] duration-200 active:translate-y-[1px]',
].join(' ');
