import * as THREE from "three";
import {box,cylinder,sphere,mat,labelSprite} from "./utils.js";

const materials={
  asphalt:mat("#353b39"),sidewalk:mat("#aaa18c"),sand:mat("#b7a78c"),wall:mat("#c9b99d"),
  cream:mat("#e6d9bf"),brick:mat("#a56f50"),dark:mat("#26332e"),glass:new THREE.MeshStandardMaterial({color:"#9cc4c2",roughness:.18,metalness:.35,transparent:true,opacity:.48}),
  metal:mat("#626b67",.38,.7),wood:mat("#76543a"),green:mat("#45644d"),red:mat("#9c4637"),yellow:mat("#d5b15e")
};

function makeBuilding(scene,x,z,w,d,h,baseColor,seed=0){
  const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  const wallMat=mat(baseColor), trim=mat("#e4d6bd"), shadow=mat("#554c40"), glass=materials.glass;
  box(g,"building-shell",[w,h,d],[0,h/2,0],wallMat);
  box(g,"roof-parapet",[w+.18,.32,d+.18],[0,h+.08,0],trim);
  const floors=Math.max(1,Math.floor((h-1.2)/2.8));
  const cols=Math.max(2,Math.floor(w/1.7));
  for(let f=0;f<floors;f++){
    for(let c=0;c<cols;c++){
      const wx=-w/2+(c+.5)*w/cols, wy=1.55+f*2.8;
      box(g,"window-recess",[.98,1.45,.09],[wx,wy,-d/2-.055],shadow,false);
      box(g,"window-glass",[.82,1.23,.07],[wx,wy,-d/2-.12],glass,false);
      box(g,"window-sill",[1.08,.12,.18],[wx,wy-.78,-d/2-.12],trim);
      box(g,"window-top",[1.08,.1,.16],[wx,wy+.78,-d/2-.12],trim);
      box(g,"window-divider",[.055,1.25,.09],[wx,wy,-d/2-.17],materials.metal,false);
      if((c+f+seed)%3===0){
        box(g,"balcony-floor",[1.18,.1,.5],[wx,wy-.82,-d/2-.28],trim);
        for(let k=0;k<5;k++)cylinder(g,"balcony-rail",.025,.025,.65,[wx-.5+k*.25,wy-.48,-d/2-.48],materials.metal,8).rotation.x=Math.PI/2;
      }
    }
  }
  for(let i=0;i<Math.floor(w/2);i++){
    box(g,"shop-shutter",[1.7,1.9,.13],[-w/2+1+i*2,1,-d/2-.1],materials.wood);
  }
  return g;
}

function makeShop(scene){
  const g=new THREE.Group();g.position.set(0,0,-5.2);scene.add(g);
  const plaster=mat("#d8c6a3"), tile=mat("#b8a78b"), dark=mat("#26342e"), glass=materials.glass;
  // Shop shell and open front
  box(g,"shop-floor",[9,.18,8],[0,.09,0],tile);
  box(g,"back-wall",[9,3.6,.25],[0,1.8,-3.85],plaster);
  box(g,"left-wall",[.25,3.6,7.5],[-4.38,1.8,0],plaster);
  box(g,"right-wall",[.25,3.6,7.5],[4.38,1.8,0],plaster);
  box(g,"front-left-pillar",[.28,3.6,.28],[-4.35,1.8,3.75],plaster);
  box(g,"front-right-pillar",[.28,3.6,.28],[4.35,1.8,3.75],plaster);
  box(g,"front-header",[8.8,.35,.3],[0,3.45,3.75],plaster);
  // Front glass panels and doorway
  box(g,"left-glass",[2.9,2.8,.07],[-2.75,1.8,3.72],glass,false);
  box(g,"right-glass",[2.9,2.8,.07],[2.75,1.8,3.72],glass,false);
  box(g,"door-frame-left",[.12,3,.16],[-.78,1.5,3.76],materials.metal);
  box(g,"door-frame-right",[.12,3,.16],[.78,1.5,3.76],materials.metal);
  const door=box(g,"shop-door",[1.42,2.85,.09],[0,1.48,3.7],glass,false);door.userData.interaction="door";
  box(g,"door-handle",[.055,.42,.08],[.53,1.45,3.62],materials.yellow);
  // Sign and canopy
  box(g,"sign-board",[7.8,.9,.28],[0,4.05,3.78],dark);
  const sign=labelSprite("كُشري المعلم","#f1d18b","#26372f");sign.position.set(0,4.06,3.96);sign.scale.set(4.4,.78,1);g.add(sign);
  box(g,"awning",[9,.18,1.05],[0,3.12,4.25],materials.red);
  for(let i=0;i<9;i++)box(g,"awning-stripe",[.5,.025,1.04],[-4.25+i*1.06,3.21,4.25],i%2?materials.cream:materials.red,false);
  // Interior details
  box(g,"counter-base",[4.8,1.15,.85],[0,.68,-1.65],materials.wood);
  box(g,"counter-top",[5,.16,1],[0,1.32,-1.65],mat("#d4c3a0",.45));
  box(g,"cash-register",[.65,.42,.48],[-1.5,1.62,-1.65],materials.dark);
  box(g,"register-screen",[.48,.27,.035],[-1.5,1.72,-1.39],mat("#6faaa0",.3));
  const register=box(g,"cash-register-interaction",[.9,.8,.8],[-1.5,1.6,-1.6],new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false}),false,false);
  register.userData.interaction="register";
  // Kitchen line and equipment
  box(g,"kitchen-worktop",[3.3,.16,.8],[2.3,1.25,-2.8],mat("#a8aaa2",.35,.5));
  for(let i=0;i<3;i++){
    cylinder(g,"cooking-pot",.38,.42,.52,[1.15+i*1.1,1.62,-2.8],materials.metal,24);
    cylinder(g,"pot-rim",.42,.42,.07,[1.15+i*1.1,1.9,-2.8],materials.dark,24);
    cylinder(g,"pot-lid",.32,.32,.05,[1.15+i*1.1,1.96,-2.8],materials.metal,24);
    sphere(g,"lid-knob",.08,[1.15+i*1.1,2.03,-2.8],materials.dark);
  }
  box(g,"fridge",[.9,2.1,.85],[3.75,1.05,-.1],mat("#c8d0cb",.32,.35));
  box(g,"fridge-handle",[.07,.75,.08],[3.25,1.1,.34],materials.metal);
  // tables and stools
  for(let i=0;i<2;i++){
    const x=-2.6+i*1.5,z=.5;
    cylinder(g,"table-top",.55,.55,.12,[x,.85,z],materials.wood,24);
    cylinder(g,"table-pedestal",.09,.12,.68,[x,.48,z],materials.metal,12);
    for(let a=0;a<3;a++){const ang=a*Math.PI*2/3;cylinder(g,"stool-seat",.24,.24,.12,[x+Math.cos(ang)*.82,.55,z+Math.sin(ang)*.82],materials.red,16);}
  }
  return {group:g,interactives:[door,register]};
}

function makeTree(scene,x,z){
  const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  cylinder(g,"trunk",.19,.26,2.2,[0,1.1,0],mat("#6b4d36"),10);
  sphere(g,"foliage",1.1,[0,2.45,0],mat("#49664b"),[1,1.15,1],14);
  sphere(g,"foliage",.75,[-.58,2.25,.1],mat("#58764f"),[1,1,1],12);
  sphere(g,"foliage",.72,[.55,2.3,-.08],mat("#3f5b43"),[1,1,1],12);
}
function makeHuman(scene,x,z,shirt,pants,seed=0){
  const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  const skin=mat(seed%2?"#9a6548":"#bd8967"), top=mat(shirt), bottom=mat(pants), hair=mat("#302720"), shoe=mat("#292d2b");
  // torso, neck, head and facial details
  const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.25,.55,4,8),top);torso.position.y=1.12;torso.castShadow=true;g.add(torso);
  cylinder(g,"neck",.09,.1,.18,[0,1.52,0],skin,10);
  sphere(g,"head",.22,[0,1.78,0],skin,[.86,1.08,.88],14);
  sphere(g,"hair",.225,[0,1.91,-.015],hair,[.9,.48,.9],12);
  sphere(g,"nose",.055,[0,1.76,.2],skin,[.7,1,.7],8);
  for(const sx of [-.085,.085])sphere(g,"eye",.022,[sx,1.8,.19],mat("#252522"),[1,1,1],8);
  // arms and legs with pivot groups
  const limbs=[];
  for(const side of [-1,1]){
    const arm=new THREE.Group();arm.position.set(side*.28,1.35,0);g.add(arm);
    cylinder(arm,"upper-arm",.105,.12,.48,[0,-.24,0],top,10);
    sphere(arm,"hand",.095,[0,-.52,.02],skin,[.85,1,.8],8);
    const leg=new THREE.Group();leg.position.set(side*.13,.72,0);g.add(leg);
    cylinder(leg,"trouser-leg",.12,.1,.65,[0,-.28,0],bottom,10);
    sphere(leg,"shoe",.12,[-.025,-.62,.07],shoe,[.9,.55,1.5],8);
    limbs.push({arm,leg,phase:side*Math.PI});
  }
  g.userData.limbs=limbs;g.userData.phase=seed*.9;g.userData.baseZ=z;
  return g;
}

export function createWorld(scene){
  scene.background=new THREE.Color("#9db7b6");
  scene.fog=new THREE.Fog("#a9b7ad",24,72);
  const hemi=new THREE.HemisphereLight("#dce8e5","#5c5141",2.0);scene.add(hemi);
  const sun=new THREE.DirectionalLight("#ffe4b4",2.6);sun.position.set(-12,22,10);sun.castShadow=true;
  sun.shadow.mapSize.set(1536,1536);sun.shadow.camera.left=-32;sun.shadow.camera.right=32;sun.shadow.camera.top=32;sun.shadow.camera.bottom=-32;sun.shadow.bias=-.0003;scene.add(sun);
  const ground=box(scene,"ground",[90,.2,90],[0,-.16,0],materials.sand,false);
  box(scene,"road",[13,.12,58],[0,-.04,0],materials.asphalt,false);
  // Sidewalks and curb stones
  for(const side of [-1,1]){
    box(scene,"sidewalk",[5,.22,58],[side*9,.02,0],materials.sidewalk,false);
    for(let z=-28;z<29;z+=1.8)box(scene,"curb-stone",[.25,.25,1.72],[side*6.45,.13,z],mat("#d4c8ae"),false);
    for(let z=-26;z<27;z+=8){
      makeBuilding(scene,side*12.8,z,8.5,7,8.2+(Math.abs(z)%3),z%2?"#b58e6d":"#cbbca1",Math.abs(z));
    }
  }
  // road markings and manholes
  for(let z=-25;z<27;z+=6)box(scene,"lane-marking",[.12,.018,2.6],[0,.035,z],mat("#d7c69c"),false,false);
  cylinder(scene,"manhole",.48,.48,.025,[4,.035,6],mat("#666a63"),24);
  // shop is at street-side block; entrance faces the road
  const shop=makeShop(scene);
  // lamps, bins, trees, signboards
  for(const side of [-1,1]){
    for(let z=-21;z<=22;z+=14){
      cylinder(scene,"lamp-pole",.055,.08,5,[side*5.55,2.5,z],materials.metal,10);
      const arm=box(scene,"lamp-arm",[.75,.07,.07],[side*5.2,4.75,z],materials.metal);arm.rotation.z=side*.12;
      sphere(scene,"lamp-head",.19,[side*4.85,4.62,z],mat("#f4dca0",.3),[1,.5,1],10);
      makeTree(scene,side*8.1,z+3);
    }
  }
  // parked compact vehicles: rounded body and wheels, not block placeholders
  const car=makeCar(scene,-3.9,-11);
  const scooter=makeScooter(scene,4.9,13);
  // pedestrians
  const people=[
    makeHuman(scene,-5.1,4,"#3d6670","#393a35",1),
    makeHuman(scene,5.1,-2,"#b27a3d","#393a35",2),
    makeHuman(scene,-5.15,18,"#7d5146","#353b38",3),
    makeHuman(scene,5.1,-19,"#55704e","#41403a",4)
  ];
  return {shop,people,colliders:[
    // Back wall, side walls, and two front glass sections; leave the doorway clear.
    {minX:-4.55,maxX:4.55,minZ:-9.2,maxZ:-8.85},
    {minX:-4.65,maxX:-4.25,minZ:-8.9,maxZ:-1.4},
    {minX:4.25,maxX:4.65,minZ:-8.9,maxZ:-1.4},
    {minX:-4.5,maxX:-.85,minZ:-1.65,maxZ:-1.35},
    {minX:.85,maxX:4.5,minZ:-1.65,maxZ:-1.35}
  ],interactives:shop.interactives};
}

function makeCar(scene,x,z){
  const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  const body=mat("#6f7771",.42,.25),window=materials.glass,black=mat("#202522");
  const shell=new THREE.Mesh(new THREE.CapsuleGeometry(.62,.95,5,12),body);shell.rotation.z=Math.PI/2;shell.scale.set(1.15,.72,1.35);shell.position.y=.75;shell.castShadow=true;g.add(shell);
  const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.2,.65,1.45),window);cabin.position.set(0,1.25,-.05);cabin.castShadow=true;g.add(cabin);
  for(const side of [-1,1])for(const zz of [-.72,.72])cylinder(g,"wheel",.31,.31,.18,[side*.63,.38,zz],black,16).rotation.z=Math.PI/2;
  for(const side of [-1,1])box(g,"headlight",[.22,.16,.06],[side*.36,.72,1.1],mat("#eadcb0"),false);
}
function makeScooter(scene,x,z){
  const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  const black=mat("#222925"),red=mat("#a94737"),metal=materials.metal;
  for(const zz of [-.58,.55])cylinder(g,"scooter-wheel",.27,.27,.13,[0,.3,zz],black,18).rotation.x=Math.PI/2;
  const frame=new THREE.Mesh(new THREE.CapsuleGeometry(.19,.72,4,8),red);frame.rotation.x=Math.PI/2;frame.position.set(0,.75,-.03);g.add(frame);
  box(g,"seat",[.5,.14,.65],[0,1.1,-.28],black);
  cylinder(g,"handlebar",.055,.055,.8,[0,1.35,.48],metal,10).rotation.z=Math.PI/2;
  sphere(g,"headlight",.16,[0,1.08,.54],mat("#f2d99b",.3),[1,.8,.55],12);
}
export function animatePeople(people,time){
  for(const p of people){
    const phase=time*2+p.userData.phase;
    p.position.z=p.userData.baseZ+Math.sin(time*.38+p.userData.phase)*.85;
    p.rotation.y=Math.sin(time*.38+p.userData.phase)*.3;
    for(const limb of p.userData.limbs){limb.arm.rotation.x=Math.sin(phase+limb.phase)*.22;limb.leg.rotation.x=Math.sin(phase+limb.phase)*.32;}
  }
}
