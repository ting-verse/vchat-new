import { createI18n } from "vue-i18n";
import zhCN from "./locales/zh-CN";
import enUS from "./locales/en-US";

export type Locale = "zh-CN" | "en-US";

const messages = {
  "zh-CN": zhCN,
  "en-US": enUS,
};

// 创建 i18n 实例
export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: "zh-CN", // 默认语言
  fallbackLocale: "en-US", // 回退语言
  messages,
});

// 设置语言的辅助函数
export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale;
}

// 获取当前语言的辅助函数
export function getLocale(): Locale {
  return i18n.global.locale.value as Locale;
}

