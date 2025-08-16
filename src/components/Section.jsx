import styles from "./section.module.css";
import { NavLink } from "react-router-dom";
import RecentActivity from "./RecentActivity";
export default function NewSections() {
  return (
    <div className={styles.container}>
      <section id="features" className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>📊</span>
          <h3 className={styles.featureTitle}>Interactive Dashboard</h3>
          <p className={styles.featureDescription}>
            Explore comprehensive student data with interactive visualizations,
            real-time filtering, and drill-down capabilities for detailed
            analysis.
          </p>
          <NavLink to="/dashboardpage" className={styles.featureLink}>
            {" "}
            View Dashboard
          </NavLink>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🎓</span>
          <h3 className={styles.featureTitle}>Course Performance</h3>
          <p className={styles.featureDescription}>
            Track course success rates, identify challenging modules, and
            monitor academic progress across different programs and semesters.
          </p>
          <NavLink to="/Courses" className={styles.featureLink}>
            Explore Courses
          </NavLink>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>👥</span>
          <h3 className={styles.featureTitle}>Student Insights</h3>
          <p className={styles.featureDescription}>
            Analyze individual and cohort performance, track enrollment trends,
            and identify students who may need additional support or are excelling.
          </p>
          <NavLink to="/students" className={styles.featureLink}>
            View All Students
          </NavLink>
        </div>
      </section>

      <section className={styles.quickStats}>
        <h2 className={styles.statsTitle}>📈 Academic Overview</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>307</div>
            <div className={styles.statLabel}>Total Students</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>90%</div>
            <div className={styles.statLabel}>Pass Rate</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>50</div>
            <div className={styles.statLabel}>Active Courses</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>2025</div>
            <div className={styles.statLabel}>Current Year</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>75</div>
            <div className={styles.statLabel}>Avg Score</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>80</div>
            <div className={styles.statLabel}>Failed Modules</div>
          </div>
        </div>
      </section>

      <section className={styles.recentActivity}>
  {/* Real-time Recent Activity */}
  <RecentActivity />
      </section>
    </div>
  );
}
