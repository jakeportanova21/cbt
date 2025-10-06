import { useState, useEffect } from 'react'

type Entry = { id: number; action: string; negatives: string[]; positives: string[] }
const STORAGE_KEY = 'cantlose.entries'

export default function CantLose(){
  const [action, setAction] = useState('')
  const [negText, setNegText] = useState('')
  const [posText, setPosText] = useState('')
  const [entries, setEntries] = useState<Entry[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    }catch{return[]}
  })

  useEffect(()=>{ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) }catch{} },[entries])

  function addEntry(){ if(!action.trim()) return; const e: Entry = { id: Date.now(), action: action.trim(), negatives: negText.trim() ? [negText.trim()] : [], positives: posText.trim() ? [posText.trim()] : [] }; setEntries(prev => [e, ...prev]); setAction(''); setNegText(''); setPosText('') }
  function removeEntry(id:number){ setEntries(prev => prev.filter(e=>e.id!==id)) }
  function addNegative(id:number, text:string){ if(!text.trim()) return; setEntries(prev => prev.map(en => en.id===id ? {...en, negatives: [text.trim(), ...en.negatives]} : en)); }
  function addPositive(id:number, text:string){ if(!text.trim()) return; setEntries(prev => prev.map(en => en.id===id ? {...en, positives: [text.trim(), ...en.positives]} : en)); }
  function removeNegative(id:number, idx:number){ setEntries(prev => prev.map(en => en.id===id ? {...en, negatives: en.negatives.filter((_,i)=>i!==idx)} : en)); }
  function removePositive(id:number, idx:number){ setEntries(prev => prev.map(en => en.id===id ? {...en, positives: en.positives.filter((_,i)=>i!==idx)} : en)); }

  return (
    <div>
      <h2>Can't Lose System</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <form onSubmit={e=>{e.preventDefault(); addEntry()}} style={{display:'flex',gap:8,alignItems:'end',flexWrap:'wrap'}}>
          <label style={{flex:1}}>
            Action
            <input placeholder="Action you want to take" value={action} onChange={e=>setAction(e.target.value)} />
          </label>
          <label>
            Quick negative (optional)
            <input placeholder="Short negative consequence" value={negText} onChange={e=>setNegText(e.target.value)} />
          </label>
          <label>
            Quick positive / coping
            <input placeholder="Short positive thought or coping" value={posText} onChange={e=>setPosText(e.target.value)} />
          </label>
          <div>
            <button type="submit">Add</button>
          </div>
        </form>

        <div style={{display:'grid',gap:12}}>
          {entries.length === 0 ? <div>No entries yet. Add one above.</div> : entries.map(en => (
            <div key={en.id} style={{border:'1px solid #eee',padding:8,borderRadius:6}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <strong>{en.action}</strong>
                <button onClick={()=>removeEntry(en.id)}>Delete</button>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:8}}>
                <div>
                  <div style={{fontSize:12,color:'#666',marginBottom:6}}>Negative consequences</div>
                  <AddList initialItems={en.negatives} onAdd={(text)=>addNegative(en.id,text)} onRemove={(idx)=>removeNegative(en.id,idx)} />
                </div>
                <div>
                  <div style={{fontSize:12,color:'#666',marginBottom:6}}>Positive thoughts / coping strategies</div>
                  <AddList initialItems={en.positives} onAdd={(text)=>addPositive(en.id,text)} onRemove={(idx)=>removePositive(en.id,idx)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AddList({initialItems, onAdd, onRemove}:{ initialItems:string[], onAdd:(text:string)=>void, onRemove:(idx:number)=>void }){
  const [text,setText] = useState('')
  return (
    <div>
      <form onSubmit={e=>{e.preventDefault(); onAdd(text); setText('')}} style={{display:'flex',gap:8,marginBottom:8}}>
        <input placeholder="Add item" value={text} onChange={e=>setText(e.target.value)} style={{flex:1}} />
        <button type="submit">Add</button>
      </form>
      <ul style={{margin:0,paddingLeft:18}}>
        {initialItems.map((it,idx)=>(<li key={idx} style={{display:'flex',alignItems:'center',gap:8}}>{it}<button style={{marginLeft:'auto'}} onClick={()=>onRemove(idx)}>Delete</button></li>))}
      </ul>
    </div>
  )
}
