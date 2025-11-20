import { useState, useEffect } from 'react'

type ProConItem = {
  id: number
  description: string
  weight: number // 1-10 scale for importance
}

type Entry = {
  id: number
  decision: string
  pros: ProConItem[]
  cons: ProConItem[]
}

const STORAGE_KEY = 'proscons.entries'

export default function ProsCons() {
  const [decision, setDecision] = useState('')
  const [proText, setProText] = useState('')
  const [conText, setConText] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])

  // Load from localStorage after initial render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Entry[]
        setEntries(parsed)
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
  }, [])

  // Save to localStorage when entries change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [entries])

  function addEntry() {
    if (!decision.trim()) return
    const e: Entry = {
      id: Date.now(),
      decision: decision.trim(),
      pros: [],
      cons: []
    }
    setEntries(prev => [e, ...prev])
    setDecision('')
  }

  function addPro(entryId: number) {
    if (!proText.trim()) return
    const newPro: ProConItem = {
      id: Date.now(),
      description: proText.trim(),
      weight: 5
    }
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, pros: [...e.pros, newPro] }
        : e
    ))
    setProText('')
  }

  function addCon(entryId: number) {
    if (!conText.trim()) return
    const newCon: ProConItem = {
      id: Date.now(),
      description: conText.trim(),
      weight: 5
    }
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, cons: [...e.cons, newCon] }
        : e
    ))
    setConText('')
  }

  function removePro(entryId: number, proId: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, pros: e.pros.filter(p => p.id !== proId) }
        : e
    ))
  }

  function removeCon(entryId: number, conId: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, cons: e.cons.filter(c => c.id !== conId) }
        : e
    ))
  }

  function updateProWeight(entryId: number, proId: number, weight: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            pros: e.pros.map(p =>
              p.id === proId ? { ...p, weight } : p
            )
          }
        : e
    ))
  }

  function updateConWeight(entryId: number, conId: number, weight: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            cons: e.cons.map(c =>
              c.id === conId ? { ...c, weight } : c
            )
          }
        : e
    ))
  }

  function removeEntry(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function calculateScore(entry: Entry) {
    const prosTotal = entry.pros.reduce((sum, pro) => sum + pro.weight, 0)
    const consTotal = entry.cons.reduce((sum, con) => sum + con.weight, 0)
    return prosTotal - consTotal
  }

  function getScoreColor(score: number) {
    if (score > 5) return '#d4edda'
    if (score > 0) return '#d1ecf1'
    if (score === 0) return '#fff3cd'
    if (score > -5) return '#f8d7da'
    return '#f5c6cb'
  }

  function getScoreTextColor(score: number) {
    if (score > 5) return '#155724'
    if (score > 0) return '#0c5460'
    if (score === 0) return '#856404'
    if (score > -5) return '#721c24'
    return '#721c24'
  }

  return (
    <div>
      <h2>Pros & Cons Analysis</h2>
      <p>Evaluate decisions by listing and weighting pros and cons to calculate an overall score.</p>
      
      <div className="card">
        <form onSubmit={e => { e.preventDefault(); addEntry() }} style={{display:'grid',gap:8}}>
          <label>
            Decision to Evaluate
            <input
              type="text"
              value={decision}
              onChange={e => setDecision(e.target.value)}
              placeholder="e.g. Should I take this job offer?"
              required
            />
          </label>
          <button type="submit">Create Analysis</button>
        </form>

        <div style={{marginTop:16}}>
          {entries.map(en => (
            <div key={en.id} className="card" style={{marginBottom:24}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:16}}>
                <h3 style={{margin:0}}>{en.decision}</h3>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <span style={{
                    padding:'8px 16px',
                    borderRadius:6,
                    background: getScoreColor(calculateScore(en)),
                    color: getScoreTextColor(calculateScore(en)),
                    fontWeight:'bold',
                    fontSize:'1.1em'
                  }}>
                    Score: {calculateScore(en) > 0 ? '+' : ''}{calculateScore(en)}
                  </span>
                  <button onClick={() => removeEntry(en.id)}>Delete</button>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
                {/* Pros Column */}
                <div>
                  <h4 style={{color:'#155724',margin:'0 0 12px 0'}}>Pros (Benefits)</h4>
                  
                  {/* Add Pro Form */}
                  <div style={{border:'1px solid #d4edda',padding:12,borderRadius:6,marginBottom:12,background:'#f8fff9'}}>
                    <input
                      type="text"
                      value={proText}
                      onChange={e => setProText(e.target.value)}
                      placeholder="Add a positive aspect..."
                      style={{width:'100%',marginBottom:8}}
                    />
                    <button onClick={() => addPro(en.id)} style={{width:'100%',background:'#28a745',color:'white',border:'none',padding:'6px',borderRadius:4}}>
                      Add Pro
                    </button>
                  </div>

                  {/* Pros List */}
                  <div style={{maxHeight:300,overflowY:'auto'}}>
                    {en.pros.map(pro => (
                      <div key={pro.id} style={{
                        border:'1px solid #d4edda',
                        padding:12,
                        borderRadius:4,
                        marginBottom:8,
                        background:'#f8fff9'
                      }}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
                          <div style={{flex:1,fontWeight:'bold'}}>{pro.description}</div>
                          <button onClick={() => removePro(en.id, pro.id)} style={{marginLeft:8,background:'#dc3545',color:'white',border:'none',padding:'2px 6px',borderRadius:2,fontSize:'12px'}}>
                            ×
                          </button>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <label style={{fontSize:'14px',fontWeight:'bold'}}>Weight:</label>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={pro.weight}
                            onChange={e => updateProWeight(en.id, pro.id, Number(e.target.value))}
                            style={{flex:1}}
                          />
                          <span style={{fontWeight:'bold',color:'#155724',minWidth:'20px'}}>{pro.weight}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {en.pros.length > 0 && (
                    <div style={{marginTop:12,padding:8,background:'#d4edda',borderRadius:4,textAlign:'center'}}>
                      <strong style={{color:'#155724'}}>Total Pros: {en.pros.reduce((sum, pro) => sum + pro.weight, 0)}</strong>
                    </div>
                  )}
                </div>

                {/* Cons Column */}
                <div>
                  <h4 style={{color:'#721c24',margin:'0 0 12px 0'}}>Cons (Drawbacks)</h4>
                  
                  {/* Add Con Form */}
                  <div style={{border:'1px solid #f8d7da',padding:12,borderRadius:6,marginBottom:12,background:'#fdf2f2'}}>
                    <input
                      type="text"
                      value={conText}
                      onChange={e => setConText(e.target.value)}
                      placeholder="Add a negative aspect..."
                      style={{width:'100%',marginBottom:8}}
                    />
                    <button onClick={() => addCon(en.id)} style={{width:'100%',background:'#dc3545',color:'white',border:'none',padding:'6px',borderRadius:4}}>
                      Add Con
                    </button>
                  </div>

                  {/* Cons List */}
                  <div style={{maxHeight:300,overflowY:'auto'}}>
                    {en.cons.map(con => (
                      <div key={con.id} style={{
                        border:'1px solid #f8d7da',
                        padding:12,
                        borderRadius:4,
                        marginBottom:8,
                        background:'#fdf2f2'
                      }}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
                          <div style={{flex:1,fontWeight:'bold'}}>{con.description}</div>
                          <button onClick={() => removeCon(en.id, con.id)} style={{marginLeft:8,background:'#dc3545',color:'white',border:'none',padding:'2px 6px',borderRadius:2,fontSize:'12px'}}>
                            ×
                          </button>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <label style={{fontSize:'14px',fontWeight:'bold'}}>Weight:</label>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={con.weight}
                            onChange={e => updateConWeight(en.id, con.id, Number(e.target.value))}
                            style={{flex:1}}
                          />
                          <span style={{fontWeight:'bold',color:'#721c24',minWidth:'20px'}}>{con.weight}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {en.cons.length > 0 && (
                    <div style={{marginTop:12,padding:8,background:'#f8d7da',borderRadius:4,textAlign:'center'}}>
                      <strong style={{color:'#721c24'}}>Total Cons: {en.cons.reduce((sum, con) => sum + con.weight, 0)}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div style={{
                marginTop:16,
                padding:16,
                background:'#f8f9fa',
                borderRadius:8,
                border:'2px solid #dee2e6'
              }}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:16,textAlign:'center'}}>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Total Pros</div>
                    <div style={{fontSize:'1.2em',fontWeight:'bold',color:'#155724'}}>
                      +{en.pros.reduce((sum, pro) => sum + pro.weight, 0)}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Total Cons</div>
                    <div style={{fontSize:'1.2em',fontWeight:'bold',color:'#721c24'}}>
                      -{en.cons.reduce((sum, con) => sum + con.weight, 0)}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Net Score</div>
                    <div style={{
                      fontSize:'1.4em',
                      fontWeight:'bold',
                      color: getScoreTextColor(calculateScore(en))
                    }}>
                      {calculateScore(en) > 0 ? '+' : ''}{calculateScore(en)}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Recommendation</div>
                    <div style={{
                      fontSize:'1.1em',
                      fontWeight:'bold',
                      color: getScoreTextColor(calculateScore(en))
                    }}>
                      {calculateScore(en) > 0 ? 'Go for it!' : calculateScore(en) < 0 ? 'Reconsider' : 'Neutral'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
