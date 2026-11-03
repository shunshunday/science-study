(function(){
 const URL="https://tmgfcmzufamxuzsuedza.supabase.co";
 const KEY="sb_publishable_2hmdBWipev_2go57lH7wdA_fpHAP-Ng";
 const db=window.rikakidsSupabaseClient||window.supabase.createClient(URL,KEY);
 let userId=null,timer=null,lastTick=0,wasActive=false,pending=0,syncing=null;
 const key=id=>"rikakids-playtime-pending-"+id;
 const active=()=>document.visibilityState==="visible"&&document.hasFocus();
 async function sync(){
  if(!userId||syncing)return;
  const id=userId;
  syncing=(async()=>{
   while(userId===id&&pending>0){
    const amount=Math.min(30,pending);
    const {error}=await db.rpc("increment_playtime",{p_seconds:amount});
    if(error){console.error("プレイ時間の保存に失敗:",error);break;}
    pending-=amount;
    try{localStorage.setItem(key(id),String(pending));}catch(e){}
   }
  })();
  try{await syncing;}finally{syncing=null;}
 }
 function flush(force=false){
  if(!userId||!lastTick)return;
  const now=Date.now(),nowActive=active();
  if(nowActive||(force&&wasActive)){
   const seconds=Math.min(30,Math.max(0,Math.floor((now-lastTick)/1000)));
   if(seconds){pending+=seconds;try{localStorage.setItem(key(userId),String(pending));}catch(e){}sync();}
  }
  lastTick=now;wasActive=nowActive;
 }
 async function start(id){
  if(!id||userId===id)return;
  stop();
  userId=id;
  try{pending=Math.max(0,Math.floor(Number(localStorage.getItem(key(id))||0)));}catch(e){pending=0;}
  try{
   const oldKey="rikakids-playtime-"+id,old=Number(localStorage.getItem(oldKey)||0);
   if(old>0){const {error}=await db.rpc("import_legacy_playtime",{p_seconds:Math.min(604800,Math.floor(old))});if(error)throw error;localStorage.removeItem(oldKey);}
  }catch(e){console.error("以前のプレイ時間の移行に失敗:",e);}
  lastTick=Date.now();wasActive=active();sync();
  timer=setInterval(()=>flush(),10000);
 }
 function stop(){
  flush();
  sync();
  if(timer)clearInterval(timer);
  timer=null;userId=null;lastTick=0;wasActive=false;pending=0;
 }
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flush(true);else{lastTick=Date.now();wasActive=active();}});
 window.addEventListener("focus",()=>{lastTick=Date.now();wasActive=active();});
 window.addEventListener("blur",()=>flush(true));
 window.addEventListener("pagehide",()=>flush(true));
 db.auth.getSession().then(({data})=>{if(data.session)start(data.session.user.id);});
 db.auth.onAuthStateChange((event,session)=>{if(session)start(session.user.id);else stop();});
})();