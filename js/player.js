import * as THREE from "three";
import {CONFIG} from "./config.js";
export class Player{
  constructor(camera,renderer){
    this.camera=camera;this.renderer=renderer;this.position=new THREE.Vector3(0,0,7.5);
    this.yaw=0;this.pitch=0;this.keys={};this.move={x:0,y:0};this.running=false;
    this.camera.position.set(this.position.x,CONFIG.player.eyeHeight,this.position.z);
    this.hands=new THREE.Group();this.camera.add(this.hands);
    const skin=new THREE.MeshStandardMaterial({color:"#b47c5b",roughness:.8});
    const sleeve=new THREE.MeshStandardMaterial({color:"#d4c6a8",roughness:.9});
    for(const side of [-1,1]){
      const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.095,.38,4,8),sleeve);
      arm.position.set(side*.34,-.38,-.42);arm.rotation.z=side*.2;this.hands.add(arm);
      const hand=new THREE.Mesh(new THREE.SphereGeometry(.11,12,10),skin);
      hand.position.set(side*.36,-.58,-.43);hand.scale.set(1,.8,1.2);this.hands.add(hand);
    }
    this.hands.position.set(0,0,0);
  }
  setKey(code,down){this.keys[code]=down;}
  look(dx,dy,sensitivity=.0022){
    this.yaw-=dx*sensitivity;this.pitch-=dy*sensitivity;
    this.pitch=THREE.MathUtils.clamp(this.pitch,-1.25,1.25);
  }
  update(dt,colliders=[]){
    const forward=(this.keys.KeyW?1:0)-(this.keys.KeyS?1:0)+this.move.y;
    const strafe=(this.keys.KeyD?1:0)-(this.keys.KeyA?1:0)+this.move.x;
    const input=new THREE.Vector2(strafe,forward);if(input.length()>1)input.normalize();
    const speed=CONFIG.player.speed*(this.running||this.keys.ShiftLeft?CONFIG.player.sprint:1);
    const dx=(Math.sin(this.yaw)*input.y+Math.cos(this.yaw)*input.x)*speed*dt;
    const dz=(-Math.cos(this.yaw)*input.y+Math.sin(this.yaw)*input.x)*speed*dt;
    const nextX=this.position.x+dx,nextZ=this.position.z+dz;
    const r=CONFIG.player.radius;
    const blocked=(x,z)=>colliders.some(c=>x+r>c.minX&&x-r<c.maxX&&z+r>c.minZ&&z-r<c.maxZ);
    if(!blocked(nextX,this.position.z))this.position.x=THREE.MathUtils.clamp(nextX,-5.65,5.65);
    if(!blocked(this.position.x,nextZ))this.position.z=THREE.MathUtils.clamp(nextZ,-27,27);
    this.camera.position.set(this.position.x,CONFIG.player.eyeHeight,this.position.z);
    this.camera.rotation.order="YXZ";this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch;
    const bob=input.length()>.1?Math.sin(performance.now()*.012)*(this.running?.012:.006):0;
    this.hands.position.y=bob;
  }
}
