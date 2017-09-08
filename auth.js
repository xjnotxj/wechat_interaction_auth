let https = require('https');

class Auth {

    constructor(appId, appSecret) {
        this.appId = appId;
        this.appSecret = appSecret;
    }

    //  oauth 授权跳转接口
    //  @param string url
    //  @param string scope
    //  @param string state
    //  @return string

    getOauthRedirect(url, scope, state = "") {
        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${url}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
    }

    // 通过code获取AccessToken（注意：这里是网页授权access_token，不是基础支持中的access_token）
    // @param string code
    // @return json {access_token,expires_in,refresh_token,openid,scope}

    getOauthAccessToken(code) {

        return new Promise((resolve, reject) => {

            let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.appId}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`;

            //向微信服务器发送请求
            https.get(url, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {

                    if (data) {

                        data = JSON.parse(data);

                        //如果微信返回错误
                        if (data.errcode) {
                            return reject(new Error(data.errmsg));
                        }

                        //成功后返回data
                        return resolve(data);

                    } else {
                        return reject(new Error("getOauthAccessToken 请求返回数据为空"));
                    }

                });
            }).on("error", function (err) {
                return resolve(err);
            });

        })

    }


    // 获取授权后的用户资料（注意：这里是网页授权access_token，不是基础支持中的access_token）
    // @param string access_token
    // @param string openid
    // @return json {openid,nickname,sex,province,city,country,headimgurl,privilege,[unionid]}
    // 注意：unionid字段 只有在用户将公众号绑定到微信开放平台账号后，才会出现。

    getOauthUserinfo(access_token, openid) {

        return new Promise((resolve, reject) => {

            let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;

            //向微信服务器发送请求
            https.get(url, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {

                    if (data) {

                        data = JSON.parse(data);

                        //如果微信返回错误
                        if (data.errcode) {
                            return reject(new Error(data.errmsg));
                        }

                        //成功后返回access_token
                        return resolve(data);

                    } else {
                        return reject(new Error("getOauthAccessToken 请求返回数据为空"));
                    }

                });
            }).on("error", function (err) {
                return resolve(err);
            });

        })

    }

}

module.exports = Auth;