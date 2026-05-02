const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;1,500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    min-height: 100vh;
    display: flex;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #F5F3FF;
    position: relative;
    overflow: hidden;
  }

  .blob {
    position: absolute;
    pointer-events: none;
  }
  .blob1 {
    width: 420px; height: 420px;
    background: #C7F2E8; opacity: 0.6;
    top: -80px; right: 180px;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
  }
  .blob2 {
    width: 320px; height: 320px;
    background: #FFD6E8; opacity: 0.55;
    bottom: -60px; left: 60px;
    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
  }
  .blob3 {
    width: 200px; height: 200px;
    background: #FFF3B0; opacity: 0.7;
    top: 55%; right: 5%;
    border-radius: 50%;
  }

  .left {
    width: 46%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 56px 60px;
    position: relative;
    z-index: 1;
    animation: slideIn 0.55s ease both;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 60px;
  }
  .brand-mark {
    width: 38px; height: 38px;
    border-radius: 12px;
    background: #7C3AED;
    display: flex; align-items: center; justify-content: center;
  }
  .brand-name {
    font-family: 'Fraunces', serif;
    font-size: 22px; font-weight: 600;
    color: #1E1B4B;
    letter-spacing: -0.01em;
  }

  .hero h1 {
    font-family: 'Fraunces', serif;
    font-size: 50px; font-weight: 600;
    color: #1E1B4B;
    line-height: 1.12;
    margin-bottom: 18px;
    letter-spacing: -0.02em;
  }
  .hero h1 span { font-style: italic; color: #7C3AED; }
  .hero p {
    font-size: 16px; font-weight: 300;
    color: #6B7280; line-height: 1.75;
    max-width: 340px;
  }

  .stats-row { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 44px; }
  .stat-box {
    background: #fff; border-radius: 16px;
    padding: 16px 22px; border: 1.5px solid #EDE9FE;
  }
  .stat-num {
    font-size: 26px; font-weight: 700;
    color: #7C3AED; line-height: 1; margin-bottom: 4px;
  }
  .stat-label { font-size: 12px; color: #9CA3AF; font-weight: 400; }

  .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; }
  .tag {
    padding: 6px 14px; border-radius: 999px;
    font-size: 12px; font-weight: 500;
    display: flex; align-items: center; gap: 5px;
  }
  .tag-purple { background: #EDE9FE; color: #5B21B6; }
  .tag-pink   { background: #FCE7F3; color: #9D174D; }
  .tag-teal   { background: #D1FAE5; color: #065F46; }
  .tag-amber  { background: #FEF3C7; color: #92400E; }
  .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  .right {
    width: 54%;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 52px 48px 32px;
    position: relative; z-index: 1;
  }

  .card {
    width: 100%; max-width: 460px;
    background: #ffffff; border-radius: 28px;
    padding: 48px 44px;
    border: 1.5px solid #EDE9FE;
    box-shadow: 0 4px 40px rgba(124,58,237,0.08);
    animation: slideIn 0.55s 0.12s ease both;
  }

  .card-top { margin-bottom: 30px; }
  .card-top h2 {
    font-family: 'Fraunces', serif;
    font-size: 30px; font-weight: 600;
    color: #1E1B4B; margin-bottom: 6px;
    letter-spacing: -0.01em;
  }
  .card-top p { font-size: 14px; color: #9CA3AF; font-weight: 300; }

  .socials { display: flex; gap: 10px; margin-bottom: 26px; }
  .soc-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px 14px; border-radius: 12px;
    border: 1.5px solid #E5E7EB; background: #FAFAFA;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 500; color: #374151;
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
  }
  .soc-btn:hover { border-color: #C4B5FD; background: #F5F3FF; }

  .sep { display: flex; align-items: center; gap: 12px; margin-bottom: 26px; }
  .sep-line { flex: 1; height: 1px; background: #F3F4F6; }
  .sep span { font-size: 12px; color: #D1D5DB; white-space: nowrap; }

  .fld { margin-bottom: 16px; }
  .fld label {
    display: block; font-size: 13px; font-weight: 500;
    color: #374151; margin-bottom: 7px;
  }
  .inp-wrap { position: relative; }
  .inp-ico {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: #C4B5FD; pointer-events: none; display: flex;
  }
  .fld input {
    width: 100%; padding: 12px 14px 12px 40px;
    background: #FAFAFA; border: 1.5px solid #E5E7EB; border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; color: #111827;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .fld input::placeholder { color: #D1D5DB; }
  .fld input:focus { border-color: #7C3AED; background: #F5F3FF; }

  .eye-btn {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #C4B5FD; display: flex; padding: 0; transition: color 0.2s;
  }
  .eye-btn:hover { color: #7C3AED; }

  .meta {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 22px;
  }
  .chk-row {
    display: flex; align-items: center; gap: 7px;
    cursor: pointer; user-select: none;
  }
  .chk-box {
    width: 18px; height: 18px; border-radius: 6px;
    border: 1.5px solid #D1D5DB; background: #fff;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .chk-box.on { background: #7C3AED; border-color: #7C3AED; }
  .chk-label { font-size: 13px; color: #6B7280; }

  .fgt-btn {
    font-size: 13px; color: #7C3AED; font-weight: 500;
    background: none; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: color 0.2s; padding: 0;
  }
  .fgt-btn:hover { color: #5B21B6; }

  .btn-main {
    width: 100%; padding: 14px; border-radius: 14px; border: none;
    background: #7C3AED; color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px; font-weight: 600;
    cursor: pointer; letter-spacing: 0.01em;
    transition: background 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-main:hover { background: #6D28D9; }
  .btn-main:active { transform: scale(0.98); }

  .signup { text-align: center; margin-top: 20px; font-size: 13px; color: #9CA3AF; }
  .signup a { color: #7C3AED; font-weight: 600; text-decoration: none; transition: color 0.2s; }
  .signup a:hover { color: #5B21B6; }

  .trust-strip {
    display: flex; align-items: center; gap: 14px;
    margin-top: 28px; padding-top: 22px;
    border-top: 1.5px solid #F3F4F6;
  }
  .av-stack { display: flex; }
  .av {
    width: 30px; height: 30px; border-radius: 50%;
    border: 2px solid #fff; margin-left: -9px;
    font-size: 11px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; color: #fff;
  }
  .av:first-child { margin-left: 0; }
  .av1 { background: #7C3AED; }
  .av2 { background: #EC4899; }
  .av3 { background: #10B981; }
  .av4 { background: #F59E0B; }
  .trust-txt { font-size: 12px; color: #9CA3AF; line-height: 1.5; }
  .trust-txt b { color: #374151; }
  .stars { display: flex; gap: 2px; margin-bottom: 2px; }
  .star {
    width: 10px; height: 10px; background: #FCD34D;
    clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .root { flex-direction: column; }
    .left { width: 100%; padding: 40px 28px 24px; }
    .right { width: 100%; padding: 0 20px 40px; }
    .stats-row { gap: 12px; }
    .hero h1 { font-size: 36px; }
  }
`;
export default styles;