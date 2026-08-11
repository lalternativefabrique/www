import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/Logo'
import { chrome, useLocale } from '@/lib/i18n'

export function Header() {
  const locale = useLocale()
  const t = chrome[locale]

  return (
    <header className="border-b-2 border-text">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5 sm:py-6">
        <Link
          to={locale === 'en' ? '/en' : '/'}
          className="shrink-0 transition-opacity hover:opacity-70"
          aria-label={t.home}
        >
          {/* Smaller on mobile so the nav keeps its room on a narrow bar. */}
          <Logo size={56} className="h-14 w-14 sm:h-[68px] sm:w-[68px]" />
        </Link>
        <nav
          aria-label={t.mainNav}
          className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 sm:gap-x-7"
        >
          {t.nav.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="label text-text/80 transition-colors hover:text-accent-primary"
              activeProps={{ className: 'label text-accent-primary' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={t.switchPath}
            className="label border-2 border-text/30 px-2 py-1 text-text/70 transition-colors hover:border-accent-primary hover:text-accent-primary"
          >
            {t.switchTo}
          </Link>
        </nav>
      </div>
    </header>
  )
}
