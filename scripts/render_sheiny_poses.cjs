const fs=require('fs');
const assert=require('assert/strict');
const {chromium}=require('playwright-core');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',
    args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:440,height:520},deviceScaleFactor:1});
    page.on('pageerror',e=>console.error('BROWSER ERROR:',e.message));
    await page.goto('http://127.0.0.1:8765/scripts/skin-render.html',{waitUntil:'load'});
    await page.waitForFunction(()=>typeof window.drawOfficialSkinPortrait==='function',{timeout:25000});
    const data=await page.evaluate(()=>window.drawOfficialSkinPortrait());
    assert(data.startsWith('data:image/png;base64,'),'Expected PNG portrait');
    const buffer=Buffer.from(data.split(',')[1],'base64');
    assert(buffer.length>9000,'Portrait seems blank');
    const file='assets/sheiny-portrait.png';
    fs.writeFileSync(file,buffer);
    console.log('PORTRAIT:',file,'bytes:',buffer.length);
  }finally{await browser.close()}
})().catch(e=>{console.error(e.stack);process.exit(1)});
