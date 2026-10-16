const MNEMONICA={
'A C':43,'A H':51,'A S':7,'A D':39,'2 C':27,'2 H':2,'2 S':10,'2 D':19,'3 C':4,'3 H':28,'3 S':21,'3 D':12,
'4 C':1,'4 H':5,'4 S':40,'4 D':42,'5 C':30,'5 H':8,'5 S':16,'5 D':25,'6 C':50,'6 H':23,'6 S':15,'6 D':6,
'7 C':47,'7 H':41,'7 S':37,'7 D':3,'8 C':33,'8 H':14,'8 S':22,'8 D':29,'9 C':44,'9 H':17,'9 S':9,'9 D':52,
'10 C':24,'10 H':38,'10 S':34,'10 D':49,'J C':36,'J H':20,'J S':45,'J D':32,'Q C':13,'Q H':11,'Q S':48,'Q D':46,
'K C':18,'K H':35,'K S':31,'K D':26};
const RANK_GROUPS={
rank1:[['1','A'],['2','2'],['3','3']],
rank4:[['4','4'],['5','5'],['6','6']],
rank7:[['7','7'],['8','8'],['9','9']],
rank8:[['10','10'],['J','J'],['Q','Q'],['K','K']]};
const SUITS=['C','H','S','D'],HOLD_MS=280;
// After consulting the chart, show the same simulated passcode screen used by VOX.
const NOTES_LOCK_DELAY_MS=15000;
const notes=document.getElementById('notes');
let savedArticleScroll=0;
function restoreArticle(){notes.scrollTop=savedArticleScroll}
let notesLockTimer=null;
function showNotes(){document.getElementById('lock').hidden=true;document.getElementById('fake').hidden=true;document.getElementById('done').hidden=true;notes.hidden=false;requestAnimationFrame(restoreArticle)}
function showLock(){savedArticleScroll=notes.scrollTop;notes.hidden=true;document.getElementById('lock').hidden=false;clearTimeout(notesLockTimer)}
function scheduleLock(){clearTimeout(notesLockTimer);notesLockTimer=setTimeout(showLock,NOTES_LOCK_DELAY_MS)}
// Inactivity means no interaction with the visible Wikipedia article.
function noteActivity(){if(!notes.hidden)scheduleLock()}
['touchstart','touchmove','touchend','pointerdown','pointermove','pointerup','wheel','scroll','keydown'].forEach(type=>notes.addEventListener(type,noteActivity,{passive:true}));
(function chart(){const spoken=['Fifty-one','2.6 thousand','133 thousand','6.8 million','345 million','17.6 billion','897 billion','45.8 trillion','2.3 quadrillion','119 quadrillion','6.1 quintillion','310 quintillion'];const tbody=document.querySelector('#sequences tbody');for(let n=1;n<=12;n++){let tr=document.createElement('tr');let a=document.createElement('td'),b=document.createElement('td'),c=document.createElement('td');a.textContent=n;b.textContent=(51n**BigInt(n)).toLocaleString('en-AU');const parts=spoken[n-1].match(/^(.*?)(thousand|million|billion|trillion|quadrillion|quintillion)$/);if(parts){c.append(document.createTextNode(parts[1]));const word=document.createElement('span');word.className='magnitude';word.textContent=parts[2];c.append(word)}else{c.textContent=spoken[n-1]}tr.append(a,b,c);tbody.append(tr)}})();
let phase=0,captured=[],suitIndex=0,holdTimer=null,pointerDown=false,holdTriggered=false;
const echo=document.getElementById('echo'),spin=document.getElementById('spin'),track=document.getElementById('track');

function updateEcho(){echo.textContent=captured.join('  ')}
function resetRankKeys(){Object.entries(RANK_GROUPS).forEach(([id,g])=>{let b=document.getElementById(id);b.dataset.i='0';b.querySelector('span').textContent=g[0][0]})}
function showRankMode(){track.innerHTML='<div class="witem">9</div>';spin.style.pointerEvents='none';resetRankKeys();updateEcho()}
function showSuitMode(){suitIndex=0;track.innerHTML='<div class="witem">C</div>';spin.style.pointerEvents='auto';updateEcho()}
function advancePhase(){phase++;if(phase===4){finish();return}phase%2?showSuitMode():showRankMode()}

function installRank(id){
 const b=document.getElementById(id),g=RANK_GROUPS[id];
 b.onpointerdown=e=>{if(phase%2)return;pointerDown=true;holdTriggered=false;b.setPointerCapture(e.pointerId);clearTimeout(holdTimer);holdTimer=setTimeout(()=>{if(pointerDown)holdTriggered=true},HOLD_MS)};
 b.onpointerup=()=>{if(phase%2)return;clearTimeout(holdTimer);let was=holdTriggered;pointerDown=false;holdTriggered=false;if(was){captured.push(g[Number(b.dataset.i||0)][1]);updateEcho();advancePhase();}else{let i=(Number(b.dataset.i||0)+1)%g.length;b.dataset.i=i;b.querySelector('span').textContent=g[i][0]}};
 b.onpointercancel=()=>{clearTimeout(holdTimer);pointerDown=false;holdTriggered=false};
}
['rank1','rank4','rank7','rank8'].forEach(installRank);

spin.onpointerdown=e=>{if(phase%2!==1)return;pointerDown=true;holdTriggered=false;spin.setPointerCapture(e.pointerId);clearTimeout(holdTimer);holdTimer=setTimeout(()=>{if(pointerDown)holdTriggered=true},HOLD_MS)};
spin.onpointerup=()=>{
 if(phase%2!==1)return;
 clearTimeout(holdTimer);
 let was=holdTriggered;
 pointerDown=false;
 holdTriggered=false;

 if(!was){
   suitIndex=(suitIndex+1)%SUITS.length;
   track.innerHTML='<div class="witem">'+SUITS[suitIndex]+'</div>';
   return;
 }

 captured.push(SUITS[suitIndex]);
 updateEcho();

 // V8.4.10: on the final suit, write once to the clipboard directly
 // from this pointerup user gesture. Do not route through advancePhase().
 if(phase===3){
   phase=4;
   finish();
   return;
 }
 advancePhase();
};
spin.onpointercancel=()=>{clearTimeout(holdTimer);pointerDown=false;holdTriggered=false};

function finish(){
 const namedValue=MNEMONICA[captured[0]+' '+captured[1]];
 const inputtedValue=MNEMONICA[captured[2]+' '+captured[3]];
 const raw=namedValue-inputtedValue+1;
 const position=((raw-1)%52+52)%52+1;
 const text=String(position);

 if(navigator.clipboard && navigator.clipboard.writeText){
   try{
     navigator.clipboard.writeText(text).then(()=>{
       document.getElementById('lock').hidden=true;
       showNotes();
       scheduleLock();
     }).catch(()=>clipboardFailed());
     return;
   }catch(_){}
 }

 clipboardFailed();
}

function clipboardFailed(){
 // The fourth input was already appended before the clipboard attempt.
 // Remove it so another long press retries with exactly four inputs.
 if(phase===4 && captured.length===4)captured.pop();
 phase=3;
 echo.textContent=captured.join('  ')+'  !';
}

function resetAll(){clearTimeout(notesLockTimer);clearTimeout(holdTimer);phase=0;captured=[];suitIndex=0;pointerDown=false;holdTriggered=false;document.getElementById('done').hidden=true;document.getElementById('fake').hidden=true;document.getElementById('lock').hidden=false;showRankMode();showNotes();scheduleLock()}
window.resetAll=resetAll;
function undoLastInput(){
 clearTimeout(holdTimer);
 pointerDown=false;holdTriggered=false;
 if(phase===0)return;
 if(phase===4)phase=3;
 else phase--;
 captured.pop();
 document.getElementById('fake').hidden=true;
 document.getElementById('lock').hidden=false;
 if(phase%2)showSuitMode();else showRankMode();
}
document.getElementById('cancel').onclick=undoLastInput;

document.getElementById('zero').onclick=()=>{if(phase!==2)return;document.getElementById('lock').hidden=true;document.getElementById('fake').hidden=false;setTimeout(()=>{if(phase===2){document.getElementById('fake').hidden=true;document.getElementById('lock').hidden=false;showRankMode()}},8000)};
document.getElementById('reset').onclick=resetAll;
showRankMode();
showNotes();
// Start with the lower part of the Canasta photograph visible, as in the accepted iPhone screenshot.
// Use the heading's actual rendered position, and re-align after the image loads.
function alignOpeningView(){
 const target=document.getElementById('probabilities');
 const headingTop=target.getBoundingClientRect().top-notes.getBoundingClientRect().top+notes.scrollTop;
 savedArticleScroll=Math.max(0,headingTop-225);
 restoreArticle();
 notes.style.visibility='visible';
}
// Dimensions reserved in HTML/CSS: do not delay initial display for remote imagery.
requestAnimationFrame(alignOpeningView);
scheduleLock();