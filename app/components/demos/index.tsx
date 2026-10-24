import type { ComponentType } from 'react'
import type { Locale } from '@/lib/i18n'
import { SynthizSearchDemo } from './SynthizSearchDemo'

export const demos: Record<string, ComponentType<{ locale: Locale }>> = {
  Synthiz: SynthizSearchDemo,
}
