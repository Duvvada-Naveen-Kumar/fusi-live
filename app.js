// ===== PERSISTENT DATA DRIVER SYSTEM =====
const initialData = {
  scooties: [
    {id:1,name:"Ola S1 Pro",price:"1,34,999",desc:"125km range, 90kmph top speed, fast charge in 4.5 hrs. Most popular EV scooty in India.",stock:"In Stock",emoji:"🛵",badge:"hot"},
    {id:2,name:"TVS iQube S",price:"1,28,990",desc:"100km range, 78kmph top speed, smart connectivity with TVS app.",stock:"In Stock",emoji:"🛵",badge:""},
    {id:3,name:"Bajaj Chetak Premium",price:"1,40,000",desc:"Steel body, 126km range, advanced BMS. Built tough for Indian roads.",stock:"Limited Stock",emoji:"🛵",badge:"new"}
  ],
  batteries: [
    {id:5,name:"48V 30Ah Li-Ion Pack",price:"18,500",desc:"Compatible with most EV scooties. Long cycle life, BMS protected, 2-year warranty.",stock:"In Stock",emoji:"🔋",badge:"hot"},
    {id:6,name:"60V 25Ah LiFePO4",price:"24,000",desc:"Lithium Iron Phosphate — safest chemistry. Ideal for heavy-duty use.",stock:"In Stock",emoji:"🔋",badge:""}
  ],
  parts: [
    {id:9,name:"Universal EV Controller",price:"2,400",desc:"48V/60V compatible BLDC motor controller. Plug-and-play setup.",stock:"In Stock",emoji:"⚙️",badge:""},
    {id:10,name:"LCD Display Panel",price:"1,100",desc:"Smart display with speed, battery %, trip meter. Universal fit.",stock:"In Stock",emoji:"📱",badge:""}
  ]
};

// LocalStorage Hydration Hooks
let products = JSON.parse(localStorage.getItem('fusi_products')) || initialData;
let companyInfo = JSON.parse(localStorage.getItem('fusi_info')) || {
  name: "Fusi E-Bikes Private Limited",
  email: "fusiebikes1@gmail.com",
  phone: "+91 98765 43210",
  addr1: "Ahmedabad, Gujarat, India",
  addr2: ""
};

let editingId = null;
let nextId = Number(localStorage.getItem('fusi_next_id')) || 20;
let secretClicks = 0;
let secretTimer;

// Sync Data State Utilities
function syncStorage() {
  localStorage.setItem('fusi_products', JSON.stringify(products));
  localStorage.setItem('fusi_info', JSON.stringify(companyInfo));
  localStorage.setItem('fusi_next_id', nextId.toString());
}

// ===== SYSTEM ANIMATION CONTROLLERS =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    startCounters();
  }, 1500);
});

// Kinetic Matrix Logic Canvas
(function(){
  const c = document.getElementById('particles');
  if(!c) return;
  const ctx = c.getContext('2d');
  let W, H, particles=[];
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;}
  resize();
  window.addEventListener('resize',resize);
  for(let i=0;i<40;i++){
    particles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.5+0.5,a:Math.random()});
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,230,118,${p.a*0.35})`;ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// Cursor Interaction Physics
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  if(cur && ring) {
    cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
    setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }, 40);
  }
});

// Scroll Observers
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.1});
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));

function startCounters(){
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let curVal = 0;
    const iv = setInterval(() => {
      curVal += Math.ceil(target/30);
      if(curVal >= target) { curVal = target; clearInterval(iv); }
      el.textContent = curVal + '+';
    }, 40);
  });
}

// ===== UI ACTIONS & CMS INVENTORY MANIFEST =====
function switchTab(cat, btn){
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['scooties', 'batteries', 'parts'].forEach(c => {
    const panel = document.getElementById('tab-' + c);
    if(panel) panel.classList.toggle('active', c === cat);
  });
}

function renderAll(){
  ['scooties', 'batteries', 'parts'].forEach(cat => renderCat(cat));
  document.getElementById('dispEmail').textContent = companyInfo.email;
  document.getElementById('dispPhone').textContent = companyInfo.phone;
  document.getElementById('dispAddr').textContent = companyInfo.addr1;
}

function renderCat(cat){
  const container = document.getElementById('tab-' + cat);
  if(!container) return;
  const items = products[cat] || [];
  container.innerHTML = items.map(p => `
    <div class="product-card">
      <div class="product-img">${p.emoji || '🛵'}</div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-price">₹${p.price}<span class="unit">/ unit</span></div>
        <div class="product-meta">
          <div class="product-stock">${p.stock}</div>
          <button class="btn-enquire" onclick="enquireProduct('${p.name}')">ENQUIRE</button>
        </div>
      </div>
    </div>
  `).join('');
}

function enquireProduct(name){
  document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
  showToast('Enquiry loaded for ' + name);
}

// Portal Modal Actions
function openModal(){ document.getElementById('loginModal').classList.add('open'); }
function closeModal(){ document.getElementById('loginModal').classList.remove('open'); }
function openOwnerPanel(){ document.getElementById('ownerPanel').classList.add('open'); loadInfoForm(); renderAdminList(); }
function closeOwnerPanel(){ document.getElementById('ownerPanel').classList.remove('open'); }
function ownerLogout(){ closeOwnerPanel(); showToast('Logged out.'); }

function doLogin(){
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  if(u === 'fusi_admin' && p === 'ebikes2024'){
    closeModal(); openOwnerPanel();
  } else {
    showToast('Authentication failure', 'error');
  }
}

function switchOTab(name, btn){
  document.querySelectorAll('.otab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['products', 'info', 'preview'].forEach(t => {
    const el = document.getElementById('otab-' + t);
    if(el) el.classList.toggle('active', t === name);
  });
}

// Inventory Logic Mutation
function addOrUpdateProduct(){
  const name = document.getElementById('newName').value.trim();
  const cat = document.getElementById('newCat').value;
  const price = document.getElementById('newPrice').value.trim();
  const desc = document.getElementById('newDesc').value.trim();
  const stock = document.getElementById('newStock').value;
  const emoji = document.getElementById('newEmoji').value.trim() || '🛵';
  
  if(!name || !price){ showToast('Name and Price required', 'error'); return; }

  if(editingId !== null){
    ['scooties', 'batteries', 'parts'].forEach(c => {
      products[c] = products[c].filter(p => p.id !== editingId);
    });
    editingId = null;
    document.getElementById('addBtn').textContent = 'PUBLISH PRODUCT';
  }

  products[cat].push({id: nextId++, name, price, desc, stock, emoji});
  syncStorage(); renderAll(); renderAdminList(); clearAddForm();
  showToast('Database item synchronized.');
}

function clearAddForm(){
  document.getElementById('newName').value = '';
  document.getElementById('newPrice').value = '';
  document.getElementById('newDesc').value = '';
}

function editProduct(id){
  let item = null;
  ['scooties', 'batteries', 'parts'].forEach(c => {
    const found = products[c].find(x => x.id === id);
    if(found) item = found;
  });
  if(!item) return;
  document.getElementById('newName').value = item.name;
  document.getElementById('newPrice').value = item.price;
  document.getElementById('newDesc').value = item.desc;
  editingId = id;
  document.getElementById('addBtn').textContent = 'UPDATE ARCHITECTURE';
}

function deleteProduct(id){
  ['scooties', 'batteries', 'parts'].forEach(c => {
    products[c] = products[c].filter(p => p.id !== id);
  });
  syncStorage(); renderAll(); renderAdminList();
}

function renderAdminList(){
  const list = document.getElementById('adminList');
  const all = [...products.scooties, ...products.batteries, ...products.parts];
  list.innerHTML = all.map(p => `
    <div class="admin-card">
      <div class="admin-card-top">
        <div class="admin-card-name">${p.name}</div>
        <div class="admin-card-price">₹${p.price}</div>
      </div>
      <div class="admin-card-actions">
        <button class="btn-edit" onclick="editProduct(${p.id})">EDIT</button>
        <button class="btn-delete" onclick="deleteProduct(${p.id})">DELETE</button>
      </div>
    </div>
  `).join('');
}

function loadInfoForm(){
  document.getElementById('infoName').value = companyInfo.name;
  document.getElementById('infoEmail').value = companyInfo.email;
  document.getElementById('infoPhone').value = companyInfo.phone;
  document.getElementById('infoAddr1').value = companyInfo.addr1;
}

function saveInfo(){
  companyInfo.name = document.getElementById('infoName').value;
  companyInfo.email = document.getElementById('infoEmail').value;
  companyInfo.phone = document.getElementById('infoPhone').value;
  companyInfo.addr1 = document.getElementById('infoAddr1').value;
  syncStorage(); renderAll();
  showToast('Meta details operational.');
}

function sendEnquiry(){ showToast('Enquiry processed seamlessly.'); }

document.getElementById('secretTrigger').addEventListener('click', () => {
  secretClicks++;
  clearTimeout(secretTimer);
  secretTimer = setTimeout(() => secretClicks = 0, 1000);
  if(secretClicks >= 3) { openModal(); secretClicks = 0; }
});

function showToast(msg, type=''){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Scroll Performance Trackers
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('chargeTopbar').style.width = pct + '%';
});

const battObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      document.getElementById('battMain').classList.add('charged');
      document.getElementById('energyBar').classList.add('charged');
      document.getElementById('rangeBar').classList.add('charged');
      document.getElementById('healthBar').classList.add('charged');
      
      let val = 0;
      const tIv = setInterval(() => {
        val += 2;
        if(val >= 78) { val = 78; clearInterval(tIv); }
        document.getElementById('battPct').textContent = val + '%';
        document.getElementById('battKw').textContent = '3.2 kWh';
        document.getElementById('battRange').textContent = '92 km';
        document.getElementById('battHealth').textContent = '96%';
      }, 20);
      
      document.querySelectorAll('.batt-spec-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 100);
      });
    }
  });
}, {threshold: 0.2});

const showcaseSection = document.getElementById('battery-showcase');
if(showcaseSection) battObs.observe(showcaseSection);

renderAll();