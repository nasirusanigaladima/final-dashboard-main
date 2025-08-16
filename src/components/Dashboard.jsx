import { Api, TableauViz } from "@tableau/embedding-api-react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.featureCard}>
      <TableauViz
        src="https://public.tableau.com/views/FirstTABLEAU_17536311240820/OverviewDashboard?:showShareOptions=false"
        toolbar="hidden"
        hideTabs
        className={styles.dashboardContainer}
      />
    </div>
  );
}
