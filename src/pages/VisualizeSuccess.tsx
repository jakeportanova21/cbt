import React, { useState, useEffect } from 'react'

type Entry = {
  id: number
  activity: string
  pros: string[]
  scene: string
}

const STORAGE_KEY = 'visualize.entries'

export default function VisualizeSuccess(){
  const [activity, setActivity] = useState('')
  const [proText, setProText] = useState('')
  const [pros, setPros] = useState<string[]>([])
  const [scene, setScene] = useState('')

  const [entries, setEntries] = useState<Entry[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) }catch{}
  },[entries])

  function addPro(){ if(!proText.trim()) return; setPros(p=>[proText.trim(),...p]); setProText('') }
  function removePro(idx:number){ setPros(p=>p.filter((_,i)=>i!==idx)) }

  function addEntry(){
    if(!activity.trim() && pros.length===0 && !scene.trim()) return
    const e: Entry = { id: Date.now(), activity: activity.trim(), pros: pros.slice(), scene: scene.trim() }
    setEntries(prev => [e, ...prev])
    setActivity('')
    setPros([])
    setScene('')
  }

  function removeEntry(id:number){ setEntries(prev => prev.filter(e=>e.id!==id)) }

  return (
    <div>
      <h2>Visualize Success</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <label>
          Activity / change you want to make
          <input value={activity} onChange={e=>setActivity(e.target.value)} placeholder="e.g. Start running regularly" />
        </label>

        <div>
          <div style={{fontSize:12,color:'#666'}}>Pros of making this change</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input placeholder="Add a pro" value={proText} onChange={e=>setProText(e.target.value)} style={{flex:1}} />
            <button onClick={addPro}>Add pro</button>
          </div>
          <ul style={{margin:0,paddingLeft:18}}>
            {pros.map((p,idx)=>(<li key={idx} style={{display:'flex',alignItems:'center',gap:8}}>{p}<button style={{marginLeft:'auto'}} onClick={()=>removePro(idx)}>Delete</button></li>))}
          </ul>
        </div>

        <label>
          Fantasy / scene where the change is made
          <textarea value={scene} onChange={e=>setScene(e.target.value)} placeholder="Imagine and describe the scene" />
        </label>

        <div>
          <button onClick={addEntry}>Save visualization</button>
        </div>

        <div style={{display:'grid',gap:12}}>
          {entries.map(en=> (
            <div key={en.id} style={{border:'1px solid #eee',padding:8,borderRadius:6}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <strong>{en.activity || 'General'}</strong>
                <button onClick={()=>removeEntry(en.id)}>Delete</button>
              </div>
              <div style={{marginTop:8}}>
                <div style={{fontSize:12,color:'#666'}}>Pros</div>
                <ul style={{margin:0,paddingLeft:18}}>{en.pros.map((p,i)=><li key={i}>{p}</li>)}</ul>
              </div>
              <div style={{marginTop:8}}>
                <div style={{fontSize:12,color:'#666'}}>Scene</div>
                <div>{en.scene}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
