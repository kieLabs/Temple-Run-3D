(() => {
'use strict';
const root=document.getElementById('game-root');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9bb3a0);
scene.fog=new THREE.FogExp2(0x9bb3a0,.012);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,260);
camera.position.set(0,6.2,11.5);camera.lookAt(0,1.4,-9);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
renderer.outputEncoding=THREE.sRGBEncoding;
root.insertBefore(renderer.domElement,root.firstChild);
scene.add(new THREE.HemisphereLight(0xd9f0df,0x394333,1.05));
const sun=new THREE.DirectionalLight(0xffe5b4,2.1);sun.position.set(-22,36,18);sun.castShadow=true;
sun.shadow.mapSize.set(1536,1536);sun.shadow.camera.left=-24;sun.shadow.camera.right=24;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-25;sun.shadow.camera.far=100;sun.shadow.bias=-.00025;scene.add(sun);
const fill=new THREE.DirectionalLight(0x91b8ad,.55);fill.position.set(18,12,-24);scene.add(fill);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(240,320),new THREE.MeshStandardMaterial({color:0x344c32,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.position.set(0,-.55,-100);ground.receiveShadow=true;scene.add(ground);
const lanes=[-2.15,0,2.15], trackW=8.2, segLen=12, segments=[],items=[];
const roadMat=new THREE.MeshStandardMaterial({color:0x777663,roughness:.95});
const edgeMat=new THREE.MeshStandardMaterial({color:0x9c895c,roughness:.9});
for(let i=0;i<24;i++){
 const group=new THREE.Group();
 const road=new THREE.Mesh(new THREE.BoxGeometry(trackW,.38,segLen),roadMat);road.position.y=-.12;road.receiveShadow=true;group.add(road);
 for(const x of [-trackW/2+.08,trackW/2-.08]){const edge=new THREE.Mesh(new THREE.BoxGeometry(.12,.045,segLen),edgeMat);edge.position.set(x,.1,0);group.add(edge);}
 for(const x of [-1.08,1.08]){const line=new THREE.Mesh(new THREE.BoxGeometry(.035,.012,segLen*.72),new THREE.MeshStandardMaterial({color:0x4c5140,roughness:1}));line.position.set(x,.08,0);group.add(line);}
 if(i%2===0){
   group.add(buildTempleColumn(-5.2,0),buildTempleColumn(5.2,0));
   if(i%4===0){const lintel=new THREE.Mesh(new THREE.BoxGeometry(11,.48,.65),PBR_MATS.darkStone);lintel.position.set(0,4.7,0);lintel.castShadow=true;group.add(lintel);}
 }
 if(i%1===0){group.add(buildTree(-8.2-Math.random()*2,0,.9+Math.random()*.35));group.add(buildTree(8.2+Math.random()*2,0,.9+Math.random()*.35));}
 group.position.z=-i*segLen;scene.add(group);segments.push(group);
}
const player=buildRunner();player.position.set(0,0,3);scene.add(player);
const shield=new THREE.Mesh(new THREE.SphereGeometry(1.35,24,18),new THREE.MeshPhysicalMaterial({color:0x63e9e3,transparent:true,opacity:.19,roughness:.1,metalness:.1,emissive:0x0b7773,emissiveIntensity:.35}));shield.position.y=1.25;shield.visible=false;player.add(shield);
const ui={hud:document.getElementById('hud'),start:document.getElementById('start-screen'),pause:document.getElementById('pause-screen'),over:document.getElementById('gameover'),score:document.getElementById('score'),coins:document.getElementById('coins'),shield:document.getElementById('shield'),finalScore:document.getElementById('final-score'),finalCoins:document.getElementById('final-coins'),mobile:document.getElementById('mobile-controls'),toast:document.getElementById('toast')};
let state='ready',lane=1,score=0,coinCount=0,speed=13,worldTravel=0,spawnAt=25,jumpTime=0,slideTime=0,shieldTime=0,toastTimer=0,last=0,runTime=0;
function showToast(message){ui.toast.textContent=message;ui.toast.classList.add('show');toastTimer=1.2;}
function setState(next){state=next;ui.start.classList.toggle('hidden',next!=='ready');ui.pause.classList.toggle('hidden',next!=='paused');ui.over.classList.toggle('hidden',next!=='over');ui.hud.classList.toggle('hidden',next==='ready');ui.mobile.classList.toggle('hidden',next!=='running');}
function clearItems(){for(const o of items)scene.remove(o);items.length=0;}
function addItem(type,x,z){let obj;if(type==='coin')obj=buildCoin();else if(type==='shield'){obj=new THREE.Mesh(new THREE.OctahedronGeometry(.48,1),PBR_MATS.blue);}else obj=buildObstacle(type);obj.position.set(x,type==='coin'?1.18:type==='shield'?1.35:0,z);obj.userData={type,laneX:x,passed:false};scene.add(obj);items.push(obj);}
function spawnPattern(z){
 const laneIndex=Math.floor(Math.random()*3),r=Math.random(),x=lanes[laneIndex];
 if(r<.48){for(let i=0;i<6;i++)addItem('coin',x,z-i*1.65);}
 else if(r<.68)addItem('jump',x,z);
 else if(r<.84)addItem('slide',x,z);
 else addItem('shield',x,z);
 // occasional coin trail in an adjacent lane keeps choices readable
 if(Math.random()<.35){const other=lanes[(laneIndex+1+Math.floor(Math.random()*2))%3];for(let i=0;i<4;i++)addItem('coin',other,z-5-i*1.65);}
}
function startRun(){clearItems();lane=1;score=0;coinCount=0;speed=13;worldTravel=0;spawnAt=24;jumpTime=0;slideTime=0;shieldTime=0;player.position.set(0,0,3);player.scale.set(1,1,1);shield.visible=false;ui.score.textContent='0';ui.coins.textContent='0';ui.shield.textContent='OFF';segments.forEach((s,i)=>s.position.z=-i*segLen);for(let z=-24;z>-145;z-=18)spawnPattern(z);spawnAt=145;setState('running');}
function move(dir){if(state==='running')lane=Math.max(0,Math.min(2,lane+dir));}
function jump(){if(state==='running'&&jumpTime<=0&&slideTime<=0)jumpTime=.78;}
function slide(){if(state==='running'&&slideTime<=0&&jumpTime<=0)slideTime=.72;}
function action(a){if(a==='left')move(-1);if(a==='right')move(1);if(a==='jump')jump();if(a==='slide')slide();}
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();if(e.code==='ArrowLeft'||e.code==='KeyA')action('left');if(e.code==='ArrowRight'||e.code==='KeyD')action('right');if(e.code==='ArrowUp'||e.code==='Space'||e.code==='KeyW')action('jump');if(e.code==='ArrowDown'||e.code==='KeyS')action('slide');if(e.code==='Escape'&&state==='running')pause();else if(e.code==='Escape'&&state==='paused')resume();});
ui.mobile.querySelectorAll('button').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();action(b.dataset.action);}));
let touchStart=null;renderer.domElement.addEventListener('touchstart',e=>{if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
renderer.domElement.addEventListener('touchend',e=>{if(!touchStart)return;const t=e.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;if(Math.max(Math.abs(dx),Math.abs(dy))>28){if(Math.abs(dx)>Math.abs(dy))action(dx>0?'right':'left');else action(dy<0?'jump':'slide');}touchStart=null;},{passive:true});
function pause(){if(state==='running')setState('paused');}function resume(){if(state==='paused')setState('running');}
document.getElementById('start-btn').addEventListener('click',startRun);document.getElementById('again-btn').addEventListener('click',startRun);document.getElementById('pause-btn').addEventListener('click',pause);document.getElementById('resume-btn').addEventListener('click',resume);
function endRun(){setState('over');ui.finalScore.textContent=Math.floor(score);ui.finalCoins.textContent=coinCount;}
function collect(obj,index){scene.remove(obj);items.splice(index,1);if(obj.userData.type==='coin'){coinCount++;ui.coins.textContent=coinCount;}else{shieldTime=8;shield.visible=true;ui.shield.textContent='8s';showToast('SHIELD ACTIVATED');}}
function update(dt){
 runTime+=dt;score+=dt*speed*.8;speed=Math.min(25,13+score*.004);ui.score.textContent=Math.floor(score);
 const travel=speed*dt;worldTravel+=travel;
 segments.forEach(seg=>{seg.position.z+=travel;if(seg.position.z>segLen*2){seg.position.z-=segLen*segments.length;}});
 const targetX=lanes[lane];player.position.x+=(targetX-player.position.x)*Math.min(1,dt*12);
 if(jumpTime>0){jumpTime=Math.max(0,jumpTime-dt);const p=1-jumpTime/.78;player.position.y=Math.sin(p*Math.PI)*2.05;}
 else player.position.y=0;
 if(slideTime>0){slideTime=Math.max(0,slideTime-dt);player.scale.y=.48;}else player.scale.y=1;
 const phase=runTime*13;player.userData.legL.rotation.x=Math.sin(phase)*.72;player.userData.legR.rotation.x=-Math.sin(phase)*.72;player.userData.armL.rotation.x=-Math.sin(phase)*.55;player.userData.armR.rotation.x=Math.sin(phase)*.55;
 player.position.y+=Math.sin(phase*2)*.025;
 if(shieldTime>0){shieldTime=Math.max(0,shieldTime-dt);shield.visible=true;shield.rotation.y+=dt*1.8;ui.shield.textContent=Math.ceil(shieldTime)+'s';}else{shield.visible=false;ui.shield.textContent='OFF';}
 if(worldTravel>spawnAt){spawnPattern(-150);spawnAt+=18+Math.random()*7;}
 for(let i=items.length-1;i>=0;i--){const o=items[i];o.position.z+=travel;if(o.userData.type==='coin'||o.userData.type==='shield'){o.rotation.y+=dt*2.6;o.rotation.z+=dt*.8;}
 const dz=Math.abs(o.position.z-player.position.z),dx=Math.abs(o.position.x-player.position.x);
 if(dz<1.05&&dx<.95){
   if(o.userData.type==='coin'||o.userData.type==='shield'){collect(o,i);continue;}
   const safe=o.userData.type==='jump'?jumpTime>.22:slideTime>.18;
   if(!safe){if(shieldTime>0){shieldTime=0;shield.visible=false;ui.shield.textContent='OFF';scene.remove(o);items.splice(i,1);showToast('SHIELD BLOCKED HIT');continue;}endRun();return;}
   scene.remove(o);items.splice(i,1);continue;
 }
 if(o.position.z>12){scene.remove(o);items.splice(i,1);}
 }
 if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)ui.toast.classList.remove('show');}
}
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.04,(now-last)/1000||0);last=now;if(state==='running')update(dt);renderer.render(scene,camera);}
function resize(){const w=innerWidth,h=innerHeight;camera.aspect=w/h;camera.fov=w/h<.72?68:58;camera.position.set(0,w/h<.72?6.8:6.2,w/h<.72?13:11.5);camera.lookAt(0,1.35,-9);camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.setSize(w,h);}
window.addEventListener('resize',resize);resize();requestAnimationFrame(frame);
})();
