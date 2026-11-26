# Hướng dẫn Bảo mật & Vận hành An toàn — Alpha HR

Tài liệu này tổng hợp các biện pháp bảo mật vừa được nâng cấp và quy trình vận hành an toàn cho hệ thống Quản lý nhân sự Alpha Books.

---

## 1. Cấu hình biến môi trường bí mật (Secrets)

Các token và khóa bảo mật đã được gỡ bỏ hoàn toàn khỏi mã nguồn và file cấu hình `wrangler.jsonc`.

### Thiết lập Telegram Bot Token mới
1. Mở Telegram, nhắn tin cho **@BotFather**:
   - Gõ `/revoke` -> Chọn bot quản trị nhân sự hiện tại để hủy token cũ đã lộ.
   - Gõ `/token` -> Sao chép chuỗi mã Token mới.
2. Mở cửa sổ dòng lệnh (Terminal / PowerShell) tại thư mục `ban-day-du`:
   ```bash
   cd "f:\1. Vibe Coding\Quản lý nhân sự Alpha Books\ban-day-du"
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   # Dán token mới khi được hỏi và bấm Enter
   
   npx wrangler secret put TELEGRAM_CHAT_ID
   # Dán Chat ID (ví dụ: 1891298910) và bấm Enter
   ```
3. Khi chạy thử máy chủ cục bộ (local dev), ghi các giá trị vào file `.dev.vars` (file này đã nằm trong `.gitignore`, không bao giờ được commit lên GitHub).

---

## 2. Cơ chế bảo vệ dữ liệu nhạy cảm phía Máy chủ (Server-side Sanitization)

* **Trước đây:** Máy chủ trả về nguyên khối dữ liệu công ty bao gồm Bảng lương, CCCD, số tài khoản ngân hàng và hợp đồng cho bất kỳ ai có tài khoản vào trang Quản trị (`/quan-tri`), giao diện chỉ ẩn tab.
* **Hiện tại:** 
  - Máy chủ tự động kiểm tra quyền hạn (`QS.q`) của người dùng trước khi phản hồi API `/api/qt/kv`.
  - Nếu tài khoản **không có quyền Lương** (`bl`, `chiluong`): Máy chủ tự động xóa bỏ hoàn toàn dữ liệu bảng lương, chi lương, thiết lập công thức và làm sạch các cột `Lương cơ bản`, `Mức lương`, `Lương đóng BH`, `Số tài khoản`, `Ngân hàng` trong danh sách nhân viên.
  - Nếu tài khoản **không có quyền Hồ sơ/Hợp đồng**: Máy chủ tự động xóa chi tiết hợp đồng và che số CCCD/CMND dạng `***`.
  - Người dùng dù mở F12 / DevTools / Network tab cũng **không thể đọc được dữ liệu nhạy cảm ngoài phạm vi phân quyền**.

---

## 3. Chống gian lận chấm công (Anti-Spoofing IP)

* Hệ thống chỉ tin cậy địa chỉ IP thực tế do hạ tầng Cloudflare xác nhận (`cf-connecting-ip`).
* Mọi nỗ lực can thiệp hoặc chèn header `X-Forwarded-For` / `X-Forwarded-Host` từ phía client đều bị vô hiệu hóa, ngăn chặn nhân viên ngồi tại nhà giả lập IP mạng Wi-Fi công ty để chấm công.

---

## 4. Chống tấn công dò quét mã PIN (Password / PIN Spraying)

* Bổ sung cơ chế bảo vệ theo địa chỉ IP:
  - Nếu một địa chỉ IP nhập sai mã PIN hoặc mật khẩu quá 15 lần trong vòng 10 phút (kể cả thử trên nhiều mã nhân viên khác nhau), địa chỉ IP đó sẽ bị tạm khóa kết nối 15 phút với mã lỗi `429 Too Many Requests`.
  - Mọi lượt đăng nhập thất bại đều được ghi vết vào bảng từ chối (`tu_choi`) để quản trị viên theo dõi nhật ký vi phạm.

---

## 5. Quy chuẩn sao lưu và bảo mật dữ liệu định kỳ (Backup Encryption)

1. Khi tải bản sao lưu từ hệ thống (`Cài đặt → Dữ liệu & sao lưu → Tải bản sao lưu`) hoặc xuất database:
   ```bash
   npx wrangler d1 export quan-ly-nhan-su-db --remote --output sao-luu.sql
   ```
2. **Quy định bắt buộc:**
   - Tuyệt đối không gửi file `sao-luu.sql` hoặc file backup `.zip` qua email cá nhân hoặc các nhóm chat công cộng.
   - Trước khi lưu trữ lên Google Drive / OneDrive công ty, sử dụng công cụ **7-Zip** hoặc **WinRAR** để nén file với mật khẩu mã hóa **AES-256** (chọn *Encrypt file names*).
   - Đặt mật khẩu sao lưu từ 12 ký tự trở lên và chỉ chia sẻ cho người có thẩm quyền cao nhất (Giám đốc, Kế toán trưởng).
