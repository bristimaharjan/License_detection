import styles from "./FeaturesSection.module.css";

const FEATURES = [
  {
    icon: "🖼️",
    title: "Drag & Drop Upload",
    desc: "Drop any vehicle image or pick from curated dataset samples. Instant preview before inference.",
    iconClass: "orange",
  },
  {
    icon: "🔍",
    title: "Live Bounding Boxes",
    desc: "Detected plates are overlaid directly on the image with confidence labels and pixel-accurate boxes.",
    iconClass: "teal",
  },
  {
    icon: "📊",
    title: "Model Metrics Dashboard",
    desc: "Accuracy, precision, recall, and IoU scores displayed live alongside dataset split breakdowns.",
    iconClass: "orange",
  },
  {
    icon: "⚡",
    title: "Backend YOLO Inference",
    desc: "All computation runs server-side via YOLOv8. No GPU required on your device.",
    iconClass: "teal",
  },
  {
    icon: "🗂️",
    title: "Quick Sample Tests",
    desc: "130+ pre-loaded test images from the evaluation dataset, one click away for rapid testing.",
    iconClass: "orange",
  },
  {
    icon: "✅",
    title: "IoU Validation",
    desc: "Each prediction is automatically validated against ground-truth IoU threshold (≥ 0.50) for correctness.",
    iconClass: "teal",
  },
] as const;

export default function FeaturesSection() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.sectionLabel}>Capabilities</div>
      <h2 className={styles.sectionTitle}>Everything you need for plate detection</h2>
      <p className={styles.sectionSub}>
        From raw image upload to bounding boxes and metrics — the full inference pipeline at your fingertips.
      </p>

      <div className={styles.grid}>
        {FEATURES.map(({ icon, title, desc, iconClass }) => (
          <div key={title} className={styles.card}>
            <div className={`${styles.featIcon} ${styles[iconClass]}`}>{icon}</div>
            <div className={styles.featTitle}>{title}</div>
            <div className={styles.featDesc}>{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
