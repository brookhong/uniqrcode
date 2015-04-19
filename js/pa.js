! function() {
    var a = decodeURIComponent(location.search.split("=")[1]),
        b = $("#code"), c = "";
    var showQRCode = function(s, c) {
        b.qrcode({
            width: c,
            height: c,
            text: utf16to8(s)
        }).attr("title", s);
        c = "" + b.find("canvas")[0].toDataURL();
        b.find("canvas").replaceWith($('<img src="' + c + '" />'));
    };
    showQRCode(a, 212);
    b.on("click", function() {
        b.find("img").remove();
        showQRCode($("#anytext").val(), 212);
    });
    var d = $('<a class="download-btn" href="download.html">' + chrome.i18n.getMessage("save") + "</a>");
    $("#bar").append(d), $("#anytext").val(a), d.on("click", function(a) {
        a.preventDefault(), chrome.runtime.sendMessage({
            download_img: c
        }, function() {})
    });
}();
