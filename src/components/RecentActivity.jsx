import React, { useEffect, useState } from "react";
import styles from "./section.module.css";

function fetchRecentActivity() {
  // Simulate API call with random data
  const activities = [
    {
      icon: "📊",
      text: "Dashboard data updated with latest semester results",
      time: "Just now",
    },
    {
      icon: "👥",
      text: "New student enrollments processed for BIO201",
      time: "1 minute ago",
    },
    {
      icon: "📈",
      text: "Pass rate analysis completed for 2024 academic year",
      time: "5 minutes ago",
    },
    {
      icon: "🎓",
      text: "Course performance report generated",
      time: "10 minutes ago",
    },
    {
      icon: "⚠️",
      text: "Alert: 15 students require academic support in BIO107",
      time: "15 minutes ago",
    },
  ];
  // Shuffle for demo
  return activities.sort(() => Math.random() - 0.5);
}

export default function RecentActivity() {
  const [recentActivity, setRecentActivity] = useState(fetchRecentActivity());

  useEffect(() => {
    const interval = setInterval(() => {
      setRecentActivity(fetchRecentActivity());
    }, 10000); // update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h2 className={styles.activityTitle}>🔄 Recent Activity</h2>
      <ul className={styles.activityList}>
        {recentActivity.map((activity, idx) => (
          <li className={styles.activiyItem} key={idx}>
            <div className={styles.activityIcon}>{activity.icon}</div>
            <div className={styles.activityContent}>
              <div className={styles.activityText}>{activity.text}</div>
              <div className={styles.activityTime}>{activity.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
