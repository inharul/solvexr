import Link from "next/link";
import React from "react";
import Image from "next/image";
import styles from "../styles/header.module.css";
import settings from "../public/settings.svg";
import solvexr from "../public/solvexr.svg";

const Header = () => {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      <nav className={styles.nav}>
        <Image
          src={solvexr}
          alt="icon"
          style={{ width: 60, height: 60 }}
          priority
        />
        <ul>
          <li>
            <Link href="/">/home</Link>
          </li>
          <li>
            <Link href="/about">/about</Link>
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
