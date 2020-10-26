// thieu proxy 
// thieu truong hop catch 
// thieu cac buoc cuoi cung de xac nhan
const dotenv = require('dotenv').config();
const axios = require('axios');
const puppeteer = require('puppeteer');
const util = require('util');
var baseUrl = {
    TOKEN: process.env.TOKEN,
    GET_API: process.env.GET_API,
    GET_NETWORK: process.env.GET_NETWORK,
    GET_PHONE: process.env.GET_PHONE,
    GET_OLD_NUMBER: process.env.GET_OLD_NUMBER,
    GET_CODE: process.env.GET_CODE,
    CANCEL_CODE: process.env.CANCEL_CODE
};
let idService = 3;

(async () => {
    const browser = await puppeteer.launch({
        headless: false, 
        devtools: false,
    });
    const page = await browser.newPage(); 
    // const navigationPromise = page.waitForNavigation({ timeout: 4000, waitUntil: "domcontentloaded"});
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136");
    await page.goto('https://accounts.google.com/signin/v2/identifier', { waitUntil: 'domcontentloaded' });

    const selector = "#view_container > div:first-child > div:first-child > div:last-child > div:first-child > div:last-child > div:first-child > div:last-child > div:first-child > div:first-child "
    
    await page.waitForSelector('#view_container')
    await page.click(selector)

    await page.waitForSelector('#initialView')

    await page.click('#initialView > div:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child > span:first-child')
    .catch(() => {})
    await page.waitForNavigation()
    .catch(() => {})

    await page.waitForSelector('#lastName')
    await page.type("#lastName", 'nam the', {delay: 100})
    
    await page.waitForSelector('#firstName')
    await page.type("#firstName", 'nam the', {delay: 100})

    await page.waitForSelector('#username')
    await page.type("#username", 'hododododo123', {delay: 100})

    await page.waitForSelector('[name="Passwd"]')
    await page.type('[name="Passwd"]', 'helo123thE', {delay: 100})

    await page.waitForSelector('[name="ConfirmPasswd"]')
    await page.type('[name="ConfirmPasswd"]', 'helo123thE', {delay: 100})

    await page.click('#accountDetailsNext')
    .catch(() => {

    })
    await page.waitForNavigation()
    .catch(() => {

    })
    if(page.url().includes('webgradsidvphone')) {
        await page.waitForSelector('#phoneNumberId')
        let response = await axios.get(util.format(baseUrl.GET_PHONE, baseUrl.TOKEN, idService))
        let { phone_number, network, session } = response.data.data
        // console.log(phone_number, network, session)
        await page.waitForTimeout(1000)
        await page.$eval('#phoneNumberId', (el, phone_number) => el.value = phone_number, phone_number)
        .catch(() => {})
        let selector = '#view_container > div:first-child > div:first-child > div:last-child > div:last-child > div:last-child > div:first-child > div:first-child > div:first-child'
        await page.click(selector)
        .catch(() => {})
        await page.waitForNavigation()
        .catch(() => {})
        if(page.url().includes('webgradsidvverify')) {
            await page.waitForSelector('#code')
            let data = {}
            while(true) {
                data = await new Promise(resolve => {
                    setTimeout(async () => {
                        let response = await axios.get(util.format(baseUrl.GET_CODE, session, baseUrl.TOKEN))
                        let data = response.data.data
                        console.log(data)
                        resolve(data)
                    }, 2000)
                }) 
                if(data.status == 3 || data.status == 2) {
                    return;
                }
                if(data.status == 0) {
                    break;
                }
            }
            if(!data.messages) {
                return
            }
            let message = data.messages.find(m => {
                return m.otp
            })
            if(!message) {
                console.log('error')
                return
            }
            let code = message.otp
            console.log(code)
            await page.$eval('#code', (el, code) => el.value = code, code);
            let selector = '#view_container > div:first-child > div:first-child > div:last-child > div:last-child > div:last-child > div:last-child > div:first-child > div:first-child'
            await page.click(selector)
            .catch(() => {})
            await page.waitForNavigation()
            .catch(() => {})

            if(page.url().includes('webpersonaldetails')) {
                await page.waitForSelector('#day')
                await page.waitForSelector('#month')
                await page.waitForSelector('#year')
                await page.waitForSelector('#gender')
                
                await page.$eval('#day', (el, day) => el.value = day, day);
                await page.select('#month', 10);
                await page.$eval('#year', (el, year) => el.value = year, year);
                
                await page.select('#gender', 1);

                let selector = '#view_container > div:first-child > div:first-child > div:last-child > div:last-child > div:last-child > div:first-child > div:first-child > div:first-child'
                await page.click(selector)
                .catch(() => {})
                await page.waitForNavigation()
                .catch(() => {})

            }else {

            }

        }else {

        }
    }else{
        console.log('error')
    }
    // await page.waitForTimeout(5000);
    // await browser.close();
})();