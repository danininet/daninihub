'use strict';
(() => {
 function init(){
  const nav=document.querySelector('.head .nav');
  if(!nav)return;
  nav.id=nav.id||'danini-primary-nav';
  const button=document.createElement('button');
  button.type='button';button.className='danini-menu-toggle';
  button.setAttribute('aria-controls',nav.id);
  button.setAttribute('aria-expanded','false');
  button.textContent=document.documentElement.lang==='de'?'☰ Menü':'☰ Meni';
  nav.before(button);
  const css=document.createElement('style');
  css.textContent='.danini-menu-toggle{display:none;background:#141d24;color:white;border:1px solid #53616d;border-radius:8px;padding:12px 16px;font-size:16px;min-height:48px;margin:0 18px 10px;cursor:pointer}@media(max-width:700px){.danini-menu-toggle{display:block}.head .nav{display:none;overflow:visible;flex-direction:column;padding:8px 18px 14px;max-height:65dvh;overflow-y:auto}.head .nav.danini-menu-expanded{display:flex}.head .nav a{display:block;min-height:44px;padding:12px 14px;font-size:15px}.head .top{flex-wrap:wrap}}@media(min-width:701px){.head .nav{display:flex!important}}';
  document.head.appendChild(css);
  const close=()=>{nav.classList.remove('danini-menu-expanded');button.setAttribute('aria-expanded','false');};
  button.addEventListener('click',()=>{const expanded=nav.classList.toggle('danini-menu-expanded');button.setAttribute('aria-expanded',String(expanded));});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();