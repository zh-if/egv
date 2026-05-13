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
const fs = require('fs');
const md5 = require('md5');

// console.log(process.argv);


var now = new Date();

var dateStr = now.toISOString();

var width = 1000;
var height = 600;

//if (typeof process.argv[3] === 'string') {
//    var [width, height] = process.argv[3].split('x').map(v => parseInt(v, 10));
//}

var delay = 0;

if (typeof process.argv[2] === 'string') {
    type = process.argv[2];
}

if (typeof process.argv[3] === 'string') {
    eve_cookie = process.argv[3];
}
if (typeof process.argv[4] === 'string') {
    job = process.argv[4];
}

if (typeof process.argv[5] === 'string') {
    filename = process.argv[5];
    fs.readFile(filename, function(err, buf) {
	    sum=md5(buf);
	    target=filename+'.'+ type + '.' + sum ;
	    if (fs.existsSync(target)) {
		    process.exit(1)
	    }
    });
    
}

var isMobile = false;


var url = 'https://127.0.0.1/legacy/';
var eve_domain = '127.0.0.1';

(async() => {

    const browser = await puppeteer.launch({
	ignoreHTTPSErrors: true,
	headless: true,
	userDataDir: '/tmp/',
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        //'--single-process', // <- this one doesn't works in Windows
        '--disable-gpu',
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
	'--disable-features=CookiesWithoutSameSiteMustBeSecure',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
	'--no-first-run',
	'--data-path=/home/pptr/.config/chromium/',
	'--user-data-dir=/tmp',
        '--no-pings',
        '--incognito',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
	'--ignore-certificate-errors',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
	'--disable-volume-adjust-sound',
	"--proxy-server = 'direct: //'",
	"--proxy-bypass-list = *"
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
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": eve_cookie,
            "id": 1
        }
    ] 

    await page.setCookie(...cookies) ;

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36')

    await page.setExtraHTTPHeaders({
            'Accept-Encoding': 'gzip, deflate, br', // also tried 'accept', accept, Accept, "accept", "Accept"
	    'Connection': 'keep-alive',
        });

//    await page.goto(url, {'timeout': 10000, waitUntil: 'networkidle2'});
    //await page.goto(url);
    page.goto(url);
    await page.waitForSelector('#action-labclose');
//    await sleep(200);
    //const gitMetrics = await page.metrics();
    //console.log(gitMetrics.Timestamp) 
    //console.log(gitMetrics.TaskDuration)
    await page.evaluate( () => {
	    let viewport=document.querySelector('#lab-viewport');
	    viewport.style.left = "0"; 
	    viewport.style.zIndex = "4004";
	    viewport.style.backgroundImage = "none";
	    viewport.style.backgroundColor = "white";
	    viewport.classList.add('font_adjust');
	    let elems = document.querySelectorAll(".grayscale");

	   [].forEach.call(elems, function(el) {
	   el.classList.remove("grayscale");
	   });
	   let loadscreen = document.querySelector('#loading-lab');
	   if ( loadscreen != null  ) loadscreen.parentNode.removeChild(loadscreen);
	   let nodes_status = document.querySelectorAll(".node_name > *");
	   [].forEach.call(nodes_status, function(el) {
		   el.classList.add("glyphicon-play");
		   //el.remove();
		   el.classList.remove("glyphicon-question-sign");
		   el.classList.remove("glyphicon-stop");

	   });
    });

    var x = await page.$eval('#lab-viewport', el => el.scrollWidth);
    var y = await page.$eval('#lab-viewport', el => el.scrollHeight);
    width = x + 40
    height = y + 0

//   console.log ( "x="+x+",y="+y ); 

    page.setViewport({
       width,
       height,
       isMobile
    });


    //await page.screenshot({path: `/screenshots/${filename}`, fullPage: false});
    if ( type == "jpeg" ) img = await page.screenshot({ type: 'jpeg', quality: 30, encoding: 'base64', fullPage: false});
    if ( type == "png" ) img = await page.screenshot({ encoding: 'base64', fullPage: false});


    browser.close();
    if  ( job === "1" ) {
	    fs.writeFile(target, img, err => {
  		if (err) {
    			console.error(err);
  		}
		// file written successfully
	    });
    } else {
    	console.log( img );
    }
})();
