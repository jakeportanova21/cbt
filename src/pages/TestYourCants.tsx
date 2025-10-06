import React, { useState, useEffect } from 'react'

type Entry = { id: number; belief: string; plan: string; result?: 'success' | 'failure' }
const STORAGE_KEY = 'testcants.entries'

export default function TestYourCants(){
  const [belief, setBelief] = useState('')
  const [plan, setPlan] = useState('')
  const [entries, setEntries] = useState<Entry[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    }catch{return[]}
  })

  useEffect(()=>{ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) }catch{} },[entries])

  function add(){ if(!belief.trim() || !plan.trim()) return; const e: Entry = { id: Date.now(), belief: belief.trim(), plan: plan.trim() }; setEntries(prev => [e, ...prev]); setBelief(''); setPlan('') }
  function remove(id:number){ setEntries(prev => prev.filter(e=>e.id !== id)) }
  function setResult(id:number, r:'success'|'failure'|undefined){ setEntries(prev => prev.map(en => en.id===id ? {...en, result: r} : en)) }

  return (
    <div>
      <h2>Test Your Can'ts</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <form onSubmit={e=>{e.preventDefault(); add()}} style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'end'}}>
          <label style={{flex:1}}>
            Can't belief
            <input placeholder="I can't..." value={belief} onChange={e=>setBelief(e.target.value)} />
          </label>

          <label style={{flex:1}}>
            Plan to test belief
            <input placeholder="Small experiment to test it" value={plan} onChange={e=>setPlan(e.target.value)} />
          </label>

          <div>
            <button type="submit">Add</button>
          </div>
        </form>

        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left',padding:8}}>Can't belief</th>
                <th style={{textAlign:'left',padding:8}}>Plan</th>
                <th style={{textAlign:'left',padding:8}}>Result</th>
                <th style={{padding:8}}></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(en => (
                <tr key={en.id} style={{borderTop:'1px solid #eee',verticalAlign:'middle'}}>
                  <td style={{padding:8}}>{en.belief}</td>
                  <td style={{padding:8}}>{en.plan}</td>
                  <td style={{padding:8}}>
                    <select value={en.result||''} onChange={e=>setResult(en.id, e.target.value ? e.target.value as any : undefined)}>
                      <option value="">--</option>
                      <option value="success">Success</option>
                      <option value="failure">Failure</option>
                    </select>
                  </td>
                  <td style={{padding:8}}>
                    <button onClick={()=>remove(en.id)}>Delete</button>
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
