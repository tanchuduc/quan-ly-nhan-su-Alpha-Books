/**
 * Alpha Books HR - Enterprise UX Enhancement Library
 * Intercepts legacy alerts, adds Toast notifications, Bottom Sheets,
 * and Smart Fallback for attendance & approvals.
 */

(function () {
  'use strict';

  // Create AlphaUX Namespace
  window.AlphaUX = window.AlphaUX || {};

  /* ==========================================================================
     1. Toast Notification Container & Engine
     ========================================================================== */
  var toastContainer = null;

  function initToastContainer() {
    if (toastContainer && document.body.contains(toastContainer)) return;
    toastContainer = document.createElement('div');
    toastContainer.id = 'alpha-toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('role', 'region');
    toastContainer.style.cssText =
      'position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 999999;' +
      'display: flex; flex-direction: column; gap: 8px; width: calc(100% - 32px); max-width: 420px; pointer-events: none;';
    document.body.appendChild(toastContainer);
  }

  /**
   * Display floating toast
   * @param {string} message - Message text or HTML
   * @param {'info'|'success'|'warning'|'error'} type - Feedback type
   * @param {number} duration - Auto dismiss ms
   */
  window.AlphaUX.toast = function (message, type, duration) {
    initToastContainer();
    type = type || 'info';
    duration = duration || 3500;

    var toast = document.createElement('div');
    toast.className = 'alpha-toast alpha-toast-' + type;

    var bg = '#ffffff';
    var border = '#E2E8F0';
    var text = '#0F172A';
    var icon = 'ℹ️';

    if (type === 'success') {
      bg = '#F0FDF4';
      border = '#86EFAC';
      text = '#14532D';
      icon = '✓';
    } else if (type === 'warning') {
      bg = '#FFFBEB';
      border = '#FDE68A';
      text = '#78350F';
      icon = '⚠️';
    } else if (type === 'error' || type === 'danger') {
      bg = '#FFF1F2';
      border = '#FECDD3';
      text = '#9F1239';
      icon = '✕';
    }

    toast.style.cssText =
      'background:' + bg + '; border: 1.5px solid ' + border + '; color:' + text + ';' +
      'padding: 12px 16px; border-radius: 12px; font-size: 14px; font-weight: 500;' +
      'box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08);' +
      'display: flex; align-items: center; gap: 12px; pointer-events: auto;' +
      'opacity: 0; transform: translateY(-10px); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);';

    var iconSpan = '<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:99px;background:rgba(0,0,0,0.06);font-size:13px;font-weight:700;flex-shrink:0">' + icon + '</span>';
    var msgSpan = '<div style="flex:1;line-height:1.4">' + message + '</div>';

    toast.innerHTML = iconSpan + msgSpan;
    toastContainer.appendChild(toast);

    // Animation in
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto dismiss
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, duration);
  };

  /* ==========================================================================
     2. Override Window Alert on Web & Mobile
     ========================================================================== */
  var originalAlert = window.alert;
  window.alert = function (msg) {
    if (typeof msg === 'string') {
      var isError = /lỗi|sai|không|thất bại|chưa|từ chối/i.test(msg);
      window.AlphaUX.toast(msg, isError ? 'error' : 'info', 4000);
    } else {
      originalAlert.apply(window, arguments);
    }
  };

  /* ==========================================================================
     3. Modern Confirmation Modal (Replaces browser confirm)
     ========================================================================== */
  window.AlphaUX.confirm = function (title, message, onConfirm, onCancel, options) {
    options = options || {};
    var isDestructive = options.destructive !== false;

    var backdrop = document.createElement('div');
    backdrop.style.cssText =
      'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.55); backdrop-filter: blur(4px);' +
      'z-index: 1000000; display: flex; align-items: center; justify-content: center; padding: 20px;' +
      'opacity: 0; transition: opacity 0.2s ease;';

    var modal = document.createElement('div');
    modal.style.cssText =
      'background: #ffffff; border-radius: 16px; width: 100%; max-width: 400px; padding: 24px;' +
      'box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.2); transform: scale(0.95); transition: transform 0.2s ease;';

    var btnOkStyle = isDestructive
      ? 'background: #F43F5E; color: #fff; border: none;'
      : 'background: #F47830; color: #fff; border: none;';

    modal.innerHTML =
      '<div style="font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">' + title + '</div>' +
      '<div style="font-size: 14px; color: #475569; line-height: 1.5; margin-bottom: 24px;">' + message + '</div>' +
      '<div style="display: flex; gap: 10px; justify-content: flex-end;">' +
      '<button id="alpha-modal-cancel" style="padding: 10px 18px; border-radius: 10px; border: 1.5px solid #CBD5E1; background: #fff; color: #334155; font-size: 14px; font-weight: 600; cursor: pointer;">Hủy bỏ</button>' +
      '<button id="alpha-modal-ok" style="padding: 10px 20px; border-radius: 10px; ' + btnOkStyle + ' font-size: 14px; font-weight: 600; cursor: pointer;">Xác nhận</button>' +
      '</div>';

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    requestAnimationFrame(function () {
      backdrop.style.opacity = '1';
      modal.style.transform = 'scale(1)';
    });

    function close() {
      backdrop.style.opacity = '0';
      modal.style.transform = 'scale(0.95)';
      setTimeout(function () {
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      }, 200);
    }

    modal.querySelector('#alpha-modal-cancel').onclick = function () {
      close();
      if (typeof onCancel === 'function') onCancel();
    };

    modal.querySelector('#alpha-modal-ok').onclick = function () {
      close();
      if (typeof onConfirm === 'function') onConfirm();
    };

    backdrop.onclick = function (e) {
      if (e.target === backdrop) {
        close();
        if (typeof onCancel === 'function') onCancel();
      }
    };
  };

  /* ==========================================================================
     4. Smart Attendance Fallback Helper
     ========================================================================== */
  function injectAttendanceHelper() {
    var checkInWrap = document.querySelector('#ch-box, .ch-wrap, #view-home');
    if (!checkInWrap) return;

    // Check if network indicator shows outside wifi
    var observer = new MutationObserver(function () {
      var netStatus = document.querySelector('.ch-wifi, #ch-wifi, .net-tag');
      if (netStatus && (netStatus.textContent.indexOf('Ngoài') !== -1 || netStatus.classList.contains('err'))) {
        if (!document.querySelector('#alpha-net-help')) {
          var helpCard = document.createElement('div');
          helpCard.id = 'alpha-net-help';
          helpCard.style.cssText =
            'margin: 16px 0; padding: 14px 16px; background: #FFFBEB; border: 1.5px solid #FDE68A;' +
            'border-radius: 12px; font-size: 13.5px; color: #78350F;';
          helpCard.innerHTML =
            '<div style="font-weight:700; margin-bottom:6px; display:flex; align-items:center; gap:6px;">' +
            '<span>⚠️ Không nhận được Wi-Fi văn phòng?</span>' +
            '</div>' +
            '<div style="font-size:12.5px; color:#92400E; margin-bottom:12px; line-height:1.4;">' +
            'Vui lòng tắt 4G/5G, tắt VPN hoặc tắt "Chuyển tiếp bảo mật" trên iPhone để nhận đúng Wi-Fi.' +
            '</div>' +
            '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
            '<button type="button" id="alpha-btn-qr" style="flex:1; min-height:38px; background:#fff; border:1px solid #CBD5E1; border-radius:8px; font-size:12.5px; font-weight:600; color:#334155; cursor:pointer;">📷 Quét mã QR</button>' +
            '<button type="button" id="alpha-btn-gt" style="flex:1; min-height:38px; background:#F47830; border:none; border-radius:8px; font-size:12.5px; font-weight:600; color:#fff; cursor:pointer;">📝 Tạo giải trình</button>' +
            '</div>';

          var targetParent = netStatus.closest('.ch-wrap') || netStatus.parentNode;
          if (targetParent) targetParent.appendChild(helpCard);

          var qrBtn = helpCard.querySelector('#alpha-btn-qr');
          if (qrBtn) {
            qrBtn.onclick = function () {
              var qrAction = document.querySelector('[data-tab="tram"], [data-qr], #btn-qr, a[href*="tram"]');
              if (qrAction) qrAction.click();
              else window.location.hash = '#tram';
            };
          }

          var gtBtn = helpCard.querySelector('#alpha-btn-gt');
          if (gtBtn) {
            gtBtn.onclick = function () {
              var donTab = document.querySelector('[data-tab="don"], [data-nv="don"], a[href*="don"]');
              if (donTab) donTab.click();
              window.AlphaUX.toast('Đã mở phân hệ Đơn để gửi giải trình công.', 'info');
            };
          }
        }
      } else {
        var existingHelp = document.querySelector('#alpha-net-help');
        if (existingHelp) existingHelp.parentNode.removeChild(existingHelp);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  }

  // Init when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAttendanceHelper);
  } else {
    injectAttendanceHelper();
  }

})();
