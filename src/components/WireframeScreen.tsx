"use client";

import React, { useState } from "react";
import styles from "./WireframeScreen.module.css";

interface WireframeScreenProps {
  title: string;
  screenNumber: number;
  imgSrc: string;
  description?: string;
}

const WireframeScreen: React.FC<WireframeScreenProps> = ({
  title,
  screenNumber,
  imgSrc,
  description,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.screenBadge}>Screen {screenNumber}</span>
          <h1 className={styles.title}>{title}</h1>
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </header>

      <div className={styles.screenWrapper}>
        <div className={styles.browserChrome}>
          <div className={styles.browserDots}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.browserBar}>wireframes-app.local/{title.toLowerCase().replace(/\s+/g, "-")}</div>
        </div>
        <div className={`${styles.imageContainer} ${loaded ? styles.loaded : ""}`}>
          {!loaded && (
            <div className={styles.skeleton}>
              <div className={styles.skeletonPulse} />
            </div>
          )}
          <img
            src={imgSrc}
            alt={`${title} wireframe`}
            className={styles.wireframeImg}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default WireframeScreen;
