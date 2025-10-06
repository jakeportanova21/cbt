import { useState, useEffect } from 'react'

type Emotions = {
  joy: number
  anger: number
  fear: number
  sadness: number
  disgust: number
}

type Entry = {
  id: number
  date: string
  situation: string
  emotions: Emotions
  automaticThoughts: string
  cognitiveDistortions: string[]
  rationalResponse: string
}

const STORAGE_KEY = 'dysfunctional.entries'
const DISTORTIONS = [
  'All-or-nothing thinking',
  'Overgeneralization',
  'Mental filter',
  'Discounting the positive',
  'Jumping to conclusions',
  'Magnification / Minimization',
  'Emotional reasoning',
  'Should statements',
  'Labeling',
  'Personalization'
]

export default function DysfunctionalThoughts(){
  const [date,setDate] = useState<string>(()=> new Date().toISOString().slice(0,10))
  const [situation,setSituation] = useState('')
  const [emotions,setEmotions] = useState<Emotions>({joy:0,anger:0,fear:0,sadness:0,disgust:0})
  const [automaticThoughts,setAutomaticThoughts] = useState('')
  const [cognitiveDistortions,setCognitiveDistortions] = useState<string[]>([])
  const [rationalResponse,setRationalResponse] = useState('')

  const [entries,setEntries] = useState<Entry[]>(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) }catch{}
  },[entries])

  function toggleDistortion(name:string){
    setCognitiveDistortions(prev => prev.includes(name) ? prev.filter(d => d!==name) : [...prev, name])
  }

  function add(){
    if(!situation.trim() && !automaticThoughts.trim()) return
    const e: Entry = {
      id: Date.now(),
      date,
      situation: situation.trim(),
      emotions,
      automaticThoughts: automaticThoughts.trim(),
      cognitiveDistortions: cognitiveDistortions.slice(),
      rationalResponse: rationalResponse.trim()
    }
    setEntries(prev => [e, ...prev])
    // reset form
    setSituation('')
    setEmotions({joy:0,anger:0,fear:0,sadness:0,disgust:0})
    setAutomaticThoughts('')
    setCognitiveDistortions([])
    setRationalResponse('')
  }

  function remove(id:number){
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h2>Dysfunctional Thoughts Record</h2>
      <div className="card">
        <form onSubmit={e=>{e.preventDefault(); add()}} style={{display:'grid',gap:8}}>
          <div style={{display:'flex',gap:8,alignItems:'end'}}>
            <label>
              Date
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </label>

            <label style={{flex:1}}>
              Situation
              <input type="text" value={situation} onChange={e=>setSituation(e.target.value)} placeholder="Brief description of situation" />
            </label>
          </div>

          <fieldset style={{border:'1px solid #eee',padding:8,borderRadius:6}}>
            <legend>Emotions (0–10)</legend>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
              {(['joy','anger','fear','sadness','disgust'] as (keyof Emotions)[]).map(key => (
                <label key={key} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  {key[0].toUpperCase() + key.slice(1)}
                  <input type="range" min={0} max={10} value={emotions[key]} onChange={e => setEmotions(prev=>({...prev,[key]:Number(e.target.value)}))} />
                  <div>{emotions[key]}</div>
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            Automatic negative thoughts
            <textarea value={automaticThoughts} onChange={e=>setAutomaticThoughts(e.target.value)} placeholder="Write the automatic thoughts" />
          </label>

          <fieldset style={{border:'1px solid #eee',padding:8,borderRadius:6}}>
            <legend>Cognitive distortions (select all that apply)</legend>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {DISTORTIONS.map(d => (
                <label key={d} style={{display:'flex',alignItems:'center',gap:6}}>
                  <input type="checkbox" checked={cognitiveDistortions.includes(d)} onChange={()=>toggleDistortion(d)} />
                  <span>{d}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            Rational response
            <textarea value={rationalResponse} onChange={e=>setRationalResponse(e.target.value)} placeholder="Construct a rational response to the automatic thought" />
          </label>

          <div>
            <button type="submit">Add entry</button>
          </div>
        </form>

        <div style={{marginTop:12,overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left',padding:8}}>Date</th>
                <th style={{textAlign:'left',padding:8}}>Situation</th>
                <th style={{textAlign:'left',padding:8}}>Emotions</th>
                <th style={{textAlign:'left',padding:8}}>Automatic thoughts</th>
                <th style={{textAlign:'left',padding:8}}>Cognitive distortions</th>
                <th style={{textAlign:'left',padding:8}}>Rational response</th>
                <th style={{padding:8}}></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(en => (
                <tr key={en.id} style={{borderTop:'1px solid #eee',verticalAlign:'top'}}>
                  <td style={{padding:8}}>{en.date}</td>
                  <td style={{padding:8}}>{en.situation}</td>
                  <td style={{padding:8}}>
                    <div style={{display:'grid',gap:4}}>
                      <div>Joy: {en.emotions.joy}</div>
                      <div>Anger: {en.emotions.anger}</div>
                      <div>Fear: {en.emotions.fear}</div>
                      <div>Sadness: {en.emotions.sadness}</div>
                      <div>Disgust: {en.emotions.disgust}</div>
                    </div>
                  </td>
                  <td style={{padding:8}}>{en.automaticThoughts}</td>
                  <td style={{padding:8}}>{en.cognitiveDistortions.join(', ')}</td>
                  <td style={{padding:8}}>
                    <div style={{whiteSpace:'pre-wrap'}}>{en.rationalResponse}</div>
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
