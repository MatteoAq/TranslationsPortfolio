import {SkinViewer} from 'skinview3d';

// A selection of carefully restrained, asymmetrical promotional poses,
// rendered only from the official Minecraft skin of Sheiny__.
// No borrowed team artwork, props, blocks, or artificial props.
const POSES = {
  casual:{
    yaw:-0.57,lean:-0.045,
    headYaw:0.24,headPitch:-0.055,headTilt:0.024,
    rightArmZ:-0.29,leftArmZ:0.18,
    rightArmX:-0.26,leftArmX:0.21,
    leftLegX:-0.19,rightLegX:0.29
  },
  stepping:{
    yaw:-0.48,lean:0.026,
    headYaw:0.21,headPitch:-0.09,headTilt:-0.032,
    rightArmZ:-0.14,leftArmZ:0.26,
    rightArmX:0.45,leftArmX:-0.45,
    leftLegX:0.36,rightLegX:-0.38
  },
  greeting:{
    yaw:-0.52,lean:-0.05,
    headYaw:0.33,headPitch:-0.055,headTilt:0.035,
    rightArmZ:-0.55,leftArmZ:0.16,
    rightArmX:-0.93,leftArmX:0.11,
    leftLegX:0.12,rightLegX:-0.18
  }
};
window.drawOfficialSkinPose=async function(name){
 const p=POSES[name];if(!p)throw new Error('Invalid pose '+name);
 const viewer=new SkinViewer({
  canvas:document.getElementById('skin'),
  width:720,height:840,enableControls:false,
  preserveDrawingBuffer:true,background:null,renderPaused:true,zoom:0.79
 });
 viewer.renderer.setClearColor(0x000000,0);
 try{
  await viewer.loadSkin('/assets/sheiny-official-skin.png');
  const skin=viewer.playerObject.skin;
  viewer.playerWrapper.rotation.y=p.yaw;
  viewer.playerObject.rotation.z=p.lean;
  skin.head.rotation.y=p.headYaw;
  skin.head.rotation.x=p.headPitch;
  skin.head.rotation.z=p.headTilt;
  skin.rightArm.rotation.z=p.rightArmZ;
  skin.rightArm.rotation.x=p.rightArmX;
  skin.leftArm.rotation.z=p.leftArmZ;
  skin.leftArm.rotation.x=p.leftArmX;
  skin.leftLeg.rotation.x=p.leftLegX;
  skin.rightLeg.rotation.x=p.rightLegX;
  viewer.cameraLight.intensity=0.95;
  viewer.globalLight.intensity=2.3;
  viewer.render();
  await new Promise(resolve=>setTimeout(resolve,120));
  viewer.render();
  return viewer.canvas.toDataURL('image/png');
 } finally{viewer.dispose()}
};
