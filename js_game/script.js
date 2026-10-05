let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");
let backButton = document.getElementById("backButton"); // 获取返回按钮

let clickCount = 0;  // 记录点击 No 的次数
const YES_GROW_CLICKS = 3; // 前几次点击 Yes 整体变大，之后只变长
let yesBaseFontSize = null;
let yesGrownWidth = null;

// No 按钮的文字变化
const noTexts = [
    "？你认真的吗…",
    "要不再想想？",
    "不许选这个！ ",
    "我会很伤心…",
    "不行:("
];

// 挤压 No 按钮，每次右移 50px，但不移出屏幕（按去掉偏移后的原位计算可移动距离）
function placeNoButton() {
    let currentOffset = new DOMMatrix(getComputedStyle(noButton).transform).m41;
    let baseRight = noButton.getBoundingClientRect().right - currentOffset;
    let maxOffset = Math.max(0, window.innerWidth - 8 - baseRight);
    let noOffset = Math.min(clickCount * 50, maxOffset);
    noButton.style.transform = `translateX(${noOffset}px)`;
}

// Yes 变大的过渡动画结束后布局才稳定（电脑端会把 No 往右推），再校正一次
yesButton.addEventListener("transitionend", placeNoButton);

// No 按钮点击事件
noButton.addEventListener("click", function () {
    clickCount++;

    // 让 Yes 变大：前几次整体放大字号，之后只加宽（改真实尺寸，会把 No 挤开而不是盖住它）
    if (yesBaseFontSize === null) {
        yesBaseFontSize = parseFloat(getComputedStyle(yesButton).fontSize);
    }
    if (clickCount <= YES_GROW_CLICKS) {
        yesButton.style.fontSize = `${yesBaseFontSize * (1 + clickCount * 0.4)}px`;
    } else {
        if (yesGrownWidth === null) {
            yesGrownWidth = yesButton.getBoundingClientRect().width;
        }
        let isStacked = getComputedStyle(yesButton.parentElement).flexDirection === "column";
        let maxWidth = isStacked ? yesButton.parentElement.clientWidth - 20 : window.innerWidth * 0.5;
        let width = Math.min(yesGrownWidth + (clickCount - YES_GROW_CLICKS) * 60, maxWidth);
        yesButton.style.width = `${width}px`;
    }

    // 让图片和文字往上移动
    let moveUp = clickCount * 25; // 每次上移 20px
    mainImage.style.transform = `translateY(-${moveUp}px)`;
    questionText.style.transform = `translateY(-${moveUp}px)`;

    // No 文案变化（前 5 次变化）
    if (clickCount <= 5) {
        noButton.innerText = noTexts[clickCount - 1];
    }

    placeNoButton();

    // 图片变化（前 5 次变化）
    if (clickCount === 1) mainImage.src = "./images3/shocked.png";  
    if (clickCount === 2) mainImage.src = "./images3/think.png";  
    if (clickCount === 3) mainImage.src = "./images3/angry.png"; 
    if (clickCount === 4) mainImage.src = "./images3/crying.png";   
    if (clickCount >= 5) mainImage.src = "./images3/crying.png";
});

// Yes 按钮点击后，进入表白成功页面
yesButton.addEventListener("click", function () {
    // 隐藏原始内容
    document.querySelector(".container").style.display = "none";
    
    // 创建成功页面元素
    const yesScreen = document.createElement("div");
    yesScreen.className = "yes-screen";
    
    const yesText = document.createElement("h1");
    yesText.className = "yes-text";
    yesText.textContent = "!!!轻轻捏哟!! ( >᎑<)♡︎ᐝ";
    
    const yesImage = document.createElement("img");
    yesImage.src = "./images3/yes.jpg";
    yesImage.alt = "丁香鱼";
    yesImage.className = "yes-image";
    
    yesScreen.appendChild(yesText);
    yesScreen.appendChild(yesImage);
    document.body.appendChild(yesScreen);
    
    // 显示返回按钮
    backButton.style.display = "block";
});

// 返回按钮点击事件
backButton.addEventListener("click", function () {
    window.location.href = "./index.html?skipIntro=1";
});
