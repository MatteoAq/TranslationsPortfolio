import {SkinViewer} from 'skinview3d';
import * as THREE from 'three';

const styles = {
 grass: { right:0x6e4d31,left:0x6a4327,top:0x5aa25a,front:0x785437,back:0x745235,bottom:0x58432b},
 stone: {right:0x767d90,left:0x657189,top:0x9ca2b2,front:0x858ca3,back:0x707990,bottom:0x697084},
 copper:{right:0xa55f3f,left:0x865132,top:0xcd8c5b,front:0xb97946,back:0x975a39,bottom:0x865132}
};
function buildBlock(style,x,y){
 const c=styles[style],mesh=new THREE.Mesh(
   new THREE.BoxGeometry(11,11,11),
   [c.right,c.left,c.top,c.bottom,c.front,c.back].map(color=>new THREE.MeshStandardMaterial({color,roughness:1}))
 );
 mesh.position.set(x,y,-1);
 const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color:0x17101b,transparent:true,opacity:.22}));
 mesh.add(edges);
 return mesh;
}
window.drawOfficialSkinPose=async function(pose){
 const canvas=document.getElementById('skin');
 const viewer=new SkinViewer({canvas,width:440,height:520,enableControls:false,preserveDrawingBuffer:true,background:null,renderPaused:true,zoom:1.15});
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
