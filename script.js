const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const menu = $('#mobile-nav');
const menuButton = $('.menu-toggle');
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open menu'); }
menuButton.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
$('#year').textContent = new Date().getFullYear();

const journey = $('.journey');
const stage = $('.journey-stage');
const canvas = $('#system-canvas');
const ctx = canvas.getContext('2d');
const copies = $$('.journey-copy');
const portal = $('.hq-portal');
const indexLinks = $$('.journey-index a');
const progressBar = $('.journey-track span');
const sceneNote = $('.scene-note');
const motionButton = $('.motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactViewport = window.matchMedia('(max-height: 590px)');
const brandVideo = $('#brand-video');
const filmControl = $('.film-control');
let motionChoice = null;
let immersive = false;
let filmPlayed = false;
let width = 1, height = 1, progress = 0, requestedProgress = 0, frame = 0;
let camera;

/* Perspective projection keeps the same objects in the scene as the viewpoint
   advances. All positions and transitions follow native scroll progress. */
function routeX(z) { return Math.sin((z + 350) / 1050) * (width < 760 ? 95 : 180); }
function project(point) {
  const depth = point.z - camera.z;
  if (depth < 65) return null;
  const scale = camera.focal / depth;
  return { x: camera.cx + (point.x - camera.x) * scale, y: camera.cy + (point.y - camera.y) * scale, scale, depth };
}
function segment(a, b, color, lineWidth = 1) {
  const near = camera.z + 66;
  if (a.z < near && b.z < near) return;
  if (a.z < near) { const t = (near - a.z) / (b.z - a.z); a = {x:lerp(a.x,b.x,t), y:lerp(a.y,b.y,t), z:near}; }
  if (b.z < near) { const t = (near - b.z) / (a.z - b.z); b = {x:lerp(b.x,a.x,t), y:lerp(b.y,a.y,t), z:near}; }
  const pa = project(a), pb = project(b);
  if (!pa || !pb) return;
  ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y); ctx.strokeStyle=color; ctx.lineWidth=lineWidth; ctx.stroke();
}
function worldLabel(text, point, alpha, size = 16, color = '203,210,220') {
  const p = project(point); if (!p || alpha < .01 || p.x < -400 || p.x > width + 400 || p.y < -150 || p.y > height + 150) return;
  const nearFade = smooth(250, 650, p.depth) * (1-smooth(1150,2200,p.depth));
  ctx.fillStyle=`rgba(${color},${alpha * nearFade})`;
  ctx.font=`500 ${clamp(size * p.scale, 10, width < 760 ? 25 : 38)}px "DM Sans",sans-serif`;
  ctx.fillText(text,p.x,p.y);
}
const gates = [
  {z:0, title:'CAPTURE', detail:'An inquiry becomes a next step.'},
  {z:1050, title:'CONNECT', detail:'A clear owner. A connected action.'},
  {z:2100, title:'DELIVER', detail:'The work reaches the people it serves.'}
];
const inputs = [
  {text:'An idea.', x:-680,y:-170,z:650, side:-1},
  {text:'A conversation.', x:540,y:-210,z:1250, side:1},
  {text:'A deadline.', x:-570,y:260,z:1650, side:-1},
  {text:'A decision.', x:720,y:160,z:2300, side:1},
  {text:'A handoff.', x:-830,y:20,z:2800, side:-1},
  {text:'A next step.', x:430,y:340,z:3400, side:1}
];
function plane(points, fill) {
  const projected=points.map(project);if(projected.some(p=>!p))return;
  ctx.beginPath();projected.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();
}
function drawWorkUnit(x,z,index,alpha) {
  const p=project({x,y:0,z});if(!p||p.depth>2200)return;
  alpha*=smooth(300,650,p.depth)*(1-smooth(1600,2600,p.depth));
  const line=`rgba(203,210,220,${alpha*.65})`,signal=`rgba(99,139,255,${alpha})`;
  // An open document becomes an assigned action, then a delivered outcome.
  const left=x-95,top=-90;
  plane([{x:left-18,y:top-18,z},{x:left+220,y:top-18,z},{x:left+220,y:top+175,z},{x:left-18,y:top+175,z}],`rgba(151,174,220,${alpha*.045})`);
  if(index===0){
    segment({x:left,y:top,z},{x:left+155,y:top,z},line,1.2);
    segment({x:left,y:top,z},{x:left,y:top+108,z},line,1.2);
    for(let i=0;i<3;i++)segment({x:left+22,y:top+30+i*24,z},{x:left+120-i*15,y:top+30+i*24,z},i?line:signal,1.5);
  }else if(index===1){
    segment({x:left,y:top+5,z},{x:left+70,y:top+45,z},line,1.5);
    segment({x:left,y:top+85,z},{x:left+70,y:top+45,z},line,1.5);
    segment({x:left+70,y:top+45,z},{x:left+165,y:top+45,z},signal,2);
    segment({x:left+145,y:top+30,z},{x:left+165,y:top+45,z},signal,1.5);
    segment({x:left+145,y:top+60,z},{x:left+165,y:top+45,z},signal,1.5);
  }else{
    segment({x:left+20,y:top+50,z},{x:left+65,y:top+90,z},signal,2.5);
    segment({x:left+65,y:top+90,z},{x:left+155,y:top+5,z},signal,2.5);
  }
  worldLabel(['Request received','Owner assigned','Ready to deliver'][index],{x:left,y:top+145,z},alpha,24);
}
function drawWorld(p) {
  if (!ctx || !immersive || stage.getBoundingClientRect().bottom < 0) return;
  ctx.clearRect(0,0,width,height);
  const phone = width < 760;
  const assembly = smooth(.08,.36,p);
  const flight = smooth(.24,.88,p);
  const arrival = smooth(.68,.94,p);
  const cameraZ = lerp(-1000,2720,flight);
  camera = {z:cameraZ,x:routeX(cameraZ+400)*.78,y:lerp(-65,-15,flight),focal:phone?width*1.6:Math.min(width*.63,850),cx:width*lerp(phone?.5:.57,phone?.5:.69,arrival),cy:height*(phone?.57:.61)};
  const atmosphere = lerp(.22,1,smooth(.08,.25,p)) * (1-smooth(.79,1,p)*.78);
  const wide = phone ? 390 : 620;
  // Longitudinal rails and sparse crossbeams establish a space to travel through.
  for (const x of [-wide,-wide*.5,0,wide*.5,wide]) {
    for(let z=-1300;z<5300;z+=200) {
      const opacity = atmosphere * (x===0?.16:.10);
      segment({x:routeX(z)+x,y:245,z},{x:routeX(z+200)+x,y:245,z:z+200},`rgba(203,210,220,${opacity})`,.7);
    }
  }
  for (let z=-1000;z<5300;z+=420) {
    const alpha=atmosphere*.1;
    segment({x:routeX(z)-wide,y:245,z},{x:routeX(z)+wide,y:245,z},`rgba(203,210,220,${alpha})`,.65);
  }
  // The loose inputs occupy the same world; scrolling brings them onto the route.
  for(const input of [...inputs].sort((a,b)=>b.z-a.z)) {
    const x=lerp(input.x*(phone?.54:1),routeX(input.z)+input.side*(phone?460:680),assembly);
    const y=lerp(input.y,-40+input.side*35,assembly);
    const opacity=(1-smooth(.3,.53,p))*smooth(.07,.23,p)*.85;
    const point=project({x,y,z:input.z});
    if(point){
      const a=opacity*smooth(80,400,point.depth);
      segment({x,y:y+20,z:input.z},{x:x+190,y:y+20,z:input.z},`rgba(203,210,220,${a*.4})`,.8);
      worldLabel(input.text,{x,y,z:input.z},a,23);
      ctx.fillStyle=`rgba(99,139,255,${a})`;ctx.fillRect(point.x-12,point.y-5,3,3);
    }
  }
  // Open frames assemble, then pass around the viewer rather than being swapped.
  for(const [i,gate] of [...gates.entries()].reverse()) {
    const gx=routeX(gate.z), half=phone?365:600, tall=phone?235:240;
    const depth=gate.z-camera.z;
    if(depth<67) continue;
    const fade=atmosphere*smooth(68,360,depth)*(.32+assembly*.58);
    const spread=(1-assembly)*170;
    const corners=[{x:gx-half-spread,y:-tall-spread,z:gate.z},{x:gx+half+spread,y:-tall,z:gate.z},{x:gx+half,y:tall+spread,z:gate.z},{x:gx-half,y:tall,z:gate.z}];
    const cap=.38+assembly*.62;
    plane([corners[0],corners[3],{...corners[3],z:gate.z+120},{...corners[0],z:gate.z+120}],`rgba(151,174,220,${fade*.075})`);
    plane([corners[0],corners[1],{...corners[1],z:gate.z+90},{...corners[0],z:gate.z+90}],`rgba(151,174,220,${fade*.045})`);
    for(let j=0;j<4;j++){
      const a=corners[j],b=corners[(j+1)%4];
      segment(a,{x:lerp(a.x,b.x,cap),y:lerp(a.y,b.y,cap),z:b.z},`rgba(203,210,220,${fade*.72})`,1);
      segment({...a,z:a.z+60},{...b,z:b.z+60},`rgba(203,210,220,${fade*.16})`,.65);
      segment(a,{...a,z:a.z+60},`rgba(203,210,220,${fade*.24})`,.7);
    }
    segment({x:gx-half,y:tall,z:gate.z},{x:gx-half,y:lerp(tall,-tall,assembly),z:gate.z},`rgba(99,139,255,${fade*.78})`,1.5);
    worldLabel(`0${i+1} / ${gate.title}`,{x:gx-half+26,y:-tall+48,z:gate.z},fade*smooth(.1,.23,p),21,'203,210,220');
    worldLabel(gate.detail,{x:gx-half+26,y:tall-35,z:gate.z},fade*smooth(.1,.23,p)*.8,16);
    drawWorkUnit(gx,gate.z+80,i,fade*assembly);
  }
  // A single illuminated route and its work packets continue through every gate.
  const routeAlpha=atmosphere*smooth(.12,.3,p);
  const routeEnd=lerp(-400,4700,smooth(.14,.62,p));
  for(let z=-1400;z<routeEnd;z+=45){
    const next=Math.min(z+45,routeEnd);
    segment({x:routeX(z),y:230,z},{x:routeX(next),y:230,z:next},`rgba(99,139,255,${routeAlpha*.68})`,phone?1.3:1.7);
    segment({x:routeX(z)+9,y:230,z},{x:routeX(next)+9,y:230,z:next},`rgba(99,139,255,${routeAlpha*.22})`,3);
  }
  for(let i=0;i<5;i++){
    const z=-700+i*940+p*1350;
    const q=project({x:routeX(z),y:230,z});
    if(!q)continue;
    const a=routeAlpha*smooth(90,420,q.depth);const size=clamp(q.scale*7,2,12);
    ctx.shadowColor='rgba(99,139,255,.55)';ctx.shadowBlur=16;ctx.fillStyle=`rgba(190,209,255,${a})`;ctx.fillRect(q.x-size/2,q.y-size/2,size,size);ctx.shadowBlur=0;
  }
}
function sceneOpacity(index,p) {
  if(index===0)return 1-smooth(.055,.15,p);
  if(index===1)return smooth(.16,.23,p)*(1-smooth(.34,.4,p));
  if(index===2)return smooth(.42,.49,p)*(1-smooth(.66,.72,p));
  return smooth(.74,.82,p);
}
function resetBrand() { brandVideo.pause();brandVideo.style.opacity='0';filmControl.innerHTML='Replay brand film <span aria-hidden="true">↗</span>';filmControl.setAttribute('aria-label','Replay the HowOps brand film'); }
function playBrand() { brandVideo.currentTime=0;brandVideo.play().catch(resetBrand); }
brandVideo.addEventListener('playing',()=>{brandVideo.style.opacity='1';filmControl.innerHTML='Pause brand film <span aria-hidden="true">Ⅱ</span>';filmControl.setAttribute('aria-label','Pause the HowOps brand film');});
brandVideo.addEventListener('ended',resetBrand);brandVideo.addEventListener('error',resetBrand);
filmControl.addEventListener('click',()=>{if(brandVideo.paused)playBrand();else resetBrand();});
function applyScene(p) {
  const active=p<.155?0:p<.41?1:p<.73?2:3;
  copies.forEach((el,i)=>{
    const opacity=sceneOpacity(i,p);
    el.style.opacity=String(opacity);
    el.style.transform=`translateY(${i===0?-p*55:(1-opacity)*20}px)`;
    el.classList.toggle('is-current',i===active);
    el.inert=i!==active;
    el.setAttribute('aria-hidden',String(i!==active));
  });
  const arrive=smooth(.69,.96,p);
  portal.style.opacity=String(smooth(.7,.82,p));
  portal.style.transform=`translate(-50%,-50%) perspective(1200px) rotateY(${(1-arrive)*-12}deg) scale(${lerp(.2,1,arrive)})`;
  portal.inert=p<.8;
  portal.setAttribute('aria-hidden',String(p<.8));
  portal.style.pointerEvents=p>.8?'auto':'none';
  progressBar.style.width=`${p*100}%`;
  indexLinks.forEach((link,i)=>{if(i===active)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
  sceneNote.textContent=active===0?'SCROLL TO MOVE THROUGH':active===3?'HQ / A HOWOPS PRODUCT':'AN ILLUSTRATION OF HOW WORK CONNECTS';
  if(p>.18&&!brandVideo.paused)resetBrand();
  if(p<.06&&!filmPlayed&&immersive&&!navigator.connection?.saveData&&document.visibilityState==='visible'){filmPlayed=true;playBrand();}
  drawWorld(p);
}
function measure() {
  width=stage.clientWidth;height=stage.clientHeight;
  const ratio=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
  if(ctx)ctx.setTransform(ratio,0,0,ratio,0,0);
}
function readProgress() {
  const top=journey.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
  return clamp((scrollY-top)/Math.max(1,journey.offsetHeight-stage.offsetHeight));
}
function render() {
  frame=0;if(!immersive)return;
  requestedProgress=readProgress();
  // A short settle smooths wheel steps without delaying direct chapter navigation.
  progress=lerp(progress,requestedProgress,.3);
  if(Math.abs(progress-requestedProgress)<.0004)progress=requestedProgress;
  applyScene(progress);
  if(progress!==requestedProgress)frame=requestAnimationFrame(render);
}
function schedule(){if(!frame&&immersive)frame=requestAnimationFrame(render);}
function setMode() {
  immersive=Boolean(ctx)&&(motionChoice??!reducedMotion.matches)&&!compactViewport.matches;
  journey.classList.toggle('is-immersive',immersive);
  motionButton.hidden=compactViewport.matches||!ctx;
  motionButton.textContent=immersive?'Reduce motion':'Use immersive view';
  motionButton.setAttribute('aria-pressed',String(!immersive));
  if(!immersive){
    if(frame)cancelAnimationFrame(frame);frame=0;resetBrand();
    copies.forEach(el=>{el.style.opacity='';el.style.transform='';el.inert=false;el.removeAttribute('aria-hidden');el.classList.remove('is-current');});
    portal.style.opacity='';portal.style.transform='';portal.style.pointerEvents='';portal.inert=false;portal.removeAttribute('aria-hidden');
  }else{measure();progress=readProgress();applyScene(progress);}
}
motionButton.addEventListener('click',()=>{motionChoice=!immersive;setMode();window.scrollTo({top:0,behavior:'auto'});});
reducedMotion.addEventListener('change',setMode);compactViewport.addEventListener('change',setMode);
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',()=>{if(immersive){measure();schedule();}});
setMode();

const positions={'#structure':.28,'#in-motion':.56,'#inside-hq':.94};
const aliases={'#friction':'#structure','#services':'#expertise','#blueprint':'#expertise','#flow':'#in-motion'};
function navigate(hash,updateHistory=true) {
  hash=aliases[hash]||hash;
  if(hash==='#top'){
    window.scrollTo({top:0,behavior:'auto'});progress=0;if(immersive)applyScene(0);
  }else if(immersive&&Object.hasOwn(positions,hash)){
    const navHeight=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top=journey.getBoundingClientRect().top+scrollY-navHeight;
    const target=top+(journey.offsetHeight-stage.offsetHeight)*positions[hash];
    progress=positions[hash];window.scrollTo({top:target,behavior:'auto'});applyScene(progress);
  }else{
    const target=document.getElementById(hash.slice(1));if(!target)return;
    target.scrollIntoView({behavior:'auto',block:'start'});
  }
  if(updateHistory&&location.hash!==hash)history.pushState(null,'',hash);
}
$$('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();closeMenu();navigate(link.getAttribute('href'));}));
window.addEventListener('popstate',()=>navigate(location.hash||'#top',false));
window.addEventListener('load',()=>{if(immersive)measure();if(location.hash)navigate(location.hash,false);else schedule();});

const audio=$('#howops-audio'), audioButton=$('.audio-button');
function updateAudio(){const duration=Number.isFinite(audio.duration)?audio.duration:22;const left=Math.max(0,Math.ceil(duration-audio.currentTime));$('.audio-time').textContent=`0:${String(left).padStart(2,'0')}`;$('.audio-progress span').style.width=`${clamp(audio.currentTime/duration)*100}%`;$('.audio-icon').textContent=audio.paused?'▷':'Ⅱ';audioButton.setAttribute('aria-label',`${audio.paused?'Play':'Pause'} the 22-second HowOps introduction`);}
audioButton.addEventListener('click',()=>{if(audio.paused)audio.play().catch(()=>{});else audio.pause();});
['play','pause','timeupdate','loadedmetadata'].forEach(event=>audio.addEventListener(event,updateAudio));audio.addEventListener('ended',()=>{audio.currentTime=0;updateAudio();});
const dialog=$('.film-dialog'),ableFilm=$('#able-film'),inlineFilm=$('#able-inline');
const filmButton=$('.film-play-button'),filmLabel=$('.film-play-label');
const filmPlayers=[inlineFilm,ableFilm];
function filmStatus(video,message,failed=false){
  const parent=video===inlineFilm?$('.work-film'):dialog;
  parent.querySelector('.film-status').textContent=message;
  parent.querySelector('.film-fallback').hidden=!failed;
}
function startFilm(video){
  audio.pause();resetBrand();
  filmPlayers.forEach(other=>{if(other!==video)other.pause();});
  filmStatus(video,'Loading film…');
  video.play().catch(error=>{
    if(error.name==='AbortError')return;
    filmStatus(video,'Tap the video’s play control, or open the film directly.',true);
  });
}
filmPlayers.forEach(video=>{
  video.addEventListener('playing',()=>{
    audio.pause();resetBrand();filmPlayers.forEach(other=>{if(other!==video)other.pause();});
    filmStatus(video,'');
  });
  video.addEventListener('waiting',()=>filmStatus(video,'Loading film…'));
  video.addEventListener('error',()=>filmStatus(video,'The film couldn’t load. Open it directly to try again.',true));
});
function updateFilmButton(){filmLabel.textContent=inlineFilm.ended?'Replay film':inlineFilm.paused?'Play film':'Pause film';filmButton.lastElementChild.textContent=inlineFilm.paused?'▷':'Ⅱ';}
['play','pause','ended'].forEach(event=>inlineFilm.addEventListener(event,updateFilmButton));
filmButton.addEventListener('click',()=>{if(inlineFilm.paused)startFilm(inlineFilm);else inlineFilm.pause();});
$$('[data-film="able"]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();dialog.showModal();document.body.classList.add('film-open');startFilm(ableFilm);}));
$('.close-film').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{ableFilm.pause();document.body.classList.remove('film-open');});
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.pause();filmPlayers.forEach(video=>video.pause());resetBrand();}});
