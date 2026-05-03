import styles from "./StatsStrip.module.css";

const STATS = [
  { icon: "🎯", value: "87.78%", label: "Overall accuracy on test set", iconClass: "orange" },
  { icon: "📐", value: "88.35%", label: "Precision across all classes", iconClass: "teal" },
  { icon: "⚡", value: "433 imgs", label: "Train / Val / Test dataset", iconClass: "gold" },
] as const;

export default function StatsStrip() {
  return (
    <section className={styles.strip}>
      {STATS.map(({ icon, value, label, iconClass }) => (
        <div key={label} className={styles.card}>
          <div className={`${styles.icon} ${styles[iconClass]}`}>{icon}</div>
          <div>
            <div className={styles.value}>{value}</div>
            <div className={styles.label}>{label}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
