(function() {
    // Защита от повторного запуска
    if (document.getElementById('focus-timer-overlay')) return;
  
    const TIME_LIMIT = 5 * 60; // 5 минут
    
    // --- CSS Стили ---
    const style = document.createElement('style');
    style.textContent = `
      /* --- ТАЙМЕР --- */
      #focus-timer-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2147483647; /* Самый верхний слой */
        pointer-events: none;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
  
      #focus-timer-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        border-radius: 50%;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      }
  
      .timer-svg {
        transform: rotate(-90deg);
        width: 100%;
        height: 100%;
      }
  
      .timer-circle-bg {
        fill: none;
        stroke: rgba(255, 255, 255, 0.2);
        stroke-width: 6;
      }
  
      .timer-circle-progress {
        fill: none;
        stroke: #00ffaa;
        stroke-width: 6;
        stroke-linecap: round;
        transition: stroke-dashoffset 1s linear;
      }
  
      #timer-text {
        position: absolute;
        color: white;
        font-size: 18px;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      }
      
      .timer-finished .timer-circle-progress {
        stroke: #ff4d4d;
      }
  
      /* --- НЕОНОВАЯ РАМКА --- */
      #focus-neon-border {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2147483646; /* Чуть ниже таймера */
        pointer-events: none; /* Пропускает клики */
        box-sizing: border-box;
        
        /* Внутреннее свечение (inset) */
        box-shadow: inset 0 0 20px 5px rgba(0, 255, 170, 0.5),
                    inset 0 0 40px 10px rgba(0, 255, 170, 0.2);
        
        animation: neon-pulse 3s infinite alternate;
      }
  
      @keyframes neon-pulse {
        0% {
          box-shadow: inset 0 0 20px 5px rgba(0, 255, 170, 0.5),
                      inset 0 0 40px 10px rgba(0, 255, 170, 0.2);
        }
        100% {
          box-shadow: inset 0 0 30px 8px rgba(0, 255, 170, 0.8),
                      inset 0 0 60px 15px rgba(0, 255, 170, 0.4);
        }
      }
    `;
    document.head.appendChild(style);
  
    // --- Добавляем рамку ---
    const borderDiv = document.createElement('div');
    borderDiv.id = 'focus-neon-border';
    document.body.appendChild(borderDiv);
  
    // --- Добавляем таймер ---
    const container = document.createElement('div');
    container.id = 'focus-timer-overlay';
  
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
  
    container.innerHTML = `
      <div id="focus-timer-bg"></div>
      <svg class="timer-svg" viewBox="0 0 100 100">
        <circle class="timer-circle-bg" cx="50" cy="50" r="${radius}"></circle>
        <circle class="timer-circle-progress" cx="50" cy="50" r="${radius}" 
                stroke-dasharray="${circumference}" 
                stroke-dashoffset="0"></circle>
      </svg>
      <div id="timer-text">05:00</div>
    `;
  
    document.body.appendChild(container);
  
    // --- Логика таймера ---
    let timeLeft = TIME_LIMIT;
    const circle = container.querySelector('.timer-circle-progress');
    const text = document.getElementById('timer-text');
  
    function updateTimer() {
      if (timeLeft < 0) {
        clearInterval(interval);
        container.classList.add('timer-finished');
        text.innerText = "00:00";
        // Изменим цвет рамки на красный при завершении
        borderDiv.style.animation = 'none';
        borderDiv.style.boxShadow = 'inset 0 0 30px 10px rgba(255, 77, 77, 0.6)';
        return;
      }
  
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      text.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
      const offset = circumference - (timeLeft / TIME_LIMIT) * circumference;
      circle.style.strokeDashoffset = offset;
  
      timeLeft--;
    }
  
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
  })();