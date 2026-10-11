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
   const context=await browser.newContext({viewport:{width:size.width,height:size.height},locale:'ru-RU',deviceScaleFactor:1,reducedMotion:'reduce'});
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
   await page.locator('.about-avatar').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>[...document.querySelectorAll('.about-avatar .avatar-pose')].every(img=>img.complete&&img.naturalWidth>0),{timeout:20000});
   const artwork=await page.evaluate(()=>{
      const el=document.querySelector('.about-avatar'),rect=el.getBoundingClientRect();
      const img=[...el.querySelectorAll('img')].map(x=>{
         const c=document.createElement('canvas');c.width=1;c.height=1;
         const g=c.getContext('2d');g.drawImage(x,0,0);
         return {ok:x.complete&&x.naturalWidth>0,width:x.naturalWidth,height:x.naturalHeight,animation:getComputedStyle(x).animationDuration,
                 alphaTopLeft:g.getImageData(0,0,1,1).data[3]};
       });
      return {w:rect.width,h:rect.height,img,scroll:document.documentElement.scrollWidth};
   });
   assert.equal(artwork.img.length,3);
   assert(artwork.img.every(x=>x.ok&&x.width>0&&x.height>0),'invalid skin artwork on '+size.name);
   assert(artwork.img.every(x=>x.alphaTopLeft<30),'skin artwork must have transparent edges: '+size.name+' '+JSON.stringify(artwork.img));
   assert(artwork.scroll<=size.width+2,'About art overflows on '+size.name);
   await page.screenshot({path:'qa-shots/'+size.name+'-about-en.png',fullPage:false});
   // Anchor alignment: visible heading, not section top + internal top padding.
   const navSelector=size.width>1180?'.quick-nav':'.mobile-dock';
   for(const id of ['work','approach','about','contact']){
      await page.locator(navSelector+' a[href="#'+id+'"]').click();
      await page.waitForFunction(name => [...document.querySelectorAll('[data-section-link="'+name+'"]')].every(el=>el.classList.contains('active')),id);
      const check=await page.evaluate(id=>{
        const landmarks={work:document.querySelector('#work > .section-head'),approach:document.querySelector('#approach > .section-head'),about:document.querySelector('#about > .about-card'),contact:document.getElementById('contact')};
        const el=landmarks[id],r=el.getBoundingClientRect();
        return {top:r.top,bottom:r.bottom,viewport:window.innerHeight,scroll:scrollY,total:document.documentElement.scrollHeight};
      },id);
      assert(check.bottom>0&&check.top<check.viewport,'anchor did not reveal '+id+' on '+size.name+' '+JSON.stringify(check));
      if(id==='work'||id==='approach')assert(check.top>=-5&&check.top<=60,'anchor landed on blank padding for '+id+' on '+size.name+' '+JSON.stringify(check));
   }
   await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-section-link="contact"]')].every(el=>el.classList.contains('active')));
   assert.equal(await page.locator(navSelector+' a[href="#contact"]').getAttribute('aria-current'),'location');
   // Deep linking and browser back navigation should preserve target alignment.
   await page.locator(navSelector+' a[href="#work"]').click();
   await page.waitForFunction(()=>window.location.hash==='#work');
   await page.goBack();
   await page.waitForFunction(()=>window.location.hash==='#contact');
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-section-link="contact"]')].every(el=>el.classList.contains('active')));
   assert.equal(errors.length,0,errors.join(' ; '));
   console.log('ABOUT',size.name,JSON.stringify(artwork));
   console.log(size.name,JSON.stringify({ru:ru.cards.map(x=>({w:round(x.width),h:round(x.height)})),en:en.cards.map(x=>({w:round(x.width),h:round(x.height)})),art_ru:[round(ru.art.width),round(ru.art.height)],art_en:[round(en.art.width),round(en.art.height)],scroll_ru:ru.scrollWidth,scroll_en:en.scrollWidth}));
   await context.close();
  }
 }finally{await browser.close()}
})().catch(err=>{console.error(err.stack);process.exit(1)});
