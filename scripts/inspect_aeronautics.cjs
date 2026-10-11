const {chromium}=require('playwright-core');
const fs=require('fs');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const page=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const url='https://kennyminecraft.ru/all_of_aeronautics/';
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(1900);
  console.log('REFERENCE PAGE',await page.title());
  console.log('MAIN',JSON.stringify((await page.locator('main').allTextContents()).slice(0,2).map(x=>x.slice(0,300))));
  await page.screenshot({path:'qa-shots/aeronautics-reference.jpg',type:'jpeg',quality:88,fullPage:false});
  console.log('SAVED REF',fs.statSync('qa-shots/aeronautics-reference.jpg').size);
  console.log('BACKGROUNDS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('*')].filter(x=>{const r=x.getBoundingClientRect();return r.width>120&&r.height>140 && r.y<1100}).map(x=>({cls:String(x.className).slice(0,80),bg:getComputedStyle(x).backgroundImage})).filter(x=>x.bg&&x.bg!=='none').slice(0,15))));
 }finally{await b.close()}
})().catch(e=>{console.error('REF ERROR',e.message);process.exit(1)});
