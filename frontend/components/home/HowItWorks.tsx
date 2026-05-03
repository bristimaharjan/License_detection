import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    num: "1",
    title: "Upload image",
    desc: "Drop a vehicle photo or select a sample from the dataset library.",
  },
  {
    num: "2",
    title: "Backend inference",
    desc: "YOLOv8 runs server-side and returns bounding box coordinates + confidence.",
  },
  {
    num: "3",
    title: "Overlay results",
    desc: "Detected plates are drawn on the preview with labels and confidence scores.",
  },
  {
    num: "4",
    title: "Review metrics",
    desc: "Accuracy, IoU, precision and recall are updated in real time below the preview.",
  },
] as const;

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how">
      <div className={styles.sectionLabel}>How it works</div>
      <h2 className={styles.sectionTitle}>Four steps to a detection</h2>

      <div className={styles.steps}>
        {STEPS.map(({ num, title, desc }, i) => (
          <div key={num} className={styles.step}>
            {i < STEPS.length - 1 && <span className={styles.connector} />}
            <div className={`${styles.stepNum} ${i % 2 === 0 ? styles.orange : styles.teal}`}>
              {num}
            </div>
            <div className={styles.stepTitle}>{title}</div>
            <div className={styles.stepDesc}>{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
