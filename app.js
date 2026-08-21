const VALUES=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const SUITS=['C','H','S','D'];
const ITEM_H=76;

const MNEMONICA={
'A C':43,'A H':51,'A S':7,'A D':39,
'2 C':27,'2 H':2,'2 S':10,'2 D':19,
'3 C':4,'3 H':28,'3 S':21,'3 D':12,
'4 C':1,'4 H':5,'4 S':40,'4 D':42,
'5 C':30,'5 H':8,'5 S':16,'5 D':25,
'6 C':50,'6 H':23,'6 S':15,'6 D':6,
'7 C':47,'7 H':41,'7 S':37,'7 D':3,
'8 C':33,'8 H':14,'8 S':22,'8 D':29,
'9 C':44,'9 H':17,'9 S':9,'9 D':52,
'10 C':24,'10 H':38,'10 S':34,'10 D':49,
'J C':36,'J H':20,'J S':45,'J D':32,
'Q C':13,'Q H':11,'Q S':48,'Q D':46,
'K C':18,'K H':35,'K S':31,'K D':26
};

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

let holdTimer=null, holdArmed=false, moved=false;
const HOLD_MS=240;
spin.addEventListener('pointerdown',e=>{
  cancelAnimationFrame(raf);
  drag=true; moved=false; holdArmed=false;
  yStart=yLast=e.clientY; tLast=performance.now(); velocity=0;
  spin.setPointerCapture(e.pointerId);
  holdTimer=setTimeout(()=>{
    if(drag && !moved){
      holdArmed=true;
      spin.animate([{transform:'scale(1)'},{transform:'scale(.96)'},{transform:'scale(1)'}],
                   {duration:120,easing:'ease-out'});
    }
  },HOLD_MS);
});
spin.addEventListener('pointermove',e=>{
  if(!drag)return;
  const now=performance.now(), dy=e.clientY-yLast, dt=Math.max(1,now-tLast);
  if(Math.abs(e.clientY-yStart)>7){
    moved=true; holdArmed=false; clearTimeout(holdTimer);
  }
  velocity=(dy/dt)*1000;
  setOffset(rubber(offset+dy));
  yLast=e.clientY; tLast=now;
});
spin.addEventListener('pointerup',e=>{
  if(!drag)return;
  clearTimeout(holdTimer);
  const travel=Math.abs(e.clientY-yStart);
  drag=false;
  if(travel<7){
    if(holdArmed){
      snapTo(Math.round(-offset/ITEM_H),false);
      setTimeout(lockSelection,60);
    } else {
      snapTo(Math.round(-offset/ITEM_H),false);
    }
  } else releaseMomentum(velocity);
});
spin.addEventListener('pointercancel',()=>{
  clearTimeout(holdTimer); drag=false; holdArmed=false;
  snapTo(Math.round(-offset/ITEM_H),true);
});

async function finish(){
  const N={A:'Ace',J:'Jack',Q:'Queen',K:'King'},U={C:'Clubs',H:'Hearts',S:'Spades',D:'Diamonds'};
  const card1=(N[captured[0]]||captured[0])+' of '+U[captured[1]];
  const card2=(N[captured[2]]||captured[2])+' of '+U[captured[3]];
  const namedValue=MNEMONICA[captured[0]+' '+captured[1]];
  const inputtedValue=MNEMONICA[captured[2]+' '+captured[3]];

  // Jonathan's marked-deck/top-card handling:
  // Inputted Card Value - Named Card Value + 1, wrapped to 1..52.
  const raw=inputtedValue-namedValue+1;
  const position=((raw-1)%52+52)%52+1;

  let copied=false, copyMethod='';
  try{
    await navigator.clipboard.writeText(String(position));
    copied=true; copyMethod='Clipboard API';
  }catch(e){
    const ta=document.createElement('textarea');
    ta.value=String(position);
    ta.setAttribute('readonly','');
    ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta);
    ta.select();
    try{copied=document.execCommand('copy'); copyMethod='fallback';}catch(_){}
    ta.remove();
  }

  document.getElementById('lock').hidden=true;
  document.getElementById('done').hidden=false;
  document.getElementById('c1').textContent='Named: '+card1+' → '+namedValue;
  document.getElementById('c2').textContent='Key: '+card2+' → '+inputtedValue;
  document.getElementById('calc').textContent=inputtedValue+' − '+namedValue+' + 1 = '+raw+' → '+position;
  document.getElementById('clip').textContent=copied?'Clipboard: '+position+' ✓':'Clipboard copy FAILED';
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
