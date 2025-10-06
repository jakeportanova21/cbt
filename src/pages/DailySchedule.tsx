import { useState } from 'react'

function formatHour(h: number){
  const suffix = h < 12 ? 'AM' : 'PM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12} ${suffix}`
}

export default function DailySchedule(){
  const times = Array.from({length:12}, (_, i) => i * 2) // 0,2,4,...,22

  const [items,setItems] = useState<{id:number,hour:number,task:string}[]>([])
  const [time,setTime] = useState<number>(times[0])
  const [task,setTask] = useState('')

  function add(){
    if(!task) return
    const newItem = { id: Date.now(), hour: time, task }
    setItems(prev => {
      // insert and keep list sorted by hour (earliest to latest)
      const next = [...prev, newItem].sort((a,b) => a.hour - b.hour)
      return next
    })
    setTask('')
  }

  return (
    <div>
      <h2>Daily Activity Schedule</h2>
      <div className="card">
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <label>
            <span className="sr-only">Time</span>
            <select value={String(time)} onChange={e=>setTime(Number(e.target.value))} aria-label="Time">
              {times.map(t => (
                <option key={t} value={t}>{formatHour(t)}</option>
              ))}
            </select>
          </label>

          <input placeholder="Task" value={task} onChange={e=>setTask(e.target.value)} />
          <button onClick={add}>Add</button>
        </div>
        <ol>
          {items.map((it)=> <li key={it.id}>{formatHour(it.hour)} - {it.task}</li>)}
        </ol>
      </div>
    </div>
  )
}
