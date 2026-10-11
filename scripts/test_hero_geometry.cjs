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

   // Full visual-asset audit: all 13 verified images must actually decode in
   // Chromium, not merely appear as <img> URLs in the HTML source.
   const coverAudit=await page.evaluate(async()=>{
     const cards=[...document.querySelectorAll('.project-card')];
     const imgs=[...document.querySelectorAll('.project-card .cover-photo')];
     const results=await Promise.all(imgs.map(async el=>{
       el.loading='eager';
       try{await el.decode();}catch(_){}
       return {src:el.getAttribute('src'),loaded:el.complete&&el.naturalWidth>=300&&el.naturalHeight>=180,
         width:el.naturalWidth,height:el.naturalHeight};
     }));
     return {cards:cards.length,photos:imgs.length,results,
       missing:[...cards].filter(el=>!el.querySelector('.cover-photo')).map(el=>el.querySelector('h3')?.textContent)};
   });
   assert.equal(coverAudit.cards,15,'catalog must contain 15 packs');
   assert.equal(coverAudit.photos,13,'two packs intentionally have no verified photo');
   assert(coverAudit.results.every(x=>x.src.startsWith('./assets/')&&x.loaded),
     'Broken or undersized image: '+JSON.stringify(coverAudit.results.filter(x=>!x.loaded)));
   assert.deepEqual(coverAudit.missing.sort(),['Create: Mekanized','Solo Leveling: OVERLOAD'].sort());
   console.log('IMAGE AUDIT',size.name,JSON.stringify({total:coverAudit.cards,loaded:coverAudit.photos,
     missing:coverAudit.missing,smallest:coverAudit.results.map(x=>[x.width,x.height]).sort((a,b)=>a[0]-b[0])[0]}));

   // The previous bug was in the detail modal, not catalog cards.
   // Validate all 15 modal windows on desktop and mobile, RU and EN.
   async function testAllModals(lang){
     if(size.name!=='desktop' && size.name!=='phone')return;
     if(lang==='en')await page.locator('.lang-btn[data-lang="en"]').click();
     for(let i=0;i<15;i++){
       const card=page.locator('#project-grid .project-card').nth(i);
       const name=await card.locator('.card-title').innerText();
       const cardSrc=await card.locator('.cover-photo').count()
         ? await card.locator('.cover-photo').getAttribute('src') : null;
       await card.locator('.card-more').click();
       const dlg=page.locator('#project-dialog');
       await dlg.waitFor({state:'visible'});
       const state=await page.evaluate(async()=>{
         const dialog=document.querySelector('#project-dialog');
         const el=dialog.querySelector('.dialog-photo');
         if(el){try{await el.decode()}catch(e){}}
         const imageRect=el?.getBoundingClientRect();
         const wrapper=dialog.querySelector('.dialog-image').getBoundingClientRect();
         const style=el?getComputedStyle(el):null;
         return {
           title:dialog.querySelector('#dialog-title')?.textContent,
           photo:el?.getAttribute('src')||null,
           valid:!el || (!!el.complete && el.naturalWidth>=300 && el.naturalHeight>=180
                  && style.display!=='none' && style.visibility!=='hidden'
                  && imageRect.width>100 && imageRect.height>80
                  && imageRect.top>=wrapper.top-1 && imageRect.bottom<=wrapper.bottom+1),
           naturalWidth:el?.naturalWidth||0,
           naturalHeight:el?.naturalHeight||0
         }
       });
       assert.equal(state.title,name,'Modal title mismatch for '+name);
       assert.equal(state.photo,cardSrc,'Modal photo mismatch: '+name+' '+lang+' '+size.name);
       assert(state.valid,'Modal image failed to render: '+JSON.stringify(state));
       if(name==='Dread Reborn'||name==="waccyy's Fantasia"){
         await dlg.screenshot({path:'qa-shots/modal-'+size.name+'-'+lang+'-'+(name==='Dread Reborn'?'dread':'fantasia')+'.png'});
       }
       await page.locator('#dialog-close').click();
       await dlg.waitFor({state:'hidden'});
     }
     console.log('MODAL AUDIT',size.name,lang,'15/15; 13 decoded images, 2 intentional placeholders');
     if(lang==='en')await page.locator('.lang-btn[data-lang="ru"]').click();
   }
   await testAllModals('ru');
   await testAllModals('en');


   // Each portfolio item must go to its own verified translation product.
   const translationLinks=await page.locator('.project-card .translation-action').evaluateAll(els=>els.map(a=>a.href));
   assert.equal(translationLinks.length,15,'Missing per-pack translation links');
   assert.equal(new Set(translationLinks).size,15,'Duplicate pack translation link');
   assert(translationLinks.every(url=>url.startsWith('https://kennyminecraft.ru/translations/')),'Generic landing page link detected');
   console.log('DIRECT TRANSLATION LINKS',size.name,translationLinks.length);

   const ru=await capture(page);
   await page.screenshot({path:'qa-shots/'+size.name+'-ru.png',fullPage:false});
   // Regression: the Russian "Проекты" button must reveal the portfolio heading,
   // not the empty upper padding of its section.
   const ruNav=size.width>1180?'.quick-nav':'.mobile-dock';
   await page.locator(ruNav+' a[href="#work"]').click();
   await page.waitForTimeout(140);
   const ruLanding=await page.evaluate(()=>{
     const heading=document.querySelector('#work > .section-head').getBoundingClientRect();
     return {top:heading.top,bottom:heading.bottom,active:[...document.querySelectorAll('[data-section-link="work"]')].every(x=>x.classList.contains('active'))};
   });
   assert(ruLanding.active&&ruLanding.top>=-5&&ruLanding.top<=60,'Russian projects anchor landed in blank space: '+JSON.stringify(ruLanding));
   console.log('RU PROJECTS',size.name,JSON.stringify(ruLanding));
   await page.locator(ruNav+' a[href="#top"]').click();
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
   await page.waitForFunction(()=>[...document.querySelectorAll('.about-avatar .avatar-portrait')].length===1&&[...document.querySelectorAll('.about-avatar .avatar-portrait')].every(img=>img.complete&&img.naturalWidth>0),{timeout:20000});
   const artwork=await page.evaluate(()=>{
      const el=document.querySelector('.about-avatar'),rect=el.getBoundingClientRect();
      const img=[...el.querySelectorAll('img')].map(x=>{
         const c=document.createElement('canvas');c.width=1;c.height=1;
         const g=c.getContext('2d');g.drawImage(x,0,0);
         return {ok:x.complete&&x.naturalWidth>0,width:x.naturalWidth,height:x.naturalHeight,animationName:getComputedStyle(x).animationName,
                 alphaTopLeft:g.getImageData(0,0,1,1).data[3]};
       });
      return {w:rect.width,h:rect.height,img,scroll:document.documentElement.scrollWidth};
   });
   assert.equal(artwork.img.length,1);
   assert(artwork.img.every(x=>x.ok&&x.width>0&&x.height>0),'invalid skin artwork on '+size.name);
   assert(artwork.img.every(x=>x.alphaTopLeft<30),'portrait should have transparent edges: '+size.name+' '+JSON.stringify(artwork.img));
   assert.equal(artwork.img[0].animationName,'none','portrait should not have pose cycling');
   assert(artwork.scroll<=size.width+2,'About art overflows on '+size.name);
   await page.screenshot({path:'qa-shots/'+size.name+'-about-en.png',fullPage:false});
   // Anchor alignment: visible heading, not section top + internal top padding.
   const navSelector=size.width>1180?'.quick-nav':'.mobile-dock';
   for(const id of ['work','approach','about','contact']){
      await page.locator(navSelector+' a[href="#'+id+'"]').click();
      await page.waitForTimeout(240);
      const navState=await page.evaluate(id=>({
        target:id,hash:location.hash,y:scrollY,
        active:[...document.querySelectorAll('.quick-nav a.active,.mobile-dock a.active')].map(x=>x.dataset.sectionLink),
        all:[...document.querySelectorAll('[data-section-link="'+id+'"]')].map(x=>x.classList.contains('active'))
      }),id);
      console.log('NAV',size.name,JSON.stringify(navState));
      assert(navState.all.length===2&&navState.all.every(Boolean),'navigation active state mismatch '+JSON.stringify(navState));
      const check=await page.evaluate(id=>{
        const landmarks={work:document.querySelector('#work > .section-head'),approach:document.querySelector('#approach > .section-head'),about:document.querySelector('#about > .about-card'),contact:document.getElementById('contact')};
        const el=landmarks[id],r=el.getBoundingClientRect();
        return {top:r.top,bottom:r.bottom,viewport:window.innerHeight,scroll:scrollY,total:document.documentElement.scrollHeight};
      },id);
      assert(check.bottom>0&&check.top<check.viewport,'anchor did not reveal '+id+' on '+size.name+' '+JSON.stringify(check));
      if(id==='work'||id==='approach')assert(check.top>=-5&&check.top<=60,'anchor landed on blank padding for '+id+' on '+size.name+' '+JSON.stringify(check));
   }
   await page.evaluate(()=>{
      window.dispatchEvent(new WheelEvent('wheel',{deltaY:190,bubbles:true}));
      window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'});
   });
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
