(() => {
  'use strict';
  const {projects, accounts} = window.PORTFOLIO;
  const caseDialog=document.querySelector('#case-dialog');
  const body=document.querySelector('#dialog-body');
  const credits=document.querySelector('#credits-dialog');
  const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const e=escapeHTML;
  let opener=null;
  const openDialog=(dialog,trigger)=>{opener=trigger;dialog.showModal();dialog.scrollTop=0;dialog.querySelector('.dialog-close').focus({preventScroll:true});};
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{opener?.focus({preventScroll:true});});
  });
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
    const p=projects.find(p=>p.id===button.dataset.project);
    body.innerHTML=`<img class="case-cover" src="assets/${e(p.img)}.webp" alt="${e(p.title)}公开参考图"><div class="case-content"><p class="eyebrow">${e(p.kind)}</p><h2 id="dialog-title">${e(p.title)}</h2><p class="case-intro">${e(p.intro)}</p><p>${e(p.text)}</p><div class="case-role"><span>参与内容</span><span>${e(p.role)}</span></div>${p.extra.length?`<div class="case-extras">${p.extra.map(img=>`<img src="assets/${e(img)}.webp" alt="${e(p.title)}公开参考图" loading="lazy">`).join('')}</div>`:''}<p class="case-source">参考图片：<a href="${e(p.url)}" target="_blank" rel="noopener noreferrer">${e(p.source)} ↗</a><br>非本人拍摄或项目成片${p.id==='indigo'?'，不对应具体合作门店':''}。</p><p class="small-note">项目经历依据本人提供的作品集整理。</p></div>`;
    openDialog(caseDialog,button);
  }));
  document.querySelectorAll('[data-account]').forEach(button=>button.addEventListener('click',()=>{
    const p=accounts.find(a=>a.id===button.dataset.account);
    body.innerHTML=`<div class="account-full"><p class="eyebrow">ACCOUNT SNAPSHOT</p><h2 id="dialog-title">${e(p.name)}</h2><p>${e(p.group)} · ${e(p.fans)} 万粉丝。账号数据截至 2026.10.16。<br>截图由本人提供，账号体量不代表个人任职期间增长。</p><img src="assets/${e(p.img)}.webp" alt="${e(p.name)}完整账号截图"></div>`;
    openDialog(caseDialog,button);
  }));
  document.querySelector('#credits-open').addEventListener('click',event=>openDialog(credits,event.currentTarget));
  const setFilter=filter=>{
    const valid=['all','brand','travel','event'];
    if(!valid.includes(filter))filter='all';
    document.querySelectorAll('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
    let count=0;
    document.querySelectorAll('.project').forEach(card=>{const show=filter==='all'||card.dataset.category===filter;card.hidden=!show;if(show)count++;});
    document.querySelector('.filter-count').textContent=`${count} 个项目`;
    document.querySelector('.empty-state').hidden=count>0;
  };
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.filter;setFilter(filter);
    const url=new URL(location.href);if(filter==='all')url.searchParams.delete('category');else url.searchParams.set('category',filter);
    if(location.protocol!=='file:'&&url.href!==location.href)history.pushState({},'',url);
  }));
  addEventListener('popstate',()=>setFilter(new URL(location.href).searchParams.get('category')||'all'));
  setFilter(new URL(location.href).searchParams.get('category')||'all');
})();
