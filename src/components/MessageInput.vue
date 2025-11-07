<template>
  <div
    class="message-input flex w-full border items-center shadow-sm rounded-lg border-gray-300 py-1 px-2 focus-within:border-green-700"
  >
    <input
      type="text"
      class="flex-1 outline-none border-0 bg-white focus:ring-0"
      v-model="model"
    />
    <Button icon-name="radix-icons:paper-plane" @click="onCreate">发送</Button>
  </div>
</template>

<script lang="ts" setup>
import Button from "./Button.vue";

const emit = defineEmits<{
  create: [value: string];
}>();
const model = defineModel<string>();
const onCreate = () => {
  if (model.value && model.value.trim() !== "") {
    emit("create", model.value);
  }
};
</script>
