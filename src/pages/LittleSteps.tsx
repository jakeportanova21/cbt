import { useState, useEffect } from 'react'

type Step = { id: number; text: string; done: boolean }
type Goal = { id: number; time: string; title: string; steps: Step[] }

const STORAGE_KEY = 'little.steps.goals'

export default function LittleSteps(){
  const [title, setTitle] = useState('')
  const [time, setTime] = useState<string>(()=> new Date().toISOString().slice(11,16)) // hh:mm
  const [goals, setGoals] = useState<Goal[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Goal[] : []
    }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(goals)) }catch{}
  },[goals])

  function addGoal(){
    if(!title.trim()) return
    const g: Goal = { id: Date.now() + Math.floor(Math.random()*1000), time, title: title.trim(), steps: [] }
    setGoals(prev => [g, ...prev])
    setTitle('')
  }

  function removeGoal(id:number){ setGoals(prev => prev.filter(g => g.id !== id)) }

  function addStep(goalId:number, text:string){
    if(!text.trim()) return
    setGoals(prev => prev.map(g => g.id === goalId ? {...g, steps: [{id: Date.now()+Math.floor(Math.random()*1000), text: text.trim(), done: false}, ...g.steps]} : g))
  }

  function toggleStep(goalId:number, stepId:number){
    setGoals(prev => prev.map(g => g.id === goalId ? {...g, steps: g.steps.map(s => s.id === stepId ? {...s, done: !s.done} : s)} : g))
  }

  function removeStep(goalId:number, stepId:number){
    setGoals(prev => prev.map(g => g.id === goalId ? {...g, steps: g.steps.filter(s => s.id !== stepId)} : g))
  }

  return (
    <div>
      <h2>Little Steps for Little Feet</h2>
      <div className="card" style={{display:'grid',gap:8}}>
        <form onSubmit={e=>{e.preventDefault(); addGoal()}} style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'end'}}>
          <label style={{flex:1}}>
            Goal title
            <input placeholder="Small, specific goal" value={title} onChange={e=>setTitle(e.target.value)} />
          </label>

          <label>
            Time
            <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
          </label>

          <div>
            <button type="submit">Add goal</button>
          </div>
        </form>

        <div style={{display:'grid',gap:12}}>
          {goals.length === 0 ? <div>No goals yet. Add one above.</div> : (
            goals.map(g => <GoalCard key={g.id} goal={g} onAddStep={addStep} onToggleStep={toggleStep} onRemoveStep={removeStep} onRemoveGoal={removeGoal} />)
          )}
        </div>
      </div>
    </div>
  )
}

function GoalCard({goal, onAddStep, onToggleStep, onRemoveStep, onRemoveGoal}:{
  goal: Goal,
  onAddStep:(goalId:number,text:string)=>void,
  onToggleStep:(goalId:number,stepId:number)=>void,
  onRemoveStep:(goalId:number,stepId:number)=>void,
  onRemoveGoal:(id:number)=>void
}){
  const [stepText,setStepText] = useState('')
  return (
    <div style={{border:'1px solid #eee',padding:8,borderRadius:6}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
        <div>
          <strong>{goal.title}</strong>
          <div style={{fontSize:12,color:'#666'}}>Time: {goal.time}</div>
        </div>
        <div>
          <button onClick={() => onRemoveGoal(goal.id)}>Delete goal</button>
        </div>
      </div>

      <div style={{marginTop:8,display:'grid',gap:8}}>
        <form onSubmit={e=>{e.preventDefault(); onAddStep(goal.id, stepText); setStepText('')}} style={{display:'flex',gap:8}}>
          <input placeholder="Add tiny step" value={stepText} onChange={e=>setStepText(e.target.value)} style={{flex:1}} />
          <button type="submit">Add step</button>
        </form>

        <ol style={{margin:0,paddingLeft:18}}>
          {goal.steps.map(s => (
            <li key={s.id} style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="checkbox" checked={s.done} onChange={() => onToggleStep(goal.id, s.id)} />
              <span style={{textDecoration: s.done ? 'line-through' : 'none'}}>{s.text}</span>
              <button style={{marginLeft:'auto'}} onClick={() => onRemoveStep(goal.id, s.id)}>Delete</button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
