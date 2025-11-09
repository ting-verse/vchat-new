<template>
  <div class="w-[80%] mx-auto h-full p-8 space-y-6">
    <h1 class="text-2xl font-bold">{{ $t("settings.title") }}</h1>

    <!-- Tabs -->
    <div class="flex items-center gap-6 border-b border-gray-200">
      <button
        type="button"
        class="pb-3 text-sm font-medium border-b-2 transition-colors"
        :class="
          activeTab === 'general'
            ? 'border-purple-500 text-purple-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        "
        @click="setActiveTab('general')"
      >
        {{ $t("settings.tabs.general") }}
      </button>
      <button
        type="button"
        class="pb-3 text-sm font-medium border-b-2 transition-colors"
        :class="
          activeTab === 'models'
            ? 'border-purple-500 text-purple-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        "
        @click="setActiveTab('models')"
      >
        {{ $t("settings.tabs.models") }}
      </button>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'" class="space-y-6">
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

    <!-- Model Settings -->
    <div v-else class="space-y-4">
      <div v-if="providers.length" class="space-y-4">
        <div
          v-for="provider in providers"
          :key="provider.id"
          class="border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          <button
            type="button"
            class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            @click="toggleProvider(provider.id)"
          >
            <div class="flex items-center gap-3 text-left">
              <img
                v-if="provider.avatar"
                :src="provider.avatar"
                :alt="provider.title"
                class="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
              <div>
                <div class="text-sm font-medium text-gray-900">{{ provider.title }}</div>
                <div class="text-xs text-gray-500" v-if="provider.desc">{{ provider.desc }}</div>
              </div>
            </div>
            <Icon
              icon="radix-icons:chevron-down"
              class="h-4 w-4 text-gray-500 transition-transform"
              :class="{ 'rotate-180': isProviderExpanded(provider.id) }"
            />
          </button>
          <transition name="fade">
            <div
              v-if="isProviderExpanded(provider.id)"
              class="px-4 pb-4 border-t border-gray-100"
            >
              <div
                class="mt-4 grid gap-4"
                v-if="getProviderConfig(provider.name).length"
              >
                <div
                  v-for="item in getProviderConfig(provider.name)"
                  :key="item.key"
                >
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ formatConfigLabel(item.key) }}
                  </label>
                  <input
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    :value="getProviderSettingValue(provider.name, item.key)"
                    @input="
                      handleProviderSettingInput(
                        provider.name,
                        item.key,
                        ($event.target as HTMLInputElement).value
                      )
                    "
                    @blur="handleProviderSettingBlur"
                    placeholder="请输入..."
                  />
                </div>
              </div>
              <div
                v-else
                class="mt-4 text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-md px-3 py-2"
              >
                {{ $t("settings.models.noConfig") }}
              </div>
              <div class="mt-4">
                <h4 class="text-xs font-medium text-gray-500 mb-2">
                  {{ $t("provider.selectModel") }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="model in provider.models"
                    :key="model"
                    class="px-2 py-1 text-xs border border-purple-200 text-purple-600 rounded-full bg-purple-50"
                  >
                    {{ model }}
                  </span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div v-else class="text-sm text-gray-500">
        {{ $t("settings.models.empty") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useConfigStore } from "../stores/config";
import { useProviderStore } from "../stores/provider";
import { providerConfigs } from "../config/providerConfigs";
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

const configStore = useConfigStore();
const providerStore = useProviderStore();
const saveTimeout = ref<NodeJS.Timeout | null>(null);
const activeTab = ref<"general" | "models">("general");
const expandedProviderId = ref<number | null>(null);

// 语言选项
const languages = computed(() => [
  { value: "zh-CN" },
  { value: "en-US" },
]);

const providers = computed(() => providerStore.items);

// 加载配置
onMounted(async () => {
  await configStore.loadConfig();
  if (!providers.value.length) {
    try {
      await providerStore.fetchProviders();
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    }
  }
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

// 切换选中的 tab
const setActiveTab = (tab: "general" | "models") => {
  activeTab.value = tab;
};

// 控制手风琴展开
const toggleProvider = (providerId: number) => {
  expandedProviderId.value =
    expandedProviderId.value === providerId ? null : providerId;
};

const isProviderExpanded = (providerId: number) =>
  expandedProviderId.value === providerId;

const getProviderConfig = (providerName: string) => {
  return providerConfigs[providerName] || [];
};

const formatConfigLabel = (key: string): string => {
  const spaced = key.replace(/([A-Z])/g, " $1").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const getProviderSettingValue = (providerName: string, key: string): string => {
  return configStore.providerSettings?.[providerName]?.[key] ?? "";
};

const handleProviderSettingInput = (
  providerName: string,
  key: string,
  value: string
) => {
  configStore.setProviderSetting(providerName, key, value);
  saveConfig();
};

const handleProviderSettingBlur = () => {
  saveConfig();
};
</script>
