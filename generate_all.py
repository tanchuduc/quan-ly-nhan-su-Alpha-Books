import os
import subprocess

slides_data = [
    {
        'num': '01',
        'kicker': 'CỔNG THÔNG TIN NỘI BỘ · NĂM 2026',
        'title_html': 'Hệ thống<br>quản lý nhân sự<br><span class="highlight">Alpha Books</span>',
        'is_cover': True,
        'badge_main': 'NỀN TẢNG QUẢN TRỊ NHÂN SỰ TOÀN DIỆN',
        'badge_sub': 'Dành cho toàn thể CBNV Alpha Books',
        'pills': ['Chấm công thông minh', 'Tính lương tự động', 'Ứng dụng di động tiện lợi'],
        'mockup': 'slides_assets/mockup_slide_1_patched.png',
        'output_name': '01_Tong_quan_He_thong_HR_Alpha_Books.png'
    },
    {
        'num': '02',
        'kicker': 'NHÓM TÍNH NĂNG 1/5',
        'title_html': 'Hồ sơ, hợp đồng,<br><span class="highlight">nhắc việc đến hạn</span>',
        'is_cover': False,
        'bullets': [
            'Sơ đồ tổ chức, danh sách, hồ sơ giấy tờ từng người, lịch sử điều chuyển',
            'Lập hợp đồng có kiểm tra theo Bộ luật Lao động 2019, kho mẫu xuất file Word',
            'Việc cần xử lý: tự nhắc hợp đồng sắp hết hạn, giấy tờ còn thiếu',
            'Nhân viên xem hồ sơ, hợp đồng của mình trực tiếp trên ứng dụng di động'
        ],
        'mockup': 'slides_assets/mockup_slide_2_patched.png',
        'output_name': '02_Ho_so_Hop_dong_Nhac_viec.png'
    },
    {
        'num': '03',
        'kicker': 'NHÓM TÍNH NĂNG 2/5',
        'title_html': 'Chấm công, nghỉ phép,<br><span class="highlight">bảng công tự tính</span>',
        'is_cover': False,
        'bullets': [
            'Chấm công Wi-Fi, quét mã QR nhanh chóng ngay trên điện thoại',
            'Bảng công tự tính từ giờ chấm, đơn nghỉ, lịch lễ tết; ca làm việc linh hoạt',
            'Đồng bộ dữ liệu máy chấm công vân tay, tự khớp mã nhân viên chuẩn xác',
            'Quỹ phép tự tính theo thâm niên, phép tồn tự động chuyển sang năm sau'
        ],
        'mockup': 'slides_assets/mockup_slide_3_patched.png',
        'output_name': '03_Cham_cong_Nghi_phep_Bang_cong.png'
    },
    {
        'num': '04',
        'kicker': 'NHÓM TÍNH NĂNG 3/5',
        'title_html': 'Bảng lương, BHXH,<br><span class="highlight">thuế TNCN</span>',
        'is_cover': False,
        'bullets': [
            'Bảng lương tự tính từ bảng công đã chốt, minh bạch từng bước tính',
            'Bảo hiểm xã hội: danh sách đóng, đối chiếu biểu mẫu C12 với bảng lương',
            'Xuất bảng chi lương tiền mặt và bảng chuyển khoản ngân hàng tự động',
            'Phiếu lương gửi trực tiếp vào điện thoại, nhân viên xác nhận hoặc phản hồi tức thì'
        ],
        'mockup': 'slides_assets/mockup_slide_4_patched.png',
        'output_name': '04_Bang_luong_BHXH_Thue_TNCN.png'
    },
    {
        'num': '05',
        'kicker': 'NHÓM TÍNH NĂNG 4/5',
        'title_html': 'Tuyển dụng, hội nhập,<br><span class="highlight">đào tạo nội bộ</span>',
        'is_cover': False,
        'bullets': [
            'Ngân hàng ứng viên, theo dõi lịch phỏng vấn, kết quả và gửi thư mời',
            'Cổng tuyển dụng nội bộ, tiếp nhận hồ sơ và CV ứng viên trực tuyến',
            'Hành trình hội nhập (Onboarding) chuẩn hóa cho nhân sự mới tại Alpha Books',
            'Kho khóa học, văn hóa doanh nghiệp; nhân viên học và làm bài kiểm tra trên app'
        ],
        'mockup': 'slides_assets/mockup_slide_5_patched.png',
        'output_name': '05_Tuyen_dung_Hoi_nhap_Dao_tao.png'
    },
    {
        'num': '06',
        'kicker': 'NHÓM TÍNH NĂNG 5/5',
        'title_html': 'Duyệt đơn, phân quyền,<br><span class="highlight">nhập dữ liệu</span>',
        'is_cover': False,
        'bullets': [
            'Nhân viên gửi đơn nghỉ, đi muộn, về sớm; quản lý duyệt trực tuyến trên điện thoại',
            'Tài khoản riêng cho từng nhân viên, phân quyền chặt chẽ theo vai trò và phòng ban',
            'Thông báo nội bộ quan trọng, thông điệp chung gửi chính xác đến từng đối tượng',
            'Nhập xuất dữ liệu linh hoạt từ file Excel biểu mẫu có sẵn, không phải nhập lại'
        ],
        'mockup': 'slides_assets/mockup_slide_6_patched.png',
        'output_name': '06_Duyet_don_Phan_quyen_Du_lieu.png'
    }
]

out_dir = r'F:\1. Vibe Coding\Quản lý nhân sự Alpha Books\anh-gioi-thieu-alpha-hr'
os.makedirs(out_dir, exist_ok=True)

for item in slides_data:
    idx_num = item['num']
    is_cover = item['is_cover']
    
    if is_cover:
        content_html = f'''
        <div class="kicker">{item['kicker']}</div>
        <div class="title">{item['title_html']}</div>
        <div class="hero-badge">
          <div class="badge-main">{item['badge_main']}</div>
          <div class="badge-sub">{item['badge_sub']}</div>
        </div>
        <div class="pills">
          <div class="pill pill-filled">{item['pills'][0]}</div>
          <div class="pill pill-outline">{item['pills'][1]}</div>
          <div class="pill pill-outline">{item['pills'][2]}</div>
        </div>
        '''
    else:
        bullets_html = ''.join([
            f'''
            <div class="bullet-card">
              <div class="check-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="bullet-text">{b}</div>
            </div>
            ''' for b in item['bullets']
        ])
        content_html = f'''
        <div class="kicker">{item['kicker']}</div>
        <div class="title">{item['title_html']}</div>
        <div class="bullet-list">
          {bullets_html}
        </div>
        '''

    html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    width: 1080px;
    height: 1350px;
    background: radial-gradient(circle at 85% 15%, rgba(244, 120, 48, 0.09) 0%, transparent 45%), linear-gradient(180deg, #FAF7F2 0%, #F4ECE1 100%);
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 55px 65px 40px 65px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }}
  .header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
  }}
  .logo {{
    height: 42px;
  }}
  .page-num {{
    font-size: 22px;
    font-weight: 700;
    color: #64748B;
    letter-spacing: 2px;
  }}
  .kicker {{
    margin-top: 26px;
    font-size: 17px;
    font-weight: 800;
    color: #C2410C;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }}
  .title {{
    font-size: 52px;
    font-weight: 800;
    line-height: 1.15;
    color: #0F172A;
    margin-top: 12px;
    letter-spacing: -1px;
  }}
  .title .highlight {{
    color: #F47830;
  }}
  .hero-badge {{
    margin-top: 22px;
    background: linear-gradient(135deg, #F47830 0%, #E05A10 100%);
    border-radius: 20px;
    padding: 16px 26px;
    display: inline-flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 10px 25px -5px rgba(244, 120, 48, 0.35);
  }}
  .badge-main {{
    font-size: 22px;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: 0.5px;
  }}
  .badge-sub {{
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.92);
    border-left: 2px solid rgba(255, 255, 255, 0.35);
    padding-left: 16px;
  }}
  .pills {{
    display: flex;
    gap: 14px;
    margin-top: 18px;
  }}
  .pill {{
    padding: 10px 22px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 700;
  }}
  .pill-filled {{
    background: #F47830;
    color: #FFFFFF;
    box-shadow: 0 4px 12px rgba(244, 120, 48, 0.25);
  }}
  .pill-outline {{
    background: #FFFFFF;
    border: 1.5px solid #E2E8F0;
    color: #1E293B;
    box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  }}
  .bullet-list {{
    display: flex;
    flex-direction: column;
    gap: 11px;
    margin-top: 20px;
  }}
  .bullet-card {{
    background: #FFFFFF;
    border-radius: 16px;
    padding: 13px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid rgba(226, 232, 240, 0.9);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.03);
  }}
  .check-circle {{
    width: 28px;
    height: 28px;
    min-width: 28px;
    background: linear-gradient(135deg, #F47830 0%, #E05A10 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .check-circle svg {{
    width: 16px;
    height: 16px;
  }}
  .bullet-text {{
    font-size: 18.5px;
    font-weight: 600;
    color: #1E293B;
    line-height: 1.35;
  }}
  .mockup-container {{
    position: relative;
    width: 100%;
    height: 520px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }}
  .mockup-img {{
    width: 100%;
    height: auto;
    max-height: 520px;
    object-fit: contain;
    object-position: bottom center;
  }}
  .footer {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(0,0,0,0.08);
    padding-top: 18px;
  }}
  .footer-url {{
    font-size: 21px;
    font-weight: 800;
    color: #F47830;
    text-decoration: none;
    letter-spacing: 0.5px;
  }}
  .footer-name {{
    font-size: 16px;
    font-weight: 600;
    color: #64748B;
  }}
</style>
</head>
<body>
  <div>
    <div class="header">
      <img class="logo" src="../slides_assets/alpha_logo.png">
      <div class="page-num">{idx_num} / 06</div>
    </div>
    {content_html}
  </div>
  <div class="mockup-container">
    <img class="mockup-img" src="../{item['mockup']}">
  </div>
  <div class="footer">
    <div class="footer-url">https://hr.alphabooks.vn/</div>
    <div class="footer-name">Hệ thống Quản lý Nhân sự Alpha Books</div>
  </div>
</body>
</html>'''

    html_file = f'slides_assets/slide_{idx_num}.html'
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    out_png = os.path.join(out_dir, item['output_name'])
    html_abs = os.path.abspath(html_file)
    url = 'file:///' + html_abs.replace('\\', '/')
    
    cmd = [
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--window-size=1080,1350',
        f'--screenshot={out_png}',
        url
    ]
    subprocess.run(cmd, check=True)
    print(f'Rendered {item["output_name"]} ({os.path.getsize(out_png)} bytes)')

print('All 6 slides successfully rendered!')
