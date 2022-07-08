import { useEffect, useState } from 'react'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'
import { ResizableBox } from 'react-resizable'

import styles from './FileUpload.module.css'

export default function FileUpload() {
  const [content, setContent] = useState([])
  const [filteredContent, setFilteredContent] = useState('')
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ time: '', level: '' })

  const replaceAllButLast = (string, token, newToken) => {
    const parts = string.split(token)
    return parts.slice(0, -1).join(newToken) + token + parts.slice(-1)
  }

  const splitJsonError = (string) => {
    let splitted = string.split('Process Process-1:')
    let json = splitted[0]
    let error = ''

    if (splitted[1]) {
      error = 'Process Process-1:' + splitted[1]
    }
    return [json, error]
  }

  const handleShow = async (e) => {
    e.preventDefault()
    const reader = new FileReader()

    reader.onload = async (e) => {
      let text = e.target.result
      let [json, error] = splitJsonError(text)

      text = json
      text = replaceAllButLast(text, '}', '},')
      text = text.replaceAll('},}', '}}')
      text = text.replaceAll('},]', '}]')
      text = text.replaceAll('}},}', '}}}')
      text = text.replaceAll(',,', ',')

      console.log('text', text)

      setContent(JSON.parse(`[${text}]`))
      setError(error)
    }
    reader.readAsText(e.target.files[0])
  }

  const handleTimeChange = (e) => {
    setFilters({ ...filters, time: e.target.value })
  }

  const handleLevelChange = (e) => {
    console.log('e.target.value', e.target.value)
    setFilters({ ...filters, level: e.target.value })
  }

  useEffect(() => {
    if (content.length) {
      const newContent = content.filter((item) => {
        console.log('item.level', item.level)
        return (
          item.time.includes(filters.time) && item.level.includes(filters.level)
        )
      })
      setFilteredContent(newContent)
    }
  }, [filters, content])

  console.log('filteredContent', filteredContent.length)

  return (
    <div className={styles.root}>
      <div className={styles.inputs}>
        <input type='file' className={styles.fileInput} onChange={handleShow} />
        <div className={styles.dateTimeInput}>
          <div className={styles.text}>Time: </div>
          <input
            type='text'
            className={styles.textInput}
            onChange={handleTimeChange}
          />
        </div>
        <div className={styles.dateTimeInput}>
          <div className={styles.text}>Level: </div>
          <select
            className={styles.select}
            id='cars'
            name='cars'
            onChange={handleLevelChange}
          >
            <option value=''></option>
            <option value='INFO'>INFO</option>
            <option value='WARNING'>WARNING</option>
            <option value='DEBUG'>DEBUG</option>
          </select>
        </div>
        <div className={styles.divider}></div>
      </div>
      <JSONPretty className={styles.content} data={filteredContent} />
      <div className={styles.divider}></div>
      <JSONPretty data={error} />
    </div>
  )
}
