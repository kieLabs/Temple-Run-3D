// Procedural PBR surfaces: no external texture files required.
function makeNoiseTexture(base, specks, count=1800) {
  const c=document.createElement('canvas'); c.width=c.height=512;
  const x=c.getContext('2d'); x.fillStyle=base; x.fillRect(0,0,512,512);
  for(let i=0;i<count;i++){const a=.08+Math.random()*.22;x.fillStyle=specks.replace('ALPHA',a.toFixed(2));const s=1+Math.random()*5;x.fillRect(Math.random()*512,Math.random()*512,s,s);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;
}
const stoneTexture=makeNoiseTexture('#777565','rgba(30,27,20,ALPHA)',2600);
const barkTexture=makeNoiseTexture('#493321','rgba(8,5,2,ALPHA)',1300);
const PBR_MATS={
 stone:new THREE.MeshStandardMaterial({map:stoneTexture,roughness:.91,bumpMap:stoneTexture,bumpScale:.045}),
 darkStone:new THREE.MeshStandardMaterial({color:0x45483b,roughness:.95}),
 moss:new THREE.MeshStandardMaterial({color:0x435c39,roughness:1}),
 bark:new THREE.MeshStandardMaterial({map:barkTexture,roughness:.96,bumpMap:barkTexture,bumpScale:.06}),
 leaves:new THREE.MeshStandardMaterial({color:0x254b2c,roughness:.88}),
 gold:new THREE.MeshStandardMaterial({color:0xf4bd38,metalness:.82,roughness:.24,emissive:0x382000,emissiveIntensity:.15}),
 cloth:new THREE.MeshStandardMaterial({color:0x9b4e27,roughness:.82}),
 pants:new THREE.MeshStandardMaterial({color:0x26302c,roughness:.9}),
 skin:new THREE.MeshStandardMaterial({color:0xb97851,roughness:.72}),
 leather:new THREE.MeshStandardMaterial({color:0x342319,roughness:.85}),
 blue:new THREE.MeshStandardMaterial({color:0x54d8d0,metalness:.45,roughness:.2,emissive:0x063d3a,emissiveIntensity:.7}),
 fire:new THREE.MeshStandardMaterial({color:0xff682c,emissive:0xff3c08,emissiveIntensity:1.6,roughness:.35})
};
