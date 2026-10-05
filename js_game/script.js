let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let mainImage = document.getElementById("mainImage");
let backButton = document.getElementById("backButton"); // 获取返回按钮

let clickCount = 0;  // 记录点击 No 的次数
const YES_WIDTH_CLICKS = 5; // 加宽进度为原来的 4 倍，5 次后接近屏幕宽度，再开始变高
const YES_HEIGHT_CLICKS = 16; // 再分 16 次逐步增加高度
let yesBaseWidth = null;
let yesBaseHeight = null;

// No 按钮的文字变化
const noTexts = [
    "？你认真的吗…",
    "要不再想想？",
    "不许选这个！ ",
    "我会很伤心…",
    "不行:("
];

// 保持字号不变，先横向增长，再纵向增长；按点击次数计算，连点也不会跳过增长阶段。
function growYesButton() {
    if (yesBaseWidth === null) {
        const rect = yesButton.getBoundingClientRect();
        // 先把 auto 尺寸固定成像素值，后续变宽/变高才有过渡动画，不会突然跳变
        yesBaseWidth = rect.width;
        yesBaseHeight = rect.height;
        yesButton.style.width = `${rect.width}px`;
        yesButton.style.height = `${rect.height}px`;
        yesButton.getBoundingClientRect(); // 强制生效
    }

    const maxWidth = Math.max(0, yesButton.parentElement.clientWidth - 20);
    const startWidth = Math.min(yesBaseWidth, maxWidth);
    const widthProgress = Math.min(clickCount / YES_WIDTH_CLICKS, 1);
    yesButton.style.width = `${startWidth + (maxWidth - startWidth) * widthProgress}px`;

    // 加宽阶段高度不变，之后逐步填满剩余高度，给上下边缘各留 16px。
    const rect = yesButton.getBoundingClientRect();
    const restHeight = document.querySelector(".container").getBoundingClientRect().height - rect.height;
    const maxHeight = Math.max(yesBaseHeight, window.innerHeight - 32 - restHeight);
    const heightProgress = Math.min(Math.max(clickCount - YES_WIDTH_CLICKS, 0) / YES_HEIGHT_CLICKS, 1);
    yesButton.style.height = `${yesBaseHeight + (maxHeight - yesBaseHeight) * heightProgress}px`;
}

window.addEventListener("resize", function () {
    if (clickCount > 0) growYesButton();
});

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
