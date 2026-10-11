import {SkinViewer} from 'skinview3d';

// A single restrained, balanced standing pose. No blocks or accessories.
// The texture is downloaded from the official Sheiny__ Mojang account.
window.drawOfficialSkinPortrait=async function(){
  const canvas=document.getElementById('skin');
  const viewer=new SkinViewer({
    canvas,
    width:440,
    height:520,
    enableControls:false,
    preserveDrawingBuffer:true,
    background:null,
    renderPaused:true,
    zoom:0.80
  });
  viewer.renderer.setClearColor(0x000000,0);
  try {
    await viewer.loadSkin('/assets/sheiny-official-skin.png');
    const character=viewer.playerObject.skin;
    // Subtle three-quarter stance without unnatural shoulder contortions.
    viewer.playerWrapper.rotation.y=-0.20;
    viewer.playerObject.rotation.z=0.008;
    character.head.rotation.y=0.09;
    character.head.rotation.x=-0.035;
    character.rightArm.rotation.z=-0.07;
    character.leftArm.rotation.z=0.055;
    character.rightArm.rotation.x=-0.14;
    character.leftArm.rotation.x=0.12;
    character.rightLeg.rotation.x=0.08;
    character.leftLeg.rotation.x=-0.07;
    viewer.cameraLight.intensity=0.82;
    viewer.globalLight.intensity=2.45;
    viewer.render();
    await new Promise(resolve=>setTimeout(resolve,200));
    viewer.render();
    return canvas.toDataURL('image/png');
  } finally {
    viewer.dispose();
  }
};
