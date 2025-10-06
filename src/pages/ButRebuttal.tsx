import React, { useState, useEffect } from 'react'

type Entry = {
  id: number
  but: string
  rebuttal: string
}

const STORAGE_KEY = 'butrebuttal.entries'

export default function ButRebuttal(){
  const [but, setBut] = useState('')
  const [rebuttal, setRebuttal] = useState('')
  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) } catch {}
  }, [entries])

  function add(){
    if(!but.trim() || !rebuttal.trim()) return
    const e: Entry = { id: Date.now(), but: but.trim(), rebuttal: rebuttal.trim() }
    setEntries(prev => [e, ...prev])
    setBut('')
    setRebuttal('')
  }

  function remove(id:number){
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h2>But — Rebuttal</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <form onSubmit={e => { e.preventDefault(); add() }} style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'end'}}>
          <label style={{flex:1}}>
            "But" statement
            <input placeholder="e.g. I can't handle this, but..." value={but} onChange={e=>setBut(e.target.value)} />
          </label>

          <label style={{flex:1}}>
            Rebuttal
            <input placeholder="A realistic rebuttal to the 'but' statement" value={rebuttal} onChange={e=>setRebuttal(e.target.value)} />
          </label>

          <div>
            <button type="submit">Add</button>
          </div>
        </form>

        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left',padding:8}}>But statement</th>
                <th style={{textAlign:'left',padding:8}}>Rebuttal</th>
                <th style={{padding:8}}></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(en => (
                <tr key={en.id} style={{borderTop:'1px solid #eee',verticalAlign:'top'}}>
                  <td style={{padding:8}}>{en.but}</td>
                  <td style={{padding:8}}>{en.rebuttal}</td>
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
