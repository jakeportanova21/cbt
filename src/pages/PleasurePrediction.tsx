import { useState, useEffect } from 'react'

type Entry = {
  id: number
  date: string // YYYY-MM-DD
  activity: string
  withWho: string
  predicted: number
  actual?: number
}

const STORAGE_KEY = 'pleasure.entries'

export default function PleasurePrediction(){
  const [date,setDate] = useState<string>(()=> new Date().toISOString().slice(0,10))
  const [activity,setActivity] = useState('')
  const [withWho,setWithWho] = useState('')
  const [predicted,setPredicted] = useState<number | ''>('')

  const [entries,setEntries] = useState<Entry[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) }catch{}
  },[entries])

  function add(){
    if(!activity.trim() || predicted === '') return
    const e: Entry = {
      id: Date.now(),
      date,
      activity: activity.trim(),
      withWho: withWho.trim(),
      predicted: Number(predicted)
    }
    setEntries(prev => [e, ...prev])
    // reset form
    setActivity('')
    setWithWho('')
    setPredicted('')
    setDate(new Date().toISOString().slice(0,10))
  }

  function updateActual(id:number, value: number | undefined){
    setEntries(prev => prev.map(en => en.id === id ? {...en, actual: value} : en))
  }

  function remove(id:number){
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h2>Pleasure Prediction / Satisfaction Log</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <form onSubmit={e=>{e.preventDefault(); add()}} style={{display:'grid',gap:8}}>
          <div style={{display:'flex',gap:8,alignItems:'end',flexWrap:'wrap'}}>
            <label>
              Date
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </label>

            <label style={{flex:1}}>
              Activity
              <input type="text" value={activity} onChange={e=>setActivity(e.target.value)} placeholder="What did you do?" />
            </label>

            <label>
              With
              <input type="text" value={withWho} onChange={e=>setWithWho(e.target.value)} placeholder="Who (optional)" />
            </label>

            <label>
              Predicted satisfaction (0–10)
              <input type="number" min={0} max={10} step={1} value={predicted as any} onChange={e=>setPredicted(e.target.value?Number(e.target.value):'')} />
            </label>

            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <button type="submit">Add</button>
            </div>
          </div>
        </form>

        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left',padding:8}}>Date</th>
                <th style={{textAlign:'left',padding:8}}>Activity</th>
                <th style={{textAlign:'left',padding:8}}>With</th>
                <th style={{textAlign:'left',padding:8}}>Predicted</th>
                <th style={{textAlign:'left',padding:8}}>Actual</th>
                <th style={{padding:8}}></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(en => (
                <tr key={en.id} style={{borderTop:'1px solid #eee',verticalAlign:'middle'}}>
                  <td style={{padding:8}}>{en.date}</td>
                  <td style={{padding:8}}>{en.activity}</td>
                  <td style={{padding:8}}>{en.withWho || '-'}</td>
                  <td style={{padding:8}}>{en.predicted}</td>
                  <td style={{padding:8}}>
                    <input
                      aria-label={`Actual satisfaction for ${en.activity}`}
                      type="number"
                      min={0}
                      max={10}
                      step={1}
                      value={typeof en.actual === 'number' ? en.actual : ''}
                      onChange={e => {
                        const v = e.target.value === '' ? undefined : Number(e.target.value)
                        updateActual(en.id, v)
                      }}
                    />
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
