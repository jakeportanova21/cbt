import React, { useState, useEffect } from 'react'

type Activity = { id: number; name: string; value: number }
type Measurement = { id: number; title: string; activities: Activity[] }

const STORAGE_KEY = 'countwhat.entries'

export default function CountWhatCounts(){
  const [title, setTitle] = useState('')
  const [measurements, setMeasurements] = useState<Measurement[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      if(!raw) return []
      const parsed = JSON.parse(raw) as any[]
      return parsed.map(m => ({
        id: m.id,
        title: m.title || '',
        activities: (m.activities || []).map((a: any) => ({ id: a.id, name: a.name || '', value: Number(a.value) || 0 }))
      }))
    }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements)) }catch{}
  },[measurements])

  function addMeasurement(){
    if(!title.trim()) return
    const m: Measurement = { id: Date.now(), title: title.trim(), activities: [] }
    setMeasurements(prev => [m, ...prev])
    setTitle('')
  }

  function removeMeasurement(id:number){ setMeasurements(prev => prev.filter(m => m.id !== id)) }

  function addActivity(measureId:number, name:string, value:number){
    if(!name.trim()) return
    const a: Activity = { id: Date.now()+Math.floor(Math.random()*1000), name: name.trim(), value: Number(value) || 0 }
    setMeasurements(prev => prev.map(m => m.id === measureId ? { ...m, activities: [a, ...m.activities] } : m))
  }

  function updateActivityValue(measureId:number, activityId:number, value:number){
    setMeasurements(prev => prev.map(m => m.id === measureId ? { ...m, activities: m.activities.map(a => a.id === activityId ? { ...a, value: Number(value) || 0 } : a) } : m))
  }

  function updateActivityName(measureId:number, activityId:number, name:string){
    setMeasurements(prev => prev.map(m => m.id === measureId ? { ...m, activities: m.activities.map(a => a.id === activityId ? { ...a, name } : a) } : m))
  }

  function removeActivity(measureId:number, activityId:number){
    setMeasurements(prev => prev.map(m => m.id === measureId ? { ...m, activities: m.activities.filter(a => a.id !== activityId) } : m))
  }

  function sumActivities(m: Measurement){
    return m.activities.reduce((s, a) => s + (Number(a.value) || 0), 0)
  }

  return (
    <div>
      <h2>Count What Counts</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <form onSubmit={e => { e.preventDefault(); addMeasurement() }} style={{display:'flex',gap:8,alignItems:'end',flexWrap:'wrap'}}>
          <label style={{flex:1}}>
            What is being measured
            <input placeholder="Summary (e.g. Minutes exercised)" value={title} onChange={e=>setTitle(e.target.value)} />
          </label>
          <div>
            <button type="submit">Add measurement</button>
          </div>
        </form>

        <div style={{display:'grid',gap:12}}>
          {measurements.length === 0 ? <div>No measurements yet. Add one above.</div> : (
            measurements.map(m => (
              <div key={m.id} style={{border:'1px solid #eee',padding:8,borderRadius:6}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <strong style={{flex:1}}>{m.title || 'Untitled'}</strong>
                  <div style={{fontSize:14,color:'#333'}}>Counter: <strong>{sumActivities(m)}</strong></div>
                  <div>
                    <button onClick={() => removeMeasurement(m.id)}>Delete</button>
                  </div>
                </div>

                <MeasurementActivities
                  measurement={m}
                  onAdd={(name,value)=>addActivity(m.id,name,value)}
                  onUpdateValue={(activityId,value)=>updateActivityValue(m.id,activityId,value)}
                  onUpdateName={(activityId,name)=>updateActivityName(m.id,activityId,name)}
                  onRemove={(activityId)=>removeActivity(m.id,activityId)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function MeasurementActivities({measurement, onAdd, onUpdateValue, onUpdateName, onRemove}:{
  measurement: Measurement,
  onAdd:(name:string,value:number)=>void,
  onUpdateValue:(activityId:number,value:number)=>void,
  onUpdateName:(activityId:number,name:string)=>void,
  onRemove:(activityId:number)=>void
}){
  const [name, setName] = useState('')
  const [value, setValue] = useState<number | ''>('')

  return (
    <div style={{marginTop:8}}>
      <form onSubmit={e=>{e.preventDefault(); onAdd(name, typeof value === 'number' ? value : 0); setName(''); setValue('')}} style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'end'}}>
        <label style={{flex:1}}>
          Activity
          <input placeholder="Activity name (e.g. Run)" value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label>
          Measure
          <input type="number" min={0} step={1} value={value as any} onChange={e=>setValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
        </label>
        <div>
          <button type="submit">Add activity</button>
        </div>
      </form>

      <div style={{marginTop:8}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th style={{textAlign:'left',padding:8}}>Activity</th>
              <th style={{textAlign:'left',padding:8}}>Measure</th>
              <th style={{padding:8}}></th>
            </tr>
          </thead>
          <tbody>
            {measurement.activities.map(a => (
              <tr key={a.id} style={{borderTop:'1px solid #eee',verticalAlign:'middle'}}>
                <td style={{padding:8}}>
                  <input value={a.name} onChange={e=>onUpdateName(a.id,e.target.value)} style={{width:'100%'}} />
                </td>
                <td style={{padding:8}}>
                  <input type="number" min={0} step={1} value={a.value as any} onChange={e=>onUpdateValue(a.id, e.target.value === '' ? 0 : Number(e.target.value))} />
                </td>
                <td style={{padding:8}}>
                  <button onClick={() => onRemove(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
