const presets=[
  // 1. Popular Presets (SinCap Popular)
  {id:'hormozi',name:'Hormozi Pop',category:'popular',hint:'Hormozi signature yellow · viral shorts & reels',mode:'active',color:'#ffffff',accent:'#ffe600',outline:4.5,shadow:3,size:62,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'reference',name:'Reference Pop',category:'popular',hint:'Bold orange, words reveal at center',mode:'reveal',color:'#ffffff',accent:'#ff6500',outline:1.5,shadow:2,size:54,font:'LNKcap Sinhala Impact',position:'middle',groupWords:3},
  {id:'clean',name:'Natural White',category:'popular',hint:'Simple, crisp white · high readability',mode:'phrase',color:'#ffffff',accent:'#ffe35c',outline:2,shadow:1,size:52},
  {id:'bold',name:'Spotlight',category:'popular',hint:'Bold yellow, strong contrast outline',mode:'phrase',color:'#ffe35c',accent:'#ffe35c',outline:5,shadow:2,size:60},
  {id:'box',name:'Subtitle Box',category:'popular',hint:'White text on dark translucent panel',mode:'phrase',color:'#ffffff',accent:'#ffe35c',outline:0,shadow:0,size:48,box:true},
  {id:'podcast',name:'Podcast Box',category:'popular',hint:'Sleek dark panel · modern podcasts & interviews',mode:'active',color:'#f1f5f9',accent:'#38bdf8',outline:0,shadow:0,size:48,font:'LNKcap Yaldevi',position:'bottom',box:true},
  {id:'cinema',name:'Cinema Serif',category:'popular',hint:'Warm ivory serif · documentary & films',mode:'phrase',motion:'fade',color:'#f4eee0',accent:'#e5c07b',outline:1.2,shadow:2,size:48,font:'LNKcap Noto Serif Sinhala',position:'bottom'},
  {id:'rise',name:'Slide Up',category:'popular',hint:'Smooth upward entrance into frame',mode:'phrase',motion:'rise',color:'#ffffff',accent:'#67efc4',outline:2,shadow:2,size:52,font:'LNKcap Sinhala Impact',position:'bottom'},
  {id:'slide',name:'Slide In',category:'popular',hint:'Glide in smoothly from the left',mode:'phrase',motion:'slide',color:'#ffe35c',accent:'#ffe35c',outline:2,shadow:2,size:54,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'zoom',name:'Zoom Focus',category:'popular',hint:'Settle into focus with subtle zoom',mode:'phrase',motion:'zoom',color:'#ffffff',accent:'#67efc4',outline:2,shadow:2,size:54,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'fade',name:'Soft Fade',category:'popular',hint:'Gentle fade in and out',mode:'phrase',motion:'fade',color:'#ffffff',accent:'#b48aff',outline:1,shadow:2,size:52,font:'LNKcap Abhaya Libre',position:'bottom'},
  {id:'handwritten',name:'Handwritten Note',category:'popular',hint:'Warm casual handwriting · personal vlog',mode:'phrase',motion:'fade',color:'#ffffff',accent:'#ff9b71',outline:1.5,shadow:2,size:58,font:'LNKcap Atlas Chirani',position:'bottom'},
  {id:'aesthetic',name:'Aesthetic Peach',category:'popular',hint:'Soft pastel peach · lifestyle & cafe vlogs',mode:'phrase',motion:'rise',color:'#ffffff',accent:'#ff9e99',outline:1.5,shadow:1.5,size:52,font:'LNKcap Maname',position:'bottom'},

  // 2. Highlight & Karaoke Presets (SinCap Highlight)
  {id:'beast',name:'Beast Lime',category:'highlight',hint:'High-energy neon lime · viral shorts',mode:'active',color:'#ffffff',accent:'#52ff00',outline:3.5,shadow:3,size:58,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'emerald',name:'Emerald Mint',category:'highlight',hint:'Vibrant neon mint · finance & motivation',mode:'active',color:'#ffffff',accent:'#00ff88',outline:4,shadow:2.5,size:58,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'fire',name:'Fire Red',category:'highlight',hint:'Punchy crimson red · dramatic moments',mode:'active',color:'#ffffff',accent:'#ff2a55',outline:3.5,shadow:2,size:56,font:'LNKcap Post No Bills Colombo',position:'middle'},
  {id:'orange',name:'Red Orange',category:'highlight',hint:'Fiery orange on the active spoken word',mode:'active',color:'#ffffff',accent:'#ff681f',outline:3,shadow:2,size:52},
  {id:'highlight',name:'Highlight Active',category:'highlight',hint:'Follow each word dynamically in yellow',mode:'active',color:'#ffffff',accent:'#ffe35c',outline:3,shadow:2,size:52},
  {id:'weightfade',name:'Weight Fade Focus',category:'highlight',hint:'SinCap smart style · unspoken words fade, active pops',mode:'active',color:'#7d7890',accent:'#ffffff',outline:2,shadow:2,size:58,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'karaokegold',name:'Golden Karaoke',category:'highlight',hint:'Words fill with radiant gold on the beat',mode:'karaoke',color:'#e0e0e0',accent:'#ffd700',outline:3.5,shadow:2,size:58,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'karaoke',name:'Karaoke Mint',category:'highlight',hint:'Smooth mint color builds as words play',mode:'karaoke',color:'#ffffff',accent:'#67efc4',outline:2,shadow:1,size:52},

  // 3. Social & Viral Reels Presets (SinCap Social)
  {id:'tiktokbold',name:'TikTok Bold',category:'social',hint:'Heavy black stroke with crisp white & red pop · TikTok FYP',mode:'active',color:'#ffffff',accent:'#fe2c55',outline:5.5,shadow:3,size:62,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'reelspunch',name:'Reels Punch',category:'social',hint:'Fast 2-word reveal with vibrant yellow punch · Reels & Shorts',mode:'reveal',groupWords:2,color:'#ffffff',accent:'#ffd600',outline:4,shadow:2.5,size:60,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'duopop',name:'Duo Flow',category:'social',hint:'Two words at a time · ultra-fast viewer retention',mode:'reveal',groupWords:2,color:'#ffffff',accent:'#00f0ff',outline:3.5,shadow:2,size:58,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'comicpop',name:'Comic Punch',category:'social',hint:'Vibrant yellow & hot pink · punchy pop',mode:'word',motion:'wordpop',color:'#fffb00',accent:'#ff007f',outline:4,shadow:3,size:64,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'wordpop',name:'Word Pop',category:'social',hint:'One word, one lively bounce animation',mode:'word',motion:'wordpop',color:'#ffffff',accent:'#67efc4',outline:2,shadow:2,size:68,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'word',name:'One Word Center',category:'social',hint:'Single word takes center stage for maximum impact',mode:'word',color:'#ffffff',accent:'#ffe35c',outline:3,shadow:2,size:72},
  {id:'velocity',name:'Electric Velocity',category:'social',hint:'High-voltage blue bounce · gym, sports & hype',mode:'phrase',motion:'bounce',color:'#ffffff',accent:'#00d2ff',outline:4,shadow:3,size:60,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'bounce',name:'Bounce Pop',category:'social',hint:'Lively bounce animation into every phrase',mode:'phrase',motion:'bounce',color:'#ffffff',accent:'#ff6500',outline:1.5,shadow:2,size:56,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'breaking',name:'Breaking Alert',category:'social',hint:'Urgent red slide-in · news, facts & alerts',mode:'phrase',motion:'slide',color:'#ffffff',accent:'#ff1744',outline:4,shadow:3,size:56,font:'LNKcap Post No Bills Colombo',position:'bottom'},
  {id:'stencil',name:'Urban Stencil',category:'social',hint:'Street poster stencil · raw, urban & bold',mode:'phrase',motion:'bounce',color:'#fff200',accent:'#ff5500',outline:3.5,shadow:3,size:56,font:'LNKcap Post No Bills Colombo',position:'middle'},

  // 4. Effects Presets (SinCap Pro Effects: Metallic, Chrome, Neon, Glitch, Sweep)
  {id:'metallicgold',name:'Metallic Gold',category:'effects',hint:'SinCap Pro metallic gold · luxury & high-retention',mode:'phrase',motion:'rise',color:'#fff6d6',accent:'#ffd700',outline:3.5,shadow:2.5,size:60,font:'LNKcap Sinhala Impact',position:'middle',glow:true},
  {id:'silverchrome',name:'Silver Chrome',category:'effects',hint:'SinCap Pro reflective chrome · premium auto & tech',mode:'phrase',motion:'zoom',color:'#ffffff',accent:'#cdd9e5',outline:4,shadow:3,size:60,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'cyberglitch',name:'Cyber Glitch',category:'effects',hint:'SinCap Pro glitch · electric cyan & crimson neon',mode:'active',color:'#00f5ff',accent:'#ff0055',outline:4,shadow:3.5,size:60,font:'LNKcap Gemunu Libre',position:'middle'},
  {id:'lightsweep',name:'Light Sweep',category:'effects',hint:'SinCap Pro light sweep shimmer · viral hooks & reveals',mode:'phrase',motion:'zoom',color:'#ffffff',accent:'#fff59d',outline:2.5,shadow:2,size:58,font:'LNKcap Sinhala Impact',position:'middle',glow:true},
  {id:'bigmoment',name:'Big Moment',category:'effects',hint:'SinCap Pro emphasis line · punchy climax & quotes',mode:'word',motion:'wordpop',color:'#ffffff',accent:'#ffe600',outline:5,shadow:3.5,size:72,font:'LNKcap Sinhala Impact',position:'middle'},
  {id:'synthwave',name:'Synthwave Glow',category:'effects',hint:'Electric magenta neon aura · gaming, EDM & tech',mode:'phrase',motion:'zoom',color:'#ffffff',accent:'#ff007f',outline:2.5,shadow:0,size:54,font:'LNKcap Gemunu Libre',position:'middle',glow:true},
  {id:'cyberglow',name:'Cyber Cyan',category:'effects',hint:'Glowing electric cyan · sci-fi & technology',mode:'phrase',motion:'zoom',color:'#ffffff',accent:'#00f0ff',outline:2.5,shadow:0,size:54,font:'LNKcap Gemunu Libre',position:'middle',glow:true},
  {id:'neon',name:'Purple Glow',category:'effects',hint:'Soft violet neon glow around your words',mode:'phrase',motion:'fade',color:'#ffffff',accent:'#b48aff',outline:2,shadow:0,size:56,position:'middle',glow:true},
  {id:'royalgold',name:'Royal Gold',category:'effects',hint:'Warm golden glow · luxury & podcast',mode:'phrase',motion:'rise',color:'#fff6d6',accent:'#ffd700',outline:2,shadow:2,size:52,font:'LNKcap Abhaya Libre',position:'bottom',glow:true}
 ];
 const fontCatalog=[
  {family:'LNKcap Sinhala Impact',name:'Sinhala Impact',hint:'Heavy & compact · Reference Pop',bundled:true,assScale:1.316},
  {family:'LNKcap Post No Bills Colombo',name:'Post No Bills Colombo',hint:'Bold stencil · Urban poster',bundled:true,assFont:'Post No Bills Colombo',assScale:1.1},
  {family:'LNKcap Atlas Chirani',name:'Atlas Chirani',hint:'Expressive handwritten script',bundled:true,assFont:'Atlas-Chirani',assScale:1.15},
  {family:'LNKcap Bindumathi',name:'Bindumathi',hint:'Playful bubble dot terminals',bundled:true,assFont:'UN-Bindumathi',assScale:1.0},
  {family:'LNKcap Derana',name:'Derana',hint:'Bold TV broadcast news headline',bundled:true,assFont:'UN-Derana',assScale:1.0},
  {family:'LNKcap Disapamok',name:'Disapamok',hint:'Heavy authoritative classical headline',bundled:true,assFont:'UN-Disapamok',assScale:1.0},
  {family:'LNKcap Sandhyanee',name:'Sandhyanee',hint:'Graceful curved calligraphy',bundled:true,assFont:'UN-Sandhyanee',assScale:1.05},
  {family:'LNKcap Alakamanda',name:'Alakamanda',hint:'Artistic modern display serif',bundled:true,assFont:'UN-Alakamanda',assScale:1.0},
  {family:'LNKcap Basuru',name:'Basuru',hint:'Contemporary crisp geometric sans',bundled:true,assFont:'UN-Basuru',assScale:1.0},
  {family:'LNKcap Bhashitha',name:'Bhashitha',hint:'National standard · ICTA Sri Lanka',bundled:true,assFont:'AdBhashitha',assScale:1.0},
  {family:'LNKcap Sigiri',name:'Sigiri',hint:'Traditional artistic headline script',bundled:true,assFont:'AF Sigiri',assScale:1.0},
  {family:'LNKcap Sandarenu',name:'Sandarenu',hint:'Smooth modern curved body text',bundled:true,assFont:'AFSandarenu',assScale:1.0},
  {family:'LNKcap Warna',name:'Warna',hint:'Large bold clear display text',bundled:true,assFont:'ICTA Large Font',assScale:1.0},
  {family:'LNKcap Abhaya Libre',name:'Abhaya Libre',hint:'Bold & expressive didone',bundled:true},
  {family:'LNKcap Gemunu Libre',name:'Gemunu Libre',hint:'Compact & modern squarish',bundled:true},
  {family:'LNKcap Yaldevi',name:'Yaldevi',hint:'Clean & confident condensed',bundled:true},
  {family:'LNKcap Noto Sans Sinhala',name:'Noto Sans Sinhala',hint:'Clear & easy to read',bundled:true},
  {family:'LNKcap Noto Serif Sinhala',name:'Noto Serif Sinhala',hint:'Classic & graceful',bundled:true},
  {family:'LNKcap Maname',name:'Maname',hint:'Soft & elegant',bundled:true},
  ...['Nirmala UI','Iskoola Pota','Segoe UI'].map(name=>({family:name,name,hint:'Windows font',bundled:false}))
 ];
 const fonts=fontCatalog.map(f=>f.family);
 const clamp=(v,a,b,f)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):f;
 const color=(v,f)=>/^#[0-9a-f]{6}$/i.test(v||'')?v:f;
 function resolve(s={}){const p=presets.find(p=>p.id===(s.preset||s.id))||presets.find(p=>p.id==='clean');return {...p,preset:p.id,size:clamp(s.size,24,100,p.size),color:color(s.color,p.color),accent:color(s.accent,p.accent),outline:clamp(s.outline,0,8,p.outline),shadow:clamp(s.shadow,0,8,p.shadow),font:fonts.includes(s.font)?s.font:(p.font||'Nirmala UI'),position:['top','middle','bottom'].includes(s.position)?s.position:(p.position||'bottom'),groupWords:Math.round(clamp(s.groupWords,1,5,p.groupWords||3)),highlight:s.highlight==='all'?'all':'first',motionSpeed:clamp(s.motionSpeed,.5,2,1),box:Boolean(s.box!==undefined?s.box:p.box),glow:Boolean(s.glow!==undefined?s.glow:p.glow)};}
 function choose(id,current={}){const p=presets.find(p=>p.id===id)||presets.find(p=>p.id==='clean');return resolve({...p,preset:p.id,font:p.font||current.font,position:p.position||current.position});}
 function wordWeight(word){
  const text=String(word||'');
  const bases=(text.match(/[\u0D85-\u0D96\u0D9A-\u0DC6a-zA-Z0-9]/g)||[]).length||1;
  const longs=(text.match(/[\u0DCF\u0DD1\u0DD3\u0DD6\u0DD8\u0DDA\u0DDC\u0DDD\u0DDF]/g)||[]).length;
  const pause=/[.,?!:;]/.test(text)?0.5:0;
  return Math.max(1.5, bases + longs * 0.45 + pause);
 }
 function words(c){
  const parts=String(c.text).trim().split(/\s+/u).filter(Boolean);
  if(!parts.length)return [];
  const weights=parts.map(wordWeight);
  const total=weights.reduce((a,b)=>a+b,0);
  const dur=c.end-c.start;
  let cursor=c.start;
  return parts.map((text,i)=>{
   const start=cursor;
   cursor=i===parts.length-1?c.end:cursor+(dur*weights[i]/total);
   return {text,start,end:cursor};
  });
 }
 function frame(c,s,t){s=resolve(s);const list=words(c);let active=list.findIndex(w=>t>=w.start&&t<w.end);if(active<0)active=Math.max(0,list.length-1);if(s.mode==='reveal'){const begin=Math.floor(active/s.groupWords)*s.groupWords,group=list.slice(begin,begin+s.groupWords);return group.map((w,j)=>{const index=begin+j,accent=s.highlight==='all'||j===0;return {text:w.text+(j<group.length-1?' ':''),color:accent?s.accent:s.color,fontScale:accent?1.18:1,opacity:index>active?0:index===active?clamp((t-w.start)/Math.min(.12,(w.end-w.start)/2),0,1,1):1,hidden:index>active,revealing:index===active};});}if(s.mode==='word')return list.length?[{text:list[active].text,color:s.accent}]:[];if(s.mode==='phrase')return [{text:c.text,color:s.color}];return list.map((w,i)=>({text:w.text+(i<list.length-1?' ':''),color:s.mode==='karaoke'?(i<=active?s.accent:s.color):(i===active?s.accent:s.color)}));}
 function motionPlan(s,duration){
  s=resolve(s);const kind=s.motion,d=Math.max(.001,duration),speed=s.motionSpeed;if(!kind)return null;
  const intro=Math.min((kind==='wordpop'?.18:kind==='fade'?.35:.3)/speed,d*.45);
  const fadeIn=Math.min((kind==='fade'?.35:kind==='wordpop'?.04:.12)/speed,d*.25);
  const fadeOut=Math.min((kind==='fade'?.25:kind==='wordpop'?.04:.12)/speed,d*.25);
  const points=kind==='bounce'||kind==='wordpop'?[[0,.8,0,0],[.45,1.08,0,0],[.75,.97,0,0],[1,1,0,0]]:kind==='zoom'?[[0,1.2,0,0],[1,1,0,0]]:kind==='rise'?[[0,1,0,32],[1,1,0,0]]:kind==='slide'?[[0,1,-70,0],[1,1,0,0]]:[[0,1,0,0],[1,1,0,0]];
  return {duration:d,intro,fadeIn,fadeOut,points:points.map(([fraction,scale,x,y])=>({time:fraction*intro,scale,x,y}))};
 }
 function motion(c,s,t){
  s=resolve(s);
  if(s.mode!=='phrase'&&s.mode!=='word')return {scale:1,x:0,y:0,opacity:1};
  let interval=c;
  if(s.mode==='word')interval=words(c).find(w=>t>=w.start&&t<w.end)||c;
  const p=motionPlan(s,interval.end-interval.start);if(!p)return {scale:1,x:0,y:0,opacity:1};
  const elapsed=t-interval.start;let a=p.points[0],b=a;for(let i=1;i<p.points.length;i++){b=p.points[i];if(elapsed<=b.time)break;a=b;}
  const k=b.time>a.time?clamp((elapsed-a.time)/(b.time-a.time),0,1,1):1;
  const value=key=>Number((a[key]+(b[key]-a[key])*k).toFixed(5));
 return {scale:value('scale'),x:value('x'),y:value('y'),opacity:Math.max(0,Math.min(1,elapsed/p.fadeIn,(p.duration-elapsed)/p.fadeOut))};
}

export { presets, fonts, fontCatalog, resolve, choose, words, frame, motionPlan, motion };
export default { presets, fonts, fontCatalog, resolve, choose, words, frame, motionPlan, motion };
