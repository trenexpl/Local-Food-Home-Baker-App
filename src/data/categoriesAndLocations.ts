import { MainCategory, SGRegion, FoodStatus } from '../types';

export interface CategoryStructure {
  name: MainCategory;
  icon: string;
  subcategories: string[];
}

export const MAIN_CATEGORIES: CategoryStructure[] = [
  {
    name: 'Bakes & Desserts',
    icon: '🍰',
    subcategories: [
      'Chiffon cakes',
      'Birthday cakes',
      'Cookies',
      'Brownies',
      'Tarts',
      'Cheesecakes',
      'Pastries',
      'Sourdough',
      'Traditional kueh',
      'Desserts',
      'Seasonal bakes',
    ],
  },
  {
    name: 'Home-Cooked Food',
    icon: '🍱',
    subcategories: [
      'Local Singapore food',
      'Malay cuisine',
      'Chinese cuisine',
      'Indian cuisine',
      'Peranakan food',
      'Nyonya food',
      'Japanese-inspired',
      'Korean-inspired',
      'Western',
      'Fusion',
      'Meal prep',
      'Family meals',
    ],
  },
  {
    name: 'Snacks & Finger Food',
    icon: '🥟',
    subcategories: [
      'Curry puffs',
      'Spring rolls',
      'Dumplings',
      'Pau',
      'Keropok',
      'Fried snacks',
      'Party food',
      'Bento boxes',
    ],
  },
  {
    name: 'Gift & Seasonal',
    icon: '🎁',
    subcategories: [
      'Festive hampers',
      'Hari Raya',
      'Chinese New Year',
      'Deepavali',
      'Christmas',
      "Mother's Day",
      "Father's Day",
      'National Day',
      'Corporate gifting',
    ],
  },
];

export interface RegionData {
  region: SGRegion;
  neighborhoods: string[];
}

export const SG_REGIONS_DATA: RegionData[] = [
  {
    region: 'Central',
    neighborhoods: [
      'Tanjong Pagar',
      'Chinatown',
      'Outram',
      'Queenstown',
      'Bukit Merah',
      'Redhill',
      'River Valley',
      'Orchard',
      'Novena',
      'Toa Payoh',
      'Bishan',
      'Ang Mo Kio',
    ],
  },
  {
    region: 'East',
    neighborhoods: [
      'Tampines',
      'Pasir Ris',
      'Simei',
      'Bedok',
      'Bedok North',
      'Bedok South',
      'Changi',
      'East Coast',
      'Marine Parade',
      'Paya Lebar',
      'Geylang',
      'Katong',
    ],
  },
  {
    region: 'West',
    neighborhoods: [
      'Jurong East',
      'Jurong West',
      'Clementi',
      'Bukit Batok',
      'Bukit Panjang',
      'Choa Chu Kang',
      'Boon Lay',
      'Pioneer',
      'Lakeside',
      'West Coast',
    ],
  },
  {
    region: 'North',
    neighborhoods: [
      'Woodlands',
      'Yishun',
      'Sembawang',
      'Canberra',
      'Admiralty',
      'Khatib',
      'Marsiling',
    ],
  },
  {
    region: 'North-East',
    neighborhoods: [
      'Punggol',
      'Sengkang',
      'Hougang',
      'Serangoon',
      'Buangkok',
      'Fernvale',
      'Rivervale',
      'Compassvale',
    ],
  },
];

export const ALL_NEIGHBORHOODS: string[] = SG_REGIONS_DATA.flatMap((r) => r.neighborhoods);

export interface FoodStatusConfig {
  status: FoodStatus;
  label: string;
  shortLabel: string;
  badgeDot: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
  icon: string;
  isHalalFriendly: boolean;
}

export const FOOD_STATUS_CONFIG: Record<FoodStatus, FoodStatusConfig> = {
  halal_certified: {
    status: 'halal_certified',
    label: 'Halal Certified',
    shortLabel: 'Halal Cert',
    badgeDot: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300',
    description: 'Verified with official MUIS (Majlis Ugama Islam Singapura) certificate number.',
    icon: '🟢',
    isHalalFriendly: true,
  },
  muslim_owned: {
    status: 'muslim_owned',
    label: 'Muslim-Owned / Halal-Friendly',
    shortLabel: 'Muslim-Owned',
    badgeDot: 'bg-teal-500',
    badgeBg: 'bg-teal-50 text-teal-900 border-teal-300',
    badgeText: 'text-teal-800',
    badgeBorder: 'border-teal-300',
    description: '100% Muslim-owned or uses exclusively halal-certified sources; seller-declared.',
    icon: '🟢',
    isHalalFriendly: true,
  },
  no_pork_no_lard: {
    status: 'no_pork_no_lard',
    label: 'No Pork / No Lard',
    shortLabel: 'No Pork/Lard',
    badgeDot: 'bg-slate-400',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    description: 'Kitchen strictly does not use pork, lard, or alcohol in these preparations.',
    icon: '⚪',
    isHalalFriendly: false,
  },
  non_halal: {
    status: 'non_halal',
    label: 'Non-Halal',
    shortLabel: 'Non-Halal',
    badgeDot: 'bg-rose-500',
    badgeBg: 'bg-rose-50 text-rose-900 border-rose-300',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-300',
    description: 'Contains pork, lard, alcohol, or non-halal meat ingredients.',
    icon: '🔴',
    isHalalFriendly: false,
  },
  not_specified: {
    status: 'not_specified',
    label: 'Not Specified',
    shortLabel: 'Not Specified',
    badgeDot: 'bg-zinc-300',
    badgeBg: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    badgeText: 'text-zinc-600',
    badgeBorder: 'border-zinc-200',
    description: 'Dietary / Halal status not explicitly stated by seller.',
    icon: '⚪',
    isHalalFriendly: false,
  },
};
