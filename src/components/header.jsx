import { NavLink } from "react-router-dom";
import styles from "./header.module.css";
function Header() {
  return (
    <div className={styles.header}>
      <nav className={styles.navContainer}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>SC</div>
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>SCSM</div>
            <div className={styles.logoSubtitle}>Analytics Hub</div>
          </div>
        </div>

        <div className={styles.navLinks}>
          <NavLink to="/" className={styles.navLink}>
            Overview
          </NavLink>
          <NavLink to="/Analytics" className={styles.navLink}>
            Analytics
          </NavLink>
          <NavLink to="/enrollment" className={styles.navLink}>
            Enrollment
          </NavLink>
          <NavLink to="/courses" className={styles.navLink}>
            Courses
          </NavLink>

          {/* <a href="#overview" className="nav-link active">
            Overview
          </a>
          <a href="#analytics" className="nav-link">
            Analytics
          </a>
          <a href="#reports" className="nav-link">
            Reports
          </a>
          <a href="#settings" className="nav-link">
            Settings
          </a> */}
          <NavLink to="/dashboardpage" className={styles.dashboardBtn}>
            {" "}
            📊 Open Dashboard
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
export default Header;
