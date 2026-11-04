'use strict';
const $=id=>document.getElementById(id), KEY='danini-catalog-project-v1';
const sampleSource='sku,title,price,currency,stock\nA-100,Platnena torba,19.90,EUR,20\nA-200,Plava majica,24.90,EUR,8\nA-300,Keramička šolja,12.00,EUR,15\nA-400,Notes,8.50,EUR,30';
const sampleTarget='sku,title,price,currency,stock\nA-100,Platnena torba,19.90,EUR,20\nA-200,Majica,29.90,EUR,12\nA-300,Keramička šolja,12.00,EUR,15\nA-300,Keramička šolja,12.00,EUR,15\nX-999,Nepoznat proizvod,7.00,EUR,2';
let project=null,busy=false;
const now=()=>new Date().toISOString();
const names={SOURCE_MISMATCH:'Razlika u odnosu na izvor',SOURCE_FORMAT_DIFFERENCE:'Ista vrednost, drugačiji zapis',DUPLICATE_SKU:'Duplikat — izdvojen',NO_SOURCE:'SKU nema izvor',NOT_IN_TARGET:'Nedostaje u katalogu',MISSING_SKU:'Nedostaje SKU',MISSING_TITLE:'Nedostaje naziv',INVALID_PRICE:'Neispravna cena',INVALID_CURRENCY_CODE:'Neispravna oznaka valute',INVALID_STOCK:'Neispravno stanje',CELL_TOO_LONG:'Preduga vrednost'};
async function hash(data){return DaniniCatalog.sha256(data);}
function save(){try{if($('remember').checked&&project)localStorage.setItem(KEY,JSON.stringify({...project,savedAt:now()}));else localStorage.removeItem(KEY);}catch{$('message').textContent='Čuvanje nije dostupno. Preuzmi rezervnu kopiju projekta.';}}
function log(action,evidence){project.events.push({at:now(),action,evidence});}
function reset(){project=null;$('results').hidden=true;$('approve').checked=false;document.querySelectorAll('#steps li').forEach(x=>x.classList.remove('done'));save();}
function render(){
  if(!project)return;const r=project.result;$('results').hidden=false;
  $('metrics').replaceChildren();
  for(const [n,label] of [[r.sourceRows,'redova u izvoru'],[r.targetRows,'redova u katalogu'],[r.issues.length,'nalaza za pregled'],[r.excludedRows,'izdvojenih redova']]){const div=document.createElement('div');div.className='stat';const a=document.createElement('strong'),b=document.createElement('span');a.textContent=n;b.textContent=label;div.append(a,b);$('metrics').append(div);}
  $('issues').replaceChildren();
  for(const i of r.issues){const tr=document.createElement('tr');for(const text of [(i.sku||'—')+' / '+i.side+':'+i.row,i.field,names[i.code]||i.code,i.expected||'—',i.actual||'—']){const td=document.createElement('td');td.textContent=text;tr.append(td);}$('issues').append(tr);}
  $('coverage').textContent=r.targetRows+' ulaznih redova = '+r.draft.length+' redova u nacrtu + '+r.excludedRows+' izdvojenih. '+r.changes.length+' predloženih izmena.';
  $('result-status').textContent=project.approved?'Izveštaj odobren za preuzimanje. Naplata nije izvršena.':'Provera završena. Čeka se pregled i odobravanje izveštaja.';
  $('mentor-title').textContent=project.approved?'Rezultat je spreman.':'Pregledaj izuzetke.';
  $('mentor-message').textContent=project.approved?'Preuzmi izveštaj i nacrt. Uvoz u prodavnicu zahteva zasebnu proveru.':'Posebno proveri duplikate i proizvode bez izvora. Odobravanje se odnosi na izveštaj i delimični nacrt, ne potvrđuje tačnost svih proizvoda.';
  $('approve').checked=project.approved;for(const id of ['download-report','download-draft','download-changes','download-issues','backup'])$(id).disabled=!project.approved;
  document.querySelectorAll('#steps li').forEach((x,i)=>x.classList.toggle('done',i<(project.approved?4:2)));
  $('audit').textContent=JSON.stringify({mode:'browser-local',inputHash:project.inputHash,resultHash:project.resultHash,usage:r.usage,events:project.events},null,2);
}
for(const [field,id] of [['source-file','source'],['target-file','target']])$(field).addEventListener('change',async()=>{const f=$(field).files[0];if(!f)return;if(f.size>256000){$('message').textContent='Datoteka je veća od 256 KB.';return;}$(id).value=await f.text();reset();});
for(const id of ['source','target','decimal','delimiter','authorized'])$(id).addEventListener('input',reset);
$('remember').addEventListener('change',save);
$('demo').onclick=()=>{$('source').value=sampleSource;$('target').value=sampleTarget;$('delimiter').value=',';$('decimal').value='.';$('authorized').checked=true;reset();$('message').textContent='Učitan SINTETIČKI test. Ovo nisu podaci kupca ni stvarna porudžbina.';};
$('job-form').onsubmit=async e=>{
  e.preventDefault();if(busy)return;busy=true;$('message').textContent='';
  const input={sourceCSV:$('source').value,targetCSV:$('target').value,delimiter:$('delimiter').value,decimal:$('decimal').value,sourceAuthorized:$('authorized').checked};
  try{const result=DaniniCatalog.analyze(input);project={schemaVersion:1,input,result,inputHash:await hash(input),resultHash:await hash(result),approved:false,events:[],createdAt:now()};log('INPUT_VALIDATED',project.inputHash);log('COMPARISON_COMPLETED',project.resultHash);save();render();$('results').scrollIntoView({behavior:'smooth',block:'start'});}catch(err){reset();$('message').textContent='Obrada nije završena: '+err.message;}finally{busy=false;}
};
$('approve').onchange=()=>{if(!project)return;project.approved=$('approve').checked;log(project.approved?'REPORT_RELEASE_APPROVED':'APPROVAL_REVOKED',project.resultHash);save();render();};
async function download(name,data,type){if(!project?.approved)return;if(await hash(project.result)!==project.resultHash){$('message').textContent='Provera integriteta nije prošla. Ponovi obradu.';return;}const a=document.createElement('a'),url=URL.createObjectURL(new Blob([data],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);log('DOWNLOAD_PREPARED',name);save();render();}
$('download-report').onclick=()=>download('DANINI_Izvestaj.json',JSON.stringify({result:project.result,resultHash:project.resultHash,payment:'NOT_CHARGED',events:project.events},null,2),'application/json');
$('download-draft').onclick=()=>download('DANINI_Nacrt_za_pregled.csv',DaniniCatalog.toCSV(project.result.draft,DaniniCatalog.FIELDS),'text/csv;charset=utf-8');
$('download-changes').onclick=()=>download('DANINI_Izmene.csv',DaniniCatalog.toCSV(project.result.changes,['sku','field','sourceRow','targetRow','before','after']),'text/csv;charset=utf-8');
$('download-issues').onclick=()=>download('DANINI_Nalazi.csv',DaniniCatalog.toCSV(project.result.issues,['side','row','sku','field','code','expected','actual']),'text/csv;charset=utf-8');
$('backup').onclick=()=>download('DANINI_Projekat_rezervna_kopija.json',JSON.stringify(project,null,2),'application/json');
$('clear').onclick=()=>{localStorage.removeItem(KEY);$('remember').checked=false;$('source').value='';$('target').value='';$('authorized').checked=false;reset();$('message').textContent='Lokalni projekat je obrisan.';$('mentor-title').textContent='Prvo razjasnimo izvor.';};
(async()=>{try{const p=JSON.parse(localStorage.getItem(KEY)||'null');if(!p)return;if(!Number.isFinite(Date.parse(p.createdAt))||Date.parse(p.createdAt)>Date.now()+60000||Date.now()-Date.parse(p.createdAt)>7*86400000){localStorage.removeItem(KEY);return;}if(p.schemaVersion!==1||await hash(p.result)!==p.resultHash)throw Error('INVALID_SAVED_PROJECT');const recomputed=DaniniCatalog.analyze(p.input);if(await hash(recomputed)!==p.resultHash||await hash(p.input)!==p.inputHash)throw Error('INVALID_SAVED_PROJECT');project=p;for(const id of ['source','target'])$(id).value=p.input[id+'CSV'];$('delimiter').value=p.input.delimiter;$('decimal').value=p.input.decimal;$('authorized').checked=true;$('remember').checked=true;log('PROJECT_RESUMED',p.resultHash);save();render();}catch{localStorage.removeItem(KEY);$('message').textContent='Sačuvani projekat nije važeći. Učitaj izvorne datoteke.';}})();
