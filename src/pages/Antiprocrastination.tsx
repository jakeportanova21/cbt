import React, { useState, useEffect } from 'react'

type Entry = {
  id: number
  date: string
  task: string
  predictedDifficulty: number
  predictedSatisfaction: number
  actualDifficulty?: number | null
  actualSatisfaction?: number | null
}

const STORAGE_KEY = 'antiprocrastination.entries'

export default function Antiprocrastination() {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [task, setTask] = useState('')
  const [predictedDifficulty, setPredictedDifficulty] = useState<number>(5)
  const [predictedSatisfaction, setPredictedSatisfaction] = useState<number>(5)
  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {}
  }, [entries])

  function add() {
    if (!date || !task.trim()) return
    const e: Entry = {
      id: Date.now(),
      date,
      task: task.trim(),
      predictedDifficulty: Number(predictedDifficulty),
      predictedSatisfaction: Number(predictedSatisfaction),
      actualDifficulty: null,
      actualSatisfaction: null,
    }
    setEntries(prev => [e, ...prev])
    setTask('')
    setPredictedDifficulty(5)
    setPredictedSatisfaction(5)
  }

  function update(id: number, patch: Partial<Entry>) {
    setEntries(prev => prev.map(en => en.id === id ? { ...en, ...patch } : en))
  }

  function remove(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h2>Antiprocrastination Sheet</h2>
      <div className="card">
        <form onSubmit={(e) => { e.preventDefault(); add() }} style={{display:'grid',gridTemplateColumns:'1fr 2fr 1fr 1fr auto',gap:8,alignItems:'end'}}>
          <label>
            Date
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </label>

          <label style={{gridColumn:'2 / span 1'}}>
            Task
            <input type="text" value={task} onChange={e => setTask(e.target.value)} placeholder="Task description" />
          </label>

          <label>
            Pred. difficulty (0-10)
            <input type="number" min={0} max={10} value={predictedDifficulty} onChange={e => setPredictedDifficulty(Number(e.target.value))} />
          </label>

          <label>
            Pred. satisfaction (0-10)
            <input type="number" min={0} max={10} value={predictedSatisfaction} onChange={e => setPredictedSatisfaction(Number(e.target.value))} />
          </label>

          <div>
            <button type="submit">Add</button>
          </div>
        </form>

        <div style={{overflowX:'auto',marginTop:12}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left',padding:8}}>Date</th>
                <th style={{textAlign:'left',padding:8}}>Task</th>
                <th style={{textAlign:'left',padding:8}}>Pred. Difficulty</th>
                <th style={{textAlign:'left',padding:8}}>Pred. Satisfaction</th>
                <th style={{textAlign:'left',padding:8}}>Actual Difficulty</th>
                <th style={{textAlign:'left',padding:8}}>Actual Satisfaction</th>
                <th style={{padding:8}}> </th>
              </tr>
            </thead>
            <tbody>
              {entries.map(en => (
                <tr key={en.id} style={{borderTop:'1px solid #eee'}}>
                  <td style={{padding:8}}>{en.date}</td>
                  <td style={{padding:8}}>{en.task}</td>
                  <td style={{padding:8}}>{en.predictedDifficulty}</td>
                  <td style={{padding:8}}>{en.predictedSatisfaction}</td>
                  <td style={{padding:8}}>
                    <input type="number" min={0} max={10} value={en.actualDifficulty ?? ''} onChange={e => update(en.id, { actualDifficulty: e.target.value === '' ? null : Number(e.target.value) })} />
                  </td>
                  <td style={{padding:8}}>
                    <input type="number" min={0} max={10} value={en.actualSatisfaction ?? ''} onChange={e => update(en.id, { actualSatisfaction: e.target.value === '' ? null : Number(e.target.value) })} />
                  </td>
                  <td style={{padding:8}}>
                    <button onClick={() => remove(en.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
