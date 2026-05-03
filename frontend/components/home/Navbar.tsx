import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <span className={styles.logoDot} />
        PlateVision
      </div>
      <div className={styles.links}>
        <a href="#features" className={styles.link}>Features</a>
        <a href="#how" className={styles.link}>How it works</a>
        <Link href="/detect" className={styles.cta}>Get Started</Link>
      </div>
    </nav>
  );
}
