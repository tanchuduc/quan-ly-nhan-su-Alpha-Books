# Phần mềm quản lý nhân sự toàn diện – Quản trị tử tế

Phần mềm quản lý nhân sự toàn diện miễn phí, mã nguồn mở, viết bằng tiếng Việt cho doanh nghiệp nhỏ và vừa: hồ sơ, hợp đồng, chấm công, nghỉ phép, lương, bảo hiểm xã hội, tuyển dụng, hội nhập, đào tạo nội bộ, tài sản, thông tin chung.

- Bản hiện tại: **1.0.5** (phát hành 25/11/2026) – xem [CHANGELOG.md](CHANGELOG.md)
- Trang giới thiệu, so sánh 2 bản: https://quantritute.com/quan-ly-nhan-su/so-sanh/
- **Đọc trước khi dùng** – giới hạn và trách nhiệm khi sử dụng (dữ liệu ở đâu, ai chịu trách nhiệm, giới hạn đã biết, báo sự cố): https://quantritute.com/quan-ly-nhan-su/gioi-han-trach-nhiem/
- Tác giả: [Quản trị tử tế](https://quantritute.com) · Giấy phép: [AGPL-3.0](LICENSE)

## Hai phiên bản

| | Bản rút gọn | Bản đầy đủ |
|---|---|---|
| Ai dùng | 1 người (kế toán, nhân sự, chủ doanh nghiệp) | Cả công ty: quản trị + nhân viên |
| Cần máy chủ, tên miền | Không | Có – máy chủ Cloudflare của đơn vị (có gói miễn phí) + tên miền nếu muốn |
| Dữ liệu nằm ở đâu | Trong trình duyệt trên máy tính đang dùng | Trên máy chủ riêng của đơn vị |
| Hồ sơ, hợp đồng, chấm công, nghỉ phép, lương, BHXH, tuyển dụng, hội nhập, đào tạo, tài sản, xuất báo cáo | ✔ | ✔ |
| App cho nhân viên (chấm công Wi‑Fi/QR, gửi đơn, xem công, phiếu lương, học, thông báo) | ✘ | ✔ |
| Tài khoản cho nhiều người, phân quyền | ✘ | ✔ |
| Gửi thông báo, gửi báo cáo định kỳ, cổng ứng tuyển trực tuyến | ✘ | ✔ |
| Thương hiệu riêng (logo, tên) | ✔ | ✔ (cả app nhân viên) |
| Chi phí | 0 đồng | Tên miền (nếu dùng) + Cloudflare (gói miễn phí hoặc trả phí theo nhu cầu) |

Chuyển từ bản rút gọn sang bản đầy đủ không phải nhập lại: **Cài đặt → Dữ liệu & sao lưu → Sao lưu dữ liệu** ở bản rút gọn, rồi **Khôi phục từ bản sao lưu** ở bản đầy đủ.

---

## Bản rút gọn

**Dùng ngay trên web:** https://quantritute.com/quan-ly-nhan-su/rut-gon/
– hoặc **tải về máy**: file [`ban-rut-gon/quan-ly-nhan-su.html`](ban-rut-gon/quan-ly-nhan-su.html), mở bằng Chrome hoặc Edge.

Lần đầu mở, phần mềm hỏi tên công ty rồi dẫn sang **Nhập dữ liệu** (có file mẫu trống, nhập tay, nạp file Excel, file máy chấm công).

### ❗ Dữ liệu và sao lưu
- Dữ liệu lưu **ngay trong trình duyệt trên máy tính này**, không gửi lên máy chủ nào. Mở bằng trình duyệt khác, máy khác hoặc cửa sổ ẩn danh sẽ không thấy.
- **Mất dữ liệu nếu chưa sao lưu** khi: xóa lịch sử duyệt web có tích "Cookie và dữ liệu trang web", dọn máy bằng phần mềm dọn rác, cài lại Windows, đổi hoặc hỏng ổ cứng, gỡ trình duyệt.
- Sao lưu: **Cài đặt → Dữ liệu & sao lưu → Sao lưu dữ liệu (.zip)** – ít nhất mỗi tuần và sau mỗi lần chốt công, chốt lương. Phần mềm tự nhắc khi quá 7 ngày chưa sao lưu.
- Đổi máy: sao lưu ở máy cũ → mở phần mềm ở máy mới → **Khôi phục từ bản sao lưu**.
- File sao lưu có thông tin cá nhân, lương của nhân sự – cất ở nơi an toàn.
- Dùng trên web và dùng file tải về là **hai kho dữ liệu khác nhau**. Chọn một cách để dùng hằng ngày.
- Dữ liệu nhập ở các bản dùng thử trước đây trên quantritute.com không chuyển sang bản chính thức.

---

<a id="ban-day-du"></a>
## Bản đầy đủ

> **Không rành kỹ thuật?** Làm theo [hướng dẫn thiết lập từng bước có ảnh minh họa](https://quantritute.com/quan-ly-nhan-su/huong-dan-cai-dat/).

Chạy trên tài khoản Cloudflare **của chính đơn vị** (Worker + cơ sở dữ liệu D1). Quản trị viên dùng phần mềm tại `/quan-tri`, nhân viên dùng app tại địa chỉ gốc `/`.

### Chuẩn bị
1. Tài khoản Cloudflare đăng ký bằng **email chung của công ty** (không dùng email cá nhân, để người nghỉ việc không mang theo quyền quản trị).
2. Tài khoản GitHub (cho cách 1).
3. Tên miền riêng (không bắt buộc – có thể dùng địa chỉ `….workers.dev` Cloudflare cấp).

### Cách 1 – Nút "Deploy to Cloudflare" (khuyên dùng)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/quantritute/quan-ly-nhan-su/tree/main/ban-day-du)

1. Bấm nút trên, đăng nhập Cloudflare và GitHub.
2. Đặt tên Worker, tên cơ sở dữ liệu (giữ mặc định cũng được). Cloudflare tự tạo một kho GitHub của anh/chị, tự tạo cơ sở dữ liệu và đưa phần mềm lên.
3. **Đặt mã cài đặt** (nút Deploy không hỏi bước này): Cloudflare → Workers & Pages → chọn Worker vừa tạo → tab **Settings** → mục *Runtime variables and secrets* → **+ Add variable** → Key `MA_CAI_DAT`, Value là một mã tự đặt từ 8 ký tự, tích **Secret** → **Add 1 variable and deploy**. Ghi lại mã – chỉ dùng một lần ở bước 5. Cơ sở dữ liệu D1 được tạo tự động, không phải làm gì thêm.
4. Xong, địa chỉ ở tab **Domains** → *Worker URL*, dòng Production, dạng `https://quan-ly-nhan-su.<tên-tài-khoản>.workers.dev`.
5. Mở `<địa chỉ>/quan-ly` → nhập **mã cài đặt** (MA_CAI_DAT), tên công ty, **mật khẩu quản trị** (từ 8 ký tự, có cả chữ và số – tự đặt, ghi lại) → tạo tài khoản quản trị đầu tiên.
6. Mở `<địa chỉ>/quan-tri`, đăng nhập: **Mã nhân viên** `quantri`, **Mật khẩu** là mật khẩu quản trị vừa đặt ở bước 5 (không phải mã cài đặt). Thêm nhân viên, cấp tài khoản ở **Ứng dụng nhân viên**; nhân viên mở `<địa chỉ>/` trên điện thoại.

> **Thêm công ty thứ 2 trở đi:** vào **Chấm công Wi‑Fi**, chọn *Dùng chung máy chủ này* (các công ty cùng văn phòng, cùng Wi‑Fi) hoặc *Máy chủ riêng của công ty* (công ty độc lập: cài thêm một bản đầy đủ trên tài khoản Cloudflare của công ty đó, tạo mã kết nối ở trang quản lý máy chủ đó, dán vào phần mềm).
>
> **Nhiều công ty dùng chung một máy chủ:** app nhân viên nhận diện người dùng bằng **Mã NV**, nên Mã NV phải khác nhau giữa các công ty (mỗi công ty một tiền tố, ví dụ `HD001`, `AC001`). Phần mềm báo khi có mã trùng và chưa cho cấp tài khoản app cho người trùng mã; đổi mã ở hồ sơ → **Sửa thông tin** (mọi dữ liệu đổi theo, mã PIN giữ nguyên).

### Cách 2 – Tải về và cài bằng lệnh (Windows)
1. Cài [Node.js](https://nodejs.org) bản LTS.
2. Tải kho này: nút **Code → Download ZIP** (hoặc trang *Releases*), giải nén.
3. Mở thư mục **`ban-day-du`**, bấm đúp **`cai-dat.cmd`**: tự cài công cụ, mở trình duyệt đăng nhập Cloudflare, tạo cơ sở dữ liệu, đưa phần mềm lên, hỏi **MA_CAI_DAT**.
4. Làm tiếp bước 5–6 của cách 1.

### Gắn tên miền riêng
Tên miền phải đang dùng DNS của Cloudflare. Cloudflare → Workers & Pages → chọn Worker → tab **Domains** → **+ Add Domain** → chọn tên miền → nhập subdomain, ví dụ `nhansu` → **Add domain**.

### Nhận bản cập nhật – dữ liệu giữ nguyên
Dữ liệu nằm trong cơ sở dữ liệu D1, tách khỏi mã phần mềm. Máy chủ tự nâng cấp cấu trúc dữ liệu (chỉ thêm bảng, thêm cột – không xóa) ở lần chạy đầu sau cập nhật. Trước khi cập nhật vẫn nên tải bản sao lưu.
- **Cài bằng nút Deploy:** vào kho GitHub của đơn vị → tab **Actions → Cập nhật từ bản gốc → Run workflow**. Cloudflare tự đưa bản mới lên. Lần đầu nếu tab Actions báo đang tắt, bấm nút bật Actions rồi làm lại.
- Không tự sửa mã trong kho của đơn vị: lần cập nhật sau sẽ ghi đè phần đã sửa.
- **Cài bằng lệnh:** tải bản mới, chép đè thư mục `ban-day-du` (giữ nguyên thư mục cũ nếu đã sửa gì), bấm đúp **`cap-nhat.cmd`**.

### Sao lưu
- Trong phần mềm: **Cài đặt → Dữ liệu & sao lưu → Tải bản sao lưu**.
- Toàn bộ cơ sở dữ liệu: `npx wrangler d1 export quan-ly-nhan-su-db --remote --output sao-luu.sql` (chạy trong thư mục `ban-day-du`).

### Điều chưa kiểm chứng (đang theo dõi)
- Thông báo đẩy trên điện thoại thật (Android, iPhone ghim màn hình chính).
- Hẹn giờ gửi báo cáo định kỳ trên gói miễn phí của Cloudflare (giới hạn thời gian xử lý mỗi lần chạy).
- Dữ liệu rất lớn (nhiều file đính kèm) trên gói miễn phí.
- Nút **Cập nhật từ bản gốc** (GitHub Actions) đang được chạy thử lần đầu.
- **Dán link Google Drive**: đã thử với máy chủ mô phỏng; chưa thử với Google Drive thật (file lớn có trang xác nhận quét virus, Google Sheets nhiều trang tính).
- **Gửi email tự động qua Resend**: đã thử với máy chủ mô phỏng, chưa thử gửi thật bằng tài khoản Resend và tên miền thật (tên hiển thị tiếng Việt có dấu, thư vào hộp Spam hay không).
- **Cổng tuyển dụng của công ty** (`/tuyen-dung/...`): đã thử trọn vòng với máy chủ mô phỏng (đưa vị trí lên, ứng viên nộp CV 2,6 MB, phần mềm tự lấy về, đóng cổng); chưa thử trên Cloudflare thật.
- **Thời gian lưu thông báo, cảnh báo dung lượng**: số dung lượng lấy từ Cloudflare D1 (`size_after`); chưa đối chiếu với số trên trang Cloudflare.

Giới hạn và giá các gói xem tại trang giá của Cloudflare (Workers, D1).

---

## Giấy phép, thương hiệu, trách nhiệm
- Mã nguồn theo **GNU AGPL-3.0** ([LICENSE](LICENSE)): được dùng, sửa, chia sẻ, kể cả cho mục đích thương mại; ai sửa rồi phân phối hoặc cho người khác dùng qua mạng phải công khai mã đã sửa theo cùng giấy phép và giữ ghi chú tác giả.
- Tên "Quản trị tử tế", logo, nhân vật Đốm **không** thuộc giấy phép mã nguồn – xem [NOTICE.md](NOTICE.md). Đơn vị dùng phần mềm thay bằng thương hiệu của mình ở **Cài đặt → Thương hiệu**.
- Phần mềm cung cấp **nguyên trạng, không bảo đảm** (Điều 15–16 AGPL-3.0). Đơn vị tự cài đặt là bên kiểm soát dữ liệu cá nhân của nhân sự mình, tự chịu trách nhiệm tuân thủ pháp luật về bảo vệ dữ liệu cá nhân.
- Thư viện, phông chữ của bên thứ ba: [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Góp ý, báo lỗi
- Góp ý, đề xuất tính năng: Bảng ghim trên https://quantritute.com hoặc mục *Issues* của kho này.
- **Lỗi bảo mật:** không đăng công khai – gửi email quantritute@gmail.com.
- Cần cài đặt hộ, tùy chỉnh riêng: liên hệ qua https://quantritute.com.
