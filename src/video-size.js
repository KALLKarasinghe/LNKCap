const presets=[{id:'original',name:'Original size'},{id:'portrait',name:'Portrait · 9:16',width:1080,height:1920},{id:'landscape',name:'Landscape · 16:9',width:1920,height:1080},{id:'square',name:'Square · 1:1',width:1080,height:1080},{id:'portrait720',name:'Portrait HD · 720 × 1280',width:720,height:1280},{id:'landscape720',name:'Landscape HD · 1280 × 720',width:1280,height:720},{id:'custom',name:'Custom size'}];
const even=n=>Math.max(2,Math.round(n/2)*2);
function source(stream){
 const [a,b]=String(stream.sample_aspect_ratio||'1:1').split(':').map(Number),sar=a>0&&b>0?a/b:1;
 let width=even(Number(stream.width)*sar),height=even(Number(stream.height));
 const rotation=Number(stream.side_data_list?.find(s=>Number.isFinite(Number(s.rotation)))?.rotation??stream.tags?.rotate??0);
 if(Math.abs(Math.round(rotation/90))%2===1)[width,height]=[height,width];
 return {width,height,encodedWidth:Number(stream.width),encodedHeight:Number(stream.height),rotation,sampleAspectRatio:sar};
}
function normalize(s={}){s=s||{};const preset=presets.some(p=>p.id===s.preset)?s.preset:'original';return {preset,width:Number(s.width??1080),height:Number(s.height??1920),fit:s.fit==='cover'?'cover':'contain'};}
function resolve(s,media){s=normalize(s);const p=presets.find(p=>p.id===s.preset);let width,height;
 if(p.id==='original'){width=even(media.width);height=even(media.height);}else if(p.id==='custom'){width=s.width;height=s.height;if(!Number.isInteger(width)||!Number.isInteger(height)||width<32||height<32||width>4096||height>4096||width%2||height%2)throw Error('Enter even pixel dimensions from 32 to 4096 (for example, 1080 × 1920).');}else{width=p.width;height=p.height;}
 return {...s,width,height};
}
function filter(s,media){const out=resolve(s,media),w=out.width,h=out.height;
 const base=`scale=${media.width}:${media.height},setsar=1`;
 if(out.preset==='original')return base;
 return out.fit==='cover'?`${base},scale=${w}:${h}:force_original_aspect_ratio=increase:force_divisible_by=2,crop=${w}:${h},setsar=1`:`${base},scale=${w}:${h}:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1`;
}

export { presets, source, normalize, resolve, filter };
export default { presets, source, normalize, resolve, filter };
