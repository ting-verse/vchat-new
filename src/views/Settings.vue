<template>
  <div class="w-[80%] mx-auto h-full p-8">
    <h1 class="text-2xl font-bold mb-6">{{ $t("settings.title") }}</h1>
    
    <div class="space-y-6">
      <!-- 语言设置 -->
      <div class="bg-white rounded-lg border border-gray-300 p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t("settings.language") }}
        </label>
        <SelectRoot v-model="configStore.language" @update:modelValue="handleLanguageChange">
          <SelectTrigger
            class="flex w-full items-center justify-between rounded-md py-1.5 px-3 shadow-sm border outline-none data-[placeholder]:text-gray-400 focus:ring-2 focus:ring-green-700 focus:border-green-700"
          >
            <SelectValue :placeholder="$t('settings.selectLanguage')" />
            <Icon icon="radix-icons:chevron-down" class="h-5 w-5" />
          </SelectTrigger>
          <SelectPortal>
            <SelectContent class="bg-white rounded-md shadow-md z-[100] border">
              <SelectViewport class="p-2">
                <SelectItem
                  v-for="lang in languages"
                  :key="lang.value"
                  :value="lang.value"
                  class="outline-none rounded flex items-center h-7 px-6 relative text-green-700 cursor-pointer data-[highlighted]:bg-green-700 data-[highlighted]:text-white"
                >
                  <SelectItemIndicator class="absolute left-2 w-6">
                    <Icon icon="radix-icons:check" />
                  </SelectItemIndicator>
                  <SelectItemText>{{ $t(`languages.${lang.value}`) }}</SelectItemText>
                </SelectItem>
              </SelectViewport>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>
      </div>

      <!-- 字体大小设置 -->
      <div class="bg-white rounded-lg border border-gray-300 p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t("settings.fontSizeUnit") }}
        </label>
        <NumberFieldRoot
          v-model="configStore.fontSize"
          :min="12"
          :max="24"
          :step="1"
          @update:modelValue="handleFontSizeChange"
          class="flex items-center gap-2"
        >
          <NumberFieldDecrement
            class="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="radix-icons:minus" class="h-4 w-4" />
          </NumberFieldDecrement>
          <NumberFieldInput
            class="w-20 px-3 py-1.5 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
          />
          <NumberFieldIncrement
            class="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="radix-icons:plus" class="h-4 w-4" />
          </NumberFieldIncrement>
        </NumberFieldRoot>
        <p class="mt-2 text-xs text-gray-500">{{ $t("settings.fontSizeRange") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "../stores/config";
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "radix-vue";
import { Icon } from "@iconify/vue";

const { t } = useI18n();
const configStore = useConfigStore();
const saveTimeout = ref<NodeJS.Timeout | null>(null);

// 语言选项
const languages = computed(() => [
  { value: "zh-CN" },
  { value: "en-US" },
]);

// 加载配置
onMounted(async () => {
  await configStore.loadConfig();
});

// 保存配置（防抖）
const saveConfig = async () => {
  if (saveTimeout.value) {
    clearTimeout(saveTimeout.value);
  }
  saveTimeout.value = setTimeout(async () => {
    await configStore.saveConfig();
  }, 300);
};

// 处理语言变更 - 实时更新 i18n
const handleLanguageChange = async (newLanguage: string) => {
  // 使用 config store 的 setLanguage 方法，它会同步更新 i18n
  configStore.setLanguage(newLanguage);
  await saveConfig();
};

// 处理字体大小变更
const handleFontSizeChange = async () => {
  await saveConfig();
};
</script>
