chrome.action.onClicked.addListener(async (tab) => {
    // Игнорируем служебные страницы
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) return;
  
    try {
      // Создаем окно типа 'popup' (без интерфейса браузера) и сразу делаем fullscreen
      await chrome.windows.create({
        tabId: tab.id,
        type: 'popup', 
        state: 'fullscreen',
        focused: true
      });
  
      // Небольшая задержка для инициализации окна перед внедрением скрипта
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      }, 500);
      
    } catch (error) {
      console.error("Ошибка при создании окна:", error);
    }
  });