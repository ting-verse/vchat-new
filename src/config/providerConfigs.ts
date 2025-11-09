export interface ProviderConfigItem {
  key: string;
  value: string;
}

const qianfanConfig: ProviderConfigItem[] = [
  { key: "accessKey", value: "your-access-key" },
  { key: "secretKey", value: "your-secret-key" },
  { key: "baseUrl", value: "https://api.baidu.com" },
];

const dashscopeConfig: ProviderConfigItem[] = [
  { key: "apiKey", value: "your-api-key" },
  { key: "baseUrl", value: "https://dashscope.aliyuncs.com/compatible-mode/v1" },
];

const openAIConfig: ProviderConfigItem[] = [
  { key: "apiKey", value: "sk-xxxxxxxxxxxxxxxxxxxx" },
  { key: "baseUrl", value: "https://api.openai.com/v1" },
];

const claudeConfig: ProviderConfigItem[] = [
  { key: "apiKey", value: "your-claude-api-key" },
  { key: "baseUrl", value: "https://api.anthropic.com" },
];

export const providerConfigs: Record<string, ProviderConfigItem[]> = {
  qianfan: qianfanConfig,
  dashscope: dashscopeConfig,
  openai: openAIConfig,
  claude: claudeConfig,
};

export const defaultProviderSettings: Record<string, Record<string, string>> =
  Object.fromEntries(
    Object.entries(providerConfigs).map(([providerName, items]) => [
      providerName,
      items.reduce<Record<string, string>>((acc, item) => {
        acc[item.key] = item.value ?? "";
        return acc;
      }, {}),
    ])
  );


