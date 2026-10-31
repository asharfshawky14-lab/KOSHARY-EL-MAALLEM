import * as THREE from "three";
export class Interaction{
  constructor(camera,scene,interactives,showHint,openDialog){
    this.camera=camera;this.scene=scene;this.interactives=interactives;this.showHint=showHint;this.openDialog=openDialog;
    this.raycaster=new THREE.Raycaster();this.raycaster.far=3.2;this.current=null;
  }
  update(){
    this.raycaster.setFromCamera(new THREE.Vector2(0,0),this.camera);
    const hits=this.raycaster.intersectObjects(this.interactives,true);
    let found=null;
    for(const h of hits){let o=h.object;while(o&&!o.userData.interaction)o=o.parent;if(o?.userData.interaction){found=o;break;}}
    this.current=found;
    this.showHint(found?this.label(found.userData.interaction):null);
  }
  label(type){return type==="door"?"افتح باب المحل":type==="register"?"افحص الكاشير":"تفاعل";}
  use(){
    if(!this.current)return;
    const type=this.current.userData.interaction;
    if(type==="door"){
      const door=this.current;
      door.userData.isOpen=!door.userData.isOpen;
      door.rotation.y=door.userData.isOpen?-.95:0;
      this.openDialog("باب المحل",door.userData.isOpen?"فتحت باب المحل. تقدر تدخل وتستكشف المكان.":"قفلت باب المحل.",[{label:"تمام",action:()=>{}}]);
    }
    if(type==="register")this.openDialog("الكاشير","الكاشير موجود في مكانه. نظام تسجيل الطلبات وحساب الفاتورة هيتربط في مرحلة الطلبات، ومش هنعتبره شغال قبل ما يبقى له نظام فعلي.",[{label:"إغلاق",action:()=>{}}]);
  }
}
