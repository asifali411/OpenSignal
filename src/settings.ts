import { load } from '@tauri-apps/plugin-store';
import { isApp } from './env';

/* =========================
   Settings Schema
========================= */

export interface AppSettings {
  snapToGrid: boolean;
  // Add future settings here !IMPORTANT
}

const DEFAULT_SETTINGS: AppSettings = {
  snapToGrid: true,
  // Add default settings here !IMPORTANT
};

/* =========================
   Adapter Interface
========================= */

interface SettingsAdapter {
  get<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]>;
  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void>;
  clear(): Promise<void>;
}

/* =========================
   Browser Adapter
========================= */

const BROWSER_STORAGE_KEY = "app_settings";

class BrowserSettingsAdapter implements SettingsAdapter {
  private read(): Partial<AppSettings> {
    const raw = localStorage.getItem(BROWSER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  private write(data: Partial<AppSettings>) {
    localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(data));
  }

  async get<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    const data = this.read();
    return (data[key] ?? DEFAULT_SETTINGS[key]) as AppSettings[K];
  }

  async set<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    const data = this.read();
    data[key] = value;
    this.write(data);
  }

  async clear(): Promise<void> {
    localStorage.removeItem(BROWSER_STORAGE_KEY);
  }
}

/* =========================
   App Adapter
========================= */

class AppSettingsAdapter implements SettingsAdapter {
  private store!: Awaited<ReturnType<typeof load>>;

  async init() {
    this.store = await load("settings.json");
  }

  async get<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    const value = await this.store.get(key);
    return (value ?? DEFAULT_SETTINGS[key]) as AppSettings[K];
  }

  async set<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    await this.store.set(key, value);
    await this.store.save();
  }

  async clear(): Promise<void> {
    await this.store.clear();
    await this.store.save();
  }
}

/* =========================
   Adapter Selection
========================= */

let adapter: SettingsAdapter;

export async function initSettings() {
  if (isApp()) {
    const appAdapter = new AppSettingsAdapter();
    await appAdapter.init();
    adapter = appAdapter;
  } else {
    console.log("Running in browser mode: Using localStorage");
    adapter = new BrowserSettingsAdapter();
  }
}

/* =========================
   Public API
========================= */

export async function getSetting<K extends keyof AppSettings>(
  key: K
): Promise<AppSettings[K]> {
  return adapter.get(key);
}

export async function getAllSettings(): Promise<AppSettings> {
  const settings = {} as AppSettings;
  const keys = Object.keys(DEFAULT_SETTINGS) as Array<keyof AppSettings>;
  
  for (const key of keys) {
    settings[key] = await adapter.get(key);
  }
  
  return settings;
}

export async function setSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): Promise<void> {
  await adapter.set(key, value);
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const keys = Object.keys(settings) as Array<keyof AppSettings>;
  
  for (const key of keys) {
    await adapter.set(key, settings[key]);
  }
}

export async function clearSettings(): Promise<void> {
  await adapter.clear();
}