export class Controls{
  constructor(player,renderer,onInteract){
    this.player=player;this.renderer=renderer;this.onInteract=onInteract;
    this.mobile=matchMedia("(max-width:700px)").matches||("ontouchstart" in window);
    this.pointerLocked=false;this.bindKeyboard();this.bindMouse();this.bindTouch();
    document.getElementById("mobile-controls").classList.toggle("hidden",!this.mobile);
  }
  bindKeyboard(){
    window.addEventListener("keydown",e=>{
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code))e.preventDefault();
      this.player.setKey(e.code,true);
      if(e.code==="KeyE"&&!e.repeat)this.onInteract();
    });
    window.addEventListener("keyup",e=>this.player.setKey(e.code,false));
  }
  bindMouse(){
    const canvas=this.renderer.domElement;
    canvas.addEventListener("click",()=>{if(!this.mobile&&document.pointerLockElement!==canvas)canvas.requestPointerLock?.();});
    document.addEventListener("pointerlockchange",()=>{this.pointerLocked=document.pointerLockElement===canvas;});
    document.addEventListener("mousemove",e=>{if(this.pointerLocked)this.player.look(e.movementX,e.movementY);});
  }
  bindTouch(){
    const canvas=this.renderer.domElement;let looking=false,lastX=0,lastY=0;
    canvas.addEventListener("pointerdown",e=>{if(!this.mobile)return;looking=true;lastX=e.clientX;lastY=e.clientY;});
    window.addEventListener("pointerup",()=>looking=false);
    window.addEventListener("pointermove",e=>{
      if(!looking||!this.mobile)return;
      const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;
      if(e.clientX>window.innerWidth*.27)this.player.look(dx,dy,.003);
    });
    const stick=document.getElementById("joystick"),knob=document.getElementById("joystick-knob");
    let active=false,center={x:0,y:0};
    stick.addEventListener("pointerdown",e=>{active=true;stick.setPointerCapture(e.pointerId);const r=stick.getBoundingClientRect();center={x:r.left+r.width/2,y:r.top+r.height/2};this.moveStick(e,center,knob);});
    stick.addEventListener("pointermove",e=>{if(active)this.moveStick(e,center,knob);});
    const end=()=>{active=false;this.player.move={x:0,y:0};knob.style.transform="translate(0,0)";};
    stick.addEventListener("pointerup",end);stick.addEventListener("pointercancel",end);
    document.getElementById("mobile-interact").addEventListener("click",()=>this.onInteract());
    const run=document.getElementById("mobile-run");
    run.addEventListener("pointerdown",()=>{this.player.running=true;run.classList.add("active");});
    ["pointerup","pointercancel","pointerleave"].forEach(ev=>run.addEventListener(ev,()=>{this.player.running=false;run.classList.remove("active");}));
  }
  moveStick(e,center,knob){
    let dx=e.clientX-center.x,dy=e.clientY-center.y;const len=Math.hypot(dx,dy),max=35;
    if(len>max){dx=dx/len*max;dy=dy/len*max;}
    knob.style.transform=`translate(${dx}px,${dy}px)`;
    this.player.move={x:dx/max,y:-dy/max};
  }
}
