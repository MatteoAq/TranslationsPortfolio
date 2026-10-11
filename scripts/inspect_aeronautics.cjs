const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const page=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  await page.goto('https://kennyminecraft.ru/all_of_aeronautics/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(1000);
  console.log('GEOMETRY',JSON.stringify(await page.evaluate(()=>({height:document.documentElement.scrollHeight,
    headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>({text:e.textContent.trim().slice(0,90),y:Math.round(e.getBoundingClientRect().top+scrollY)})).slice(0,100)}))));
  console.log('REFERENCES',JSON.stringify(await page.evaluate(()=>{
    const terms=/команд|создател|участник|персонаж|рендер|team|staff|skin|avatar|character|crew/i;
    return [...document.querySelectorAll('body *')].filter(e=>e.children.length<4 && terms.test(e.textContent||'')).slice(0,25).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,140),cls:String(e.className).slice(0,90)}));
  })));
  console.log('IMAGES',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('img')].map(e=>({src:e.currentSrc||e.src,alt:e.alt,y:Math.round(e.getBoundingClientRect().top+scrollY)})))));
  console.log('BGS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('*')].map(e=>{const v=getComputedStyle(e).backgroundImage;return v&&v!=='none'?{cls:String(e.className).slice(0,100),bg:v,y:Math.round(e.getBoundingClientRect().top+scrollY)}:null}).filter(Boolean).slice(0,70))));
  for(const y of [1600,3200,4800,6400,8000,10000]){
   await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(350);
   await page.screenshot({path:'qa-shots/aero-'+y+'.jpg',type:'jpeg',quality:75,fullPage:false});
   console.log('FRAME',y,'realY',await page.evaluate(()=>scrollY));
  }
 }finally{await b.close()}
})().catch(e=>{console.error(e.stack);process.exit(1)});
