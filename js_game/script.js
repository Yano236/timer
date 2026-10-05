let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let mainImage = document.getElementById("mainImage");
let backButton = document.getElementById("backButton"); // 获取返回按钮

let clickCount = 0;  // 记录点击 No 的次数
const YES_WIDTH_CLICKS = 5; // 手机端先分 5 次加宽，再开始变高
const YES_HEIGHT_CLICKS = 16; // 手机端再分 16 次逐步增加高度
const DESKTOP_GROW_CLICKS = 12; // 电脑端左右排列，连续 12 次同时加宽、增高
let yesBaseWidth = null;
let yesBaseHeight = null;
let noTargetWidth = null;

// No 按钮的文字变化
const noTexts = [
    "？你认真的吗…",
    "要不再想想？",
    "不许选这个！ ",
    "我会很伤心…",
    "不行:("
];

// 把蓝色按钮的 auto 尺寸转为像素，文案变长、变短时也能做 0.2 秒过渡。
function updateNoButton(text, animate = true) {
    if (noTargetWidth === null) {
        const rect = noButton.getBoundingClientRect();
        noButton.style.width = `${rect.width}px`;
        noButton.style.height = `${rect.height}px`;
        noButton.getBoundingClientRect();
    }

    const probe = noButton.cloneNode(false);
    probe.removeAttribute("id");
    probe.textContent = text;
    probe.style.cssText = "position: fixed; visibility: hidden; pointer-events: none; width: max-content; height: auto; margin: 0; white-space: nowrap; transition: none;";
    const style = getComputedStyle(noButton);
    probe.style.font = style.font;
    probe.style.padding = style.padding;
    probe.style.border = style.border;
    document.body.appendChild(probe);
    const size = probe.getBoundingClientRect();
    noTargetWidth = size.width;
    probe.remove();

    noButton.textContent = text;
    noButton.style.width = `${noTargetWidth}px`;
    noButton.style.height = `${size.height}px`;
    if (animate) {
        noButton.animate([{ opacity: 0.55 }, { opacity: 1 }], {
            duration: 200,
            easing: "ease-out"
        });
    }
}

// 手机先变宽再增高；电脑同时增长，始终给蓝色按钮留出空间。
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

    const buttons = yesButton.parentElement;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const yesStyle = getComputedStyle(yesButton);
    const noStyle = getComputedStyle(noButton);
    const yesMargins = parseFloat(yesStyle.marginLeft) + parseFloat(yesStyle.marginRight);
    const noMargins = parseFloat(noStyle.marginLeft) + parseFloat(noStyle.marginRight);
    const gap = parseFloat(getComputedStyle(buttons).columnGap) || 0;
    const reservedWidth = isDesktop ? (noTargetWidth ?? noButton.getBoundingClientRect().width) + noMargins + gap : 0;
    const maxWidth = Math.max(0, buttons.clientWidth - yesMargins - reservedWidth);
    const startWidth = Math.min(yesBaseWidth, maxWidth);
    const widthProgress = Math.min(clickCount / (isDesktop ? DESKTOP_GROW_CLICKS : YES_WIDTH_CLICKS), 1);
    yesButton.style.width = `${startWidth + (maxWidth - startWidth) * widthProgress}px`;

    // 电脑同时增高，手机在加宽后增高，给屏幕上下边缘各留 16px。
    const rect = yesButton.getBoundingClientRect();
    const containerHeight = document.querySelector(".container").getBoundingClientRect().height;
    const restHeight = isDesktop
        ? containerHeight - buttons.getBoundingClientRect().height + parseFloat(yesStyle.marginTop) + parseFloat(yesStyle.marginBottom)
        : containerHeight - rect.height;
    const maxHeight = Math.max(yesBaseHeight, window.innerHeight - 32 - restHeight);
    const heightProgress = isDesktop
        ? Math.min(clickCount / DESKTOP_GROW_CLICKS, 1)
        : Math.min(Math.max(clickCount - YES_WIDTH_CLICKS, 0) / YES_HEIGHT_CLICKS, 1);
    yesButton.style.height = `${yesBaseHeight + (maxHeight - yesBaseHeight) * heightProgress}px`;
}

window.addEventListener("resize", function () {
    if (clickCount > 0) {
        updateNoButton(noButton.textContent, false);
        growYesButton();
    }
});

// No 按钮点击事件
noButton.addEventListener("click", function () {
    clickCount++;

    // No 文案变化（前 5 次变化）
    if (clickCount <= 5) {
        updateNoButton(noTexts[clickCount - 1]);
    }
    growYesButton();

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
