import * as THREE from "three";
export const mat = (color, roughness=0.88, metalness=0) => new THREE.MeshStandardMaterial({color,roughness,metalness});
export function box(parent, name, size, position, material, cast=true, receive=true){
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name=name; mesh.position.set(...position); mesh.castShadow=cast; mesh.receiveShadow=receive; parent.add(mesh); return mesh;
}
export function cylinder(parent,name,rTop,rBottom,height,position,material,segments=16){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rTop,rBottom,height,segments),material);
  mesh.name=name;mesh.position.set(...position);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function sphere(parent,name,radius,position,material,scale=[1,1,1],segments=16){
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(radius,segments,12),material);
  mesh.name=name;mesh.position.set(...position);mesh.scale.set(...scale);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function labelSprite(text, color="#fff", bg="#24352e"){
  const canvas=document.createElement("canvas");canvas.width=512;canvas.height=128;
  const ctx=canvas.getContext("2d");ctx.fillStyle=bg;ctx.roundRect(8,8,496,112,22);ctx.fill();
  ctx.font="bold 48px Cairo, sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle=color;ctx.fillText(text,256,64);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
  sprite.scale.set(3.2,.8,1);return sprite;
}
