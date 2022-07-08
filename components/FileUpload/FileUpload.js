import { useEffect, useState } from 'react'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'
import clsx from 'clsx'

import styles from './FileUpload.module.css'

export default function FileUpload() {
  const [content, setContent] = useState([])
  const [filteredContent, setFilteredContent] = useState('')
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    timeFrom: '',
    timeTo: '',
    level: '',
  })

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

      setContent(JSON.parse(`[${text}]`))
      setError(error)
    }
    reader.readAsText(e.target.files[0])
  }

  const handleTimeFrom = (e) => {
    if (e.target.value) {
      setFilters({
        ...filters,
        timeFrom: new Date(e.target.value.replace(',', '.')),
      })
    } else {
      setFilters({ ...filters, timeFrom: '' })
    }
  }

  const handleTimeTo = (e) => {
    if (e.target.value) {
      setFilters({
        ...filters,
        timeTo: new Date(e.target.value.replace(',', '.')),
      })
    } else {
      setFilters({ ...filters, timeTo: '' })
    }
  }

  const handleLevelChange = (e) => {
    setFilters({ ...filters, level: e.target.value })
  }

  useEffect(() => {
    if (content.length) {
      const newContent = content.filter((item) => {
        if (filters.timeFrom && filters.timeTo) {
          return (
            new Date(item.time.replace(',', '.')) >= filters.timeFrom &&
            new Date(item.time.replace(',', '.')) <= filters.timeTo &&
            item.level.includes(filters.level)
          )
        } else if (filters.timeFrom) {
          return (
            new Date(item.time.replace(',', '.')) >= filters.timeFrom &&
            item.level.includes(filters.level)
          )
        } else if (filters.timeTo) {
          return (
            new Date(item.time.replace(',', '.')) <= filters.timeTo &&
            item.level.includes(filters.level)
          )
        } else {
          return item.level.includes(filters.level)
        }
      })
      setFilteredContent(newContent)
    }
  }, [filters, content])

  return (
    <div className={styles.root}>
      <div className={styles.inputs}>
        <input type='file' className={styles.fileInput} onChange={handleShow} />
        <div className={styles.dateTimeInput}>
          <div className={styles.text}>Time </div>
          <div className={styles.label}>from: </div>
          <input
            type='text'
            className={styles.textInput}
            onChange={handleTimeFrom}
          />
          <div className={clsx(styles.label, styles.to)}>to: </div>
          <input
            type='text'
            className={styles.textInput}
            onChange={handleTimeTo}
          />
        </div>
        <div className={styles.levelInput}>
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
