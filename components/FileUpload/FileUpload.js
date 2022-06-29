import { useState } from 'react'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'

import styles from './FileUpload.module.css'

export default function FileUpload() {
  const [content, setContent] = useState('')

  const replaceAllButLast = (string, token, newToken) => {
    const parts = string.split(token)
    return parts.slice(0, -1).join(newToken) + token + parts.slice(-1)
  }

  const handleShow = async (e) => {
    e.preventDefault()
    const reader = new FileReader()

    reader.onload = async (e) => {
      let text = e.target.result
      // text = text.replace('}', '},')
      text = replaceAllButLast(text, '}', '},')
      text = text.replaceAll('},}', '}}')
      text = text.replaceAll(',,', ',')
      console.log('text', text)
      console.log(`[${text}]`)
      console.log(JSON.parse(`[${text}]`))
      setContent(JSON.parse(`[${text}]`))
    }
    reader.readAsText(e.target.files[0])
  }

  return (
    <div className={styles.root}>
      <input type='file' className={styles.fileInput} onChange={handleShow} />
      {/* <pre>
        <code>{JSON.stringify(content, null, 2)}</code>
      </pre> */}
      <div className={styles.divider}></div>
      <JSONPretty data={content} />
    </div>
  )
}
