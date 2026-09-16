const text = document.querySelector("#text");
const counter = document.querySelector("#counter");
const result = document.querySelector("#result");
const codeEl = document.querySelector("#code");
const statusEl = document.querySelector("#status");

function setStatus(msg, ok=false){
  statusEl.textContent = msg;
  statusEl.className = "status " + (ok ? "ok" : "err");
}
function makeCode(){
  const chars="0123456789";
  return Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}
text.addEventListener("input",()=>counter.textContent=`${text.value.length.toLocaleString()} / 10,000`);

document.querySelector("#clearBtn").onclick=()=>{
  text.value=""; counter.textContent="0 / 10,000"; result.classList.add("hidden"); setStatus("");
};

document.querySelector("#shareBtn").onclick=async()=>{
  const value=text.value.trim();
  if(!value){setStatus("Paste or type some text first.");return;}
  const code=makeCode();
  const clips=JSON.parse(localStorage.getItem("quickclips")||"{}");
  clips[code]={text:value,created:Date.now()};
  localStorage.setItem("quickclips",JSON.stringify(clips));
  codeEl.textContent=code; result.classList.remove("hidden");
  setStatus("Clip created on this browser. For cross-device sharing, connect the API backend.",true);
};

document.querySelector("#copyBtn").onclick=async()=>{
  await navigator.clipboard.writeText(codeEl.textContent);
  setStatus("Clip code copied.",true);
};

document.querySelector("#openBtn").onclick=()=>{
  const code=document.querySelector("#codeInput").value.trim();
  const clips=JSON.parse(localStorage.getItem("quickclips")||"{}");
  if(!clips[code]){setStatus("Clip not found on this browser.");return;}
  text.value=clips[code].text;
  counter.textContent=`${text.value.length.toLocaleString()} / 10,000`;
  setStatus("Clip opened.",true);
  window.scrollTo({top:document.querySelector(".card").offsetTop-20,behavior:"smooth"});
};

document.querySelector("#themeBtn").onclick=()=>{
  document.body.classList.toggle("dark");
  document.querySelector("#themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾";
};

// Lightweight hero animation: one clip travels Copy -> Sync -> Paste.
function initSyncAnimation(){
  const clip=document.querySelector("#syncClip");
  const ping=document.querySelector(".sync-ping");
  const track=document.querySelector(".sync-track");
  if(!clip || !ping || !track) return;

  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const runFallback=()=>{
    clip.style.transform="translate3d(0,-50%,0)";
    clip.style.opacity=".9";
  };

  if(reduced || !window.gsap){runFallback();return;}

  let paused=false;
  const travel=Math.max(1, track.clientWidth-clip.offsetWidth);
  const tl=gsap.timeline({repeat:-1,repeatDelay:.35});

  tl.set(clip,{x:0,yPercent:-50,opacity:0,scale:.96})
    .to(clip,{opacity:1,duration:.18,ease:"power2.out"})
    .to(clip,{x:travel*.48,duration:.48,ease:"power2.inOut"})
    .to(clip,{x:travel,duration:.48,ease:"power2.inOut"})
    .to(ping,{opacity:.85,scale:1.5,duration:.1,ease:"power2.out"},"-=.08")
    .to(ping,{opacity:0,scale:3,duration:.34,ease:"power2.out"})
    .to(clip,{opacity:0,scale:.96,duration:.16,ease:"power2.in"},"-=.25");

  document.addEventListener("visibilitychange",()=>{
    if(document.hidden && !paused){tl.pause();paused=true;}
    else if(!document.hidden && paused){tl.resume();paused=false;}
  });
}

if(document.readyState === "loading"){
  window.addEventListener("DOMContentLoaded",initSyncAnimation,{once:true});
}else{
  initSyncAnimation();
}
