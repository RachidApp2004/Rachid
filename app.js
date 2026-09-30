const PAGES=[["index.html","Accueil"],["bibliotheque.html","Bibliothèque"],["concours.html","Concours"],["methodes.html","Méthodes"],["contribuer.html","Contribuer"]];
const cur=location.pathname.split("/").pop()||"index.html";
document.getElementById("hdr").innerHTML=`<header class="top"><div class="w"><a class="logo" href="index.html">Prépa<b>thèque</b></a><nav aria-label="Navigation principale">${PAGES.map(([h,t])=>`<a href="${h}" ${h===cur?'class="on" aria-current="page"':""}>${t}</a>`).join("")}</nav></div></header>`;
document.getElementById("ftr").innerHTML=`<footer><div class="w">Prépathèque — ressources gratuites pour les classes préparatoires (France &amp; Maroc). Les documents restent la propriété de leurs auteurs et éditeurs. Vérifiez toujours les informations officielles sur les sites des concours.</div></footer>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const size=n=>n>1e6?(n/1e6).toFixed(1)+" Mo":Math.max(1,Math.round(n/1e3))+" Ko";
fetch("data/documents.json").then(r=>r.json()).catch(()=>[]).then(D=>{
 const set=k=>[...new Set(D.map(d=>d[k]))].sort((a,b)=>String(b).localeCompare(a,"fr",{numeric:true}));
 const card=d=>`<article class="card"><span class="tag">${esc(d.type)}</span><span class="tag">${esc(d.filiere)}</span><h3>${esc(d.matiere)} — ${esc(d.source)} ${esc(d.annee)}</h3><p>${esc(d.titre)} (${size(d.taille)})</p><a class="btn alt" href="${encodeURI(d.fichier)}" download>Télécharger</a></article>`;
 const st=document.getElementById("stats");
 if(st)st.innerHTML=`<div><b>${D.length}</b>documents</div><div><b>${set("source").length}</b>concours</div><div><b>${set("matiere").length}</b>matières</div>`;
 const last=document.getElementById("last");
 if(last)last.innerHTML=D.length?D.slice(-6).reverse().map(card).join(""):'<div class="empty">Aucun document pour l’instant. Ajoutez le premier depuis la page <a href="contribuer.html">Contribuer</a>.</div>';
 const list=document.getElementById("list");if(!list)return;
 const F={q:"",filiere:"",matiere:"",source:"",annee:"",type:""};
 for(const k of ["filiere","matiere","source","annee","type"]){const s=document.getElementById(k);s.innerHTML=`<option value="">${s.dataset.l}</option>`+set(k).map(v=>`<option>${esc(v)}</option>`).join("");s.onchange=()=>{F[k]=s.value;draw()}}
 const q=document.getElementById("q");q.value=new URLSearchParams(location.search).get("q")||"";F.q=q.value;q.oninput=()=>{F.q=q.value;draw()};
 function draw(){const t=F.q.toLowerCase();const R=D.filter(d=>["filiere","matiere","source","annee","type"].every(k=>!F[k]||d[k]===F[k])&&(!t||(d.titre+" "+d.matiere+" "+d.source).toLowerCase().includes(t)));
  document.getElementById("count").textContent=R.length+" résultat"+(R.length>1?"s":"");
  list.innerHTML=R.length?R.map(card).join(""):`<div class="empty">${D.length?"Aucun document ne correspond. Essayez d’enlever un filtre.":'La bibliothèque est vide. Suivez le guide de la page <a href="contribuer.html">Contribuer</a> pour téléverser vos premiers PDF.'}</div>`}
 draw();
});
