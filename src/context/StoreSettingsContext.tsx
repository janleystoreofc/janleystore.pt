import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCttEnabled,
  updateCttEnabled,
  getCustomCategories,
  saveCustomCategories,
  slugifyCategoryId,
} from '../lib/supabase';
import { CATEGORIES } from '../data/products';
import { Category } from '../types';

interface StoreSettingsContextType {
  cttEnabled: boolean;
  loadingCttSetting: boolean;
  savingCttSetting: boolean;
  toggleCttEnabled: () => Promise<boolean>;
  customCategories: Category[];
  allCategories: Category[];
  savingCategory: boolean;
  addCategory: (input: { name: string; description?: string; image?: string }) => Promise<Category>;
  removeCategory: (categoryId: string) => Promise<void>;
  refreshStoreSettings: () => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cttEnabled, setCttEnabled] = useState<boolean>(() => {
    try {
      const cached = localStorage.getItem('janley_ctt_enabled');
      return cached === 'false' ? false : true;
    } catch {
      return true;
    }
  });
  const [customCategories, setCustomCategories] = useState<Category[]>(() => {
    try {
      const raw = localStorage.getItem('janley_custom_categories');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [loadingCttSetting, setLoadingCttSetting] = useState<boolean>(true);
  const [savingCttSetting, setSavingCttSetting] = useState<boolean>(false);
  const [savingCategory, setSavingCategory] = useState<boolean>(false);

  const refreshStoreSettings = useCallback(async () => {
    setLoadingCttSetting(true);
    try {
      const [enabled, loadedCats] = await Promise.all([
        getCttEnabled(),
        getCustomCategories(),
      ]);
      setCttEnabled(enabled);
      setCustomCategories(loadedCats);
    } finally {
      setLoadingCttSetting(false);
    }
  }, []);

  useEffect(() => {
    refreshStoreSettings();
  }, [refreshStoreSettings]);

  const toggleCttEnabled = useCallback(async (): Promise<boolean> => {
    const nextValue = !cttEnabled;
    setSavingCttSetting(true);
    try {
      const saved = await updateCttEnabled(nextValue);
      setCttEnabled(saved);
      return saved;
    } finally {
      setSavingCttSetting(false);
    }
  }, [cttEnabled]);

  const allCategories = useMemo(() => {
    const seen = new Set(CATEGORIES.map((c) => c.id));
    const extras = customCategories.filter((c) => !seen.has(c.id));
    return [...CATEGORIES, ...extras];
  }, [customCategories]);

  const addCategory = useCallback(
    async (input: { name: string; description?: string; image?: string }): Promise<Category> => {
      const cleanName = input.name.trim();
      if (!cleanName) {
        throw new Error('Insere o nome da categoria.');
      }

      const baseId = slugifyCategoryId(cleanName);
      const existingIds = new Set(allCategories.map((c) => c.id));
      let uniqueId = baseId;
      let suffix = 2;
      while (existingIds.has(uniqueId)) {
        uniqueId = `${baseId}-${suffix++}`;
      }

      const newCategory: Category = {
        id: uniqueId,
        name: cleanName,
        image: input.image || '/images/cat_outros.jpg',
        description: (input.description || '').trim() || `Peças exclusivas da categoria ${cleanName} em impressão 3D.`,
      };

      setSavingCategory(true);
      try {
        const updated = [...customCategories, newCategory];
        const saved = await saveCustomCategories(updated);
        setCustomCategories(saved);
        return newCategory;
      } finally {
        setSavingCategory(false);
      }
    },
    [allCategories, customCategories]
  );

  const removeCategory = useCallback(
    async (categoryId: string): Promise<void> => {
      setSavingCategory(true);
      try {
        const updated = customCategories.filter((c) => c.id !== categoryId);
        const saved = await saveCustomCategories(updated);
        setCustomCategories(saved);
      } finally {
        setSavingCategory(false);
      }
    },
    [customCategories]
  );

  return (
    <StoreSettingsContext.Provider
      value={{
        cttEnabled,
        loadingCttSetting,
        savingCttSetting,
        toggleCttEnabled,
        customCategories,
        allCategories,
        savingCategory,
        addCategory,
        removeCategory,
        refreshStoreSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
}
