let Auth = require('./auth');
let config = require("./config");

let http = require('http');
let Url = require('url');
let events = require('events');
let EventEmitter = require('events').EventEmitter;

http.createServer(function (req, res) {

    //初始化Auth类
    const auth = new Auth(config.WECHAT_APPID, config.WECHAT_APPSECRET);

    // 解析url
    let params = Url.parse(req.url, true).query;

    //分发路由
    let route = params.route || "";

    if (route == "auth") {

        let redirect_uri = decodeURIComponent(params.redirect_uri) || false;
        let scope = params.scope || "snsapi_base";
        let state = params.state || "";

        // 判断传入参数
        if (!redirect_uri) {
            res.end("参数不全");
            return;
        }

        let url_temp = `${config.WECHAT_DOMAIN}?route=authAccessToken&red_uri=${redirect_uri}&scope=${scope}&state=${state}`;

        //获取授权跳转接口
        url = auth.getOauthRedirect(encodeURIComponent(url_temp), scope);

        event.emit("redirect", res, url);

    } else if (route == "authAccessToken") {

        let code = params.code || false;
        let red_uri = params.red_uri || false;
        let scope = params.scope || false;
        let state = params.state.join("") || false;

        // 判断传入参数
        if (!code || !red_uri || !scope) {
            res.end("参数不全");
            return;
        }

        //通过code获取AccessToken（包含openid）
        auth.getOauthAccessToken(code).then(
            data => {

                if (scope == 'snsapi_base') {

                    if (red_uri.indexOf('?') < 0) {
                        event.emit("redirect", res, `${red_uri}?info=${data.openid}&state=${state}`);
                    } else {
                        event.emit("redirect", res, `${red_uri}&info=${data.openid}&state=${state}`);
                    }

                } else if (scope == 'snsapi_userinfo') {

                    //获取授权后的用户资料
                    auth.getOauthUserinfo(data.access_token, data.openid).then(
                        data_2=> {

                            if (red_uri.indexOf('?') < 0) {
                                event.emit("redirect", res, `${red_uri}?info=${encodeURIComponent(JSON.stringify(data_2))}&state=${encodeURIComponent(state)}`);
                            } else {
                                event.emit("redirect", res, `${red_uri}&info=${encodeURIComponent(JSON.stringify(data_2))}&state=${encodeURIComponent(state)}`);
                            }

                        }
                    )
                }

            }
        ).catch(err => console.error(err));

    } else {
        res.end("route为空");
        return;
    }

}).listen(3000);


//将writeHead提取出来作为重定向功能
let event = new EventEmitter();
event.on('redirect', function (res, url) {

    res.writeHead(302, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-origin': '*',
        'Location': url
    });

    res.end();
    return;

});








