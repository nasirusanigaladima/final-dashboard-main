import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink to="courses">Courses</NavLink>
          </li>
          <li>
            <NavLink to="enrollment">Enrollment</NavLink>
          </li>
          <li>
            <NavLink to="students">Students</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
