import {
  SiIfood,
  SiNetflix,
  SiSpotify,
  SiUber,
  SiNubank,
  SiAliexpress,
  SiApple,
} from 'react-icons/si'
import type { ComponentType } from 'react';

export interface TransactionIcon {
  icon: ComponentType<{ size: number; color: string }>
  color: string
}

export const transactionIcons: Record<string, TransactionIcon> = {
  ifood: {
    icon: SiIfood,
    color: '#EA1D2C',
  },
  netflix: {
    icon: SiNetflix,
    color: '#E50914',
  },
  spotify: {
    icon: SiSpotify,
    color: '#1ED760',
  },
  uber: {
    icon: SiUber,
    color: '#FFFFFF',
  },
  nubank: {
    icon: SiNubank,
    color: '#8A05BE',
  },
  // mercadolivre: {
  //   icon: SiMercadolibre,
  //   color: '#FFE600',
  // },
  aliexpress: {
    icon: SiAliexpress,
    color: '#FF4747',
  },
  apple: {
    icon: SiApple,
    color: '#FFFFFF',
  },
  // amazon: {
  //   icon: SiAmazon,
  //   color: '#FF9900',
  // },
  default: {
    icon: SiApple,
    color: '#B6FF3B',
  },
}

export function detectBrand(description: string = ''): string {
  const text = description.toLowerCase().trim()

  if (text.includes('ifood')) return 'ifood'
  if (text.includes('netflix')) return 'netflix'
  if (text.includes('spotify')) return 'spotify'
  if (text.includes('uber')) return 'uber'
  if (text.includes('nubank')) return 'nubank'
  if (text.includes('mercado livre') || text.includes('mercadolivre')) return 'mercadolivre'
  if (text.includes('aliexpress')) return 'aliexpress'
  if (text.includes('apple')) return 'apple'
  if (text.includes('amazon')) return 'amazon'

  return 'default'
}

export function brl(value: number): string {
  return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
