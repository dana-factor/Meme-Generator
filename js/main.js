'use strict'
var gElCanvas;
var gCtx;

function init() {
    gElCanvas = document.querySelector('#my-canvas');
    gCtx = gElCanvas.getContext('2d');
    gElCanvas.addEventListener('touchstart', onSwitchLine);
    gElCanvas.addEventListener('touchmove', onDrag);
    document.body.addEventListener('touchend', function () { toggleDragMode('off') });
    window.addEventListener('resize', onResizeCanvas);
    createImgs();
    renderGallery();
    renderStickers();
}

function renderGallery() {
    let strHTML = getGImgs().map(function (img) {
        return `<img id="${img.id}" src=${img.url} title="Create your meme" onclick="onImgClicked(this.id)"></img>`
    }).join("")
    document.querySelector('.image-gallery').innerHTML = strHTML;
}

function drawMeme() {
    let meme = getMeme()
    drawImg(meme);
}

function drawImg(meme) {
    let elImg = new Image();
    let imgId;
    if (meme.selectedImgId) imgId = meme.selectedImgId
    else { return }

    elImg.src = getImgById(imgId).url;
    elImg.onload = () => {
        onResizeCanvas(elImg);
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
        drawText(meme);
    }
}

function drawText(meme) {
    meme.lines.forEach(line => {
        let text = line.txt;
        gCtx.lineWidth = '2';
        gCtx.strokeStyle = line.color.stroke;
        gCtx.fillStyle = line.color.fill;
        gCtx.font = line.size + 'px ' + line.font;
        gCtx.textAlign = line.align;
        let linePos = line.position;
        gCtx.fillText(text, linePos.x, linePos.y);
        gCtx.strokeText(text, linePos.x, linePos.y);
    });
}

function onResizeCanvas(elImg) {
    if (!elImg.width) return drawMeme();
    // אין נתון לגבי הרוחב או הגובה של הקאנבס
    gElCanvas.width = elImg.width;
    gElCanvas.height = elImg.height;
    // חישוב לפי גובה קאנבס נתון
    // gElCanvas.width = elImg.height * 551 / elImg.width
    // gElCanvas.height = 551;

    // חישוב לפי רוחב קאנבס נתון
    // gElCanvas.width = 541;
    // gElCanvas.height = elImg.height / elImg.width * 541;
}

function renderStickers() {
    let stickers = getStickers()
    let stickerKey = stickers.firstOnDisplay;
    let strHTML = `<button onclick="onShowOtherStickers('-')">〈</button>`
    for (let i = 0; i < 3; i++) {
        strHTML += `<button id="${stickers[stickerKey + i]}" onclick="onAddSticker(this.id)">${stickers[stickerKey + i]}</button>`
    }
    strHTML += `<button onclick="onShowOtherStickers('+')">〉</button>`
    document.querySelector('.stickers').innerHTML = strHTML;
}

function onShowOtherStickers(mathOperation) {
    let stickers = getStickers();
    if (mathOperation === '+') {
        if (stickers.firstOnDisplay === 3) return;
        stickers.firstOnDisplay++;
    } else {
        if (stickers.firstOnDisplay === 1) return;
        stickers.firstOnDisplay--;
    }
    renderStickers()
}

function onInputChange() {
    let text = document.querySelector('#txt-to-draw').value;
    setMemeText(text);
    drawMeme();
}

function onImgClicked(imgId) {
    document.querySelector('.meme-editor').toggleAttribute("hidden");
    document.querySelector('.gallery').toggleAttribute("hidden");
    setSelectedImg(imgId);
    drawMeme();
}

function onUpdateFontSize(mathOperation) {
    updateFontSize(mathOperation);
    drawMeme();
}

function onUpdateTextHeight(direction) {
    updateTextHeight(direction);
    drawMeme();
}

function onAddLine() {
    (getMeme().lines.length === 1) ? createLine(150, 450) : createLine(150, 250);
    document.querySelector('#txt-to-draw').value = "";
    drawMeme();
}
function onAddSticker(sticker) {
    addSticker(sticker);
    drawMeme();
}

function onRemoveLine() {
    removeLine();
    document.querySelector('#txt-to-draw').value = getCurrLineText();
    drawMeme();
}

function onSwitchLine(e) {
    if (e.type === 'click') {
        switchLine();
    } else {
        var offsetY;
        toggleDragMode('on');
        if (e.type === 'mousedown') offsetY = e.offsetY;
        else if (e.type === 'touchstart') {
            e.preventDefault();
            offsetY = e.targetTouches[0].pageY - e.target.offsetTop;
        }
        getMeme().lines.forEach(function (line, idx) {
            if (offsetY <= line.position.y && offsetY >= line.position.y - line.size) {
                getMeme().selectedLineIdx = idx;
            }
        });
    }
    document.querySelector('#txt-to-draw').value = getCurrLineText();
}

function onSetStrokeColor(color) {
    setStrokeColor(color);
    drawMeme();
}

function onSetFillColor(color) {
    setFillColor(color);
    drawMeme();
}

function onSetFont(font) {
    setFont(font);
    drawMeme();
}

function onTextAlign(direction) {
    setTextAlign(direction);
    drawMeme();
}

function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme';
}

function onSaveMeme() {
    let savedMeme = gElCanvas.toDataURL();
    saveMeme(savedMeme)
}

function onDisplaySaved() {
    let savedMemes = loadMemeFromStorage()
    if (!savedMemes || savedMemes.length === 0) strHTML = 'Save a meme to see it here!';
    else {
        var strHTML = savedMemes.map(function (meme) {
            return `<img src="${meme}">`
        }).join("")
    }
    document.querySelector('.savedMemes').innerHTML = strHTML;
    let savedContainer = document.querySelector('.saved-container')
    if (savedContainer.hidden) savedContainer.toggleAttribute("hidden")
    let gallery = document.querySelector('.gallery')
    if (!gallery.hidden) gallery.toggleAttribute("hidden")
    let memeEditor = document.querySelector('.meme-editor')
    if (!memeEditor.hidden) memeEditor.toggleAttribute("hidden")
}

function onDisplayGallery() {
    let gallery = document.querySelector('.gallery');
    if (gallery.hidden) gallery.toggleAttribute("hidden");
    let memeEditor = document.querySelector('.meme-editor');
    if (!memeEditor.hidden) memeEditor.toggleAttribute("hidden");
    let savedMemes = document.querySelector('.saved-container');
    if (!savedMemes.hidden) savedMemes.toggleAttribute("hidden");
};

function onToggleMenu() {
    let elMenuBtn = document.querySelector('.menu-btn')
    document.body.classList.toggle('menu-open');
    document.body.classList.contains('menu-open') ? elMenuBtn.innerText = "X" : elMenuBtn.innerHTML = `<img src="icons/menu.svg">`
};

function onDrag(e) {
    if (getDragMode()) {
        let meme = getMeme();
        if (e.type === 'mousemove') {
            meme.lines[meme.selectedLineIdx].position.y = e.offsetY;
            meme.lines[meme.selectedLineIdx].position.x = e.offsetX;
        }
        if (e.type === 'touchmove') {
            meme.lines[meme.selectedLineIdx].position.y = e.targetTouches[0].pageY - e.target.offsetTop;
            meme.lines[meme.selectedLineIdx].position.x = e.targetTouches[0].pageX - e.target.offsetLeft;
        }
        drawMeme();
    }
}
