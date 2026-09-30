'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {evaluateImport}=require('../core/importos-engine');
const {previewResult}=require('../server-importos-runtime');
class Element{constructor(tag='div'){this.tag=tag;this.textContent='';this.children=[];this.style={}}appendChild(el){this.children.push(el)}replaceChildren(){this.children=[];this.textContent=''}text(){return this.textContent+' '+this.children.map(e=>e.text()).join(' ')}}
async function main(){
  const out=new Element(),button=new Element('button');let submit,assigned,draft;
  const values=new Map(Object.entries({budget:'9000',reserve:'1000',label0:'Test kandidat',price0:'5000',transport0:'700',export0:'250',local0:'600',year0:'2007',euro0:'4',origin0:'unknown'}));
  const form={addEventListener:(name,fn)=>{submit=fn},querySelector:()=>button};
  const context={document:{documentElement:{lang:'sr'},getElementById:id=>id==='buyer-plan'?form:id==='buyer-result'?out:null,createElement:tag=>new Element(tag)},FormData:class{get(k){return values.get(k)||null}has(k){return values.has(k)}},Intl,Number,String,URLSearchParams,AbortSignal,location:{search:'',assign:url=>assigned=url},sessionStorage:{setItem:(key,value)=>draft=value},navigator:{clipboard:{writeText:async()=>{}}},fetch:async(url,options)=>{assert.equal(url,'/api/importos/evaluate');const body=JSON.parse(options.body);assert.equal(body.otherCosts,1600);assert.ok(!('link' in body));return {ok:true,json:async()=>({result:previewResult(evaluateImport(body))})}}};
  vm.runInNewContext(fs.readFileSync('public/buyer-plan-client.js','utf8'),context);
  await submit({preventDefault(){}});
  assert.match(out.text(),/povoljniji scenario/);assert.match(out.text(),/VIN/);assert.ok(out.children.some(e=>e.tag==='article'));
  const ask=out.children.find(e=>e.tag==='button'&&e.textContent.includes('ručnu'));
  ask.onclick();assert.equal(assigned,'/sr/upit?service=AD_REVIEW');assert.match(draft,/Test kandidat/);assert.match(draft,/dokaz/);assert.equal(button.disabled,false);
  values.set('budget','0');await submit({preventDefault(){}});assert.match(out.text(),/pozitivan budžet/);
  console.log('DANINI buyer budget, unknown origin, questions and inquiry handoff: OK');
}
main().catch(error=>{console.error(error);process.exitCode=1});
