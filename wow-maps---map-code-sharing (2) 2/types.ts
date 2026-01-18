
export interface Category {
  id: string;
  title: string;
  icon: string;
  image: string;
}

export interface MapEntry {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnail: string;
  code: string;
}

export type ViewType = 'splash' | 'home' | 'list' | 'detail' | 'search' | 'favorite' | 'admin';

export interface AppState {
  currentView: ViewType;
  selectedCategoryId: string | null;
  selectedMapId: string | null;
  unlockedCodes: Set<string>;
  favoriteMapIds: Set<string>;
}
