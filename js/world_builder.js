function addMesh(parent,geo,mat,x=0,y=0,z=0,cast=true){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;parent.add(m);return m;}
// Three.js r128 core has no CapsuleGeometry. Compose capsules from native meshes.
function addCapsule(parent,radius,straightHeight,mat,x=0,y=0,z=0){
 const pivot=new THREE.Group();pivot.position.set(x,y,z);
 const shaft=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,straightHeight,12,1),mat);
 shaft.castShadow=true;shaft.receiveShadow=true;pivot.add(shaft);
 const capGeo=new THREE.SphereGeometry(radius,12,10);
 const top=new THREE.Mesh(capGeo,mat);top.position.y=straightHeight/2;top.castShadow=true;top.receiveShadow=true;pivot.add(top);
 const bottom=new THREE.Mesh(capGeo,mat);bottom.position.y=-straightHeight/2;bottom.castShadow=true;bottom.receiveShadow=true;pivot.add(bottom);
 parent.add(pivot);return pivot;
}
function buildRunner(){
 const g=new THREE.Group();
 const torso=addCapsule(g,.38,.68,PBR_MATS.cloth,0,1.45,0);
 const pack=addMesh(g,new THREE.BoxGeometry(.52,.66,.28),PBR_MATS.leather,0,1.55,.32);
 const head=addMesh(g,new THREE.SphereGeometry(.29,18,14),PBR_MATS.skin,0,2.18,0);
 const hair=addMesh(g,new THREE.SphereGeometry(.3,16,10,0,Math.PI*2,0,Math.PI*.48),PBR_MATS.leather,0,2.31,-.015);
 const limbMat=PBR_MATS.cloth, legMat=PBR_MATS.pants;
 const armL=addCapsule(g,.105,.55,limbMat,-.48,1.42,0);
 const armR=addCapsule(g,.105,.55,limbMat,.48,1.42,0);
 const legL=addCapsule(g,.13,.58,legMat,-.2,.53,0);
 const legR=addCapsule(g,.13,.58,legMat,.2,.53,0);
 g.userData={armL,armR,legL,legR,head,torso};return g;
}
function buildTree(x,z,scale=1){
 const g=new THREE.Group();addMesh(g,new THREE.CylinderGeometry(.22*scale,.42*scale,4.4*scale,9),PBR_MATS.bark,0,2.2*scale,0);
 for(let i=0;i<4;i++){const crown=addMesh(g,new THREE.IcosahedronGeometry((1.25-i*.12)*scale,1),PBR_MATS.leaves,(Math.random()-.5)*.5*scale,(4.3+i*.35)*scale,(Math.random()-.5)*.5*scale);crown.scale.y=.65;}
 g.position.set(x,0,z);return g;
}
function buildTempleColumn(x,z){
 const g=new THREE.Group();addMesh(g,new THREE.BoxGeometry(.85,4.4,.9),PBR_MATS.stone,0,2.2,0);
 addMesh(g,new THREE.BoxGeometry(1.15,.28,1.18),PBR_MATS.darkStone,0,4.45,0);
 addMesh(g,new THREE.BoxGeometry(1.05,.22,1.08),PBR_MATS.darkStone,0,.12,0);
 g.position.set(x,0,z);return g;
}
function buildCoin(){
 const g=new THREE.Group();const coin=addMesh(g,new THREE.CylinderGeometry(.34,.34,.09,24),PBR_MATS.gold,0,0,0);
 coin.rotation.x=Math.PI/2;addMesh(g,new THREE.TorusGeometry(.24,.035,6,20),PBR_MATS.gold,0,0,.055);
 return g;
}
function buildObstacle(type){
 const g=new THREE.Group();
 if(type==='jump'){
   addMesh(g,new THREE.BoxGeometry(1.5,.72,1),PBR_MATS.darkStone,0,.38,0);
   addMesh(g,new THREE.BoxGeometry(1.7,.12,1.12),PBR_MATS.stone,0,.8,0);
   for(let i=-1;i<=1;i++)addMesh(g,new THREE.ConeGeometry(.12,.3,7),PBR_MATS.fire,i*.48,1.05,0,false);
 }else{
   addMesh(g,new THREE.BoxGeometry(1.8,.22,.22),PBR_MATS.bark,0,2.05,0);
   for(let x of [-.78,.78])addMesh(g,new THREE.CylinderGeometry(.1,.14,2.1,8),PBR_MATS.darkStone,x,1.02,0);
 }
 return g;
}
