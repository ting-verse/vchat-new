import { defineStore } from "pinia";
import { setLocale, type Locale } from "../i18n";

export interface AppConfig {
  language: string;
  fontSize: number;
}

export interface ConfigStore {
  language: string;
  fontSize: number;
}

export const useConfigStore = defineStore("config", {
  state: (): ConfigStore => {
    return {
      language: "zh-CN",
      fontSize: 14,
    };
  },
  actions: {
    // 从文件加载配置
    async loadConfig() {
      try {
        const config = await window.electronAPI.getAppConfig();
        this.language = config.language;
        this.fontSize = config.fontSize;
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
  },
});

