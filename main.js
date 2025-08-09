// =============================
// 气泡按钮动画与页面切换
// =============================

function expandBubble(btn) {
  const mainContent = document.querySelector('.main-content');
  const whoPage = document.querySelector('.who-is-she-page');

  btn.classList.add('hide-text');
  setTimeout(() => {
    mainContent.classList.add('fade-out');
    btn.classList.add('expand-hole');
  }, 250);

  setTimeout(() => {
    whoPage.classList.remove('hidden');
    whoPage.classList.add('show');
      // 先慢慢变透明
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
      // 等透明动画结束后再缩回去（与CSS transition时间一致）
      setTimeout(() => {
        btn.style.transform = 'translate(-50%, 0) scale(1)';
      }, 1000); // 1s后再缩回去

    

  }, 1100);
}

// 展示 who-is-she-page 的辅助函数
function showWhoIsShePage() {
  document.querySelector('.main-content').classList.add('hidden');
  document.querySelector('.who-is-she-page').classList.add('show');
}

// 隐藏 who-is-she-page 的辅助函数
function hideWhoIsShePage() {
  // 获取主页面文本区域元素
  const mainContent_text = document.querySelector('.main-content-text');
  // 获取“她是谁”页面元素
  const whoIsShePage = document.querySelector('.who-is-she-page');
  // 获取气泡按钮元素
  const bubbleButton = document.querySelector('.button-bubble');
  // 获取主页面按钮区域元素
  const mainContent_buttons = document.querySelector('.main-content-buttons');
  // 获取主页面整体元素
  const mainContent = document.querySelector('.main-content');

  // 1. 添加 who 页面滑出动画
  whoIsShePage.classList.add('slide-down-out');

  // 2. 恢复按钮状态（立刻执行）
  bubbleButton.classList.remove('expand-hole');
  bubbleButton.classList.remove('hide-text');

  // 3. 等动画结束后再隐藏 who 页面、显示 main 页面
  setTimeout(() => {
    whoIsShePage.classList.add('hidden');
    whoIsShePage.classList.remove('show');
    whoIsShePage.classList.remove('slide-down-out');

    mainContent.classList.remove('hidden');
    mainContent.classList.add('slide-up-in');
    mainContent_text.classList.remove('hidden');
    mainContent_text.classList.add('slide-up-in');
    mainContent_buttons.classList.remove('hidden');
    bubbleButton.style = '';
    mainContent_buttons.classList.add('show');
    mainContent_text.classList.remove('fade-out');
  }, 800);
}

// =============================
// 简单樱花飘落特效
// =============================

const canvas = document.getElementById("petals");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const petals = [];
for (let i = 0; i < 30; i++) {
  petals.push({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 3 + 2,
    d: Math.random() * 1
  });
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,192,203,0.8)";
  petals.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    ctx.fill();
    p.y += p.d;
    p.x += Math.sin(p.y * 0.01);
    if (p.y > height) {
      p.y = 0;
      p.x = Math.random() * width;
    }
  });
  if (!window._stopEffects) {
    requestAnimationFrame(draw);
  }
}

draw();

// =============================
// 极淡灰色弹幕雨效果
// =============================

let bulletMessages = [];
const bulletContainer = document.getElementById('bullets');

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createBullet() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const msg = bulletMessages[Math.floor(Math.random() * bulletMessages.length)];
  const div = document.createElement('div');
  div.className = 'bullet';
  div.innerText = msg;
  const fontSize = randomBetween(14 + Math.min(w, h) / 120, 20 + Math.min(w, h) / 60);
  div.style.fontSize = fontSize + 'px';
  div.style.left = randomBetween(0, w - 120) + 'px';
  const duration = randomBetween(5.5, 7.5);
  div.style.animationDuration = duration + 's';
  div.style.top = randomBetween(-40, h * 0.2) + 'px';
  div.style.opacity = randomBetween(0.10, 0.18);
  bulletContainer.appendChild(div);
  div.addEventListener('animationend', () => {
    if (!window._stopEffects) {
      bulletContainer.removeChild(div);
    }
  });
}

function startBulletRain() {
  let base = Math.max(900 - window.innerWidth * 0.3, 350);
  if (!window._stopEffects) {
    createBullet();
    setTimeout(startBulletRain, randomBetween(base, base + 600));
  }
}

function fetchAndStartBullets() {
  fetch('bulletmessages.yml')
    .then(res => res.text())
    .then(ymlText => {
      const data = jsyaml.load(ymlText);
      if (Array.isArray(data)) {
        bulletMessages = data;
        startBulletRain();
      }
    });
}

if (bulletContainer) fetchAndStartBullets();

// =============================
// 打字机效果
// =============================

function typeWriter(
  text,
  interval,
  defaultSpecialPause,
  defaultSpecialPauseAt,
  uniquePauseAt,
  i = 0,
  onFinish = () => {}
) {
  if (i === 0) {
    document.getElementById("quote").innerText = "";
  }

  if (i < text.length) {
    document.getElementById("quote").innerText += text.charAt(i);

    let delay = interval;
    if (uniquePauseAt && i in uniquePauseAt) {
      delay = uniquePauseAt[i];
    } else if (defaultSpecialPause && defaultSpecialPauseAt && defaultSpecialPauseAt.includes(i)) {
      delay = defaultSpecialPause;
    }

    setTimeout(() => {
      typeWriter(
        text,
        interval,
        defaultSpecialPause,
        defaultSpecialPauseAt,
        uniquePauseAt,
        i + 1,
        onFinish
      );
    }, delay);
  } else {
    setTimeout(onFinish, 1500);
  }
}

let configList = [];
let current = 0;

function playAllQuotes() {
  const cfg = configList[current];
  typeWriter(
    cfg.text,
    cfg.interval,
    cfg.defaultSpecialPause,
    cfg.defaultSpecialPauseAt || [],
    cfg.uniquePauseAt || {},
    0,
    () => {
      current = (current + 1) % configList.length;
      playAllQuotes();
    }
  );
}

fetch("quotes.yml")
  .then(res => res.text())
  .then(ymlText => {
    const data = jsyaml.load(ymlText);
    configList = data;
    playAllQuotes();
  });
