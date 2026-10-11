const fs=require('fs');const assert=require('assert/strict');
const {chromium}=require('playwright-core');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',
  args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:720,height:840},deviceScaleFactor:1});
  page.on('pageerror',x=>console.error('BROWSER',x.message));
  await page.goto('http://127.0.0.1:8765/scripts/skin-render.html',{waitUntil:'load'});
  await page.waitForFunction(()=>typeof window.drawOfficialSkinPose==='function',{timeout:25000});
  for(const pose of ['casual','stepping','greeting']){
   const data=await page.evaluate(name=>window.drawOfficialSkinPose(name),pose);
   assert(data.startsWith('data:image/png;base64,'));
   const bytes=Buffer.from(data.split(',')[1],'base64');
   assert(bytes.length>14000,'Render is too small/possibly blank');
   const path='assets/sheiny-candidate-'+pose+'.png';
   fs.writeFileSync(path,bytes);
   console.log('RENDER',pose,bytes.length,path);
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack);process.exit(1)});
