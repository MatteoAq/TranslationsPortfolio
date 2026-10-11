import {SkinViewer} from 'skinview3d';
import * as THREE from 'three';


function buildTexture(style,face,seed){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=16;
  const ctx=canvas.getContext('2d'); let st=seed;
  const rand=()=>{st=(st*1664525+1013904223)>>>0;return st/4294967296};
  const base={grass:[102,76,49],stone:[124,129,144],copper:[171,103,64]}[style];
  for(let y=0;y<16;y++) for(let x=0;x<16;x++){
    const v=(rand()-.5)*55, shade=(x+y)%5===0?-8:0;
    let c=base.map(n=>Math.max(15,Math.min(245,Math.round(n+v+shade))));
    if(style==='grass' && (face===2 || (face!==3 && y<2+(x%3===0?1:0)))){
      c=[72+rand()*39,124+rand()*49,48+rand()*20].map(n=>Math.round(n));
    } else if(style==='stone' && rand()>.91){
      c=c.map(n=>Math.min(245,n+20));
    } else if(style==='copper' && rand()>.91){
      c=[65+rand()*35,131+rand()*30,122+rand()*20].map(n=>Math.round(n));
    }
    ctx.fillStyle='rgb('+c.join(',')+')';ctx.fillRect(x,y,1,1);
  }
  const t=new THREE.CanvasTexture(canvas);
  t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.colorSpace=THREE.SRGBColorSpace;
  return t;
}
function buildBlock(style,x,y){
 const mesh=new THREE.Mesh(
   new THREE.BoxGeometry(11,11,11),
   [0,1,2,3,4,5].map(i=>new THREE.MeshStandardMaterial({map:buildTexture(style,i,23+i*31),roughness:1}))
 );
 mesh.position.set(x,y,-1);
 mesh.rotation.y=.32;
 mesh.rotation.x=-.1;
 const edges=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),
   new THREE.LineBasicMaterial({color:0x221822,transparent:true,opacity:.36}));
 mesh.add(edges);return mesh;
}

window.drawOfficialSkinPose=async function(pose){
 const canvas=document.getElementById('skin');
 const viewer=new SkinViewer({canvas,width:440,height:520,enableControls:false,preserveDrawingBuffer:true,background:null,renderPaused:true,zoom:0.80});
 viewer.renderer.setClearColor(0x000000,0);
 await viewer.loadSkin('/assets/sheiny-official-skin.png');
 const body=viewer.playerObject.skin;
 viewer.playerWrapper.rotation.y=-.30;
 body.head.rotation.y=.13;
 viewer.cameraLight.intensity=0.75;
 viewer.globalLight.intensity=2.6;
 const config={
  lean:{block:'grass',x:-14,y:-10,bodyZ:-.065,armZ:-.52,armX:-.12,otherArmX:.14,legX:0.08,turn:-.25},
  quest:{block:'stone',x:14,y:-10,bodyZ:.025,armZ:.12,armX:-1.1,otherArmX:-.58,legX:-.16,turn:.32},
  tech:{block:'copper',x:-14,y:-10,bodyZ:-.04,armZ:-.72,armX:-.75,otherArmX:.25,legX:.2,turn:-.20}
 }[pose];
 if(!config) throw Error('Unknown pose '+pose);
 viewer.playerWrapper.rotation.y=config.turn;
 viewer.playerObject.rotation.z=config.bodyZ;
 body.rightArm.rotation.z=config.armZ;
 body.rightArm.rotation.x=config.armX;
 body.leftArm.rotation.x=config.otherArmX;
 body.leftLeg.rotation.x=config.legX;
 body.rightLeg.rotation.x=-config.legX;
 viewer.scene.add(buildBlock(config.block,config.x,config.y));
 viewer.render();
 await new Promise(resolve=>setTimeout(resolve,200));
 viewer.render();
 const result=canvas.toDataURL('image/png');
 viewer.dispose();
 return result;
};
