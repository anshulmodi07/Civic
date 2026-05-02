export default function LeftPanel() {
  return (
    <div className="left">
          <div className="brand">
            <div className="brand-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" fill="white" />
              </svg>
            </div>
            <span className="brand-name">Civic Mitra</span>
          </div>

          <div className="hero">
            <h1>
              Think it.<br />
              <span>Build it.</span><br />
              Ship it.
            </h1>
            <p>
              The all-in-one workspace where your best work comes to life.
              Fast, beautiful, and built for teams.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-num">50K+</div>
              <div className="stat-label">Active users</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">4.9★</div>
              <div className="stat-label">App store rating</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">99.9%</div>
              <div className="stat-label">Uptime SLA</div>
            </div>
          </div>

        </div>
  );
}