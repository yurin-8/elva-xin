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

const quote = "风吹过心上的湖泊，你就是泛起的涟漪。"; // 要显示的句子
let i = 0; // 当前字符索引

// 打字机主函数，逐字显示quote内容
function typeWriter() {
  if (i < quote.length) {
    document.getElementById("quote").innerHTML += quote.charAt(i++); // 追加下一个字符
    setTimeout(typeWriter, 120); // 每120ms显示下一个字
  }
}

typeWriter(); // 启动打字机效果
