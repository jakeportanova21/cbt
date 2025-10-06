import React, { useState, useEffect } from 'react'

type Activity = {
  id: number
  title: string
  pros: string[]
  cons: string[]
}

const STORAGE_KEY = 'motivation.activities'

export default function MotivationWithoutCoercion(){
  const [title, setTitle] = useState('')
  const [activities, setActivities] = useState<Activity[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Activity[] : []
    }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(activities)) }catch{}
  },[activities])

  function addActivity(){
    if(!title.trim()) return
    const a: Activity = { id: Date.now(), title: title.trim(), pros: [], cons: [] }
    setActivities(prev => [a, ...prev])
    setTitle('')
  }

  function removeActivity(id:number){ setActivities(prev => prev.filter(a => a.id !== id)) }

  function addPro(id:number, text:string){
    if(!text.trim()) return
    setActivities(prev => prev.map(a => a.id === id ? {...a, pros: [text.trim(), ...a.pros]} : a))
  }
  function removePro(id:number, idx:number){
    setActivities(prev => prev.map(a => a.id === id ? {...a, pros: a.pros.filter((_,i)=>i!==idx)} : a))
  }

  function addCon(id:number, text:string){
    if(!text.trim()) return
    setActivities(prev => prev.map(a => a.id === id ? {...a, cons: [text.trim(), ...a.cons]} : a))
  }
  function removeCon(id:number, idx:number){
    setActivities(prev => prev.map(a => a.id === id ? {...a, cons: a.cons.filter((_,i)=>i!==idx)} : a))
  }

  return (
    <div>
      <h2>Motivation — Pros & Cons by Activity</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <form onSubmit={e=>{e.preventDefault(); addActivity()}} style={{display:'flex',gap:8,alignItems:'end',flexWrap:'wrap'}}>
          <label style={{flex:1}}>
            Activity name
            <input placeholder="e.g. Start exercising" value={title} onChange={e=>setTitle(e.target.value)} />
          </label>
          <div>
            <button type="submit">Add activity</button>
          </div>
        </form>

        <div style={{display:'grid',gap:12}}>
          {activities.length === 0 ? <div>No activities yet. Add one above.</div> : (
            activities.map(a => <ActivityCard key={a.id} activity={a} onRemove={removeActivity} onAddPro={addPro} onRemovePro={removePro} onAddCon={addCon} onRemoveCon={removeCon} />)
          )}
        </div>
      </div>
    </div>
  )
}

function ActivityCard({activity, onRemove, onAddPro, onRemovePro, onAddCon, onRemoveCon}:{
  activity: Activity,
  onRemove:(id:number)=>void,
  onAddPro:(id:number,text:string)=>void,
  onRemovePro:(id:number,idx:number)=>void,
  onAddCon:(id:number,text:string)=>void,
  onRemoveCon:(id:number,idx:number)=>void
}){
  const [proText, setProText] = useState('')
  const [conText, setConText] = useState('')

  return (
    <div style={{border:'1px solid #eee',padding:8,borderRadius:6}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
        <strong>{activity.title}</strong>
        <div>
          <button onClick={() => onRemove(activity.id)}>Delete activity</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:8}}>
        <div>
          <div style={{fontSize:12,color:'#666',marginBottom:6}}>Pros</div>
          <form onSubmit={e=>{e.preventDefault(); onAddPro(activity.id, proText); setProText('')}} style={{display:'flex',gap:8,marginBottom:8}}>
            <input placeholder="Add a pro" value={proText} onChange={e=>setProText(e.target.value)} style={{flex:1}} />
            <button type="submit">Add</button>
          </form>
          <ul style={{margin:0,paddingLeft:18}}>
            {activity.pros.map((p,idx) => (
              <li key={idx} style={{display:'flex',alignItems:'center',gap:8}}>
                <span>{p}</span>
                <button style={{marginLeft:'auto'}} onClick={() => onRemovePro(activity.id, idx)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{fontSize:12,color:'#666',marginBottom:6}}>Cons</div>
          <form onSubmit={e=>{e.preventDefault(); onAddCon(activity.id, conText); setConText('')}} style={{display:'flex',gap:8,marginBottom:8}}>
            <input placeholder="Add a con" value={conText} onChange={e=>setConText(e.target.value)} style={{flex:1}} />
            <button type="submit">Add</button>
          </form>
          <ul style={{margin:0,paddingLeft:18}}>
            {activity.cons.map((c,idx) => (
              <li key={idx} style={{display:'flex',alignItems:'center',gap:8}}>
                <span>{c}</span>
                <button style={{marginLeft:'auto'}} onClick={() => onRemoveCon(activity.id, idx)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
