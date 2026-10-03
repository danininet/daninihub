'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
class Element{constructor(){this.children=[];this.style={};this.textContent=''}appendChild(e){this.children.push(e)}replaceChildren(){this.children=[]}}
for(const lang of ['sr','de']){
  let submit,draft,target;const out=new Element();
  const values=new Map(Object.entries({budget:'8000',criteria:'Benzin, automatik, bez kompresora',purpose:'Niš, grad i put',details:'https://example.org/auto',stage:'0'}));
  const form={elements:{stage:{options:[{text:'1. Izbor i budžet'}],selectedIndex:0}},addEventListener:(event,fn)=>submit=fn};
  const context={document:{documentElement:{lang},getElementById:id=>id==='purchase-brief'?form:out,createElement:()=>new Element()},FormData:class{get(key){return values.get(key)}},Number,String,sessionStorage:{setItem:(key,value)=>{assert.equal(key,'danini-buyer-plan-draft');draft=value}},location:{assign:url=>target=url}};
  vm.runInNewContext(fs.readFileSync('public/purchase-journey-client.js','utf8'),context);
  submit({preventDefault(){}});assert.equal(out.children.length,2);out.children[1].onclick();
  assert.match(draft,/Benzin, automatik, bez kompresora/);assert.match(draft,/8000 EUR/);assert.match(target,/service=AD_REVIEW/);
  assert.equal(target,lang==='sr'?'/sr/upit?service=AD_REVIEW':'/de/anfrage?service=AD_REVIEW');
  for(const invalid of ['0','-1','Infinity','abc']){values.set('budget',invalid);submit({preventDefault(){}});assert.equal(out.children.length,1);assert.equal(out.children[0].onclick,undefined)}
}
console.log('Purchase dossier: SR/DE handoff preserves constraints; invalid budgets rejected: OK');
