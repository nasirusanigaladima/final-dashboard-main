import { NavLink } from "react-router-dom";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>SCSM Platform</h3>
          <p>
            Empowering educational institutions with comprehensive student
            analytics and course management solutions.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>

          <p>
            <NavLink to="/">Overview</NavLink>
          </p>
          <p>
            <NavLink to="analytics">Analytics</NavLink>
          </p>
          <p>
            <NavLink to="enrollment">Enrollment</NavLink>
          </p>
          <p>
            <NavLink to="courses">Courses</NavLink>
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3>Data & Privacy</h3>
          <p>
            All student data is handled in accordance with educational privacy
            regulations and institutional policies.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2024 SCSM - Computerized Student Result and Course Management
          System
        </p>
      </div>
    </footer>
  );
}
