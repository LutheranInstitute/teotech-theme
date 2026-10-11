/* TEOTECH · UI: cuenta regresiva, secciones plegables con memoria, plegar/desplegar todo */
(()=>{const TZ=document.documentElement.dataset.tz||"America/Chicago";
const parts=d=>Object.fromEntries(new Intl.DateTimeFormat("en-US",{timeZone:TZ,weekday:"short",hour:"numeric",minute:"numeric",second:"numeric",hour12:false}).formatToParts(d).map(p=>[p.type,p.value]));
const DAYS={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
/* data-countdown="2@19:00" → martes 7 pm en la zona del sitio */
const left=spec=>{const[m,dw,hh,mm]=spec.match(/^(\d)@(\d+):(\d+)$/)||[];if(!m)return null;const p=parts(new Date());
 const now=((DAYS[p.weekday]*24+(+p.hour%24))*60+(+p.minute))*60+(+p.second);let tgt=((+dw*24+(+hh))*60+(+mm))*60,d=tgt-now;if(d<-5400)d+=604800;return d};
const fmt=s=>{if(s<=0)return"EN VIVO AHORA ●";const d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);return(d?d+"D ":"")+String(h).padStart(2,"0")+"H "+String(m).padStart(2,"0")+"M"};
const cds=[...document.querySelectorAll("[data-countdown]")];cds.forEach(e=>e.dataset.label=e.textContent);
const tick=()=>cds.forEach(e=>{const s=left(e.dataset.countdown);if(s!=null)e.textContent=e.dataset.label+" · "+fmt(s)});tick();setInterval(tick,30000);
/* plegables */
const K="tt-fold:"+location.pathname,st=JSON.parse(localStorage.getItem(K)||"{}");
const folds=[...document.querySelectorAll("details.fold")];
folds.forEach((d,i)=>{const id=d.id||"f"+i;if(id in st)d.open=st[id];
 d.addEventListener("toggle",()=>{st[id]=d.open;localStorage.setItem(K,JSON.stringify(st));if(d.open&&d.dataset.solo!=null)folds.forEach(o=>{if(o!==d&&o.dataset.solo!=null)o.open=false})})});
document.querySelectorAll("[data-fold-all]").forEach(b=>b.addEventListener("click",()=>{const open=!folds.every(d=>d.open);folds.forEach(d=>d.open=open);b.textContent=open?"PLEGAR TODO −":"DESPLEGAR TODO +"}));
/* revelar al hacer scroll */
if("IntersectionObserver"in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});
 document.querySelectorAll(".fold,.card,.stat").forEach(e=>{e.classList.add("rv");io.observe(e)})}
/* copiar */
document.querySelectorAll("[data-copy]").forEach(b=>b.addEventListener("click",()=>{navigator.clipboard?.writeText(b.dataset.copy).then(()=>{const t=b.textContent;b.textContent="✓ COPIADO";setTimeout(()=>b.textContent=t,1400)})}));
})();
