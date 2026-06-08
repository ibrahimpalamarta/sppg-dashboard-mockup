/* ============================================================
   MBG Dashboard — Mock role switching & access gating
   ============================================================ */
(function () {
  const ROLES = [
    { id: 'publik', label: 'Publik', sub: 'Tampilan publik', internal: false },
    { id: 'pengawas', label: 'Pengawas Lapangan', sub: 'Operasional & distribusi', internal: true },
    { id: 'program', label: 'MBG Program Head', sub: 'Seluruh unit & monitor', internal: true },
    { id: 'finance', label: 'Tim Finance', sub: 'Keuangan (Fase berikutnya)', internal: true },
    { id: 'ceo', label: 'Pembina / CEO', sub: 'Ringkasan kepemimpinan', internal: true },
  ];
  const KEY = 'mbg.role';
  const listeners = [];

  function current() {
    const id = localStorage.getItem(KEY) || 'publik';
    return ROLES.find(r => r.id === id) || ROLES[0];
  }
  function isInternal() { return current().internal; }

  function set(id) {
    localStorage.setItem(KEY, id);
    apply();
    listeners.forEach(fn => fn(current()));
  }

  /* gate elements: [data-internal] hidden for public; nav .internal locked */
  function apply() {
    const internal = isInternal();
    document.querySelectorAll('[data-internal]').forEach(el => { el.hidden = !internal; });
    document.querySelectorAll('[data-public-only]').forEach(el => { el.hidden = internal; });
    document.querySelectorAll('.nav a.internal').forEach(a => {
      a.classList.toggle('locked', !internal);
    });
    // banner
    let banner = document.getElementById('role-banner');
    if (internal) {
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'role-banner';
        banner.className = 'role-banner';
        banner.innerHTML = `<div class="container">${icon('eye')}<span>Anda melihat sebagai peran internal: <b class="rb-role"></b>. Data internal & menu monitor terbuka.</span></div>`;
        const hdr = document.querySelector('.site-header');
        hdr.parentNode.insertBefore(banner, hdr.nextSibling);
      }
      banner.querySelector('.rb-role').textContent = current().label;
      banner.hidden = false;
    } else if (banner) {
      banner.hidden = true;
    }
    // role button label
    const lbl = document.querySelector('.role-sw .role-label');
    if (lbl) lbl.textContent = current().label;
    document.querySelectorAll('.role-menu button').forEach(b => b.classList.toggle('sel', b.dataset.role === current().id));
  }

  /* build the switcher markup (called by layout) */
  function markup() {
    return `<div class="role-sw">
      <button class="role-btn" aria-haspopup="true" aria-expanded="false">
        <span class="dot"></span><span class="role-label">${current().label}</span>${icon('chevronDown')}
      </button>
      <div class="role-menu" role="menu">
        ${ROLES.map(r => `<button data-role="${r.id}" role="menuitem">
          <span>${r.label}<span class="rm-sub">${r.sub}</span></span>
          ${r.internal ? icon('lock') : icon('globe')}
        </button>`).join('')}
      </div>
    </div>`;
  }

  function bind() {
    const sw = document.querySelector('.role-sw');
    if (!sw) return;
    const btn = sw.querySelector('.role-btn');
    const menu = sw.querySelector('.role-menu');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => { set(b.dataset.role); menu.classList.remove('open'); btn.setAttribute('aria-expanded', false); });
    });
    document.addEventListener('click', () => menu.classList.remove('open'));
  }

  /* guard internal-only pages: redirect publik to home */
  function guard(pageInternal) {
    if (pageInternal && !isInternal()) {
      sessionStorage.setItem('mbg.needRole', '1');
      // soft gate: show overlay instead of hard redirect (better demo)
      return false;
    }
    return true;
  }

  window.Role = { ROLES, current, isInternal, set, apply, markup, bind, guard, onChange: (fn) => listeners.push(fn) };
})();
