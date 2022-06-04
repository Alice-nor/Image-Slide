let container = document.getElementById('animation-container');
let button = document.getElementById('animation-button');
// 存入各式各樣的綠色
let color = ['#74C37E', '#9DC4A2', '#538A5A', '#226129', '#B5CF91', '#D2EF67', '#7B951B']
button.addEventListener('click', plantATrees);

function plantATrees() {
    // 為了適應 RWD，先抓取不同裝置的 container 長寬
    // 40 與 50 是因為 container 的 邊框而保留的位置（不要超過邊框或貼太近）
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 50;

    // 隨機之位置
    let xPosition = Math.floor(Math.random() * containerWidth);
    let yPosition = Math.floor(Math.random() * containerHeight);
    // 隨機之數值，當作顏色索引
    let colorIndex = Math.floor(Math.random() * color.length);
    console.log(colorIndex)

    // 取得數值，最大為7，最小為1
    // 為了取索引正常，取索引時要 +1

    let i = document.createElement('i');
    i.classList.add('fa', 'fa-tree', 'animate__animated', 'animate__slideInDown');
    i.setAttribute('style', `top:${yPosition}px;left:${xPosition}px;color:${color[colorIndex]}`)
    container.appendChild(i);

    // 在一定時間後會消失
    setTimeout(function() {
        i.classList.remove("animate__slideInDown"); // 移除滑入的動畫
        i.classList.add('animate__fadeOutUp') // 加入淡出的效果
        setTimeout(function() {
            // 一段時間後，把整個 i 移除
            i.remove();
        }, 1000)
    }, 1500)
}