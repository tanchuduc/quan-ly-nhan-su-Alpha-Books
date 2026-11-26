/* ==========================================================================
     TRANG QUẢN TRỊ: HÒM THƯ GÓP Ý & BÁO LỖI NỘI BỘ (/quan-tri#gopy)
     ========================================================================== */
  var GOPY_CACHE = null;

  PAGES.gopy = function () {
    var f = ps('gopy', { tab: 'all', q: '', loai: '' });

    var html = pageHead(
      'Hòm thư Góp ý & Báo lỗi',
      'Theo dõi, phân loại và xử lý các phản hồi, thắc mắc và báo lỗi kỹ thuật được gửi từ ứng dụng nhân viên Alpha Books.',
      '<button class="btn btn-sm" data-act="gopy-reload" title="Tải lại danh sách mới nhất">' + ic('rescan', 16) + ' Làm mới</button>' +
      '<button class="btn btn-sm" data-act="gopy-export" title="Tải danh sách ra file Excel">' + ic('xuat', 16) + ' Xuất Excel</button>'
    );

    // Khu vực thống kê nhanh
    html += '<div id="gopy-stats" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px">' +
      '<div class="card card-pad" style="text-align:center;padding:12px"><small style="color:var(--dim,#64748b)">Tổng phản hồi</small><div id="st-all" style="font-size:22px;font-weight:700;color:var(--tx,#0f172a)">…</div></div>' +
      '<div class="card card-pad" style="text-align:center;padding:12px;border-left:3px solid #dc2626"><small style="color:#dc2626;font-weight:600">🔴 Mới / Chưa xử lý</small><div id="st-moi" style="font-size:22px;font-weight:700;color:#dc2626">…</div></div>' +
      '<div class="card card-pad" style="text-align:center;padding:12px;border-left:3px solid #d97706"><small style="color:#d97706;font-weight:600">🟡 Đang xử lý</small><div id="st-dang" style="font-size:22px;font-weight:700;color:#d97706">…</div></div>' +
      '<div class="card card-pad" style="text-align:center;padding:12px;border-left:3px solid #16a34a"><small style="color:#16a34a;font-weight:600">🟢 Đã xử lý xong</small><div id="st-xong" style="font-size:22px;font-weight:700;color:#16a34a">…</div></div>' +
    '</div>';

    // Thanh lọc và tìm kiếm
    html += '<div class="card card-pad" style="margin-bottom:16px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">' +
      '<div class="seg" id="gopy-tabs">' +
        '<button class="' + (f.tab === 'all' ? 'on' : '') + '" data-st-tab="all">Tất cả</button>' +
        '<button class="' + (f.tab === 'moi' ? 'on' : '') + '" data-st-tab="moi">Chưa xử lý (Mới)</button>' +
        '<button class="' + (f.tab === 'dang_xu_ly' ? 'on' : '') + '" data-st-tab="dang_xu_ly">Đang xử lý</button>' +
        '<button class="' + (f.tab === 'da_xu_ly' ? 'on' : '') + '" data-st-tab="da_xu_ly">Đã xử lý</button>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex:1;min-width:280px;justify-content:flex-end">' +
        '<select class="input" id="gopy-type-sel" style="max-width:180px">' +
          '<option value="">Tất cả phân loại</option>' +
          '<option value="Báo lỗi"' + (f.loai === 'Báo lỗi' ? ' selected' : '') + '>Báo lỗi</option>' +
          '<option value="Thắc mắc quy chế"' + (f.loai === 'Thắc mắc quy chế' ? ' selected' : '') + '>Thắc mắc quy chế</option>' +
          '<option value="Đề xuất tính năng"' + (f.loai === 'Đề xuất tính năng' ? ' selected' : '') + '>Đề xuất tính năng</option>' +
        '</select>' +
        '<input class="input" id="gopy-q" value="' + esc(f.q || '') + '" placeholder="Tìm theo tên, mã NV, SĐT, nội dung…" style="max-width:320px">' +
      '</div>' +
    '</div>';

    // Danh sách phản hồi
    html += '<div id="gopy-list" style="display:flex;flex-direction:column;gap:14px">' +
      '<div class="card card-pad" style="text-align:center;padding:32px"><p class="muted">Đang tải danh sách hòm thư…</p></div>' +
    '</div>';

    return html;
  };

  BINDS.gopy = function () {
    var f = ps('gopy', { tab: 'all', q: '', loai: '' });

    function renderGopyList(list) {
      GOPY_CACHE = list || [];
      var nAll = list.length;
      var nMoi = list.filter(function (x) { return !x.trang_thai || x.trang_thai === 'moi'; }).length;
      var nDang = list.filter(function (x) { return x.trang_thai === 'dang_xu_ly'; }).length;
      var nXong = list.filter(function (x) { return x.trang_thai === 'da_xu_ly'; }).length;

      var elAll = $('#st-all'), elMoi = $('#st-moi'), elDang = $('#st-dang'), elXong = $('#st-xong');
      if (elAll) elAll.textContent = nAll;
      if (elMoi) elMoi.textContent = nMoi;
      if (elDang) elDang.textContent = nDang;
      if (elXong) elXong.textContent = nXong;

      var q = (f.q || '').toLowerCase().trim();
      var filtered = list.filter(function (x) {
        if (f.tab === 'moi' && (x.trang_thai && x.trang_thai !== 'moi')) return false;
        if (f.tab === 'dang_xu_ly' && x.trang_thai !== 'dang_xu_ly') return false;
        if (f.tab === 'da_xu_ly' && x.trang_thai !== 'da_xu_ly') return false;
        if (f.loai && x.loai !== f.loai) return false;
        if (q) {
          var t = (x.ten || '') + ' ' + (x.ma || '') + ' ' + (x.phone || '') + ' ' + (x.noi_dung || '') + ' ' + (x.ghi_chu || '');
          if (t.toLowerCase().indexOf(q) === -1) return false;
        }
        return true;
      });

      var box = $('#gopy-list');
      if (!box) return;

      if (!filtered.length) {
        box.innerHTML = '<div class="card card-pad" style="text-align:center;padding:48px">' +
          '<div style="font-size:36px;margin-bottom:8px">📭</div>' +
          '<h3 style="margin:0 0 6px">Không tìm thấy phản hồi nào</h3>' +
          '<p class="muted" style="margin:0">Chưa có góp ý/báo lỗi phù hợp với bộ lọc hiện tại.</p>' +
        '</div>';
        return;
      }

      var h = '';
      filtered.forEach(function (x) {
        var isXong = x.trang_thai === 'da_xu_ly';
        var isDang = x.trang_thai === 'dang_xu_ly';
        var stCls = isXong ? 'background:#eaf5ec;color:#2f7d4f' : isDang ? 'background:#fdf3e5;color:#c2740e' : 'background:#fdeceb;color:#d93025';
        var stTxt = isXong ? '✓ Đã xử lý' : isDang ? '⚡ Đang xử lý' : '● Mới';

        var typeCls = x.loai === 'Báo lỗi' ? 'background:#fee2e2;color:#991b1b' : x.loai === 'Thắc mắc quy chế' ? 'background:#fef3c7;color:#92400e' : 'background:#e0f2fe;color:#075985';

        var d = new Date(x.tao);
        var dStr = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);

        h += '<div class="card card-pad" style="border:1px solid var(--border,#e2e8f0);border-radius:10px;padding:16px;background:var(--card-bg,#fff);box-shadow:0 1px 3px rgba(0,0,0,0.03)">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:10px">' +
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
              '<span class="tag" style="font-weight:700;font-size:12px;' + typeCls + '">' + esc(x.loai || 'Góp ý') + '</span>' +
              '<b style="font-size:15px">' + esc(x.ten || 'Người dùng') + '</b>' +
              (x.ma ? '<span class="muted small">(' + esc(x.ma) + ')</span>' : '') +
              (x.phone ? '<a href="tel:' + esc(x.phone) + '" class="tag tag-info" style="text-decoration:none;font-size:12px">📞 ' + esc(x.phone) + '</a>' : '') +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
              '<span style="font-size:12px;padding:3px 10px;border-radius:6px;font-weight:700;' + stCls + '">' + stTxt + '</span>' +
              '<small class="muted">' + dStr + '</small>' +
            '</div>' +
          '</div>' +

          '<div style="font-size:14px;line-height:1.6;white-space:pre-wrap;background:var(--bg,#f8fafc);padding:12px 14px;border-radius:8px;border:1px solid var(--border,#e2e8f0);margin-bottom:10px;color:var(--tx,#0f172a)">' +
            esc(x.noi_dung || '') +
          '</div>' +

          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;font-size:12px" class="muted">' +
            '<div>' +
              (x.trang ? '<span>📄 ' + esc(x.trang) + '</span> · ' : '') +
              (x.thiet_bi ? '<span>💻 ' + esc(x.thiet_bi) + '</span>' : '') +
            '</div>' +
            '<div style="display:flex;gap:6px">' +
              (!isDang && !isXong ? '<button type="button" class="btn btn-sm" data-gopy-st="' + x.id + '" data-val="dang_xu_ly">⚡ Nhận xử lý</button>' : '') +
              (!isXong ? '<button type="button" class="btn btn-sm btn-primary" data-gopy-st="' + x.id + '" data-val="da_xu_ly">✓ Đã xử lý xong</button>' : '') +
              (isXong ? '<button type="button" class="btn btn-sm" data-gopy-st="' + x.id + '" data-val="dang_xu_ly">Mở lại</button>' : '') +
            '</div>' +
          '</div>' +

          // Khung ghi chú nội bộ của admin
          '<div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--border,#e2e8f0);display:flex;gap:8px;align-items:center">' +
            '<small style="font-weight:600;min-width:90px;color:var(--dim,#64748b)">Ghi chú xử lý:</small>' +
            '<input class="input" id="gopy-note-' + x.id + '" value="' + esc(x.ghi_chu || '') + '" placeholder="Ghi chú nội bộ admin (VD: Đã gọi điện hỗ trợ, đã fix bug...)" style="font-size:13px;flex:1">' +
            '<button type="button" class="btn btn-sm" data-gopy-save-note="' + x.id + '">Lưu ghi chú</button>' +
          '</div>' +
        '</div>';
      });

      box.innerHTML = h;

      // Bind status buttons
      $$('[data-gopy-st]', box).forEach(function (btn) {
        btn.onclick = function () {
          var id = btn.getAttribute('data-gopy-st');
          var stVal = btn.getAttribute('data-val');
          btn.disabled = true;
          fetch('/api/qt/gop-y-cap-nhat', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: id, trang_thai: stVal })
          }).then(function () {
            toast('Đã cập nhật trạng thái', 'ok');
            loadGopyData();
          }).catch(function (e) {
            toast('Lỗi cập nhật: ' + e.message, 'err');
            btn.disabled = false;
          });
        };
      });

      // Bind save note buttons
      $$('[data-gopy-save-note]', box).forEach(function (btn) {
        btn.onclick = function () {
          var id = btn.getAttribute('data-gopy-save-note');
          var input = $('#gopy-note-' + id);
          var noteVal = input ? input.value.trim() : '';
          btn.disabled = true;
          fetch('/api/qt/gop-y-cap-nhat', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: id, ghi_chu: noteVal })
          }).then(function () {
            toast('Đã lưu ghi chú', 'ok');
            btn.disabled = false;
          }).catch(function (e) {
            toast('Lỗi lưu ghi chú: ' + e.message, 'err');
            btn.disabled = false;
          });
        };
      });
    }

    function loadGopyData() {
      fetch('/api/qt/gop-y')
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (res) {
          renderGopyList(res.list || []);
        })
        .catch(function (er) {
          var box = $('#gopy-list');
          if (box) box.innerHTML = '<div class="card card-pad" style="text-align:center;padding:32px"><p class="muted">Không thể tải dữ liệu: ' + esc(er.message) + '</p></div>';
        });
    }

    loadGopyData();

    // Tabs filter
    $$('[data-st-tab]').forEach(function (btn) {
      btn.onclick = function () {
        var t = btn.getAttribute('data-st-tab');
        f.tab = t;
        $$('[data-st-tab]').forEach(function (x) { x.classList.toggle('on', x === btn); });
        if (GOPY_CACHE) renderGopyList(GOPY_CACHE);
      };
    });

    // Type select
    var typeSel = $('#gopy-type-sel');
    if (typeSel) {
      typeSel.onchange = function () {
        f.loai = typeSel.value;
        if (GOPY_CACHE) renderGopyList(GOPY_CACHE);
      };
    }

    // Search input
    var qInput = $('#gopy-q');
    if (qInput) {
      qInput.oninput = function () {
        f.q = qInput.value;
        if (GOPY_CACHE) renderGopyList(GOPY_CACHE);
      };
    }
  };

  ACTS['gopy-reload'] = function () {
    if (curPage === 'gopy') render();
    else go('gopy');
  };

  ACTS['gopy-export'] = function () {
    if (!GOPY_CACHE || !GOPY_CACHE.length) {
      toast('Không có dữ liệu để xuất Excel', 'warn');
      return;
    }
    var rows = [['STT', 'Mã NV', 'Họ và tên', 'Số điện thoại', 'Email', 'Phân loại', 'Nội dung', 'Trang gửi', 'Thiết bị', 'Trạng thái', 'Ghi chú xử lý', 'Thời gian gửi']];
    GOPY_CACHE.forEach(function (x, i) {
      var d = new Date(x.tao);
      var dStr = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
      var st = x.trang_thai === 'da_xu_ly' ? 'Đã xử lý' : x.trang_thai === 'dang_xu_ly' ? 'Đang xử lý' : 'Mới';
      rows.push([i + 1, x.ma || '', x.ten || '', x.phone || '', x.email || '', x.loai || '', x.noi_dung || '', x.trang || '', x.thiet_bi || '', st, x.ghi_chu || '', dStr]);
    });
    var csvContent = "\\uFEFF" + rows.map(function (e) {
      return e.map(function (val) {
        return '"' + String(val).replace(/"/g, '""') + '"';
      }).join(",");
    }).join("\\n");
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Danh_sach_gop_y_bao_loi_AlphaBooks_" + new Date().toISOString().slice(0, 10) + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Đã xuất file dữ liệu thành công', 'ok');
  };

  