import { CreateChatProps, OnUpdatedCallback } from "./src/types";

export interface AppConfig {
  language: string;
  fontSize: number;
  providerSettings: Record<string, Record<string, string>>;
}

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void;
  onUpdateMessage: (callback: OnUpdatedCallback) => any;
  copyImageToUserDir: (sourcePath: string) => Promise<string>;
  getAppConfig: () => Promise<AppConfig>;
  saveAppConfig: (config: AppConfig) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
