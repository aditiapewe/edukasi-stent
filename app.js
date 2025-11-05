// app.js — simple SPA-like behavior and local QnA storage
document.addEventListener('DOMContentLoaded', function(){
  // Buttons and links
  const btnPretest = document.getElementById('btn-pretest');
  const btnToEdu = document.getElementById('btn-to-edu');
  const btnSkip = document.getElementById('btn-skip');
  const btnRestart = document.getElementById('btn-restart');
  const btnBack = document.getElementById('btn-back');
  const btnClearQ = document.getElementById('btn-clear-q');
  const qnaForm = document.getElementById('qna-form');
  const qnaText = document.getElementById('qna-text');
  const qnaList = document.getElementById('qna-list');
  const linkPre = document.getElementById('link-pretest');
  const linkPost = document.getElementById('link-posttest');
  const btnToEduSection = document.getElementById('btn-to-edu');
  const materialDetail = document.getElementById('material-detail');
  const materialContent = document.getElementById('material-content');
  const eduSection = document.getElementById('edu');
  const homeSection = document.getElementById('home');
  const sections = ['home','pretest','edu','diskusi','posttest','finish'];

  // Navigation helpers
  function showSection(id){
    sections.forEach(sid => {
      const el = document.getElementById(sid);
      if (!el) return;
      if (sid === id) el.classList.remove('hidden');
      else el.classList.add('hidden');
    });
    // smooth scroll to top of container
    document.querySelector('.container').scrollIntoView({behavior:'smooth'});
  }

  // Initial state: show home and hide others
  showSection('home');

  // Pretest button => go to pretest section
  btnPretest.addEventListener('click', function(){ showSection('pretest'); });

  // Skip button shortcut to edu
  btnSkip.addEventListener('click', function(e){ e.preventDefault(); showSection('edu'); });

  // After user clicks "Selesai Pre-Test — Kembali ke Edukasi"
  btnToEduSection.addEventListener('click', function(){ showSection('edu'); });

  // Back from material
  btnBack.addEventListener('click', function(){ materialDetail.classList.add('hidden'); showSection('edu'); });

  // Restart to home
  btnRestart.addEventListener('click', function(){ showSection('home'); });

  // Material content handler
  window.openMaterial = function(topic){
    const materials = {
      'stent': '<h3>Apa itu Stent?</h3><p>Stent adalah rangka logam kecil yang dipasang di dalam pembuluh darah jantung untuk menjaga agar pembuluh tetap terbuka. Stent tidak dapat berpindah, dan dibuat dari bahan khusus yang tidak berkarat.</p>',
      'pci': '<h3>Apa itu PCI?</h3><p>PCI (Percutaneous Coronary Intervention) adalah tindakan medis untuk membuka sumbatan pada pembuluh darah jantung menggunakan kateter, balon, dan pemasangan stent.</p>',
      'dapt': '<h3>Obat Antiplatelet (DAPT)</h3><p>Setelah pemasangan stent, pasien akan diberikan obat antiplatelet untuk mencegah pembekuan darah. Penting untuk minum obat sesuai anjuran dokter.</p>',
      'miskonsepsi': '<h3>Miskonsepsi Umum</h3><ul><li>Stent = sembuh total? <strong>Tidak</strong></li><li>Stent dapat berpindah? <strong>Tidak</strong></li><li>Stent berkarat? <strong>Tidak</strong></li></ul>'
    };
    materialContent.innerHTML = materials[topic] || '<p>Materi belum tersedia.</p>';
    materialDetail.classList.remove('hidden');
    showSection('material-detail'); // ensure visible
    // scrollIntoView
    materialDetail.scrollIntoView({behavior:'smooth'});
  };

  // QnA — store locally in localStorage (keyed by 'edu_qna')
  function loadQnA(){
    const raw = localStorage.getItem('edu_qna') || '[]';
    try{
      const arr = JSON.parse(raw);
      qnaList.innerHTML = '';
      if (arr.length === 0){
        qnaList.innerHTML = '<p class="small">Belum ada pertanyaan.</p>';
        return;
      }
      arr.slice().reverse().forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = '<small class="small">Terkirim: ' + new Date(item.t).toLocaleString() + '</small><p>' + (item.q).replace(/\n/g,'<br>') + '</p>';
        qnaList.appendChild(div);
      });
    } catch(e){
      console.error('Failed to parse QnA storage', e);
    }
  }
  loadQnA();

  qnaForm.addEventListener('submit', function(e){
    e.preventDefault();
    const text = qnaText.value.trim();
    if (!text) return alert('Silakan ketik pertanyaan Anda.');
    const raw = localStorage.getItem('edu_qna') || '[]';
    const arr = JSON.parse(raw);
    arr.push({q: text, t: Date.now()});
    localStorage.setItem('edu_qna', JSON.stringify(arr));
    qnaText.value = '';
    loadQnA();
    alert('Pertanyaan terkirim. Tim edukasi akan menindaklanjuti.');
  });

  btnClearQ.addEventListener('click', function(){
    if (!confirm('Bersihkan semua pertanyaan lokal?')) return;
    localStorage.removeItem('edu_qna');
    loadQnA();
  });

  // Open pre/post test links in new tab (links are anchors already)
  // Nothing else needed; they open in new tab due to target="_blank"

  // Replace placeholder links with values if provided via global config (optional)
  window.EduConfig = window.EduConfig || {
    preTestUrl: 'https://docs.google.com/forms/d/PLACEHOLDER_PRETEST',
    postTestUrl: 'https://docs.google.com/forms/d/PLACEHOLDER_POSTTEST',
    youtubeEmbedId: 'PLACEHOLDER_YOUTUBE'
  };

  // dynamic replace of hrefs and iframe
  function applyConfig(){
    const cfg = window.EduConfig;
    if (cfg.preTestUrl) linkPre.href = cfg.preTestUrl;
    if (cfg.postTestUrl) linkPost.href = cfg.postTestUrl;
    const iframe = document.getElementById('yt-video');
    if (iframe && cfg.youtubeEmbedId){
      iframe.src = 'https://www.youtube.com/embed/' + cfg.youtubeEmbedId;
    }
  }
  applyConfig();

});
