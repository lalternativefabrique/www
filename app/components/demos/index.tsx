import type { ComponentType } from 'react'
import type { Locale } from '@/lib/i18n'
import { CortextAdapterDemo } from './CortextAdapterDemo'
import { MessagInboxDemo } from './MessagInboxDemo'
import { OrbitDemo } from './OrbitDemo'
import { PartageDraftDemo } from './PartageDraftDemo'
import { SporeWorkflowDemo } from './SporeWorkflowDemo'
import { SynthizSearchDemo } from './SynthizSearchDemo'

export const demos: Record<string, ComponentType<{ locale: Locale }>> = {
  Synthiz: SynthizSearchDemo,
  Spore: SporeWorkflowDemo,
  Partage: PartageDraftDemo,
  Messag: MessagInboxDemo,
  Orbit: OrbitDemo,
  Cortext: CortextAdapterDemo,
}
