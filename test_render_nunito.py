import os
import subprocess
import base64
from PIL import Image

# Read Nunito base64
with open('slides_assets/fonts/Nunito-VariableFont_wght.ttf', 'rb') as f:
    b64_nunito = base64.b64encode(f.read()).decode('utf-8')

html_test = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face {{
    font-family: 'Nunito';
    src: url('data:font/truetype;charset=utf-8;base64,{b64_nunito}') format('truetype');
    font-weight: 200 900;
    font-style: normal;
  }}
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Nunito', sans-serif;
    -webkit-font-smoothing: antialiased;
  }}
  body {{
    width: 1080px;
    height: 1350px;
    background: radial-gradient(circle at 85% 15%, rgba(244, 120, 48, 0.09) 0%, transparent 45%), linear-gradient(180deg, #FAF7F2 0%, #F4ECE1 100%);
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
    font-size: 54px;
    font-weight: 900;
    line-height: 1.15;
    color: #0F172A;
    margin-top: 12px;
    letter-spacing: -0.5px;
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
    font-weight: 900;
    color: #FFFFFF;
    letter-spacing: 0.5px;
  }}
  .badge-sub {{
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
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
    font-weight: 800;
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
    font-weight: 900;
    color: #F47830;
    text-decoration: none;
    letter-spacing: 0.5px;
  }}
  .footer-name {{
    font-size: 16px;
    font-weight: 700;
    color: #64748B;
  }}
</style>
</head>
<body>
  <div>
    <div class="header">
      <img class="logo" src="slides_assets/alpha_logo.png">
      <div class="page-num">01 / 06</div>
    </div>
    <div class="kicker">CỔNG THÔNG TIN NỘI BỘ · NĂM 2026</div>
    <div class="title">
      Hệ thống<br>
      quản lý nhân sự<br>
      <span class="highlight">Alpha Books</span>
    </div>
    <div class="hero-badge">
      <div class="badge-main">NỀN TẢNG QUẢN TRỊ NHÂN SỰ TOÀN DIỆN</div>
      <div class="badge-sub">Dành cho toàn thể CBNV Alpha Books</div>
    </div>
    <div class="pills">
      <div class="pill pill-filled">Chấm công thông minh</div>
      <div class="pill pill-outline">Tính lương tự động</div>
      <div class="pill pill-outline">Ứng dụng di động tiện lợi</div>
    </div>
  </div>
  <div class="mockup-container">
    <img class="mockup-img" src="slides_assets/mockup_slide_1_patched.png">
  </div>
  <div class="footer">
    <div class="footer-url">https://hr.alphabooks.vn/</div>
    <div class="footer-name">Hệ thống Quản lý Nhân sự Alpha Books</div>
  </div>
</body>
</html>'''

with open('test_slide1_nunito.html', 'w', encoding='utf-8') as f:
    f.write(html_test)

html_abs = os.path.abspath('test_slide1_nunito.html')
png_path = os.path.abspath('test_slide1_nunito.png')
url = 'file:///' + html_abs.replace('\\', '/')

cmd = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1080,1350',
    f'--screenshot={png_path}',
    url
]
subprocess.run(cmd, check=True)
print('Rendered test_slide1_nunito.png successfully!')
