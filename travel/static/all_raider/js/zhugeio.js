window.zhuge = window.zhuge || [];
window.zhuge.methods = "_init debug identify track trackLink trackForm page".split(" ");
window.zhuge.factory = function(b) {
    return function() {
        var a = Array.prototype.slice.call(arguments);
        a.unshift(b);
        window.zhuge.push(a);
        return window.zhuge;
    }
};
for (var i = 0; i < window.zhuge.methods.length; i++) {
    var key = window.zhuge.methods[i];
    window.zhuge[key] = window.zhuge.factory(key);
}
window.zhuge.load = function(b, x) {
    if (!document.getElementById("zhuge-js")) {
        var a = document.createElement("script");
        var verDate = new Date();
        var verStr = verDate.getFullYear().toString()
            + verDate.getMonth().toString() + verDate.getDate().toString();

        a.type = "text/javascript";
        a.id = "zhuge-js";
        a.async = !0;
        a.src = (location.protocol == 'http:' ? "http://sdk.zhugeio.com/zhuge-lastest.min.js?v=" : 'https://zgsdk.zhugeio.com/zhuge-lastest.min.js?v=') + verStr;
        var c = document.getElementsByTagName("script")[0];
        c.parentNode.insertBefore(a, c);
        window.zhuge._init(b, x)
    }
};
window.zhuge.load('c9c6d79f996741ee958c338e28f881d0');
//window.zhuge.load('c9c6d79f996741ee958c338e28f881d0', {debug:true});//璋冭瘯妯″紡
if (window.userid && window.username) {
    zhuge.identify(userid, {
        name:  username,
        sex:sex,
        year:year,
        isadmin:isadmin,
        profession:profession,
        province:province,
        entry_year:entry_year
    });
}
