import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:4321';
const examples = [
  { key:'market', value:'https://www.kleinanzeigen.de/s-anzeige/auto-angebot/1234567890-216-1234' },
  { key:'vin', value:'WVWZZZ1JZXW000001' },
  { key:'text', value:'Privatverkauf VW Golf Baujahr 2019, 98000 km, Preis 12900 EUR. Serviceheft und Fahrzeugpapiere bitte prüfen. Keine Anzahlung vor der Besichtigung.' },
];
const viewports = [
  {name:'desktop',width:1440,height:900},
  {name:'mobile',width:390,height:844},
];
mkdirSync('qa-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let passed=0;
try {
 for (const locale of ['de','sr']) {
  for (const viewport of viewports) {
   const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   for(const example of examples) {
    const response=await page.goto(base+'/'+locale+'/',{waitUntil:'networkidle'});
    assert.equal(response.status(),200);
    const h1=await page.locator('.auto-hero h1').textContent();
    assert.match(h1,locale==='de'?/Autokauf in Deutschland/:/Kupovina automobila iz Nemačke/);
    assert.equal(await page.locator('#vehicle-source').count(),1);
    // Visibility regression: white-on-light text passed earlier DOM-only QA.
    // Check computed colors on actual rendered elements, not merely HTML existence.
    const pageContrast=await page.evaluate(()=>{
      const rgb=(selector)=>{
        const el=document.querySelector(selector);
        if(!el)throw Error('Missing contrast probe '+selector);
        const m=getComputedStyle(el).color.match(/\d+(?:\.\d+)?/g);
        return m?.slice(0,3).map(Number) || [];
      };
      return {
        lightHeading:rgb('.auto-hero h1'),
        advisorHeading:rgb('.auto-advisor-box h2'),
        stepHeading:rgb('.auto-steps h3'),
        darkPanelText:rgb('.auto-hero-panel strong')
      };
    });
    for(const key of ['lightHeading','advisorHeading','stepHeading']){
      assert.ok(Math.max(...pageContrast[key])<170,
        locale+' '+viewport.name+' '+key+' is pale on a light surface: '+JSON.stringify(pageContrast[key]));
    }
    assert.ok(Math.min(...pageContrast.darkPanelText)>170,
      locale+' '+viewport.name+' dark panel text is unreadable');

    assert.equal(await page.locator('body').evaluate(el=>el.scrollWidth<=window.innerWidth+2),true,locale+' '+viewport.name+' homepage overflow');
    if(example.key==='market')await page.screenshot({path:'qa-screenshots/'+locale+'-'+viewport.name+'-home.png',fullPage:true});
    await page.locator('#vehicle-source').fill(example.value);
    await page.locator('#universal-advisor-form button[type=submit]').click();
    await page.waitForURL('**/'+locale+'/ai-savetnik/',{timeout:10000});
    assert.equal(await page.locator('#listing').inputValue(),example.value,'source handoff lost data');
    const advisorContrast=await page.evaluate(()=>{
      return ['.advisor-page h1','.advisor-panel h2','.advisor-question h3'].map(sel=>{
        const m=getComputedStyle(document.querySelector(sel)).color.match(/\d+(?:\.\d+)?/g);
        return m?.slice(0,3).map(Number)||[];
      });
    });
    for(const color of advisorContrast){
      assert.ok(Math.max(...color)<170,locale+' '+viewport.name+' pale advisor text on white: '+JSON.stringify(color));
    }

    assert.equal(await page.locator('#vehicle-identifier').textContent(),example.value.slice(0,180));
    assert.equal(await page.locator('[data-question]').count(),3);
    assert.equal(await page.locator('[data-risk-row]').count(),3);
    assert.equal(await page.locator('body').evaluate(el=>el.scrollWidth<=window.innerWidth+2),true,locale+' '+viewport.name+' advisor overflow');
    for(let i=0;i<3;i++)await page.locator('[data-question]').nth(i).locator('button[data-answer]').first().click();
    assert.match(await page.locator('#advisor-status').textContent(),locale==='de'?/Alle drei Antworten/:/Sva tri odgovora/);
    await page.locator('details').evaluate(el=>el.open=true);
    await page.locator('#cost-price').fill('12000');
    await page.locator('#cost-transport').fill('250');
    await page.locator('#cost-fees').fill('90');
    await page.locator('#cost-check').fill('120');
    assert.match(await page.locator('#cost-total').textContent(),/12[.\s\u00a0]?460,00|12[,.]460/);
    if(example.key==='market')await page.screenshot({path:'qa-screenshots/'+locale+'-'+viewport.name+'-advisor.png',fullPage:true});
    passed++;
   }
   assert.deepEqual(errors,[],locale+' '+viewport.name+' runtime errors');
   await context.close();
  }
 }
} finally {await browser.close();}
console.log('PASS: '+passed+' E2E journeys (DE/SR × desktop/mobile × Kleinanzeigen/VIN/copied text), zero runtime errors');
