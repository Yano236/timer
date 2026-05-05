let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");
let backButton = document.getElementById("backButton"); // 获取返回按钮

let clickCount = 0;  // 记录点击 No 的次数

// No 按钮的文字变化
const noTexts = [
    "？你认真的吗…",
    "要不再想想？",
    "不许选这个！ ",
    "我会很伤心…",
    "不行:("
];

// No 按钮点击事件
noButton.addEventListener("click", function () {
    clickCount++;

    // 让 Yes 变大，每次放大 2 倍
    let yesSize = 1 + (clickCount * 1.2);
    yesButton.style.transform = `scale(${yesSize})`;

    // 挤压 No 按钮，每次右移 100px
    let noOffset = clickCount * 50;
    noButton.style.transform = `translateX(${noOffset}px)`;

    // 让图片和文字往上移动
    let moveUp = clickCount * 25; // 每次上移 20px
    mainImage.style.transform = `translateY(-${moveUp}px)`;
    questionText.style.transform = `translateY(-${moveUp}px)`;

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
    yesText.textContent = "!!!喜欢你!! ( >᎑<)♡︎ᐝ";
    
    const yesImage = document.createElement("img");
    yesImage.src = "./images3/hug.png";
    yesImage.alt = "拥抱";
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
