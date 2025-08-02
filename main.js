// =============================
// 气泡按钮动画与页面切换
// =============================

// 页面加载时检查状态
window.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('whoIsSheRevealed') === '1') {
    showWhoIsShePage();
  }
});

function expandBubble(btn) {
  const mainContent = document.querySelector('.main-content');
  const whoPage = document.querySelector('.who-is-she-page');

  btn.classList.add('hide-text');       // 文字渐隐
  // 文字消失后再扩展气泡
  setTimeout(() => {
    mainContent.classList.add('fade-out'); // 主内容区淡出
    btn.classList.add('expand-hole');     // 扩散洞口

    // 保留樱花和弹幕雨特效，不做淡出和停止动画
  }, 250); // 文字渐隐更快

  setTimeout(() => {
    whoPage.classList.add('show');        // 显示 Who is she 页
    // 不再跳转页面，只展示 who-is-she-page 内容
    localStorage.setItem('whoIsSheRevealed', '1'); // 记忆状态
  }, 1100); // 扩散动画后显示页面
}

// 展示 who-is-she-page 的辅助函数
function showWhoIsShePage() {
  document.querySelector('.main-content').classList.add('fade-out');
  document.querySelector('.who-is-she-page').classList.add('show');
}
// =============================
// 简单樱花飘落特效
// =============================

// 获取canvas元素和2D上下文
const canvas = document.getElementById("petals"); // 获取canvas元素
const ctx = canvas.getContext("2d"); // 获取2D绘图上下文

// 设置canvas宽高为窗口宽高，确保全屏覆盖
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// 生成樱花花瓣数组，每个花瓣有x/y坐标、半径r、下落速度d
const petals = [];
for (let i = 0; i < 30; i++) {
  petals.push({
    x: Math.random() * width, // 随机x坐标
    y: Math.random() * height, // 随机y坐标
    r: Math.random() * 3 + 2, // 半径2~5
    d: Math.random() * 1      // 下落速度0~1
  });
}

// 绘制和动画主循环
function draw() {
  ctx.clearRect(0, 0, width, height); // 清空画布
  ctx.fillStyle = "rgba(255,192,203,0.8)"; // 樱花粉色
  petals.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true); // 画圆形花瓣
    ctx.fill();
    p.y += p.d; // 下落
    p.x += Math.sin(p.y * 0.01); // 微微左右摆动
    // 如果花瓣超出底部则重置到顶部，x坐标随机
    if (p.y > height) {
      p.y = 0;
      p.x = Math.random() * width;
    }
  });
  if (!window._stopEffects) {
    requestAnimationFrame(draw); // 循环动画
  }
}

draw(); // 启动动画
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
  // 字体大小随屏幕自适应
  const fontSize = randomBetween(14 + Math.min(w, h) / 120, 20 + Math.min(w, h) / 60);
  div.style.fontSize = fontSize + 'px';
  // 横向随机
  div.style.left = randomBetween(0, w - 120) + 'px';
  // 动画持续时间随机
  const duration = randomBetween(5.5, 7.5);
  div.style.animationDuration = duration + 's';
  // 纵向起点随机（可选）
  div.style.top = randomBetween(-40, h * 0.2) + 'px';
  // 透明度更淡
  div.style.opacity = randomBetween(0.10, 0.18);
  bulletContainer.appendChild(div);
  // 动画结束后移除
  div.addEventListener('animationend', () => {
    if (!window._stopEffects) {
      bulletContainer.removeChild(div);
    }
  });
}

// 根据屏幕大小动态调整弹幕密集度
function startBulletRain() {
  let base = Math.max(900 - window.innerWidth * 0.3, 350); // 大屏更密集
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


// 打字机主函数，支持递归与回调
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
    document.getElementById("quote").innerText = ""; // 清空文字区域
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
    setTimeout(onFinish, 1500); // 打完之后，1.5 秒后执行下一句
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
      current = (current + 1) % configList.length; // 下一句（循环）
      playAllQuotes(); // 递归播放
    }
  );
}

fetch("quotes.yml")
  .then(res => res.text()) // 注意：YAML 是纯文本
  .then(ymlText => {
    const data = jsyaml.load(ymlText); // YAML 转 JS 对象
    configList = data;
    playAllQuotes();
  });
