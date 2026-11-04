'use strict';
// Shared deterministic verification engine. No model, network, store writes or billing.
(function(root, factory) {
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.DaniniCatalog=api;
})(typeof globalThis!=='undefined'?globalThis:this, function() {
  const FIELDS=['sku','title','price','currency','stock'];
  const MAX_ROWS=500, MAX_CHARS=256000;
  function parseCSV(text, delimiter=',') {
    if(typeof text!=='string'||text.length>MAX_CHARS)throw Error('FILE_TOO_LARGE');
    if(![',',';'].includes(delimiter))throw Error('INVALID_DELIMITER');
    text=text.replace(/^\uFEFF/,'');
    const rows=[];let row=[],cell='',quoted=false,afterQuote=false;
    function pushCell(){row.push(cell);cell='';afterQuote=false;}
    function pushRow(){pushCell();if(row.some(v=>v.trim()!==''))rows.push(row);row=[];if(rows.length>MAX_ROWS+1)throw Error('ROW_LIMIT');}
    for(let i=0;i<text.length;i++) {
      const c=text[i];
      if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;afterQuote=true;}}else cell+=c;continue;}
      if(c==='"'){if(cell!==''||afterQuote)throw Error('INVALID_CSV_QUOTE');quoted=true;}
      else if(c===delimiter)pushCell();
      else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;pushRow();}
      else {if(afterQuote)throw Error('INVALID_CSV_AFTER_QUOTE');cell+=c;}
    }
    if(quoted)throw Error('UNCLOSED_CSV_QUOTE');
    if(cell!==''||row.length||afterQuote)pushRow();
    if(rows.length<2)throw Error('EMPTY_CATALOG');
    const headers=rows.shift().map(h=>h.trim().toLowerCase());
    if(new Set(headers).size!==headers.length)throw Error('DUPLICATE_HEADER');
    if(FIELDS.some(k=>!headers.includes(k)))throw Error('REQUIRED_HEADERS: '+FIELDS.join(','));
    return rows.map((values,i)=>{
      if(values.length!==headers.length)throw Error('COLUMN_COUNT_ROW_'+(i+2));
      return {row:i+2,values:Object.fromEntries(FIELDS.map(k=>[k,values[headers.indexOf(k)].trim()]))};
    });
  }
  function money(value, decimal) {
    if(!['.',','].includes(decimal))throw Error('INVALID_DECIMAL');
    const pattern=decimal==='.'?/^\d+(?:\.\d{1,2})?$/:/^\d+(?:,\d{1,2})?$/;
    if(!pattern.test(value))return null;
    const parts=value.split(decimal), n=Number(parts[0])*100+Number((parts[1]||'').padEnd(2,'0'));
    return Number.isSafeInteger(n)&&n<=10000000000?n:null;
  }
  function analyze(input) {
    if(!input||input.sourceAuthorized!==true)throw Error('SOURCE_PERMISSION_REQUIRED');
    const delimiter=input.delimiter||',', decimal=input.decimal||'.';
    if(!['.',','].includes(decimal))throw Error('INVALID_DECIMAL');
    const source=parseCSV(input.sourceCSV,delimiter),target=parseCSV(input.targetCSV,delimiter);
    const issues=[],draft=[], changes=[], excluded=[];
    function issue(side,r,field,code,expected='',actual=''){issues.push({side,row:r.row,sku:r.values.sku,field,code,expected,actual});}
    function index(rows,side) {
      const counts=new Map(),map=new Map();
      rows.forEach(r=>counts.set(r.values.sku,(counts.get(r.values.sku)||0)+1));
      for(const r of rows) {
        const v=r.values;let valid=true;
        const fail=(f,c)=>{issue(side,r,f,c,'',v[f]);valid=false;};
        if(!v.sku)fail('sku','MISSING_SKU');
        else if(counts.get(v.sku)>1)fail('sku','DUPLICATE_SKU');
        if(!v.title)fail('title','MISSING_TITLE');
        if(money(v.price,decimal)===null)fail('price','INVALID_PRICE');
        if(!/^[A-Z]{3}$/.test(v.currency))fail('currency','INVALID_CURRENCY_CODE');
        if(!/^\d+$/.test(v.stock)||!Number.isSafeInteger(Number(v.stock))||Number(v.stock)>10000000)fail('stock','INVALID_STOCK');
        if(Object.values(v).some(x=>x.length>2000))fail('title','CELL_TOO_LONG');
        map.set(v.sku,{...r,valid,unique:counts.get(v.sku)===1});
      }
      return map;
    }
    const s=index(source,'source'),t=index(target,'target');
    let matched=0;
    for(const row of target) {
      const sku=row.values.sku,a=s.get(sku),b=t.get(sku);
      if(!sku||!b.unique||!a||!a.unique||!a.valid){excluded.push({row:row.row,sku,reason:!a?'NO_SOURCE':'AMBIGUOUS_OR_INVALID_SOURCE'});if(!a)issue('target',row,'sku','NO_SOURCE');continue;}
      matched++;
      for(const field of FIELDS.slice(1)) {
        const av=a.values[field], bv=row.values[field];
        const same=field==='price'?money(av,decimal)===money(bv,decimal):field==='stock'?Number(av)===Number(bv)&&/^\d+$/.test(bv):av===bv;
        if(!same||av!==bv){issue('target',row,field,same?'SOURCE_FORMAT_DIFFERENCE':'SOURCE_MISMATCH',av,bv);changes.push({sku,field,sourceRow:a.row,targetRow:row.row,before:bv,after:av});}
      }
      // A source-backed draft only; never an automatic import or publication.
      draft.push({...a.values});
    }
    for(const row of source)if(row.values.sku&&!t.has(row.values.sku))issue('source',row,'sku','NOT_IN_TARGET');
    return {schemaVersion:1,method:'deterministic-source-comparison',sourceRows:source.length,targetRows:target.length,matchedRows:matched,excludedRows:excluded.length,issues,changes,excluded,draft,
      limitations:['Only the five declared fields are checked; other columns are omitted. Values are trimmed on ingestion; comparisons and change logs use trimmed values.','Source authority and real-world accuracy are supplied by the customer, not independently verified.','No product suitability, legal compliance, translation or successful store import is certified.','No external URL is visited; no AI API is called.'],
      usage:{modelCalls:0,inputTokens:0,outputTokens:0,apiCostEur:0},reconciliation:{targetRows:target.length,draftRows:draft.length,excludedRows:excluded.length}};
  }
  function csvCell(value) {
    let s=String(value??'');
    // Avoid executable spreadsheet formulas, including leading whitespace/control bytes.
    if(/^[\s\x00-\x1f]*[=+@-]/.test(s))s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  }
  function toCSV(rows,fields){return fields.map(csvCell).join(',')+'\r\n'+rows.map(r=>fields.map(k=>csvCell(r[k])).join(',')).join('\r\n')+'\r\n';}
  function sha256(value) {
    const bytes=new TextEncoder().encode(typeof value==='string'?value:JSON.stringify(value));
    const size=Math.ceil((bytes.length+9)/64)*64, data=new Uint8Array(size);data.set(bytes);data[bytes.length]=128;
    const view=new DataView(data.buffer);view.setUint32(size-8,Math.floor(bytes.length/536870912));view.setUint32(size-4,(bytes.length*8)>>>0);
    const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rot=(n,x)=>(x>>>n)|(x<<(32-n));
    for(let offset=0;offset<size;offset+=64){
      for(let i=0;i<16;i++)w[i]=view.getUint32(offset+i*4);
      for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(rot(7,a)^rot(18,a)^(a>>>3))+w[i-7]+(rot(17,b)^rot(19,b)^(b>>>10)))>>>0;}
      let [a,b,c,d,e,f,g,hh]=h;
      for(let i=0;i<64;i++){const t1=(hh+(rot(6,e)^rot(11,e)^rot(25,e))+((e&f)^(~e&g))+k[i]+w[i])>>>0,t2=((rot(2,a)^rot(13,a)^rot(22,a))+((a&b)^(a&c)^(b&c)))>>>0;hh=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
      [a,b,c,d,e,f,g,hh].forEach((v,i)=>h[i]=(h[i]+v)>>>0);
    }
    return h.map(n=>n.toString(16).padStart(8,'0')).join('');
  }
  return {FIELDS,MAX_ROWS,parseCSV,money,analyze,toCSV,sha256};
});
