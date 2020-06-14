'use strict'
var gDragMode = false;
var gKeywords = {
    'happy': 12,
    'funny puk': 1
};
const KEY = 'My-Memes'
var gNextId = 1;
var gImgs = [];
var gSavedMemes = [];
var gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: '',
            size: 40,
            font: 'impact',
            align: 'center',
            color: { stroke: 'black', fill: 'white' },
            position: { x: 150, y: 80 }
        }
    ]
};

var gStickers = {
    firstOnDisplay: 1,
    1: '&#127891',
    2: '&#128156',
    3: '&#128173',
    4: '&#128286',
    5: '&#128520'
};

function getStickers() {
    return gStickers;
};

function _createImg(url, keywords) {
    let img = {
        id: gNextId++,
        url,
        keywords
    };
    gImgs.push(img);
}

function createImgs() {
    _createImg('img/1.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/2.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/3.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/4.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/5.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/6.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/7.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/8.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/9.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/10.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/11.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/12.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/13.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/14.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/15.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/16.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/17.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/18.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/19.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/20.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/21.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/22.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/23.jpg', ['happy', 'crazy', 'sarcastic']);
    _createImg('img/24.jpg', ['happy', 'crazy', 'sarcastic']);
}

function getMeme() {
    return gMeme;
}

function getGImgs() {
    return gImgs;
}

function setMemeText(text) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.txt = text;
}

function setSelectedImg(imgId) {
    gMeme.selectedImgId = parseInt(imgId);
}

function getImgById(imgId) {
    let image = gImgs.find(function (img) {
        return img.id === imgId;
    })
    return image;
}

function updateFontSize(mathOperation) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx];
    (mathOperation === 'increase') ? currLine.size += 2 : currLine.size -= 2;
}

function updateTextHeight(direction) {
    let currLinePos = gMeme.lines[gMeme.selectedLineIdx].position;
    (direction === "up") ? currLinePos.y -= 2 : currLinePos.y += 2;
}

function createLine(x, y) {
    let textLine = {
        txt: '',
        size: 40,
        font: 'impact',
        align: 'center',
        color: { stroke: 'black', fill: 'white' },
        position: { x, y }
    };

    gMeme.lines.push(textLine);
    gMeme.selectedLineIdx++;
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    if (gMeme.lines.length === 0) createLine(150, 80);
    gMeme.selectedLineIdx = 0;
};

function switchLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else { gMeme.selectedLineIdx++ };
}

function addSticker(sticker) {
    createLine(150, 250);
    gMeme.lines[gMeme.selectedLineIdx].txt = sticker;
    gMeme.lines[gMeme.selectedLineIdx].size = 100;

}

function setStrokeColor(color) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.color.stroke = color;
}

function setFillColor(color) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.color.fill = color;
}

function setFont(font) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.font = font;
}

function setTextAlign(direction) {
    let currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.align = direction;
}

function getCurrLineText() {
    return gMeme.lines[gMeme.selectedLineIdx].txt;
}

function getDragMode() {
    return gDragMode;
}

function toggleDragMode(mode) {
    if (mode === 'off' && gDragMode === true) gDragMode = false
    if (mode === 'on' && gDragMode === false) gDragMode = true
}

function saveMeme(savedMeme) {
    gSavedMemes.push(savedMeme)
    saveToStorage(KEY, gSavedMemes)
}

function loadMemeFromStorage() {
    loadFromStorage(KEY)
}