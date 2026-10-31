import {CONFIG} from "./config.js";
export const SaveSystem={
  save(data){
    try{localStorage.setItem(CONFIG.saveKey,JSON.stringify({...data,savedAt:new Date().toISOString()}));return true;}
    catch(e){console.error("Save failed",e);return false;}
  },
  load(){
    try{const raw=localStorage.getItem(CONFIG.saveKey);return raw?JSON.parse(raw):null;}
    catch(e){console.error("Load failed",e);return null;}
  },
  clear(){localStorage.removeItem(CONFIG.saveKey);}
};
