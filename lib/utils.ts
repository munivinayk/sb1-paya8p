import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const countryCodeMap: { [key: string]: string } = {
  'Argentina': 'AR',
  'Belgium': 'BE',
  'Brazil': 'BR',
  'Croatia': 'HR',
  'Egypt': 'EG',
  'England': 'GB',
  'France': 'FR',
  'Germany': 'DE',
  'Netherlands': 'NL',
  'Norway': 'NO',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Senegal': 'SN',
  'Serbia': 'RS',
  'Slovenia': 'SI',
  'South Korea': 'KR',
  'Spain': 'ES'
};

export function getCountryFlag(country: string): string {
  const countryCode = countryCodeMap[country] || 'UN'; // UN as fallback
  return `https://flagsapi.com/${countryCode}/shiny/64.png`;
}