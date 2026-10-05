let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let mainImage = document.getElementById("mainImage");
let backButton = document.getElementById("backButton"); // 获取返回按钮

let clickCount = 0;  // 记录点击 No 的次数
const YES_GROW_CLICKS = 3; // 前几次点击 Yes 整体变大，之后先逐步变宽到接近屏幕宽，再逐步变高
const YES_STEP = 50; // 后期每次加宽 / 加高 px
let yesBaseFontSize = null;
let yesTargetWidth = null; // 记住目标尺寸，快速连点时不受过渡动画中间值影响
let yesTargetHeight = null;

// No 按钮的文字变化
const noTexts = [
    "？你认真的吗…",
    "要不再想想？",
    "不许选这个！ ",
    "我会很伤心…",
    "不行:("
];

// 让 Yes 变大：改真实尺寸，上下排列时靠高度把 No 往下推（No 自身不做任何平移）
function growYesButton() {
    if (yesBaseFontSize === null) {
        yesBaseFontSize = parseFloat(getComputedStyle(yesButton).fontSize);
    }
    if (clickCount <= YES_GROW_CLICKS) {
        yesButton.style.fontSize = `${yesBaseFontSize * (1 + clickCount * 0.4)}px`;
        return;
    }
    let rect = yesButton.getBoundingClientRect();
    if (yesTargetWidth === null) {
        // 先把 auto 尺寸固定成像素值，后续变宽/变高才有过渡动画，不会突然跳变
        yesTargetWidth = rect.width;
        yesTargetHeight = rect.height;
        yesButton.style.width = `${rect.width}px`;
        yesButton.style.height = `${rect.height}px`;
        yesButton.getBoundingClientRect(); // 强制生效
    }

    let maxWidth = yesButton.parentElement.clientWidth - 20;
    if (yesTargetWidth < maxWidth) {
        yesTargetWidth = Math.min(yesTargetWidth + YES_STEP, maxWidth);
        yesButton.style.width = `${yesTargetWidth}px`;
        return;
    }

    // 整体高度 = 其余部分 + Yes 高度（同一时刻测量，过渡动画中也成立）；保证整体不超出屏幕
    let restHeight = document.querySelector(".container").getBoundingClientRect().height - rect.height;
    let maxHeight = Math.max(yesTargetHeight, window.innerHeight - 32 - restHeight);
    yesTargetHeight = Math.min(yesTargetHeight + YES_STEP, maxHeight);
    yesButton.style.height = `${yesTargetHeight}px`;
}

// No 按钮点击事件
noButton.addEventListener("click", function () {
    clickCount++;
    growYesButton();

    // No 文案变化（前 5 次变化）
    if (clickCount <= 5) {
        noButton.innerText = noTexts[clickCount - 1];
    }

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
