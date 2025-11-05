// app.js — behavior for Edukasi Jantung portal
document.addEventListener('DOMContentLoaded', function(){
  // YouTube thumbnail to iframe replacement
  document.querySelectorAll('.yt-wrap').forEach(function(el){
    el.addEventListener('click', function(e){
      var id = el.getAttribute('data-youtube-id');
      el.innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
    });
  });

  // QnA via WhatsApp - open chat with prefilled message
  var qnaForm = document.getElementById('qnaForm');
  var qtext = document.getElementById('qtext');
  var sentList = document.getElementById('sentList');
  var clearLocal = document.getElementById('clearLocal');

  function loadSent(){
    try{
      var arr = JSON.parse(localStorage.getItem('edu_sent') || '[]');
      sentList.innerHTML = '';
      if (arr.length === 0){ sentList.innerHTML = '<p class="small">Belum ada pertanyaan terkirim.</p>'; return; }
      arr.slice().reverse().forEach(function(it){
        var d = document.createElement('div');
        d.className = 'card';
        d.innerHTML = '<small class="small">Terkirim: ' + (new Date(it.t)).toLocaleString() + '</small><p>' + (it.q).replace(/\n/g,'<br>') + '</p>';
        sentList.appendChild(d);
      });
    }catch(e){ console.error(e); }
  }
  loadSent();

  qnaForm.addEventListener('submit', function(e){
    e.preventDefault();
    var text = qtext.value.trim();
    if (!text) return alert('Silakan isi pertanyaan Anda.');
    // store locally
    var arr = JSON.parse(localStorage.getItem('edu_sent') || '[]');
    arr.push({q:text, t: Date.now()});
    localStorage.setItem('edu_sent', JSON.stringify(arr));
    loadSent();
    // open WhatsApp with prefilled message
    var wa = '62XXXXXXXXXXX'; // replace this with +62xxxxxxxxxx
    var msg = encodeURIComponent('Pertanyaan Edukasi Jantung:%0A' + text + '%0A%0A(Asal: Edukasi Jantung portal)');
    var url = 'https://wa.me/' + wa.replace(/\+/g,'') + '?text=' + msg;
    window.open(url, '_blank');
  });

  clearLocal.addEventListener('click', function(){
    if (!confirm('Hapus semua pertanyaan tersimpan di perangkat ini?')) return;
    localStorage.removeItem('edu_sent');
    loadSent();
  });

});
