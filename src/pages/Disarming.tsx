import { useState, useEffect } from 'react'

type Entry = {
  id: number
  activity: string
  criticism: string
  agreement: string
}

const STORAGE_KEY = 'disarming.entries'

export default function Disarming(){
  const [activity, setActivity] = useState('')
  const [criticism, setCriticism] = useState('')
  const [agreement, setAgreement] = useState('')
  const [entries, setEntries] = useState<Entry[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      if(!raw) return []
      const parsed = JSON.parse(raw) as any[]
      // normalize older entries that might not have agreement
      return parsed.map(p => ({ id: p.id, activity: p.activity||'', criticism: p.criticism||'', agreement: p.agreement || '' }))
    }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) }catch{}
  },[entries])

  function add(){
    if(!activity.trim()) return
    const e: Entry = { id: Date.now(), activity: activity.trim(), criticism: criticism.trim(), agreement: agreement.trim() }
    setEntries(prev => [e, ...prev])
    setActivity('')
    setCriticism('')
    setAgreement('')
  }

  function remove(id:number){ setEntries(prev => prev.filter(e => e.id !== id)) }

  function updateAgreement(id:number, value:string){
    setEntries(prev => prev.map(en => en.id === id ? { ...en, agreement: value } : en))
  }

  return (
    <div>
      <h2>Disarming Technique</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <form onSubmit={e=>{e.preventDefault(); add()}} style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'end'}}>
          <label style={{flex:1}}>
            Activity / situation
            <input placeholder="e.g. Feedback from colleague" value={activity} onChange={e=>setActivity(e.target.value)} />
          </label>

          <label style={{flex:1}}>
            Criticism
            <input placeholder="What was said / the criticism" value={criticism} onChange={e=>setCriticism(e.target.value)} />
          </label>

          <label style={{flex:1}}>
            Agreement
            <input placeholder="Agreement" value={agreement} onChange={e=>setAgreement(e.target.value)} />
          </label>

          <div>
            <button type="submit">Add</button>
          </div>
        </form>

        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left',padding:8}}>Activity / Situation</th>
                <th style={{textAlign:'left',padding:8}}>Criticism</th>
                <th style={{textAlign:'left',padding:8}}>Agreement</th>
                <th style={{padding:8}}></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(en => (
                <tr key={en.id} style={{borderTop:'1px solid #eee',verticalAlign:'top'}}>
                  <td style={{padding:8}}>{en.activity}</td>
                  <td style={{padding:8}}>{en.criticism || '-'}</td>
                  <td style={{padding:8}}>
                    <textarea
                      aria-label={`Agreement for ${en.activity}`}
                      value={en.agreement}
                      onChange={e => updateAgreement(en.id, e.target.value)}
                      placeholder="Agreement"
                      style={{width:'100%',minHeight:48}}
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
