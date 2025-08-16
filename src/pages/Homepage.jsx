import Dashboard from "../components/Dashboard";
import Header from "../components/header";
import Sidebar from "../components/sidebar1";
import styles from "../components/Homepage.module.css";
import NewSections from "../components/Section";
import Footer from "../components/Footer";
function Homepage() {
  return (
    <>
      <Header />
      <NewSections />
      <Footer />
      <div className={styles.sectionContainer}></div>
    </>
  );
}

export default Homepage;
