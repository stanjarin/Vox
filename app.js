const VALUES=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const SUITS=['C','H','S','D'];
const ITEM_H=76;
let phase=0, selectedIndex=8, captured=[]; // start on 9
let drag=false, yStart=0, yLast=0, tLast=0, velocity=0, offset=0, raf=0;
const spin=document.getElementById('spin'), track=document.getElementById('track'), echo=document.getElementById('echo');

function options(){return phase%2===0?VALUES:SUITS}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function maxIndex(){return options().length-1}
function baseOffsetFor(i){return -i*ITEM_H}

function buildTrack(){
  track.innerHTML='';
  options().forEach(v=>{
    const d=document.createElement('div'); d.className='witem'; d.textContent=v; track.appendChild(d);
  });
  selectedIndex=clamp(selectedIndex,0,maxIndex());
  offset=baseOffsetFor(selectedIndex);
  track.style.transform=`translateY(${offset}px)`;
  echo.textContent=captured.join('  ');
}

function rubber(pos){
  const min=baseOffsetFor(maxIndex()), max=0;
  if(pos>max) return max+(pos-max)*0.28;
  if(pos<min) return min+(pos-min)*0.28;
  return pos;
}
function setOffset(v){offset=v;track.style.transform=`translateY(${v}px)`}

function snapTo(index, withBounce=true){
  cancelAnimationFrame(raf);
  selectedIndex=clamp(index,0,maxIndex());
  const target=baseOffsetFor(selectedIndex);
  if(withBounce && (selectedIndex===0 || selectedIndex===maxIndex())){
    const overshoot=selectedIndex===0?10:-10;
    track.animate([
      {transform:`translateY(${offset}px)`},
      {transform:`translateY(${target+overshoot}px)`,offset:.72},
      {transform:`translateY(${target}px)`}
    ],{duration:300,easing:'cubic-bezier(.18,.89,.32,1.18)'});
    setTimeout(()=>setOffset(target),300);
  }else{
    const anim=track.animate([{transform:`translateY(${offset}px)`},{transform:`translateY(${target}px)`}],
      {duration:230,easing:'cubic-bezier(.22,.61,.36,1)'});
    anim.onfinish=()=>setOffset(target);
  }
}

function releaseMomentum(v){
  cancelAnimationFrame(raf);
  let pos=offset, vel=v; const min=baseOffsetFor(maxIndex()), max=0;
  let last=performance.now();
  function tick(now){
    const dt=Math.min(32,now-last)/1000; last=now;
    pos += vel*dt;
    const beyondTop=pos>max, beyondBottom=pos<min;
    if(beyondTop || beyondBottom){
      const bound=beyondTop?max:min;
      vel += (bound-pos)*42*dt;   // spring back
      vel *= Math.pow(.78,dt*60); // stronger damping at boundary
      pos = rubber(pos);
    }else{
      vel *= Math.pow(.94,dt*60); // iOS-ish deceleration
    }
    setOffset(pos);
    if(Math.abs(vel)<18){
      snapTo(Math.round(-pos/ITEM_H), true);
      return;
    }
    raf=requestAnimationFrame(tick);
  }
  raf=requestAnimationFrame(tick);
}

function lockSelection(){
  // Only lock if settled on a whole item.
  selectedIndex=clamp(Math.round(-offset/ITEM_H),0,maxIndex());
  captured.push(options()[selectedIndex]);
  phase++;
  if(phase===4){finish();return}
  selectedIndex = 0;
  buildTrack();
}

spin.addEventListener('pointerdown',e=>{
  cancelAnimationFrame(raf);
  drag=true; yStart=yLast=e.clientY; tLast=performance.now(); velocity=0;
  spin.setPointerCapture(e.pointerId);
});
spin.addEventListener('pointermove',e=>{
  if(!drag)return;
  const now=performance.now(), dy=e.clientY-yLast, dt=Math.max(1,now-tLast);
  velocity=(dy/dt)*1000;
  setOffset(rubber(offset+dy));
  yLast=e.clientY; tLast=now;
});
spin.addEventListener('pointerup',e=>{
  if(!drag)return;
  const travel=Math.abs(e.clientY-yStart);
  drag=false;
  if(travel<7){snapTo(Math.round(-offset/ITEM_H),false); setTimeout(lockSelection,80);}
  else releaseMomentum(velocity);
});
spin.addEventListener('pointercancel',()=>{drag=false;snapTo(Math.round(-offset/ITEM_H),true)});

function finish(){
  document.getElementById('lock').hidden=true;document.getElementById('done').hidden=false;
  const N={A:'Ace',J:'Jack',Q:'Queen',K:'King'},U={C:'Clubs',H:'Hearts',S:'Spades',D:'Diamonds'};
  document.getElementById('c1').textContent=(N[captured[0]]||captured[0])+' of '+U[captured[1]];
  document.getElementById('c2').textContent=(N[captured[2]]||captured[2])+' of '+U[captured[3]];
}
function resetAll(){
  cancelAnimationFrame(raf); phase=0; selectedIndex=8; captured=[];
  document.getElementById('done').hidden=true;document.getElementById('fake').hidden=true;document.getElementById('lock').hidden=false;buildTrack();
}
window.resetAll=resetAll;

document.getElementById('zero').onclick=()=>{
  if(phase!==2)return;
  document.getElementById('lock').hidden=true;document.getElementById('fake').hidden=false;
  setTimeout(()=>{if(phase===2){document.getElementById('fake').hidden=true;document.getElementById('lock').hidden=false}},30000);
};
document.getElementById('reset').onclick=resetAll;
buildTrack();
