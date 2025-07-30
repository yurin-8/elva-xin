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
  requestAnimationFrame(draw); // 循环动画
}

draw(); // 启动动画

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