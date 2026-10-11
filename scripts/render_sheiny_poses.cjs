const fs=require('fs');
const assert=require('assert/strict');
const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
  try{
    const page=await b.newPage({viewport:{width:440,height:520},deviceScaleFactor:1});
    page.on('console',m=>console.log('BROWSER',m.text()));
    page.on('pageerror',m=>console.error('BROWSER ERROR',m.message));
    await page.goto('http://127.0.0.1:8765/scripts/skin-render.html',{waitUntil:'load'});
    await page.waitForFunction(()=>typeof window.drawOfficialSkinPose==='function',{timeout:25000});
    for(const pose of ['lean','quest','tech']){
      const data=await page.evaluate(async name=>window.drawOfficialSkinPose(name),pose);
      assert(data.startsWith('data:image/png;base64,'));
      const img=Buffer.from(data.split(',')[1],'base64');
      assert(img.byteLength>7000,'blank image '+pose+' '+img.length);
      const name='assets/sheiny-pose-'+pose+'.png';
      fs.writeFileSync(name,img);
      console.log('POSE '+pose+' '+name+' '+img.length+' bytes');
    }
  } finally{await b.close()}
})().catch(e=>{console.error(e.stack);process.exit(1)});
