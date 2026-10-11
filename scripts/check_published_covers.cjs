const {chromium}=require('playwright-core');
const fs=require('fs');
const assert=require('assert/strict');
const url='https://matteoaq.github.io/TranslationsPortfolio/?asset-audit=20261011-v22';
(async()=>{
  fs.mkdirSync('qa-shots',{recursive:true});
  const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
  const failedRequests=[],badResponses=[],pageErrors=[],results=[];
  try{
    for(const viewport of [{width:1440,height:900,label:'desktop'},{width:390,height:844,label:'mobile'}]){
      const ctx=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},locale:'ru-RU',serviceWorkers:'block'});
      const page=await ctx.newPage();
      page.on('requestfailed',r=>failedRequests.push({url:r.url(),reason:r.failure()?.errorText}));
      page.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),status:r.status()})});
      page.on('pageerror',e=>pageErrors.push(e.message));
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:50000});
      await page.locator('.project-card').first().waitFor();
      // The audit must inspect the newly deployed version, not a previous Pages cache.
      let isLatest = false;
      for(let n=0;n<15;n++){
        isLatest=(await page.locator('#sheiny-inline-app-v22').count())===1;
        if(isLatest)break;
        await page.waitForTimeout(2400);
        await page.reload({waitUntil:'domcontentloaded'});
      }
      assert(isLatest,'Published GitHub Pages has not deployed v22');
      console.log('DEPLOYED VERSION',viewport.label,'v22');
      // Force images to load even when below the fold.
      const initial=await page.evaluate(async()=>{
        const cards=[...document.querySelectorAll('#project-grid .project-card')];
        return await Promise.all(cards.map(async(card,i)=>{
          const title=card.querySelector('h3')?.textContent||'';
          const img=card.querySelector('img.cover-photo');
          if(!img)return {title,index:i,noImage:true};
          img.loading='eager';
          try{await img.decode()}catch(e){}
          const st=getComputedStyle(img),rect=img.getBoundingClientRect();
          return {title,index:i,src:img.currentSrc,ok:img.complete&&img.naturalWidth>0&&st.display!=='none',
            status:{complete:img.complete,width:img.naturalWidth,height:img.naturalHeight,display:st.display,visibility:st.visibility,opacity:st.opacity,rectWidth:rect.width,rectHeight:rect.height}};
        }))
      });
      await page.screenshot({path:'qa-shots/production-'+viewport.label+'-catalog.png',fullPage:true,timeout:40000});
      for(const lang of ['ru','en']){
        if(lang==='en')await page.locator('.lang-btn[data-lang="en"]').click();
        const after=await page.evaluate(async()=>{
          const cards=[...document.querySelectorAll('#project-grid .project-card')];
          return await Promise.all(cards.map(async(card,i)=>{
            const title=card.querySelector('h3')?.textContent||'';
            const img=card.querySelector('img.cover-photo');
            if(!img)return {title,index:i,noImage:true};
            img.loading='eager';
            try{await img.decode()}catch(e){}
            const st=getComputedStyle(img),rect=img.getBoundingClientRect();
            return {title,index:i,src:img.currentSrc,ok:img.complete&&img.naturalWidth>0&&st.display!=='none',
              status:{complete:img.complete,width:img.naturalWidth,height:img.naturalHeight,display:st.display,opacity:st.opacity,rectWidth:rect.width,rectHeight:rect.height}};
          }))
        });
        results.push({size:viewport.label,lang,images:after});
        if(viewport.label==='desktop' && lang==='en')await page.screenshot({path:'qa-shots/production-desktop-en.png',fullPage:true,timeout:40000});
      }
      if(viewport.label==='desktop'){
        await page.locator('#project-grid .project-card').filter({hasText:"waccyy's Fantasia"}).locator('.card-more').click();
        await page.locator('.dialog-photo').waitFor({state:'visible'});
        await page.screenshot({path:'qa-shots/production-modal-fantasia.png'});
      }
      await ctx.close();
      console.log('INITIAL',viewport.label,JSON.stringify(initial));
    }
    fs.writeFileSync('qa-shots/production-cover-audit.json',JSON.stringify({url,results,failedRequests,badResponses,pageErrors},null,2));
    console.log('RESULTS',JSON.stringify(results));
    console.log('FAILED_REQUESTS',JSON.stringify(failedRequests));
    console.log('BAD_RESPONSES',JSON.stringify(badResponses));
    console.log('PAGE_ERRORS',JSON.stringify(pageErrors));
    const problems=results.flatMap(x=>x.images.filter(i=>!i.noImage&&!i.ok).map(i=>({...i,size:x.size,lang:x.lang})));
    if(problems.length)throw Error('Published images failed to display: '+JSON.stringify(problems));
    if(badResponses.some(x=>/assets\//.test(x.url)))throw Error('Image assets reported HTTP errors');
  } finally {await browser.close()}
})().catch(e=>{console.error('FAILED',e.stack);process.exit(1)});
