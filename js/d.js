chrome.tabs.getCurrent(function(a) {
    try {
        var b = document.getElementById("btn"),
            c = document.getElementById("qrcode");
        b.href = "" + chrome.extension.getBackgroundPage().imageDatas["t" + a.id], c.src = b.href, b.click()
    } catch (d) {}
});
