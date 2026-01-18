
import { Category, MapEntry } from './types';

export const AD_CONFIG = {
  // Official Test Reward IDs for Android and iOS
  ANDROID_REWARDED_ID: 'ca-app-pub-3940256099942544/5224354917', 
  IOS_REWARDED_ID: 'ca-app-pub-3940256099942544/1712485313',
  WEB_SPONSOR_URL: 'https://www.google.com/adsense/start/', 
  IS_TEST_MODE: true, 
  AD_REWARD_DURATION: 5, 
};

export const CATEGORIES: Category[] = [
  {
    id: 'practice_cat',
    title: 'COPY-PASTE TRAINING',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'cat1',
    title: 'BATTLE ROYALE',
    icon: 'Sword',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'cat2',
    title: 'PARKOUR & DEATHRUN',
    icon: 'Activity',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600'
  }
];

export const PRACTICE_MAPS: MapEntry[] = [
  {
    id: 'test_map_001',
    categoryId: 'practice_cat',
    title: 'COPY-PASTE PRACTICE MAP',
    description: 'TACTICAL BRIEFING: This sequence is designed to verify coordinate extraction protocols. Users must interact with the sponsorship uplink to reveal the authorized map code. Proceed with precision.',
    thumbnail: 'https://images.unsplash.com/photo-1614027164847-1b2809eb189d?auto=format&fit=crop&q=80&w=600',
    code: '9999-0000-1111'
  }
];
