/* TEOTECH · tutor æ con WebLLM: un modelo pequeño corre en el navegador con WebGPU. Nada sale del equipo. */
const LIB="https://esm.run/@mlc-ai/web-llm@0.2.85";
const pick=f16=>f16?"Qwen2.5-0.5B-Instruct-q4f16_1-MLC":"Qwen2.5-0.5B-Instruct-q4f32_1-MLC";
const $=id=>document.getElementById(id),dlg=$("tutor");
if(dlg){
const log=$("ttLog"),prog=$("ttProg"),start=$("ttStart"),form=$("ttForm"),q=$("ttQ"),why=$("ttWhy");
let web,engine,busy=false,model;
const ctx=(document.querySelector("[data-context]")?.innerText||"").replace(/\s+/g," ").slice(0,1800);
const SYS=`Eres æ, tutor del Diplomado en Transformación Digital (TEOTECH, OpenCourseWare). Respondes en español claro, breve (máximo 6 líneas), con un ejemplo cuando ayude. Ciclo: aprender → construir → comprobar → enseñar. Si no sabes algo, dilo. Nunca pidas contraseñas ni datos personales. Termina invitando al alumno a comprobar tu respuesta: el humano decide.
Contenido de la página actual:
${ctx}`;
const hist=[{role:"system",content:SYS}];
const add=(c,t)=>{const d=document.createElement("div");d.className="msg "+c;d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight;return d};
document.querySelectorAll("[data-tutor-open]").forEach(b=>b.addEventListener("click",()=>{dlg.showModal();if(engine)q.focus()}));
dlg.querySelector("[data-tutor-close]").addEventListener("click",()=>dlg.close());
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
(async()=>{if(!navigator.gpu){why.textContent="Este navegador no tiene WebGPU. Prueba Chrome reciente en Android o computadora, o Safari 26 en iPhone.";$("ttLoad").disabled=true;return}
 try{web=await import(LIB);const ad=await navigator.gpu.requestAdapter();model=pick(ad?.features.has("shader-f16"));
  if(await web.hasModelInCache(model)){why.textContent="Modelo ya guardado: enciende sin descargar.";$("ttLoad").textContent="ENCENDER"}
  else why.textContent="Modelo: Qwen2.5 0.5B · ~300 MB una sola vez · necesita ~1 GB de memoria."}catch(e){why.textContent="No pude preparar WebLLM: "+e.message}})();
$("ttLoad").addEventListener("click",async()=>{if(!web)return;start.hidden=true;prog.hidden=false;const bar=prog.querySelector("i"),tx=prog.querySelector("span");
 try{engine=await web.CreateMLCEngine(model,{initProgressCallback:r=>{bar.style.width=Math.round((r.progress||0)*100)+"%";tx.textContent=Math.round((r.progress||0)*100)+"% · "+(r.text||"").slice(0,48)}});
  prog.hidden=true;form.hidden=false;add("sys","Listo. Pregúntame sobre esta página.").className="msg sys";q.focus()}
 catch(e){prog.hidden=true;start.hidden=false;why.textContent="No se pudo encender: "+e.message}});
form.addEventListener("submit",async e=>{e.preventDefault();const t=q.value.trim();if(!t||busy||!engine)return;q.value="";busy=true;add("me",t);hist.push({role:"user",content:t});
 const out=add("ai","…");let acc="";
 try{const s=await engine.chat.completions.create({messages:hist.slice(0,1).concat(hist.slice(-6)),stream:true,temperature:.4,max_tokens:320});
  for await(const ch of s){acc+=ch.choices[0]?.delta?.content||"";out.textContent=acc;log.scrollTop=log.scrollHeight}
  hist.push({role:"assistant",content:acc})}catch(err){out.textContent="Error: "+err.message}busy=false});
$("ttForget").addEventListener("click",async()=>{if(!web||!model)return;if(!confirm("¿Borrar el modelo guardado en este equipo?"))return;
 try{await web.deleteModelAllInfoInCache(model);engine=null;form.hidden=true;start.hidden=false;$("ttLoad").textContent="DESCARGAR Y ENCENDER";why.textContent="Modelo borrado. Liberaste ~300 MB."}catch(e){alert(e.message)}});
}
