export class UI{
  constructor(){
    this.hud=document.getElementById("hud");this.hint=document.getElementById("interaction-hint");
    this.hintText=document.getElementById("hint-text");this.dialog=document.getElementById("dialog");
    this.toastEl=document.getElementById("toast");this.money=1500;this.minute=0;
  }
  showHUD(){this.hud.classList.remove("hidden");}
  hintTextFor(text){if(text){this.hintText.textContent=text;this.hint.classList.remove("hidden");}else this.hint.classList.add("hidden");}
  openDialog(title,body,actions=[]){
    document.getElementById("dialog-title").textContent=title;document.getElementById("dialog-body").textContent=body;
    const holder=document.getElementById("dialog-actions");holder.innerHTML="";
    for(const item of actions){const b=document.createElement("button");b.textContent=item.label;b.addEventListener("click",()=>{item.action?.();this.closeDialog();});holder.appendChild(b);}
    this.dialog.classList.remove("hidden");
  }
  closeDialog(){this.dialog.classList.add("hidden");}
  toast(message){
    this.toastEl.textContent=message;this.toastEl.classList.remove("hidden");
    clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>this.toastEl.classList.add("hidden"),2300);
  }
  updateClock(dt){
    this.minute+=dt*2.5;const total=9*60+Math.floor(this.minute),h=Math.floor(total/60)%24,m=total%60;
    document.getElementById("clock").textContent=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
  }
  setMoney(amount){this.money=amount;document.getElementById("money").textContent=`${amount.toLocaleString("ar-EG")} ج`;}
}
