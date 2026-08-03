/* ============================================================
   Pengguna — user management (Super Admin only) — PRD_MERGED §6.9
   Screens were undefined in both sources (C-11); designed here
   from Source B's user data model + Source A's kitchen-scope rule.
   ============================================================ */
(function () {
  function roleTone(r) {
    if (r === 'Super Admin') return 'bg-danger';
    if (r === 'Data Admin' || r === 'CMS Admin') return 'bg-warning';
    return 'bg-success';
  }

  function render(el) {
    const byRole = {};
    MBG.users.forEach(u => { byRole[u.role] = (byRole[u.role] || 0) + 1; });

    el.innerHTML = `
      <div class="i-kpis">
        <div class="i-kpi"><div class="v">${MBG.users.length}</div><div class="l">Total pengguna</div></div>
        <div class="i-kpi"><div class="v">${MBG.users.filter(u => u.status === 'Aktif').length}</div><div class="l">Akun aktif</div></div>
        <div class="i-kpi"><div class="v">${MBG.users.filter(u => u.scope !== 'Semua dapur').length}</div><div class="l">Terikat satu dapur</div><div class="s">lingkup data dibatasi</div></div>
        <div class="i-kpi"><div class="v">${Object.keys(byRole).length}</div><div class="l">Peran terpakai</div></div>
      </div>

      <div class="i-card">
        <div class="flex items-center justify-between wrap gap-3" style="margin-bottom:var(--sp-4)">
          <h3 style="margin:0">${icon('users')} Daftar pengguna</h3>
          <button class="btn btn-primary btn-sm">${icon('plus')} Tambah pengguna</button>
        </div>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr>
              <th>Nama</th><th>Email</th><th>Peran</th><th>Lingkup data</th>
              <th>Status</th><th>Login terakhir</th><th></th>
            </tr></thead>
            <tbody>
              ${MBG.users.map(u => `<tr>
                <td class="strong">${u.name}<div class="sm mono">${u.id}</div></td>
                <td class="sm">${u.email}</td>
                <td><span class="tag-s ${roleTone(u.role)}">${u.role}</span></td>
                <td class="sm">${u.scope}</td>
                <td><span class="tag-s ${u.status === 'Aktif' ? 'bg-success' : 'bg-warning'}">${u.status}</span></td>
                <td class="sm mono">${u.lastLogin}</td>
                <td><div class="flex gap-2">
                  <button class="btn btn-ghost btn-sm">${icon('edit')}</button>
                  <button class="btn btn-ghost btn-sm">${icon('lock')}</button>
                </div></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="i-card">
        <h3>${icon('shield')} Matriks wewenang</h3>
        <p class="sub">Ringkasan wewenang tiap peran. Pada platform sungguhan, matriks ini ditegakkan di server pada setiap permintaan.</p>
        <div class="dt-wrap">
          <table class="dt">
            <thead><tr><th>Peran</th><th>Wewenang</th></tr></thead>
            <tbody>
              ${Role.ROLES.filter(r => r.internal).map(r => `<tr>
                <td class="strong">${r.label}<div class="sm">${r.sub}</div></td>
                <td><ul style="list-style:none;display:grid;gap:.3rem">
                  ${Role.perms(r.id).map(p => `<li class="sm">${icon('check')} ${p}</li>`).join('')}
                </ul></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="note" style="margin-top:var(--sp-4)">${icon('alert')}
          Peran dibaca dari basis data pada <b>setiap</b> permintaan, bukan dari klaim di dalam token — sehingga pencabutan akses berlaku seketika, bukan menunggu sesi berakhir.</div>
      </div>`;
  }

  Internal.mount({
    page: 'pengguna',
    title: 'Pengguna',
    sub: 'Kelola pengguna, peran, dan lingkup dapur. Halaman ini hanya dapat diakses Super Admin.',
    render,
  });
})();
