## Description

Electron application that allows you to select an image and easily change the width and/or height.

## Usage

Install dependencies:

```bash

npm install
```

Run:

```bash
npm start
```

## Key Notes
- Entry point should be main.js.
  - Controls the main process, which runs in a Node.js environment and is responsible for controlling your app's lifecycle, displaying native interfaces, performing privileged operations, and managing renderer processes.
  - Has full operating system access. 
- Author, license, and description can be any value, but is necessary for packaging later on.
- Each window displays a web page that can be loaded either from a local HTML file or a remote web address.
- Many of Electron's core modules are Node.js event emitters that adhere to Node's asynchronous event-driven architecture. The app module is one of these emitters.
- BrowserWindows can only be created after the app module's ready event is fired. You can wait for this event by using the app.whenReady() API and calling createWindow() once its promise is fulfilled.
- Each web page your app displays in a window will run in a separate process called a renderer process (or simply renderer for short).
- Renderer processes have access to the same JavaScript APIs and tooling you use for typical front-end web development.
- You can implement basic window conventions by listening for events emitted by the app and BrowserWindow modules.
  - On Windows and Linux, closing all windows will generally quit an application entirely.
  - In contrast, macOS apps generally continue running even without any windows open. Activating the app when no windows are available should open a new one.
- Because windows cannot be created before the ready event, you should only listen for activate events after your app is initialized. Do this by only listening for activate events inside your existing whenReady() callback.
- Renderer processes run web pages and do not run Node.js by default for security reasons.
  - To bridge Electron's different process types together, we will need to use a special script called a preload.
- A BrowserWindow's preload script runs in a context that has access to both the HTML DOM and a limited subset of Node.js and Electron APIs.
- Preload scripts are injected before a web page loads in the renderer, similar to a Chrome extension's content scripts.
- To add features to your renderer that require privileged access, you can define global objects through the contextBridge API.
- It is not possible to access the Node.js APIs directly from the renderer process, nor the HTML Document Object Model (DOM) from the main process.
  - The solution for this problem is to use Electron's ipcMain and ipcRenderer modules for inter-process communication (IPC).
    - To send a message from your web page to the main process, you can set up a main process handler with ipcMain.handle and then expose a function that calls ipcRenderer.invoke to trigger the handler in your preload script.

## Sources
- https://www.youtube.com/watch?v=ML743nrkMHw
- https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app
