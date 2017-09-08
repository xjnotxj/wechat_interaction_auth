# Wechat 网页授权 

## 授权url：（请在微信客户端中打开此链接体验）

> xxx为config.js中的`WECHAT_DOMAIN`

#### 1、scope为snsapi_base
> xxx/?route=auth&redirect_uri=http://www.baidu.com/&scope=snsapi_base&state=123

#### 2、scope为snsapi_userinfo 
> xxx/?route=auth&redirect_uri=http://www.baidu.com/&scope=snsapi_userinfo&state=123

#### 参数说明： 

| **参数** | **描述** | **例子** |
| :---: | :---: | :---: |
| redirect\_uri | 获取用户信息后回调的url | encodeURIComponent('http://www.baidu.com') |
| scope | snsapi\_base / snsapi\_userinfo [默认snsapi_base] | snsapi\_base  静默授权，返回info=openid / snsapi\_userinfo  非静默授权，返回完整用户信息：info={用户信息json格式字符串} |
| state | 回调后会带上state参数，可以填写a-zA-Z0-9 | 123 |

## 授权方式说明：

#### 1. scope=snsapi\_base调用成功后会将openid重定向至回调页面

调用成功后示例:

> http://www.baidu.com?info=oJT88wHBcuAwp7fCvJ9VvS1iE4zg&state=123

info为openid

state为初始带来的参数

#### 2. scope=snsapi\_userinfo调用成功后会将详细用户信息(包含openid)重定向至回调页面

调用成功后示例:

> http://www.baidu.com?info={%22openid%22:%22oJT88wHBcuAwp7fCvJ9VvS1iE4zg%22,%22nickname%22:%22Dhoopu%22,%22sex%22:1,%22province%22:%22%e4%b8%8a%e6%b5%b7%22,%22city%22:%22%e5%98%89%e5%ae%9a%22,%22country%22:%22%e4%b8%ad%e5%9b%bd%22,%22headimgurl%22:%22http://wx.qlogo.cn/mmopen/OM4v0FU2h0vtem9J2adoZcb6xMOp88ia5icQlb90m87DdbAVW20znQjMXA4K06ykGHpEVfEicnGFLKs5e8vBnzqXQ/0%22,%22privilege%22:[],%22unionid%22:null}&state=123

info格式化后的字段如下：

| openid | 用户的唯一标识 |
| :---: | :---: |
| nickname | 用户昵称 |
| sex | 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知 |
| province | 用户个人资料填写的省份 |
| city | 普通用户个人资料填写的城市 |
| country | 国家，如中国为CN |
| headimgurl | 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640\*640正方形头像），用户没有头像时该项为空 |
| privilege | 用户特权信息，json 数组，如微信沃卡用户为（chinaunicom） |

state为初始带来的参数

## 流程图

![](http://images2017.cnblogs.com/blog/896608/201709/896608-20170908162639522-1551547789.png)

 
## 开发者备注：

1、此接口请先配置`/config.php`文件

2、微信公众平台里，在开发 - 接口权限 - 网页服务 - 网页帐号 - 网页授权获取用户基本信息”的配置选项中，修改授权回调域名。