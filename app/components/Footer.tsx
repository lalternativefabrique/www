import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/Logo'
import { chrome, useLocale } from '@/lib/i18n'

export function Footer() {
  const year = new Date().getFullYear()
  const locale = useLocale()
  const t = chrome[locale]
  return (
    <footer className="mt-32 border-t-2 border-text">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <Logo size={96} className="h-24 w-24" />
            <p className="mt-6 max-w-sm text-base text-text/70">
              {t.footerTagline}
            </p>
          </div>

          <div className="sm:col-span-3">
            <p className="label text-text/50">{t.navHeading}</p>
            <ul className="mt-4 space-y-2 text-base">
              {t.nav.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-accent-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-3">
            <p className="label text-text/50">{t.contactHeading}</p>
            <ul className="mt-4 space-y-2 text-base">
              <li>
                <a
                  href="mailto:contact@lalternativefabrique.org"
                  className="hover:text-accent-primary"
                >
                  contact@lalternativefabrique.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-text/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-text/60">№ 01 — {year}</p>
          <p className="label text-text/60">{t.motto}</p>
        </div>
      </div>
    </footer>
  )
}
