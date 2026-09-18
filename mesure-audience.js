/* GeoStudy — mesure d'audience Vercel Web Analytics (sans cookie).
   Rien n'est chargé si le visiteur a refusé : signal Do Not Track / Global Privacy Control
   de son navigateur, ou bouton « Ne plus être compté » de la page Confidentialité. */
(function () {
  var refus = false;
  try { refus = localStorage.getItem('gq:noanalytics') === '1'; } catch (e) {}
  if (refus || navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  var s = document.createElement('script');
  s.defer = true;
  s.src = '/_vercel/insights/script.js';
  document.head.appendChild(s);
})();
