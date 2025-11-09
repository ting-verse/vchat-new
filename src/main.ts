import { app, BrowserWindow, ipcMain, protocol, net } from "electron";
import { ChatCompletion } from "@baiducloud/qianfan";
import OpenAI from "openai";
import path from "path";
import fs from "fs/promises";
import url from "url";
import "dotenv/config";
import { CreateChatProps } from "./types";
import { convertMessages } from "./helper";
import { createProvider } from "./providers/createProvider";

// 配置文件接口
interface AppConfig {
  language: string;
  fontSize: number;
}

// 默认配置
const DEFAULT_CONFIG: AppConfig = {
  language: "zh-CN",
  fontSize: 14,
};

// 获取配置文件路径
const getConfigPath = (): string => {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, "config.json");
};

// 读取配置文件
const readConfig = async (): Promise<AppConfig> => {
  try {
    const configPath = getConfigPath();
    const data = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(data) as AppConfig;
    // 合并默认配置，确保所有字段都存在
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    // 如果文件不存在或读取失败，返回默认配置
    return DEFAULT_CONFIG;
  }
};

// 保存配置文件
const saveConfig = async (config: AppConfig): Promise<void> => {
  const configPath = getConfigPath();
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  protocol.handle("safe-file", async (request) => {
    console.log(request.url);
    const filePath = decodeURIComponent(
      request.url.slice("safe-file://".length)
    );
    console.log(filePath);
    // const data = await fs.readFile(filePath)
    // return new Response(data, {
    //   status: 200,
    //   headers: {
    //     'Content-Type': lookup(filePath) as string
    //   }
    // })
    const newFilePath = url.pathToFileURL(filePath).toString();
    console.log(newFilePath);
    return net.fetch(newFilePath);
  });
  ipcMain.handle(
    "copy-image-to-user-dir",
    async (event, sourcePath: string) => {
      const userDataPath = app.getPath("userData");
      const imagesDir = path.join(userDataPath, "images");
      await fs.mkdir(imagesDir, { recursive: true });
      const fileName = path.basename(sourcePath);
      const destPath = path.join(imagesDir, fileName);
      await fs.copyFile(sourcePath, destPath);
      return destPath;
    }
  );
  
  // 读取配置文件
  ipcMain.handle("get-app-config", async () => {
    return await readConfig();
  });
  
  // 保存配置文件
  ipcMain.handle("save-app-config", async (event, config: AppConfig) => {
    await saveConfig(config);
    return true;
  });
  
  ipcMain.on("start-chat", async (event, data: CreateChatProps) => {
    console.log("hey", data);
    const { providerName, messages, messageId, selectedModel } = data;
    const provider = createProvider(providerName);
    const stream = await provider.chat(messages, selectedModel);
    for await (const chunk of stream) {
      console.log("the chunk", chunk);
      const content = {
        messageId,
        data: chunk,
      };
      mainWindow.webContents.send("update-message", content);
    }
  });
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
