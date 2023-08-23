import styles from "../styles/home.module.css";

export default function Home() {
  return (
    <>
      <section className={styles.welcome}>
        <div style={{ textAlign: "center" }}>
          <h1>SolveR</h1>
          <p>practice your calculation speed (to some extent maybe)</p>
        </div>
      </section>
    </>
  );
}
