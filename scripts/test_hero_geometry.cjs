const {chromium} = require('playwright-core');
const fs=require('fs');
const assert=require('assert/strict');
const exec=require('child_process').execFileSync;
const path=require('path');
const browserPath=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/opt/google/chrome/chrome'].find(x=>fs.existsSync(x))||exec('which',['google-chrome']).toString().trim();
const sizes=[{name:'desktop',width:1440,height:900},{name:'laptop',width:1024,height:800},{name:'tablet',width:768,height:1024},{name:'phone',width:390,height:844},{name:'small-phone',width:320,height:720}];
const round=n=>Math.round(n*100)/100;
async function capture(page){
 return page.evaluate(()=>{
  const rect=x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
  return {
   lang:document.documentElement.lang,
   art:rect(document.querySelector('.hero-art')),
   cards:[...document.querySelectorAll('.hero-stack-card')].map(rect),
   hero:rect(document.querySelector('.hero')),
   wordmark:rect(document.querySelector('.wordmark')),
   scrollWidth:document.documentElement.scrollWidth,
   windowWidth:window.innerWidth,
   count:document.querySelectorAll('.project-card').length,
   note:document.querySelector('.community-note')?.textContent||'',
   text:document.querySelector('[data-i18n="hero_eyebrow"]')?.textContent||''
  };
 });
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:browserPath,args:['--no-sandbox']});
 fs.mkdirSync('qa-shots',{recursive:true});
 try{
  for(const size of sizes){
   const context=await browser.newContext({viewport:{width:size.width,height:size.height},locale:'ru-RU',deviceScaleFactor:1});
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForSelector('.project-card');
   const ru=await capture(page);
   await page.screenshot({path:'qa-shots/'+size.name+'-ru.png',fullPage:false});
   await page.locator('.lang-btn[data-lang="en"]').click();
   await page.evaluate(()=>document.fonts.ready);
   const en=await capture(page);
   await page.screenshot({path:'qa-shots/'+size.name+'-en.png',fullPage:false});
   assert.equal(ru.lang,'ru');assert.equal(en.lang,'en');
   assert.equal(ru.count,15);assert.equal(en.count,15);
   assert.equal(ru.cards.length,3);assert.equal(en.cards.length,3);
   assert(ru.note.includes('NoToxicCommunity')&&en.note.includes('NoToxicCommunity'));
   assert(!ru.text.includes('НЕЗАВИСИМЫЙ')&&!en.text.includes('INDEPENDENT'));
   for(const key of ['width','height']){
    assert(Math.abs(ru.art[key]-en.art[key])<1,'art '+key+' differs on '+size.name);
    for(let i=0;i<3;i++) assert(Math.abs(ru.cards[i][key]-en.cards[i][key])<1,'card '+i+' '+key+' differs on '+size.name);
   }
   assert(ru.scrollWidth<=size.width+2,'RU horizontal overflow '+size.name+': '+ru.scrollWidth);
   assert(en.scrollWidth<=size.width+2,'EN horizontal overflow '+size.name+': '+en.scrollWidth);
   assert.equal(errors.length,0,errors.join(' ; '));
   console.log(size.name,JSON.stringify({ru:ru.cards.map(x=>({w:round(x.width),h:round(x.height)})),en:en.cards.map(x=>({w:round(x.width),h:round(x.height)})),art_ru:[round(ru.art.width),round(ru.art.height)],art_en:[round(en.art.width),round(en.art.height)],scroll_ru:ru.scrollWidth,scroll_en:en.scrollWidth}));
   await context.close();
  }
 }finally{await browser.close()}
})().catch(err=>{console.error(err.stack);process.exit(1)});
