import { useState } from 'react'

export default function TicToc(){
  const [thought,setThought]=useState('')
  const [type,setType]=useState<'tic'|'toc'>('tic')
  const [list,setList]=useState<{t:string,type:'tic'|'toc'}[]>([])
  function add(){if(!thought) return; setList(l=>[{t:thought,type},...l]); setThought('')}
  return (
    <div>
      <h2>Tic Toc Technique</h2>
      <div className="card">
        <select value={type} onChange={e=>setType(e.target.value as any)}>
          <option value="tic">Tic (task-interfering)</option>
          <option value="toc">Toc (task-oriented)</option>
        </select>
        <input placeholder="Thought" value={thought} onChange={e=>setThought(e.target.value)} />
        <button onClick={add}>Add</button>
        <ul>{list.map((l,i)=><li key={i}>[{l.type}] {l.t}</li>)}</ul>
      </div>
    </div>
  )
}
