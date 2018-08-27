const request = require('request');
const rp = require('request-promise');

const APPID = 'wx6e57389f37ded230';
const APPSECRET = 'bc872fc08c445e8f9846c9f4f98441c2';

function getAccessToken() {
    return rp(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`, { json: true })
        .then(data => {
            console.log(data.access_token);
            return data.access_token;
        })
        .catch(err => console.log(err));
}

module.exports = {
    onLogin(req, res) {
        const { jsCode } = req.body;
        console.log('jsCode: ', jsCode);
        if (!jsCode) return res.status(400).json({ errMsg: 'Invalid js_code.' });
        rp(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${jsCode}&grant_type=authorization_code`)
            .then(data => res.send(data))
            .catch(err => console.log(err));
    },
    sendNotification: async(req, res) => {
        const ACCESS_TOKEN = await getAccessToken();
        
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${ACCESS_TOKEN}`,
            body: req.body,
            json: true,
        }
        console.log(options);
        
        rp(options)
            .then(data => res.send(data))
            .catch(err => console.log(err));
    }
}