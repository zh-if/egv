#!/usr/bin/env node

function sleep(ms) {
    ms = (ms) ? ms : 0;
    return new Promise(resolve => {setTimeout(resolve, ms);});
}

process.on('uncaughtException', (error) => {
    console.error(error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(reason, p);
    process.exit(1);
});

const puppeteer = require('puppeteer');

// console.log(process.argv);

if (!process.argv[2]) {
    console.error('ERROR: no url arg\n');

    console.info('for example:\n');
    console.log('  docker run --shm-size 1G --rm -v /tmp:/screenshots \\');
    console.log('  alekzonder/puppeteer:latest screenshot \'https://www.google.com\'\n');
    process.exit(1);
}

var url = process.argv[2];

var now = new Date();

var dateStr = now.toISOString();

var width = 800;
var height = 600;

if (typeof process.argv[3] === 'string') {
    var [width, height] = process.argv[3].split('x').map(v => parseInt(v, 10));
}

var delay = 0;

if (typeof process.argv[4] === 'string') {
    delay = parseInt(process.argv[4], 10);
}

if (typeof process.argv[5] === 'string') {
    eve_cookie = process.argv[5];
}

var isMobile = false;

let filename = `topology.png`;

var eve_domain = url.toString().replace('https://','');

(async() => {

    const browser = await puppeteer.launch({
	ignoreHTTPSErrors: true,
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();

    page.setViewport({
        width,
        height,
        isMobile
    });

//    const cookies = [{
//	  "unetlab_session": "toto"
//    }];
    var cookies = [ // cookie exported by google chrome plugin editthiscookie
        {
            "domain": eve_domain,
            "expirationDate": 1597288045,
            "hostOnly": false,
            "httpOnly": false,
            "name": "unetlab_session",
            "path": "/api/",
            "sameSite": "None",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": eve_cookie,
            "id": 1
        }
    ] 

    await page.setCookie(...cookies) ;

    await page.goto(url, {waitUntil: 'networkidle2'});

//    await sleep(delay);


    await page.evaluate( () => {
	    let viewport=document.querySelector('#lab-viewport');
	    viewport.style.left = "0"; 
	    viewport.style.zIndex = "4004";
	    viewport.style.backgroundImage = "none";
	    viewport.style.backgroundColor = "white";

    } );

    var x = await page.$eval('#lab-viewport', el => el.scrollWidth);
    var y = await page.$eval('#lab-viewport', el => el.scrollHeight);
    width = x + 0
    height = y + 40

   console.log ( "x="+x+",y="+y ); 

    page.setViewport({
       width,
       height,
       isMobile
    });


    await page.screenshot({path: `/tmp/screenshots/${filename}`, fullPage: false});

    browser.close();

    console.log(
        JSON.stringify({
            date: dateStr,
            timestamp: Math.floor(now.getTime() / 1000),
            filename,
            width,
            height
        })
    );

})();
