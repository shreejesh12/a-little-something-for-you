import React,{useRef,useEffect,useState} from 'react';
type V=[number,number,number];
const sub=(a:V,b:V):V=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const cross=(a:V,b:V):V=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=(a:V):V=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l) as V};
let data:number[]=[];let mapper:((p:V)=>V)|null=null;
function mesh(fn:(u:number,v:number)=>V,nu:number,nv:number,col:V,kind=0){
 const base=fn;const fn2=(u:number,v:number)=>mapper?mapper(base(u,v)):base(u,v);
 const point=(u:number,v:number)=>{const p=fn2(u,v),a=fn2(Math.max(0,u-.001),v),b=fn2(Math.min(1,u+.001),v),c=fn2(u,Math.max(0,v-.001)),d=fn2(u,Math.min(1,v+.001));const n=norm(cross(sub(b,a),sub(d,c)));return [...p,...n,...col,u,v,kind]};
 const pts:number[][]=[];for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++)pts.push(point(i/nu,j/nv));
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=i*(nv+1)+j,b=a+nv+1;data.push(...pts[a],...pts[b],...pts[b+1],...pts[a],...pts[b+1],...pts[a+1]);}
}
function cylinder(a:V,b:V,r:number,col:V){const d=sub(b,a),t=norm(d),n=norm(cross(t,[0,0,1])),k=cross(t,n);mesh((u,v)=>a.map((x,i)=>x+u*d[i]+r*(n[i]*Math.cos(v*6.283)+k[i]*Math.sin(v*6.283))) as V,2,12,col,1)}
function leaf(p:V,ang:number,size:number){mesh((u,v)=>{const w=(v-.5)*2,len=u*size,width=Math.sin(Math.PI*u)*.24*size*w,z=.13*Math.sin(Math.PI*u)*(1-w*w);return [p[0]+Math.cos(ang)*len-Math.sin(ang)*width,p[1]+Math.sin(ang)*len+Math.cos(ang)*width,p[2]+z]},24,12,[.12,.30,.16],1)}
function bloom(center:V,size:number,col:V,axis:V,type:number,phase=0){
 const z=norm(axis),x=norm(cross([0,1,.001],z)),y=cross(z,x);mapper=(p:V)=>center.map((v,i)=>v+p[0]*x[i]+p[1]*y[i]+p[2]*z[i]) as V;
 const layers=type===0?3:type===1?2:2;
 for(let layer=0;layer<layers;layer++){
 const count=type===0?8:type===1?12:3;
 for(let i=0;i<count;i++){const ang=i/count*6.283+layer*.57+phase;
 mesh((u,v)=>{const w=(v-.5)*2,sh=Math.pow(Math.max(0,Math.sin(Math.PI*u)),.55);
 let r:number,t:number,h:number;
 if(type===0){const L=1-layer*.16;r=size*(.12+L*u);t=size*.25*L*w*sh;h=size*(layer*.07+.22*u*u+.08*w*w*sh);}
 else if(type===1){r=size*(.10+.90*u-.15*w*w*Math.sin(u*1.57));t=size*.27*w*sh;h=size*(.03*layer+.13*u*u+.04*w*w*sh);}
 else {r=size*(.12+.65*Math.sin(u*1.65));t=size*.58*w*sh;h=size*(u*1.15+.14*w*w*sh);}
 return[r*Math.cos(ang)-t*Math.sin(ang),r*Math.sin(ang)+t*Math.cos(ang),h];},24,20,col,0);
 }}
 if(type===1)mesh((u,v)=>{const a=v*6.283,r=size*.20*Math.sin(u*3.14);return[r*Math.cos(a),r*Math.sin(a),.08+size*.13*Math.cos(u*3.14)]},16,24,[.76,.48,.08],1);
 mapper=null;
}
function stem(a:V,b:V){cylinder(a,b,.018,[.15,.31,.14])}
function pot(color:V,type=0){mesh((u,v)=>{const a=v*6.283,r=type===0?.67:type===1?.15+u*.62:.44+.17*Math.sin(u*3.14);return[r*Math.sin(a),-1.18+u*1.15,r*Math.cos(a)]},24,96,color,3);mesh((u,v)=>{const a=v*6.283;return[u*.66*Math.sin(a),-1.18,u*.66*Math.cos(a)]},12,80,color,2)}
const palettes:V[]=[[.97,.74,.75],[.89,.64,.76],[.72,.57,.82],[.95,.86,.74],[.48,.15,.28]];
const variants:number[][]=[];
for(let style=0;style<3;style++){
 data=[];
 if(style===0){
 for(let row=0;row<3;row++)for(let i=0;i<8;i++){const a=i/8*6.283+row*.39,r=row===0?.62:row===1?.51:.23;const p:V=[Math.sin(a)*r,.18+row*.29,Math.cos(a)*r];bloom(p,.29,palettes[(i+row*2)%5],[Math.sin(a)*.8,.55+row*.3,Math.cos(a)*.8],i%3===0?2:0,i*.4)}
 bloom([0,.98,0],.35,palettes[0],[0,1,.001],0);pot([.15,.28,.38]);
 }else if(style===1){
 for(let i=0;i<15;i++){const a=i*2.399,r=.56*Math.sqrt(i/15),p:V=[Math.sin(a)*r,.45+(i%3)*.18,Math.cos(a)*r];stem([0,-1,0],p);bloom(p,.26,i%3===0?[.97,.87,.74]:i%3===1?[.94,.53,.65]:[.71,.30,.48],[Math.sin(a)*.42,1,Math.cos(a)*.42],2,i)}
 pot([.70,.40,.50],1);
 }else{
 for(let i=0;i<24;i++){const a=i*2.399,r=.68*Math.sqrt(i/24),p:V=[Math.sin(a)*r,.22+(i%4)*.20,Math.cos(a)*r];stem([0,-.7,0],p);bloom(p,.30,i%4===0?[.90,.58,.35]:i%4===1?[.98,.83,.74]:i%4===2?[.86,.45,.62]:[.95,.92,.82],[Math.sin(a)*.75,.45,Math.cos(a)*.75],1,i)}
 pot([.70,.67,.58],2);
 }
 for(let i=0;i<20;i++){const a=i/20*6.283;leaf([Math.sin(a)*.44,.02,Math.cos(a)*.44],a,.62)}
 variants.push(data);
}
data=variants[0];

const vs=`attribute vec3 p;attribute vec3 n;attribute vec3 c;attribute vec3 extra;uniform vec2 rot;uniform float aspect;varying vec3 N;varying vec3 C;varying vec3 P;varying vec3 E;
void main(){float cy=cos(rot.y),sy=sin(rot.y),cx=cos(rot.x),sx=sin(rot.x);mat3 Y=mat3(cy,0.,-sy,0.,1.,0.,sy,0.,cy);mat3 X=mat3(1.,0.,0.,0.,cx,sx,0.,-sx,cx);vec3 q=X*Y*(p+vec3(0.,.13,0.));N=X*Y*n;P=q;C=c;E=extra;gl_Position=vec4(q.x*2.35/aspect,q.y*2.35,-q.z*.28,4.7-q.z*.36);}`;
const fs=`precision mediump float;varying vec3 N;varying vec3 C;varying vec3 P;varying vec3 E;uniform sampler2D label;
void main(){vec3 n=normalize(N);if(!gl_FrontFacing)n=-n;vec3 light=normalize(vec3(-.6,.9,1.6));float diff=max(dot(n,light),0.);float back=max(dot(-n,light),0.);float petal=1.-step(.5,E.z);float softness=.38+.57*diff+petal*.16*back;float veins=1.;float edge=petal*pow(E.x,7.)*.09;float spec=pow(max(dot(reflect(-light,n),vec3(0.,0.,1.)),0.),28.)*.025;vec3 base=C;if(E.z>2.5){vec4 tex=texture2D(label,vec2(fract(E.y+.5),1.-E.x));base=mix(C,tex.rgb,tex.a);}vec3 color=base*softness*veins+vec3(edge+spec);float core=petal*(1.-smoothstep(0.,.5,E.x))*.20;color*=1.-core;gl_FragColor=vec4(pow(color,vec3(.87)),1.);}`;
export function FlowerScene(){const [choice,setChoice]=useState(1);const ref=useRef<HTMLCanvasElement>(null);const rot=useRef({x:-.12,y:.12});const drag=useRef<{x:number,y:number}|null>(null);
 useEffect(()=>{const canvas=ref.current!;const gl=canvas.getContext('webgl',{antialias:true,alpha:true});if(!gl)return;const shader=(type:number,src:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'shader');return s};const program=gl.createProgram()!;gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(variants[choice]),gl.STATIC_DRAW);['p','n','c','extra'].forEach((key,i)=>{const a=gl.getAttribLocation(program,key);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,48,i*12)});const labelCanvas=document.createElement('canvas');labelCanvas.width=2048;labelCanvas.height=1024;const lc=labelCanvas.getContext('2d')!;lc.clearRect(0,0,2048,1024);lc.strokeStyle='#e2bd75';lc.fillStyle='#e2bd75';lc.lineWidth=3;lc.beginPath();lc.ellipse(1024,512,185,230,0,0,Math.PI*2);lc.stroke();lc.beginPath();lc.ellipse(1024,512,172,216,0,0,Math.PI*2);lc.stroke();lc.textAlign='center';lc.font='bold 64px Georgia';lc.fillText('From',1024,492);lc.font='bold 75px Georgia';lc.fillText('Shrijesh',1024,560);lc.font='32px Georgia';lc.fillText('✧',1024,400);lc.fillText('✧',1024,645);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,labelCanvas);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(gl.getUniformLocation(program,'label'),0);gl.enable(gl.DEPTH_TEST);const r=gl.getUniformLocation(program,'rot'),aspect=gl.getUniformLocation(program,'aspect');let frame=0;const render=()=>{const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,2);if(canvas.width!==Math.round(box.width*dpr)||canvas.height!==Math.round(box.height*dpr)){canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);}gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform2f(r,rot.current.x,rot.current.y);gl.uniform1f(aspect,box.width/box.height);gl.drawArrays(gl.TRIANGLES,0,variants[choice].length/12);frame=requestAnimationFrame(render)};render();return()=>{cancelAnimationFrame(frame);gl.deleteBuffer(buffer);gl.deleteProgram(program)}},[choice]);
 return <><div className="bouquet-picker" aria-label="Choose a bouquet">{["Tulips for you","The garden box","Wildflower day"].map((name,idx)=>{const i=[1,0,2][idx];return <button className={choice===i?"selected":""} aria-pressed={choice===i} key={name} onClick={()=>{rot.current={x:-.12,y:.12};setChoice(i)}}>{name}</button>})}</div><div className="sculpture"><canvas ref={ref} aria-label={["Mixed flowers in a blue garden box","Pink and cream tulips in a rose-colored wrap","Wildflowers in a cream vase"][choice]} tabIndex={0} onKeyDown={e=>{if(e.key.startsWith('Arrow')){e.preventDefault();rot.current.y+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;rot.current.x+=e.key==='ArrowUp'?.15:e.key==='ArrowDown'?-.15:0}}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY}}} onPointerMove={e=>{if(drag.current){rot.current.x+=(e.clientY-drag.current.y)*.008;rot.current.y+=(e.clientX-drag.current.x)*.01;drag.current={x:e.clientX,y:e.clientY}}}} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}/></div></>
                  }
