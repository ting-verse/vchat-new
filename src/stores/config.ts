import { defineStore } from "pinia";
import { setLocale, type Locale } from "../i18n";
import { defaultProviderSettings } from "../config/providerConfigs";

const clone = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

export interface AppConfig {
  language: string;
  fontSize: number;
  providerSettings: Record<string, Record<string, string>>;
}

export interface ConfigStore {
  language: string;
  fontSize: number;
  providerSettings: Record<string, Record<string, string>>;
}

export const useConfigStore = defineStore("config", {
  state: (): ConfigStore => {
    return {
      language: "zh-CN",
      fontSize: 14,
      providerSettings: clone(defaultProviderSettings),
    };
  },
  actions: {
    ensureProviderSettings() {
      const merged: Record<string, Record<string, string>> = {
        ...clone(defaultProviderSettings),
      };

      // 合并已有配置
      for (const [providerName, settings] of Object.entries(
        this.providerSettings || {}
      )) {
        merged[providerName] = {
          ...(merged[providerName] || {}),
          ...settings,
        };
      }

      this.providerSettings = merged;
    },
    // 从文件加载配置
    async loadConfig() {
      try {
        const config = await window.electronAPI.getAppConfig();
        this.language = config.language;
        this.fontSize = config.fontSize;
        this.providerSettings =
          config.providerSettings ?? clone(defaultProviderSettings);
        this.ensureProviderSettings();
        // 加载配置后同步 i18n 语言
        setLocale(this.language as Locale);
      } catch (error) {
        console.error("Failed to load config:", error);
      }
    },
    // 保存配置到文件
    async saveConfig() {
      try {
        const config: AppConfig = {
          language: this.language,
          fontSize: this.fontSize,
          providerSettings: this.providerSettings,
        };
        await window.electronAPI.saveAppConfig(config);
      } catch (error) {
        console.error("Failed to save config:", error);
        throw error;
      }
    },
    // 设置语言并同步 i18n
    setLanguage(language: string) {
      this.language = language;
      setLocale(language as Locale);
    },
    setProviderSetting(providerName: string, key: string, value: string) {
      if (!this.providerSettings[providerName]) {
        this.providerSettings[providerName] = {};
      }
      this.providerSettings[providerName][key] = value;
    },
  },
});

