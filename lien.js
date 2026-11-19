// Ouvre un défi ou une partie dans l'app Deenjoy (sans serveur : tout est dans l'adresse).
(function () {
  var PKG = 'com.mhdgri.deenjoy';
  var PLAY = 'https://play.google.com/store/apps/details?id=' + PKG;
  var kind = document.body.getAttribute('data-kind'); // 'defi' ou 'partie'
  var q = new URLSearchParams(location.search);
  var code = (q.get('c') || '').trim().toUpperCase();
  var name = (q.get('n') || '').trim().slice(0, 20);
  var ok = kind === 'defi' ? /^[DR]\d{1,2}-[0-9A-Z]{6}-\d{1,2}$/.test(code) : /^G\d{1,2}-?[0-9A-Z]{6}$/.test(code);
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  $('play').href = PLAY;
  if (!ok) {
    $('titre').textContent = kind === 'defi' ? 'Défi introuvable' : 'Partie introuvable';
    $('texte').textContent = 'Ce lien est incomplet. Demande à ton ami de te le renvoyer.';
    $('ouvrir').style.display = 'none';
    $('code-bloc').style.display = 'none';
    return;
  }

  var path = kind + '/' + code + (name ? '?n=' + encodeURIComponent(name) : '');
  var android = /Android/i.test(navigator.userAgent);
  var link = android
    ? 'intent://' + path + '#Intent;scheme=deenjoy;package=' + PKG + ';S.browser_fallback_url=' + encodeURIComponent(PLAY) + ';end'
    : 'deenjoy://' + path;
  $('ouvrir').href = link;
  $('code').textContent = code;

  if (kind === 'defi' && code[0] === 'D') {
    var score = code.split('-')[2];
    $('titre').innerHTML = (name ? esc(name) + ' te défie' : 'On te défie') + ' au quiz ⚔️';
    $('texte').innerHTML = 'Score à battre : <strong>' + score + '/10</strong>. Les mêmes 10 questions, sur ton téléphone.';
    $('ouvrir').textContent = 'Relever le défi dans Deenjoy';
  } else if (kind === 'defi') {
    $('titre').innerHTML = (name ? esc(name) : 'Ton ami') + ' a relevé ton défi 🏁';
    $('texte').textContent = 'Ouvre Deenjoy pour voir qui a gagné.';
    $('ouvrir').textContent = 'Voir le résultat dans Deenjoy';
  } else {
    $('titre').innerHTML = (name ? esc(name) + ' t’invite' : 'Tu es invité') + ' à une partie de quiz 🧠';
    $('texte').textContent = '10 questions, les mêmes pour tout le monde, chacun sur son téléphone.';
    $('ouvrir').textContent = 'Rejoindre la partie dans Deenjoy';
  }

  $('copier').onclick = function () {
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(function () { $('copier').textContent = 'Code copié ✓'; });
  };
  // Android : ouverture directe (si l'app n'est pas installée, Chrome affiche le Play Store)
  if (android) setTimeout(function () { location.href = link; }, 300);
})();
