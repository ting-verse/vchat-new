<template>
  <div 
    class="flex items-center justify-between h-screen"
    :style="{ fontSize: `${configStore.fontSize}px` }"
  >
    <div class="w-[300px] bg-gray-200 h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="items" />
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2">
        <RouterLink to="/">
          <Button icon-name="radix-icons:chat-bubble" class="w-full">
            {{ $t("common.newChat") }}
          </Button>
        </RouterLink>
        <RouterLink to="/settings">
          <Button icon-name="radix-icons:gear" plain class="w-full">
            {{ $t("common.settings") }}
          </Button>
        </RouterLink>
      </div>
    </div>
    <div class="h-full flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { initProviders } from "./db";
import { useConversationStore } from "./stores/conversation";
import { useProviderStore } from "./stores/provider";
import { useConfigStore } from "./stores/config";
import ConversationList from "./components/ConversationList.vue";
import Button from "./components/Button.vue";

const conversationStore = useConversationStore();
const provdierStore = useProviderStore();
const configStore = useConfigStore();
const items = computed(() => conversationStore.items);

// 应用字体大小和语言
const applyConfig = () => {
  // 应用字体大小到根元素
  document.documentElement.style.fontSize = `${configStore.fontSize}px`;
  // 应用语言到 html 标签
  document.documentElement.setAttribute("lang", configStore.language);
};

// 监听配置变化
watch(
  () => [configStore.fontSize, configStore.language],
  () => {
    applyConfig();
  },
  { deep: true }
);

onMounted(async () => {
  // 加载配置
  await configStore.loadConfig();
  // 应用配置
  applyConfig();
  
  await initProviders();
  // 获取最初需要的数据
  conversationStore.fetchConversations();
  provdierStore.fetchProviders();
});
</script>
