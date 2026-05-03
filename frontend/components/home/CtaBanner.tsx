import Link from "next/link";
import styles from "./CtaBanner.module.css";

export default function CtaBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Ready to detect your first plate?</h2>
        <p className={styles.sub}>
          Upload an image and get results in seconds — no account needed.
        </p>
        <Link href="/detect" className={styles.btn}>
          Get Started →
        </Link>
      </div>
    </section>
  );
}
