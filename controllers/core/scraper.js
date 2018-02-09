var request = require('request');
var rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

module.exports = {

    async login({user, socket}) {
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
        formData['MUA_CODE.DUMMY.MENSYS.1'] = user.uname;
        formData['PASSWORD.DUMMY.MENSYS.1'] = user.psw;
        formData['BP101.DUMMY_B.MENSYS.1'] = 'Log in';
        console.log('Logging in...');
        socket.io.emit(socket.id, 'Logging in...');
        
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
            socket.io.emit(socket.id, '-1');
            throw 'Failed to login!';
        }
        console.log('Redirecting to Portal...');
        socket.io.emit(socket.id, '0');

        // Redirect to portal home page
        body = await rp({uri: `https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/${redirectURL}`, jar})
        console.log('Successfully logged in!');
        socket.io.emit(socket.id, 'Successfully logged in!');

        var portal = body;
        return { portal, jar };
    },

    async getTimetable({ portal, jar, socket }) {
        var $ = cheerio.load(portal);
        const timeTablePageURL = $('#TIMETABLE').attr('href');
        var body = await rp({uri: `https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/${timeTablePageURL}`, jar})
        console.log('Entering classTable Page');
        socket.io.emit(socket.id, '1');

        $ = cheerio.load(body);

        let timeTableURL = $('a:contains("My Personal Class Timetable")').attr('href');
        if (timeTableURL === undefined) {
            console.log('No Class');
            socket.io.emit(socket.id, '-1');
            throw 'No Class!';
        }
        timeTableURL = timeTableURL.substring(7);
        
        body = await rp({uri: `https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/${timeTableURL}`, jar})   
        console.log('Got table!');
        socket.io.emit(socket.id, 'Got table');

        const table = body;
        return table;
    },

}