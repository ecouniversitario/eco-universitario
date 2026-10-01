const STORAGE_KEY = "eco_universitario_noticias_v1";

const defaultNews = [
  {id:1, section:"Arquitectura", date:"2026-10-01", author:"Redacción ECO", title:"Proyectos universitarios exploran nuevas formas de habitar", excerpt:"Estudiantes presentan propuestas que relacionan diseño, funcionalidad y necesidades de la comunidad.", body:"La comunidad académica continúa desarrollando propuestas que buscan responder a los retos contemporáneos del espacio construido. Esta nota de demostración puede sustituirse por una noticia real en cada edición.", image:"AR"},
  {id:2, section:"Informática", date:"2026-10-01", author:"Redacción ECO", title:"La innovación tecnológica llega a las aulas", excerpt:"Nuevas actividades académicas acercan a estudiantes a herramientas y metodologías digitales.", body:"La tecnología forma parte de los procesos de aprendizaje y de la preparación profesional. Esta noticia es un contenido de ejemplo para mostrar el funcionamiento del periódico.", image:"IT"},
  {id:3, section:"Contaduría", date:"2026-10-01", author:"Redacción ECO", title:"Estudiantes analizan los retos financieros de las organizaciones", excerpt:"El análisis de información financiera se convierte en una herramienta para la toma de decisiones.", body:"La formación contable combina conocimientos técnicos, análisis y responsabilidad profesional. Esta nota puede reemplazarse por el contenido de la siguiente edición.", image:"CO"},
  {id:4, section:"Derecho", date:"2026-10-01", author:"Redacción ECO", title:"La formación jurídica fortalece la participación universitaria", excerpt:"Actividades académicas promueven el conocimiento de derechos, obligaciones y cultura jurídica.", body:"El estudio del Derecho permite comprender las normas que organizan la vida social y profesional. Esta noticia de ejemplo está pensada para probar la sección.", image:"DE"},
  {id:5, section:"Pedagogía", date:"2026-10-01", author:"Redacción ECO", title:"Nuevas ideas para transformar las experiencias de aprendizaje", excerpt:"La comunidad educativa comparte estrategias centradas en el estudiante y su contexto.", body:"La innovación pedagógica invita a observar, evaluar y mejorar las prácticas educativas. Esta nota es un ejemplo editable para la primera versión.", image:"PE"},
  {id:6, section:"Informática", date:"2026-10-01", author:"Redacción ECO", title:"Estudiantes desarrollan soluciones digitales para su comunidad", excerpt:"Un ejercicio académico propone utilizar tecnología para resolver necesidades concretas.", body:"Los proyectos interdisciplinarios ofrecen oportunidades para aplicar conocimientos informáticos a situaciones reales.", image:"UX"}
];

const sections = ["Arquitectura","Informática","Contaduría","Derecho","Pedagogía"];
const getNews = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultNews; }
  catch(e) { return defaultNews; }
};
const saveNews = n => localStorage.setItem(STORAGE_KEY, JSON.stringify(n));
const formatDate = d => new Intl.DateTimeFormat("es-MX",{day:"2-digit",month:"long",year:"numeric"}).format(new Date(d+"T12:00:00"));

function card(n){
  return `<article class="news-card">
    <div class="news-image">${n.image || "EU"}</div>
    <div class="news-body">
      <div class="news-meta">${n.section} · ${formatDate(n.date)}</div>
      <h3>${escapeHtml(n.title)}</h3>
      <p>${escapeHtml(n.excerpt)}</p>
      <a href="#" class="read" data-id="${n.id}">Leer noticia →</a>
    </div>
  </article>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

function render(){
  const news = getNews().sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById("featuredGrid").innerHTML = news.slice(0,3).map(card).join("");
  document.getElementById("categorySections").innerHTML = sections.map(sec=>{
    const items = news.filter(n=>n.section===sec).slice(0,3);
    return `<div class="category-block" id="${slug(sec)}">
      <div class="category-title"><span class="eyebrow">${sec.toUpperCase()}</span><h2>${sec}</h2><span class="rule"></span></div>
      <div class="category-news">${items.length ? items.map(card).join("") : "<p>Aún no hay noticias publicadas en esta sección.</p>"}</div>
    </div>`;
  }).join("");
  document.querySelectorAll(".read").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();openArticle(Number(a.dataset.id));}));
  document.getElementById("editionNumber").textContent = String(Math.max(1, Math.ceil(news.length/5))).padStart(2,"0");
}
function slug(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"");}

function openArticle(id){
  const n=getNews().find(x=>x.id===id); if(!n)return;
  document.getElementById("articleContent").innerHTML=`<div class="article-meta">${n.section} · ${formatDate(n.date)} · ${escapeHtml(n.author)}</div><h1>${escapeHtml(n.title)}</h1><div class="news-image">${n.image||"EU"}</div><p>${escapeHtml(n.body)}</p>`;
  document.getElementById("articleOverlay").classList.add("open");
}
document.getElementById("closeArticle").onclick=()=>document.getElementById("articleOverlay").classList.remove("open");
document.getElementById("articleOverlay").addEventListener("click",e=>{if(e.target.id==="articleOverlay")e.currentTarget.classList.remove("open")});

const overlay=document.getElementById("searchOverlay");
document.getElementById("searchBtn").onclick=()=>{overlay.classList.add("open");document.getElementById("searchInput").focus()};
document.getElementById("closeSearch").onclick=()=>overlay.classList.remove("open");
document.getElementById("searchInput").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase().trim();
  const results=getNews().filter(n=>(n.title+" "+n.excerpt+" "+n.section).toLowerCase().includes(q));
  document.getElementById("searchResults").innerHTML=q ? results.map(n=>`<div class="result" data-id="${n.id}"><span class="news-meta">${n.section}</span><br><strong>${escapeHtml(n.title)}</strong></div>`).join("") : "";
  document.querySelectorAll(".result").forEach(r=>r.onclick=()=>{overlay.classList.remove("open");openArticle(Number(r.dataset.id))});
});

document.getElementById("menuToggle").onclick=()=>document.getElementById("mainNav").classList.toggle("open");
document.getElementById("today").textContent = new Intl.DateTimeFormat("es-MX",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
document.getElementById("year").textContent = new Date().getFullYear();
render();
