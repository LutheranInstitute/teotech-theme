/* TEOTECH · fondo de tinta con WebGPU (líneas que respiran). Sin WebGPU: no pasa nada. */
(async()=>{const badge=document.getElementById("gpuBadge"),cv=document.getElementById("ink");
const set=(on,t)=>{if(badge){badge.textContent=t;badge.className="gpu "+(on?"on":"off")}};
if(!navigator.gpu||!cv){set(false,"SIN GPU");return}
let ad;try{ad=await navigator.gpu.requestAdapter({powerPreference:"low-power"})}catch(e){}
if(!ad){set(false,"SIN GPU");return}
window.teotechF16=ad.features.has("shader-f16");set(true,"WEBGPU ✓");
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
const dev=await ad.requestDevice(),ctx=cv.getContext("webgpu"),fmt=navigator.gpu.getPreferredCanvasFormat();
ctx.configure({device:dev,format:fmt,alphaMode:"premultiplied"});
const code=`struct U{t:f32,w:f32,h:f32,p:f32};@group(0)@binding(0)var<uniform> u:U;
@vertex fn vs(@builtin(vertex_index) i:u32)->@builtin(position) vec4f{var p=array(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));return vec4f(p[i],0,1);}
@fragment fn fs(@builtin(position) q:vec4f)->@location(0) vec4f{
 let uv=q.xy/vec2f(u.w,u.h);let y=uv.y*26.0+sin(uv.x*6.0+u.t*.35)*.9+sin(uv.x*13.0-u.t*.2)*.35;
 let d=abs(fract(y)-.5);let l=smoothstep(.06,.0,d)*(.35+.65*smoothstep(1.0,.0,abs(uv.x-.5)*1.6));
 return vec4f(.08,.08,.08,1.0)*l*.5;}`;
const m=dev.createShaderModule({code}),pl=dev.createRenderPipeline({layout:"auto",vertex:{module:m,entryPoint:"vs"},
 fragment:{module:m,entryPoint:"fs",targets:[{format:fmt,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}});
const ub=dev.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),bg=dev.createBindGroup({layout:pl.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:ub}}]});
const fit=()=>{const r=Math.min(devicePixelRatio,1.5);cv.width=innerWidth*r;cv.height=innerHeight*r};fit();addEventListener("resize",fit);
let last=0;const f=t=>{requestAnimationFrame(f);if(document.hidden||t-last<33)return;last=t;
 dev.queue.writeBuffer(ub,0,new Float32Array([t/1000,cv.width,cv.height,0]));
 const e=dev.createCommandEncoder(),p=e.beginRenderPass({colorAttachments:[{view:ctx.getCurrentTexture().createView(),loadOp:"clear",clearValue:{r:0,g:0,b:0,a:0},storeOp:"store"}]});
 p.setPipeline(pl);p.setBindGroup(0,bg);p.draw(3);p.end();dev.queue.submit([e.finish()])};requestAnimationFrame(f)})();
