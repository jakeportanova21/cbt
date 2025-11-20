import { useState, useEffect } from 'react'

type ScoreOption = {
  id: string
  label: string
  description: string
  score: number // -10 to +10
  weight: number // 0.1 to 3.0
}

type Entry = {
  id: number
  behavior: string
  options: ScoreOption[]
}

const STORAGE_KEY = 'riskreward.entries'

const DEFAULT_OPTIONS: Omit<ScoreOption, 'score' | 'weight'>[] = [
  {
    id: 'financial_impact',
    label: 'Financial Impact',
    description: 'How this affects your finances and economic wellbeing'
  },
  {
    id: 'time_investment',
    label: 'Time Investment',
    description: 'Time required vs. time saved or wasted'
  },
  {
    id: 'emotional_wellbeing',
    label: 'Emotional Wellbeing',
    description: 'Impact on mood, stress levels, and mental health'
  },
  {
    id: 'relationships',
    label: 'Relationships',
    description: 'Effect on family, friends, and social connections'
  },
  {
    id: 'career_growth',
    label: 'Career Growth',
    description: 'Professional development and advancement opportunities'
  },
  {
    id: 'physical_health',
    label: 'Physical Health',
    description: 'Impact on fitness, energy, and overall health'
  },
  {
    id: 'personal_growth',
    label: 'Personal Growth',
    description: 'Learning, skill development, and self-improvement'
  },
  {
    id: 'life_satisfaction',
    label: 'Life Satisfaction',
    description: 'Overall happiness and fulfillment'
  },
  {
    id: 'stress_levels',
    label: 'Stress Levels',
    description: 'Anxiety, pressure, and mental burden'
  },
  {
    id: 'future_opportunities',
    label: 'Future Opportunities',
    description: 'Opens doors vs. closes future possibilities'
  },
  {
    id: 'social_status',
    label: 'Social Status',
    description: 'Reputation, respect, and how others perceive you'
  },
  {
    id: 'creativity_fulfillment',
    label: 'Creative Fulfillment',
    description: 'Expression, innovation, and artistic satisfaction'
  }
]

export default function RiskReward() {
  const [behavior, setBehavior] = useState('')
  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    } catch { 
      return [] 
    }
  })

  useEffect(() => {
    try { 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) 
    } catch {
      // Handle localStorage errors silently
    }
  }, [entries])

  function addEntry() {
    if (!behavior.trim()) return
    const e: Entry = {
      id: Date.now(),
      behavior: behavior.trim(),
      options: DEFAULT_OPTIONS.map(opt => ({
        ...opt,
        score: 0,
        weight: 1.0
      }))
    }
    setEntries(prev => [e, ...prev])
    setBehavior('')
  }

  function removeEntry(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function updateScore(entryId: number, optionId: string, score: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            options: e.options.map(opt =>
              opt.id === optionId ? { ...opt, score } : opt
            )
          }
        : e
    ))
  }

  function updateWeight(entryId: number, optionId: string, weight: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            options: e.options.map(opt =>
              opt.id === optionId ? { ...opt, weight } : opt
            )
          }
        : e
    ))
  }

  function calculateOverallScore(entry: Entry) {
    const totalWeightedScore = entry.options.reduce((sum, opt) => sum + (opt.score * opt.weight), 0)
    const totalWeight = entry.options.reduce((sum, opt) => sum + opt.weight, 0)
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0
  }

  function getScoreColor(score: number) {
    if (score > 2) return '#d4edda'
    if (score > 0) return '#d1ecf1'
    if (score === 0) return '#fff3cd'
    if (score > -2) return '#f8d7da'
    return '#f5c6cb'
  }

  function getScoreTextColor(score: number) {
    if (score > 2) return '#155724'
    if (score > 0) return '#0c5460'
    if (score === 0) return '#856404'
    if (score > -2) return '#721c24'
    return '#721c24'
  }

  return (
    <div>
      <h2>Risk-Reward Dashboard</h2>
      <p>Evaluate behaviors and decisions across multiple dimensions with weighted scoring.</p>
      
      <div className="card">
        <form onSubmit={e => { e.preventDefault(); addEntry() }} style={{display:'grid',gap:8}}>
          <label>
            Behavior or Decision to Evaluate
            <input
              type="text"
              value={behavior}
              onChange={e => setBehavior(e.target.value)}
              placeholder="e.g. Taking a new job, moving to a new city, starting a diet..."
              required
            />
          </label>
          <button type="submit">Create Evaluation</button>
        </form>

        <div style={{marginTop:16}}>
          {entries.map(en => (
            <div key={en.id} className="card" style={{marginBottom:24}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:16}}>
                <h3 style={{margin:0}}>{en.behavior}</h3>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <span style={{
                    padding:'8px 16px',
                    borderRadius:6,
                    background: getScoreColor(calculateOverallScore(en)),
                    color: getScoreTextColor(calculateOverallScore(en)),
                    fontWeight:'bold',
                    fontSize:'1.1em'
                  }}>
                    Overall Score: {calculateOverallScore(en).toFixed(1)}
                  </span>
                  <button onClick={() => removeEntry(en.id)}>Delete</button>
                </div>
              </div>

              <div style={{display:'grid',gap:12}}>
                {en.options.map(opt => (
                  <div key={opt.id} style={{
                    border:'1px solid #ddd',
                    borderRadius:8,
                    padding:12,
                    background:'#fafafa'
                  }}>
                    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:12,alignItems:'center'}}>
                      <div>
                        <div style={{fontWeight:'bold',marginBottom:4}}>{opt.label}</div>
                        <div style={{fontSize:'0.9em',color:'#666'}}>{opt.description}</div>
                      </div>
                      
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <label style={{fontWeight:'bold',marginBottom:4}}>Score</label>
                        <input
                          type="range"
                          min={-10}
                          max={10}
                          step={0.5}
                          value={opt.score}
                          onChange={e => updateScore(en.id, opt.id, Number(e.target.value))}
                          style={{width:'100%'}}
                        />
                        <span style={{
                          marginTop:4,
                          fontWeight:'bold',
                          color: opt.score > 0 ? '#155724' : opt.score < 0 ? '#721c24' : '#856404'
                        }}>
                          {opt.score > 0 ? '+' : ''}{opt.score}
                        </span>
                      </div>

                      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <label style={{fontWeight:'bold',marginBottom:4}}>Weight</label>
                        <input
                          type="range"
                          min={0.1}
                          max={3.0}
                          step={0.1}
                          value={opt.weight}
                          onChange={e => updateWeight(en.id, opt.id, Number(e.target.value))}
                          style={{width:'100%'}}
                        />
                        <span style={{marginTop:4,fontWeight:'bold'}}>
                          {opt.weight.toFixed(1)}x
                        </span>
                      </div>
                    </div>

                    <div style={{
                      marginTop:8,
                      padding:6,
                      background:'#fff',
                      borderRadius:4,
                      textAlign:'center',
                      fontWeight:'bold'
                    }}>
                      Weighted Impact: {(opt.score * opt.weight).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop:16,
                padding:16,
                background:'#f8f9fa',
                borderRadius:8,
                border:'2px solid #dee2e6'
              }}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:16,textAlign:'center'}}>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Total Weighted Score</div>
                    <div style={{fontSize:'1.2em',fontWeight:'bold'}}>
                      {en.options.reduce((sum, opt) => sum + (opt.score * opt.weight), 0).toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Total Weight</div>
                    <div style={{fontSize:'1.2em',fontWeight:'bold'}}>
                      {en.options.reduce((sum, opt) => sum + opt.weight, 0).toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Average Score</div>
                    <div style={{
                      fontSize:'1.4em',
                      fontWeight:'bold',
                      color: getScoreTextColor(calculateOverallScore(en))
                    }}>
                      {calculateOverallScore(en).toFixed(1)}
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
