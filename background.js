var extensionId = chrome.i18n.getMessage("@@extension_id"),
    imageDatas = {};
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: extensionId+'generate',
        title: chrome.i18n.getMessage("generate"),
        contexts: ["page", "frame", "selection", "link"]
        // documentUrlPatterns: ["http://*/*", "https://*/*", "ftp://*/*"]
    });
    chrome.contextMenus.create({
        id: extensionId+'read',
        title: chrome.i18n.getMessage('read'),
        contexts: ['image']
    });
}), chrome.contextMenus.onClicked.addListener(function(a, b) {
    if (a.menuItemId === extensionId+'generate') {
        var c = !0;
        a.linkUrl && (c = !1, chrome.tabs.sendMessage(b.id, {
            theTextToQRCode: a.linkUrl,
            type: "link"
        })), a.selectionText && "" != a.selectionText.trim() && (c = !1, chrome.tabs.sendMessage(b.id, {
            theTextToQRCode: a.selectionText,
            type: "text"
        })), a.srcUrl && (c = !1, chrome.tabs.sendMessage(b.id, {
            theTextToQRCode: a.srcUrl,
            type: "media"
        })), c && a.pageUrl && chrome.tabs.sendMessage(b.id, {
            theTextToQRCode: a.pageUrl,
            type: "page"
        })
    } else if(a.menuItemId == extensionId+'read') {
        var image = new Image();
        image.src = a.srcUrl;
        image.onload = function () {
            var width = this.naturalWidth;
            var height = this.naturalHeight;
            createCanvasContext(image, 0, 0, width, height);
        }
    }
});
var pageActionTitle = chrome.i18n.getMessage("pageActionTitle");
chrome.tabs.onUpdated.addListener(function(a, b, c) {
    -1 == c.url.indexOf(extensionId) && (chrome.pageAction.setTitle({
        tabId: a,
        title: pageActionTitle + c.url
    }), chrome.pageAction.setPopup({
        tabId: a,
        popup: "pageaction.html?text=" + encodeURIComponent(c.url)
    }), chrome.pageAction.show(a))
}), chrome.tabs.onRemoved.addListener(function(a) {
    delete imageDatas["t" + a]
}), chrome.pageAction.onClicked.addListener(function(a) {
    chrome.runtime.sendMessage({
        theTextToQRCode: a.url,
        type: "location"
    })
}), chrome.runtime.onMessage.addListener(function(a, b, c) {
    a.download_img && chrome.tabs.create({
        url: "download.html"
    }, function(b) {
        imageDatas["t" + b.id] = a.download_img
    }), c({
        received: !0
    })
});

function createCanvasContext(img, t, l, w, h) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'qr-canvas');
    canvas.height = h + 50;
    canvas.width = w + 50;
    var context = canvas.getContext('2d');
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, l, t, w, h, 25, 25, w, h);
    qrcode.callback = copyToClipBoard;
    qrcode.decode(canvas.toDataURL());
    console.log(canvas.toDataURL());
};

function copyToClipBoard(a) {
    if(a.indexOf('error decoding QR Code') == -1){
        document.oncopy = function(event) {
            event.clipboardData.setData("Text", a);
            event.preventDefault();
        };
        document.execCommand("Copy");
        document.oncopy = undefined;
    }else{
        alert(a);
    }
}
