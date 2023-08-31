import Link from "next/link";
import React from "react";
import Image from "next/image";
import styles from "../styles/header.module.css";
import settings from "../public/settings.svg";
import solver from "../public/solver.svg";

const Header = () => {
  return (
    <header style={{ position: "sticky", top: 0 }}>
      <nav className={styles.nav}>
        <Image src={solver} alt="icon" style={{ width: 60, height: 60 }} />
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
        <Link id={styles.settingsButton} href="/settings">
          <Image src={settings} alt="settings" />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
