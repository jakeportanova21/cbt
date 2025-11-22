import { useState, useEffect } from 'react'

type WellnessComponent = {
  id: string
  label: string
  description: string
  impact: number // -10 to +10 scale
  confidence: number // 1-100% how certain you are about this impact
}

type Entry = {
  id: number
  decision: string
  components: WellnessComponent[]
}

const STORAGE_KEY = 'wellnessrisk.entries'

const WELLNESS_COMPONENTS = [
  {
    id: 'physical',
    label: 'Physical Wellness',
    description: 'Impact on physical health, fitness, energy levels, nutrition, and overall bodily well-being'
  },
  {
    id: 'emotional',
    label: 'Emotional Wellness', 
    description: 'Effect on mood, emotional regulation, stress management, and psychological well-being'
  },
  {
    id: 'intellectual',
    label: 'Intellectual Wellness',
    description: 'Influence on learning, creativity, critical thinking, and mental stimulation'
  },
  {
    id: 'social',
    label: 'Social Wellness',
    description: 'Impact on relationships, community connections, social skills, and interpersonal bonds'
  },
  {
    id: 'spiritual',
    label: 'Spiritual Wellness',
    description: 'Effect on sense of purpose, meaning, values, beliefs, and connection to something greater'
  },
  {
    id: 'environmental',
    label: 'Environmental Wellness',
    description: 'Impact on living/working spaces, nature connection, and environmental sustainability'
  },
  {
    id: 'occupational',
    label: 'Occupational Wellness',
    description: 'Effect on career satisfaction, work-life balance, professional growth, and financial security'
  },
  {
    id: 'financial',
    label: 'Financial Wellness',
    description: 'Impact on financial stability, money management, economic security, and financial stress'
  }
]

export default function WellnessRisk() {
  const [decision, setDecision] = useState('')
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
      components: WELLNESS_COMPONENTS.map(comp => ({
        ...comp,
        impact: 0,
        confidence: 70
      }))
    }
    setEntries(prev => [e, ...prev])
    setDecision('')
  }

  function removeEntry(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function updateImpact(entryId: number, componentId: string, impact: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            components: e.components.map(comp =>
              comp.id === componentId ? { ...comp, impact } : comp
            )
          }
        : e
    ))
  }

  function updateConfidence(entryId: number, componentId: string, confidence: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            components: e.components.map(comp =>
              comp.id === componentId ? { ...comp, confidence } : comp
            )
          }
        : e
    ))
  }

  function calculateWeightedImpact(component: WellnessComponent) {
    return (component.impact * component.confidence) / 100
  }

  function calculateOverallWellness(entry: Entry) {
    const totalWeighted = entry.components.reduce((sum, comp) => sum + calculateWeightedImpact(comp), 0)
    const totalConfidence = entry.components.reduce((sum, comp) => sum + comp.confidence, 0)
    return totalConfidence > 0 ? totalWeighted : 0
  }

  function getImpactColor(impact: number) {
    if (impact > 5) return '#d4edda'
    if (impact > 2) return '#d1ecf1'
    if (impact > -2) return '#fff3cd'
    if (impact > -5) return '#f8d7da'
    return '#f5c6cb'
  }

  function getImpactTextColor(impact: number) {
    if (impact > 5) return '#155724'
    if (impact > 2) return '#0c5460'
    if (impact > -2) return '#856404'
    if (impact > -5) return '#721c24'
    return '#721c24'
  }

  function getWellnessIcon(componentId: string) {
    const icons = {
      physical: '💪',
      emotional: '💙',
      intellectual: '🧠',
      social: '👥',
      spiritual: '🕯️',
      environmental: '🌱',
      occupational: '💼',
      financial: '💰'
    }
    return icons[componentId as keyof typeof icons] || '⚡'
  }

  return (
    <div>
      <h2>Holistic Wellness Risk-Reward Analysis</h2>
      <p>Evaluate decisions across the 8 dimensions of wellness with weighted impact scoring based on your confidence level.</p>
      
      <div className="card">
        <form onSubmit={e => { e.preventDefault(); addEntry() }} style={{display:'grid',gap:8}}>
          <label>
            Decision or Life Change to Evaluate
            <input
              type="text"
              value={decision}
              onChange={e => setDecision(e.target.value)}
              placeholder="e.g. Moving to a new city, changing careers, starting a relationship..."
              required
            />
          </label>
          <button type="submit">Create Wellness Analysis</button>
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
                    background: getImpactColor(calculateOverallWellness(en)),
                    color: getImpactTextColor(calculateOverallWellness(en)),
                    fontWeight:'bold',
                    fontSize:'1.1em'
                  }}>
                    Wellness Score: {calculateOverallWellness(en).toFixed(1)}
                  </span>
                  <button onClick={() => removeEntry(en.id)}>Delete</button>
                </div>
              </div>

              <div style={{display:'grid',gap:16}}>
                {en.components.map(comp => (
                  <div key={comp.id} style={{
                    border:'1px solid #ddd',
                    borderRadius:8,
                    padding:16,
                    background:'#fafafa'
                  }}>
                    <div style={{display:'grid',gridTemplateColumns:'auto 1fr 120px 120px 100px',gap:16,alignItems:'center'}}>
                      <div style={{fontSize:'24px'}}>{getWellnessIcon(comp.id)}</div>
                      
                      <div>
                        <div style={{fontWeight:'bold',marginBottom:4}}>{comp.label}</div>
                        <div style={{fontSize:'0.9em',color:'#666',lineHeight:'1.3'}}>{comp.description}</div>
                      </div>
                      
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <label style={{fontWeight:'bold',marginBottom:4,fontSize:'12px'}}>Impact</label>
                        <input
                          type="range"
                          min={-10}
                          max={10}
                          step={0.5}
                          value={comp.impact}
                          onChange={e => updateImpact(en.id, comp.id, Number(e.target.value))}
                          style={{width:'100%'}}
                        />
                        <span style={{
                          marginTop:4,
                          fontWeight:'bold',
                          fontSize:'14px',
                          color: comp.impact > 0 ? '#155724' : comp.impact < 0 ? '#721c24' : '#856404'
                        }}>
                          {comp.impact > 0 ? '+' : ''}{comp.impact}
                        </span>
                      </div>

                      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <label style={{fontWeight:'bold',marginBottom:4,fontSize:'12px'}}>Confidence</label>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          step={5}
                          value={comp.confidence}
                          onChange={e => updateConfidence(en.id, comp.id, Number(e.target.value))}
                          style={{width:'100%'}}
                        />
                        <span style={{marginTop:4,fontWeight:'bold',fontSize:'14px'}}>
                          {comp.confidence}%
                        </span>
                      </div>

                      <div style={{
                        textAlign:'center',
                        padding:8,
                        background:'#fff',
                        borderRadius:4,
                        border:'1px solid #ddd'
                      }}>
                        <div style={{fontSize:'11px',fontWeight:'bold',color:'#666',marginBottom:2}}>Weighted</div>
                        <div style={{
                          fontWeight:'bold',
                          fontSize:'14px',
                          color: calculateWeightedImpact(comp) > 0 ? '#155724' : calculateWeightedImpact(comp) < 0 ? '#721c24' : '#856404'
                        }}>
                          {calculateWeightedImpact(comp) > 0 ? '+' : ''}{calculateWeightedImpact(comp).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wellness Summary */}
              <div style={{
                marginTop:16,
                padding:16,
                background:'#f8f9fa',
                borderRadius:8,
                border:'2px solid #dee2e6'
              }}>
                <h4 style={{margin:'0 0 12px 0',textAlign:'center'}}>Wellness Impact Summary</h4>
                
                <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:16,marginBottom:16}}>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontWeight:'bold',color:'#495057',fontSize:'12px'}}>Positive Impact</div>
                    <div style={{fontSize:'1.2em',fontWeight:'bold',color:'#155724'}}>
                      +{en.components.filter(c => calculateWeightedImpact(c) > 0)
                        .reduce((sum, c) => sum + calculateWeightedImpact(c), 0).toFixed(1)}
                    </div>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontWeight:'bold',color:'#495057',fontSize:'12px'}}>Negative Impact</div>
                    <div style={{fontSize:'1.2em',fontWeight:'bold',color:'#721c24'}}>
                      {en.components.filter(c => calculateWeightedImpact(c) < 0)
                        .reduce((sum, c) => sum + calculateWeightedImpact(c), 0).toFixed(1)}
                    </div>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontWeight:'bold',color:'#495057',fontSize:'12px'}}>Net Wellness Score</div>
                    <div style={{
                      fontSize:'1.4em',
                      fontWeight:'bold',
                      color: getImpactTextColor(calculateOverallWellness(en))
                    }}>
                      {calculateOverallWellness(en) > 0 ? '+' : ''}{calculateOverallWellness(en).toFixed(1)}
                    </div>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontWeight:'bold',color:'#495057',fontSize:'12px'}}>Recommendation</div>
                    <div style={{
                      fontSize:'1.1em',
                      fontWeight:'bold',
                      color: getImpactTextColor(calculateOverallWellness(en))
                    }}>
                      {calculateOverallWellness(en) > 25 ? 'Excellent for Wellness' :
                       calculateOverallWellness(en) > 10 ? 'Good for Wellness' :
                       calculateOverallWellness(en) > -10 ? 'Mixed Impact' :
                       calculateOverallWellness(en) > -25 ? 'Concerning for Wellness' : 'Harmful to Wellness'}
                    </div>
                  </div>
                </div>

                <div style={{
                  padding:12,
                  background:'#e9ecef',
                  borderRadius:6,
                  fontSize:'14px',
                  lineHeight:'1.4'
                }}>
                  <strong>Interpretation:</strong> Higher confidence levels increase the weight of your impact ratings. 
                  Focus on areas with high negative impact to identify potential concerns, and leverage areas with high positive impact.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
