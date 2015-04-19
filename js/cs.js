function createCode(a) {
    var b = document.getElementById("uniqrcode");
    if (!b) {
        b = document.createElement("div"), b.id = "uniqrcode";
        var c = document.createElement("button");
        c.innerHTML = chrome.i18n.getMessage("close"), c.className = "anything-to-qrcode-close", b.appendChild(c);
        var d = function() {
            self.preventClose || (b.style.display = "none", [].slice.call(b.querySelectorAll(".anything-to-qrcode-item")).forEach(function(a) {
                b.removeChild(a)
            }))
        };
        c.addEventListener("click", function() {
            self.preventClose = !1, d()
        }), document.addEventListener("click", function() {
            d()
        }), b.style.display = "none", document.body.appendChild(b)
    }
    b.style.display = "block";
    var e = document.createElement("div");
    e.className = "anything-to-qrcode-item", e.style.cssText = "box-sizing: content-box;";
    var f = document.createElement("div");
    f.className = "anything-to-qrcode-item-img", $imgWrapper = $(f), $imgWrapper.qrcode({
        width: 200,
        height: 200,
        text: utf16to8(a)
    }).attr("title", a);
    var g = "" + $imgWrapper.find("canvas")[0].toDataURL();
    $imgWrapper.find("canvas").replaceWith($('<img src="' + g + '" width="200" />'));
    var h = $('<div style="padding: 8px 0 0 0;overflow: hidden;"></div>'),
        i = $('<a download="qrcode_' + gid + '.png" href="' + g + '" style="font-size: 14px;color: #005eac;float: right;height: 20px;line-height: 20px;">' + chrome.i18n.getMessage("save") + "</a>"),
        j = document.createElement("h4");
    j.className = "anything-to-qrcode-item-title", j.innerHTML = a, j.title = a, j.style.cssText = "box-sizing: border-box;font-size: 12px;width: 165px;float: left;height: 20px;line-height: 20px;margin:0;font-weight:normal;overflow:hidden;text-overflow: ellipsis;color:#333;text-align:left;white-space: nowrap;", h.append(j), h.append(i), e.appendChild(f), h.appendTo(e), b.appendChild(e), $(e).hover(function() {
        self.preventClose = !0
    }, function() {
        self.preventClose = !1
    }), gid++
}
var self = this,
    gid = 1;
chrome.runtime.onMessage.addListener(function(a) {
    a.theTextToQRCode && "" != a.theTextToQRCode.trim() && createCode(a.theTextToQRCode)
});
