import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.eyebrow}>
          <span className={styles.pulse} />
          YOLOv8 Powered
        </div>

        <h1 className={styles.title}>
          Detect license plates{" "}
          <em className={styles.titleEm}>in milliseconds</em>
        </h1>

        <p className={styles.sub}>
          Upload any vehicle image and let our backend YOLO model instantly
          localize plates, report confidence scores, and benchmark accuracy —
          no setup needed.
        </p>

        <div className={styles.actions}>
          <Link href="/detect" className={styles.btnPrimary}>
            Get Started <span className={styles.arrow}>→</span>
          </Link>
          <a href="#how" className={styles.btnSecondary}>
            See how it works
          </a>
        </div>
      </div>

      <div className={styles.visualWrap}>
        <div className={styles.carCard}>
          <div className={styles.cardHeader}>
            <div className={styles.dotRow}>
              <span className={`${styles.dot} ${styles.dotR}`} />
              <span className={`${styles.dot} ${styles.dotY}`} />
              <span className={`${styles.dot} ${styles.dotG}`} />
            </div>
            <span className={styles.cardTitleBar}>live inference</span>
          </div>

          <div className={styles.carImgMock}>
            <svg
              viewBox="0 0 430 170"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.carSvg}
            >
              <rect width="430" height="170" fill="#1a1815" />
              <ellipse cx="215" cy="200" rx="220" ry="60" fill="#111" />
              <rect x="70" y="75" width="290" height="70" rx="14" fill="#2a2722" />
              <rect x="90" y="55" width="250" height="60" rx="18" fill="#222" />
              <rect x="100" y="58" width="100" height="50" rx="6" fill="#1a3a5c" opacity="0.8" />
              <rect x="230" y="58" width="100" height="50" rx="6" fill="#1a3a5c" opacity="0.8" />
              <rect x="60" y="120" width="50" height="22" rx="4" fill="#333" />
              <rect x="320" y="120" width="50" height="22" rx="4" fill="#333" />
              <circle cx="120" cy="148" r="20" fill="#222" stroke="#444" strokeWidth="3" />
              <circle cx="120" cy="148" r="10" fill="#555" />
              <circle cx="310" cy="148" r="20" fill="#222" stroke="#444" strokeWidth="3" />
              <circle cx="310" cy="148" r="10" fill="#555" />
              <rect x="155" y="112" width="120" height="28" rx="4" fill="#eee" opacity="0.95" />
              <text
                x="215"
                y="131"
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="13"
                fontWeight="bold"
                fill="#1a1815"
              >
                KL01CA2555
              </text>
            </svg>
            <span className={styles.plateLabel}>plate · conf 0.887</span>
            <div className={styles.plateBox}>
              <span className={styles.plateText}>KL01CA2555</span>
            </div>
          </div>

          <div className={styles.cardStats}>
            {[
              { val: "0.887", label: "Confidence", accent: true },
              { val: "0.952", label: "IoU Score" },
              { val: "87.8%", label: "Accuracy", accent: true },
            ].map(({ val, label, accent }) => (
              <div key={label} className={styles.stat}>
                <div
                  className={styles.statVal}
                  style={accent ? { color: "var(--accent-2)" } : undefined}
                >
                  {val}
                </div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            ))}
          </div>

          <div className={styles.detRow}>
            plate: conf 0.8873 · box [224.8, 125.5, 420.6, 171.9]
          </div>
        </div>
      </div>
    </section>
  );
}
