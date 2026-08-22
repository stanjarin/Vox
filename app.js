const SUITS=['C','H','S','D'];
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

const RANK_GROUPS={
  rank1:['A','2','3'],
  rank4:['4','5','6'],
  rank7:['7','8','9'],
  rank8:['10','J','Q','K']
};
const HOLD_MS=240;

let phase=0;                 // 0 rank1, 1 suit1, 2 rank2, 3 suit2
let captured=[];
let suitIndex=0;
let suitDown=false,suitY0=0,suitLastY=0,suitMoved=false,suitHold=false,suitTimer=null;

const spin=document.getElementById('spin');
const track=document.getElementById('track');
const echo=document.getElementById('echo');

function updateEcho(){ echo.textContent=captured.join('  '); }

function showRankMode(){
  spin.textContent='9';
  spin.style.pointerEvents='none';
  spin.style.fontSize='31px';
  resetRankKeys();
  updateEcho();
}

function buildSuitTrack(){
  track.innerHTML='';
  SUITS.forEach(s=>{
    const d=document.createElement('div');
    d.className='witem'; d.textContent=s; track.appendChild(d);
  });
  suitIndex=0; // always C
  track.style.transform='translateY(0px)';
  spin.style.pointerEvents='auto';
  updateEcho();
}

function showSuitMode(){ buildSuitTrack(); }

function resetRankKeys(){
  Object.entries(RANK_GROUPS).forEach(([id,g])=>{
    const b=document.getElementById(id);
    b.dataset.i='0';
    b.querySelector('span').textContent=g[0];
  });
}

function advancePhase(){
  phase++;
  if(phase===4){ finish(); return; }
  if(phase%2===1) showSuitMode(); else showRankMode();
}

function installRankKey(id){
  const btn=document.getElementById(id), group=RANK_GROUPS[id];
  let down=false,y0=0,lastY=0,moved=false,hold=false,timer=null;

  btn.addEventListener('pointerdown',e=>{
    if(phase%2!==0)return;
    down=true; moved=false; hold=false; y0=lastY=e.clientY;
    btn.setPointerCapture(e.pointerId);
    timer=setTimeout(()=>{ if(down&&!moved) hold=true; },HOLD_MS);
  });

  btn.addEventListener('pointermove',e=>{
    if(!down)return;
    const dy=e.clientY-lastY;
    if(Math.abs(e.clientY-y0)>6){
      moved=true; hold=false; clearTimeout(timer);
    }
    if(Math.abs(dy)>=16){
      let i=Number(btn.dataset.i||0);
      i=(i+(dy<0?1:-1)+group.length)%group.length; // wrap
      btn.dataset.i=String(i);
      btn.querySelector('span').textContent=group[i];
      lastY=e.clientY;
    }
  });

  btn.addEventListener('pointerup',()=>{
    if(!down)return;
    clearTimeout(timer); down=false;
    if(hold){
      const i=Number(btn.dataset.i||0);
      captured.push(group[i]);
      updateEcho();
      advancePhase();
    }
  });
  btn.addEventListener('pointercancel',()=>{clearTimeout(timer);down=false;});
}

['rank1','rank4','rank7','rank8'].forEach(installRankKey);

// Suit wheel: deliberately simple and smooth because only four entries.
spin.addEventListener('pointerdown',e=>{
  if(phase%2!==1)return;
  suitDown=true; suitMoved=false; suitHold=false; suitY0=suitLastY=e.clientY;
  spin.setPointerCapture(e.pointerId);
  suitTimer=setTimeout(()=>{if(suitDown&&!suitMoved)suitHold=true;},HOLD_MS);
});
spin.addEventListener('pointermove',e=>{
  if(!suitDown)return;
  const dy=e.clientY-suitLastY;
  if(Math.abs(e.clientY-suitY0)>6){
    suitMoved=true; suitHold=false; clearTimeout(suitTimer);
  }
  if(Math.abs(dy)>=16){
    suitIndex=(suitIndex+(dy<0?1:-1)+SUITS.length)%SUITS.length; // wrap
    track.style.transition='transform 90ms ease-out';
    track.style.transform=`translateY(${-suitIndex*76}px)`;
    suitLastY=e.clientY;
  }
});
spin.addEventListener('pointerup',()=>{
  if(!suitDown)return;
  clearTimeout(suitTimer); suitDown=false;
  if(suitHold){
    captured.push(SUITS[suitIndex]);
    updateEcho();
    advancePhase();
  }
});
spin.addEventListener('pointercancel',()=>{clearTimeout(suitTimer);suitDown=false;});

async function finish(){
  const namedValue=MNEMONICA[captured[0]+' '+captured[1]];
  const keyValue=MNEMONICA[captured[2]+' '+captured[3]];
  const raw=namedValue-keyValue+1;
  const position=((raw-1)%52+52)%52+1;

  let copied=false;
  try{
    await navigator.clipboard.writeText(String(position));
    copied=true;
  }catch(e){
    const ta=document.createElement('textarea');
    ta.value=String(position); ta.setAttribute('readonly','');
    ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select();
    try{copied=document.execCommand('copy');}catch(_){}
    ta.remove();
  }

  if(copied){
    document.getElementById('lock').hidden=true;
    document.getElementById('done').hidden=false;
  }else{
    // Fail-safe: retain Card 1, restart Card 2.
    phase=2; captured=captured.slice(0,2); showRankMode();
  }
}

function resetAll(){
  phase=0; captured=[]; suitIndex=0;
  document.getElementById('done').hidden=true;
  document.getElementById('fake').hidden=true;
  document.getElementById('lock').hidden=false;
  showRankMode();
}
window.resetAll=resetAll;

document.getElementById('zero').onclick=()=>{
  if(phase!==2)return;
  document.getElementById('lock').hidden=true;
  document.getElementById('fake').hidden=false;
  setTimeout(()=>{
    if(phase===2){
      document.getElementById('fake').hidden=true;
      document.getElementById('lock').hidden=false;
      showRankMode();
    }
  },15000);
};

document.getElementById('reset').onclick=resetAll;
showRankMode();
