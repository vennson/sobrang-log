import Head from 'next/head'
import Image from 'next/image'

import FileUpload from 'components/FileUpload'

import styles from 'styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.root}>
      <FileUpload />
    </div>
  )
}
