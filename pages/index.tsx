import Head from "next/head";
import styles from "@/styles/home.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wave Invoicing Tool</title>
        <meta name="description" content="An invoicing tool by Wave" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <Link href="/edit-customer">
          Click me to go to the Edit Customer page
        </Link>
      </main>
    </>
  );
}
