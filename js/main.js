import * as THREE from "three";
import {createWorld,animatePeople} from "./world.js";
import {Player} from "./player.js";
import {Controls} from "./controls.js";
import {Interaction} from "./interaction.js";
import {UI} from "./ui.js";
import {SaveSystem} from "./save-system.js";

const loading=document.getElementById("loading"),progress=document.getElementById("loading-progress");
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.08,120);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
document.getElementById("game-root").prepend(renderer.domElement);

const ui=new UI();
let world,player,controls,interaction,started=false,paused=false,dayMode=true;
const clock=new THREE.Clock();

function openDialog(title,body,actions){ui.openDialog(title,body,actions);}
function setPaused(value){
  paused=value;document.getElementById("pause-screen").classList.toggle("hidden",!paused);
  document.exitPointerLock?.();ui.hintTextFor(null);
}
function startGame(){
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("pause-screen").classList.add("hidden");
  ui.showHUD();started=true;paused=false;
  if(!controls.mobile)renderer.domElement.requestPointerLock?.();
  const saved=SaveSystem.load();
  if(saved?.player){player.position.set(saved.player.x,0,saved.player.z);player.yaw=saved.player.yaw||0;}
  ui.toast("أهلاً بيك في شارع المعلم");
}
function saveGame(){
  const ok=SaveSystem.save({player:{x:player.position.x,z:player.position.z,yaw:player.yaw},money:ui.money});
  ui.toast(ok?"تم حفظ تقدمك على الجهاز":"حصلت مشكلة أثناء الحفظ");
}
function init(){
  progress.style.width="35%";
  world=createWorld(scene);
  progress.style.width="65%";
  player=new Player(camera,renderer);
  controls=new Controls(player,renderer,()=>interaction?.use());
  interaction=new Interaction(camera,scene,world.interactives,t=>ui.hintTextFor(t),openDialog);
  progress.style.width="90%";
  document.getElementById("start-button").addEventListener("click",startGame);
  document.getElementById("pause-button").addEventListener("click",()=>setPaused(true));
  document.getElementById("resume-button").addEventListener("click",()=>setPaused(false));
  document.getElementById("save-button").addEventListener("click",saveGame);
  document.getElementById("back-menu-button").addEventListener("click",()=>{saveGame();setPaused(false);started=false;ui.hud.classList.add("hidden");document.getElementById("start-screen").classList.remove("hidden");});
  document.getElementById("dialog-close").addEventListener("click",()=>ui.closeDialog());
  document.getElementById("dialog").addEventListener("click",e=>{if(e.target.id==="dialog")ui.closeDialog();});
  progress.style.width="100%";setTimeout(()=>loading.classList.add("hidden"),300);
}
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.04),elapsed=clock.elapsedTime;
  if(started&&!paused&&!ui.dialog.classList.contains("hidden")){
    // Dialog pauses player movement while keeping the scene rendered.
  }else if(started&&!paused){
    player.update(dt,world.colliders);interaction.update();ui.updateClock(dt);
    animatePeople(world.people,elapsed);
  }else{
    animatePeople(world.people,elapsed*.35);
  }
  renderer.render(scene,camera);
}
window.addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&started&&!paused)setPaused(true);});
init();animate();
