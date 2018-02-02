var request = require('request');
var rp = require('request-promise');
const cheerio = require('cheerio');
const EventEmitter = require('events');
const fs = require('fs');

// Event Manager
const eventManager = new EventEmitter();

module.exports = {

    async login({uname, psw}, res) {
        console.log('Program initiating...');
        // Enable CookieJar
        var jar = rp.jar();
        // Get form data and cookie
        var body = await rp({uri: 'https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/siw_lgn', jar})
        var $ = cheerio.load(body);
        var formData = {};
        const rawform = $('form').serializeArray();
        rawform.forEach(input => {
            formData[input['name']] = input['value']
        });
        formData['MUA_CODE.DUMMY.MENSYS.1'] = uname;
        formData['PASSWORD.DUMMY.MENSYS.1'] = psw;
        formData['BP101.DUMMY_B.MENSYS.1'] = 'Log in';
        console.log('Logging in...');
          
        // Post form to log in to intermediate page
        var options = {
            method: 'POST',
            uri: 'https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/siw_lgn',
            formData: formData,
            jar
        }
        body = await rp(options)
        $ = cheerio.load(body);
        var redirectURL = $('#siw_portal_url').val();
        if (redirectURL === undefined) {
            console.log('Failed to login!');
            throw 'Failed to login!';
        }
        console.log('Redirecting to Portal...');

        // Redirect to portal home page
        body = await rp({uri: `https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/${redirectURL}`, jar})
        console.log('Successfully logged in!');

        var portal = body;
        // console.log(portal);
        return { portal, jar };
    },

    async getTimetable({portal, jar}) {
        var $ = cheerio.load(portal);
        const timeTablePageURL = $('#TIMETABLE').attr('href');
        var body = await rp({uri: `https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/${timeTablePageURL}`, jar})
        console.log('Entering classTable page...');
        $ = cheerio.load(body);
        const timeTableURL = $('a:contains("My Personal Class Timetable")').attr('href').substring(7);
        
        body = await rp({uri: `https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/${timeTableURL}`, jar})   
        console.log('Got table!');

        const table = body;
        return table;
    },

}