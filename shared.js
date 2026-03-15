/* shared.js - Centralized nav & footer for all pages */
(function(){
  var LOGO='<svg viewBox="0 0 1312 368" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1172.64 180.255V360.51H1312V309.01H1238.66V0H1172.64V180.255ZM307.227 47.8238V80.9308H373.235V14.7135H307.227V47.8238ZM0 103.001L96.5756 360.504H179.829L268.226 103.001H194.466L163.853 198.649L135.994 283.259L106.318 193.132L76.641 103.004M307.227 231.759V360.51H373.235V103.004H307.227V231.759ZM446.586 231.759V360.51H505.26V154.505H629.933V103.004H446.579V231.759M666.604 231.759V360.51H725.278V154.505H849.951V103.004H666.597V231.759M886.622 128.755V154.505H952.63C1018.15 154.505 1018.63 154.642 1018.63 172.898C1018.63 189.625 1015.81 191.295 987.466 191.331C891.223 191.459 829.344 257.607 864.255 323.042C887.3 366.243 969.072 382.427 1016.8 353.235C1036.25 341.337 1040.63 340.666 1040.63 349.585C1040.63 358.035 1050.6 360.51 1084.63 360.51H1128.65V334.76C1128.65 311.053 1126.9 309.01 1106.65 309.01H1084.64V103.004H886.622V128.755ZM1025.98 261.52C1025.98 302.419 968.236 331.132 935.009 306.757C900.587 281.511 939.904 244.292 1002.14 243.208C1022.9 242.848 1025.97 245.212 1025.97 261.52" fill="currentColor"/></svg>';

  /* ===== NAV ===== */
  var navEl=document.getElementById('shared-nav');
  if(navEl){
    navEl.outerHTML='<div id="sp"></div>'
      +'<nav id="nb"><div class="w"><div class="ni">'
      +'<a href="/" class="nlogo">'+LOGO+'</a>'
      +'<div class="nls">'
      +'<a href="/" class="na">Home</a>'
      +'<a href="/#cases" class="na">Case Studies</a>'
      +'<a href="/#creators" class="na">Creator</a>'
      +'<a href="/#process" class="na">Prozess</a>'
      +'<a href="tel:+4922129256316" class="nav-avail">'
      +'<img src="/img/Profilbild Andre (2).jpg" alt="Andre Braun" class="nav-avail-img">'
      +'<span class="nav-avail-dot"></span>'
      +'<span class="nav-avail-txt">Erreichbar</span>'
      +'<span class="nav-avail-sep">·</span>'
      +'<span class="nav-avail-phone">+49 221 29256316</span>'
      +'</a>'
      +'<a href="/anfrage" class="nc">Kostenfreie Erstberatung</a>'
      +'</div>'
      +'<button class="nm" id="nt" aria-label="Menü"><span></span><span></span><span></span></button>'
      +'</div></div></nav>'
      +'<div class="nav-mobile-menu" id="navMob">'
      +'<button class="nav-mob-close" id="navMobClose">✕</button>'
      +'<a href="/" onclick="closeNav()">Home</a>'
      +'<a href="/#cases" onclick="closeNav()">Case Studies</a>'
      +'<a href="/#creators" onclick="closeNav()">Creator</a>'
      +'<a href="/#process" onclick="closeNav()">Prozess</a>'
      +'<a href="/anfrage" class="nav-mob-cta" onclick="closeNav()">Erstberatung sichern</a>'
      +'</div>';

    /* Mobile menu toggle */
    var nt=document.getElementById('nt');
    var navMob=document.getElementById('navMob');
    var navMobClose=document.getElementById('navMobClose');
    if(nt&&navMob){
      nt.addEventListener('click',function(){navMob.classList.add('open');document.body.style.overflow='hidden'});
      navMobClose.addEventListener('click',function(){closeNav()});
    }
    window.closeNav=function(){navMob.classList.remove('open');document.body.style.overflow=''};

    /* Scroll: sticky nav + progress bar */
    var nb=document.getElementById('nb'),sp=document.getElementById('sp');
    if(nb&&sp){
      window.addEventListener('scroll',function(){
        nb.classList.toggle('s',scrollY>40);
        var progress=scrollY/(document.documentElement.scrollHeight-innerHeight);
        sp.style.transform='scaleX('+progress+')';
      },{passive:true});
    }
  }

  /* ===== FOOTER ===== */
  function initFooter(){
  var ftEl=document.getElementById('shared-footer');
  if(ftEl){
    ftEl.outerHTML='<footer class="ft"><div class="w">'
      +'<div class="ftt">'
      +'<div><div class="ft-logo">'+LOGO+'</div>'
      +'<p class="ftbd">By Creators for Brands.</p>'
      +'<div class="ftso">'
      +'<a href="#" class="ftsl" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg></a>'
      +'<a href="#" class="ftsl" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.77 0 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 100 12.63 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.82a4.84 4.84 0 01-1-.13z"/></svg></a>'
      +'<a href="#" class="ftsl" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>'
      +'<a href="#" class="ftsl" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>'
      +'</div></div>'
      +'<div><div class="ftct">Case Studies</div><ul class="ftls">'
      +'<li><a href="/jochen-schweizer">Jochen Schweizer</a></li>'
      +'<li><a href="/strabag">STRABAG</a></li>'
      +'<li><a href="/edeka">EDEKA</a></li>'
      +'<li><a href="/claas">CLAAS</a></li>'
      +'</ul></div>'
      +'<div><div class="ftct">Creators</div><ul class="ftls">'
      +'<li><a href="/finnel">Finnel</a></li>'
      +'<li><a href="/mandre">Mandre</a></li>'
      +'<li>Opa Werner</li>'
      +'<li style="margin-top:10px"><a href="/creators">Mehr erfahren →</a></li>'
      +'</ul></div>'
      +'<div><div class="ftct">Kontakt</div><ul class="ftls">'
      +'<li><a href="#">Köln, Deutschland</a></li>'
      +'<li><a href="tel:+4922129256316">+49 221 29256316</a></li>'
      +'<li><a href="mailto:hello@virral.de">hello@virral.de</a></li>'
      +'<li style="margin-top:10px"><a href="/#newsletter">Newsletter</a></li>'
      +'<li><a href="/impressum.html">Impressum</a></li>'
      +'<li><a href="/datenschutz.html">Datenschutz</a></li>'
      +'</ul></div>'
      +'</div>'
      +'<div class="ftbt"><div>&copy; 2026 virral GmbH. Alle Rechte vorbehalten.</div><div>Social First Agency · Köln, Deutschland</div></div>'
      +'</div></footer>';
  }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initFooter);
  }else{
    initFooter();
  }
  /* Fallback: retry footer init if element wasn't in DOM yet */
  if(!document.querySelector('footer.ft')){
    window.addEventListener('load',initFooter);
  }

  /* ===== NAV AVAILABILITY BADGE STYLES ===== */
  var navStyle=document.createElement('style');
  navStyle.textContent=''
    +'.nav-avail{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:100px;text-decoration:none;transition:all .3s;animation:navAvailFadeIn .6s ease-out}'
    +'.nav-avail:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.15)}'
    +'.nav-avail-img{width:28px;height:28px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.15);flex-shrink:0}'
    +'.nav-avail-dot{width:7px;height:7px;border-radius:50%;background:#2ecc71;flex-shrink:0;animation:navDotPulse 2s ease-in-out infinite}'
    +'.nav-avail-txt{font-size:.75rem;font-weight:600;color:#2ecc71}'
    +'.nav-avail-sep{font-size:.75rem;color:rgba(255,255,255,.3)}'
    +'.nav-avail-phone{font-size:.75rem;font-weight:500;color:rgba(255,255,255,.7)}'
    +'@keyframes navDotPulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(46,204,113,.4)}50%{opacity:1;box-shadow:0 0 0 4px rgba(46,204,113,0)}}'
    +'@keyframes navAvailFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}'
    +'@media(max-width:768px){.nav-avail{display:none}}';
  document.head.appendChild(navStyle);

  /* ===== COOKIE BANNER ===== */
  if(!localStorage.getItem('cookie_consent')){
    var cb=document.createElement('div');
    cb.id='cookie-banner';
    cb.innerHTML='<div class="cb-inner">'
      +'<div class="cb-text">'
      +'<strong>Cookies & Datenschutz</strong>'
      +'<p>Wir nutzen Cookies, um dir die bestmögliche Erfahrung auf unserer Website zu bieten. Mehr dazu in unserer <a href="/datenschutz.html">Datenschutzerklärung</a>.</p>'
      +'</div>'
      +'<div class="cb-btns">'
      +'<button class="cb-accept" id="cb-accept">Akzeptieren</button>'
      +'<button class="cb-decline" id="cb-decline">Nur notwendige</button>'
      +'</div>'
      +'</div>';
    document.body.appendChild(cb);
    requestAnimationFrame(function(){requestAnimationFrame(function(){cb.classList.add('show')})});
    document.getElementById('cb-accept').addEventListener('click',function(){
      localStorage.setItem('cookie_consent','all');cb.classList.remove('show');setTimeout(function(){cb.remove()},400);
    });
    document.getElementById('cb-decline').addEventListener('click',function(){
      localStorage.setItem('cookie_consent','essential');cb.classList.remove('show');setTimeout(function(){cb.remove()},400);
    });
  }
  /* ===== HUBSPOT TRACKING ===== */
  var hs=document.createElement('script');
  hs.type='text/javascript';
  hs.id='hs-script-loader';
  hs.async=true;
  hs.defer=true;
  hs.src='//js-eu1.hs-scripts.com/146589181.js';
  document.body.appendChild(hs);
})();
