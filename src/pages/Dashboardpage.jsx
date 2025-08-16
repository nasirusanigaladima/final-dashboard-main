import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";
import Header from "../components/header";
import styles from "../components/section.module.css";

export default function Dashboardpage() {
  return (
    <>
      <Header />
      <div className={styles.special}>
        <div className={styles.featureCard}>
          <Dashboard />
        </div>
      </div>
      <Footer />
    </>
  );
}
