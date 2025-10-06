import { useState, useEffect } from 'react'

type Entry = {
  id: number
  downing: string
  endorsing: string
}

const STORAGE_KEY = 'selfendorse.entries'

export default function SelfEndorsement(){
  const [downing, setDowning] = useState('')
  const [endorsing, setEndorsing] = useState('')
  const [entries, setEntries] = useState<Entry[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) }catch{}
  },[entries])

  function add(){
    if(!downing.trim() || !endorsing.trim()) return
    const e: Entry = { id: Date.now(), downing: downing.trim(), endorsing: endorsing.trim() }
    setEntries(prev => [e, ...prev])
    setDowning('')
    setEndorsing('')
  }

  function remove(id:number){ setEntries(prev => prev.filter(e => e.id !== id)) }

  return (
    <div>
      <h2>Self-Endorsement</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <form onSubmit={e=>{e.preventDefault(); add()}} style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'end'}}>
          <label style={{flex:1}}>
            Self-downing statement
            <input placeholder="e.g. I'm no good at this" value={downing} onChange={e=>setDowning(e.target.value)} />
          </label>

          <label style={{flex:1}}>
            Self-endorsing statement
            <input placeholder="A kinder, truthful endorsement" value={endorsing} onChange={e=>setEndorsing(e.target.value)} />
          </label>

          <div>
            <button type="submit">Add</button>
          </div>
        </form>

        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left',padding:8}}>Self-downing</th>
                <th style={{textAlign:'left',padding:8}}>Self-endorsing</th>
                <th style={{padding:8}}></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(en => (
                <tr key={en.id} style={{borderTop:'1px solid #eee',verticalAlign:'top'}}>
                  <td style={{padding:8}}>{en.downing}</td>
                  <td style={{padding:8}}>{en.endorsing}</td>
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
