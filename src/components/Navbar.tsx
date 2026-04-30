"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: "⊞" },
  { path: "/search", label: "Browse Groups", icon: "⊕" },
  { path: "/create-group", label: "Create Group", icon: "+" },
  { path: "/availability", label: "Availability", icon: "◷" },
  { path: "/requests", label: "Requests", icon: "◎" },
  { path: "/profile", label: "Profile", icon: "◉" },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => router.push("/dashboard")}>
        <span className={styles.logoMark}>W</span>
        <span className={styles.logoText}>Wireframes</span>
      </div>

      <ul className={styles.navList}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.navFooter}>
        <Link href="/login" className={styles.logoutBtn}>
          ← Sign Out
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
