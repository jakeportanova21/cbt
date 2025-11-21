import { useState, useEffect } from 'react'

type RiskRewardItem = {
  id: number
  description: string
  value: number // -100 to +100 impact value
  probability: number // 1-100 percentage chance
}

type Entry = {
  id: number
  item: string
  risks: RiskRewardItem[]
  rewards: RiskRewardItem[]
}

const STORAGE_KEY = 'riskreward2.entries'

export default function RiskReward2() {
  const [item, setItem] = useState('')
  const [riskText, setRiskText] = useState('')
  const [riskValue, setRiskValue] = useState(-10)
  const [riskProbability, setRiskProbability] = useState(50)
  const [rewardText, setRewardText] = useState('')
  const [rewardValue, setRewardValue] = useState(10)
  const [rewardProbability, setRewardProbability] = useState(50)
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
    if (!item.trim()) return
    const e: Entry = {
      id: Date.now(),
      item: item.trim(),
      risks: [],
      rewards: []
    }
    setEntries(prev => [e, ...prev])
    setItem('')
  }

  function addRisk(entryId: number) {
    if (!riskText.trim()) return
    const newRisk: RiskRewardItem = {
      id: Date.now(),
      description: riskText.trim(),
      value: riskValue,
      probability: riskProbability
    }
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, risks: [...e.risks, newRisk] }
        : e
    ))
    setRiskText('')
    setRiskValue(-10)
    setRiskProbability(50)
  }

  function addReward(entryId: number) {
    if (!rewardText.trim()) return
    const newReward: RiskRewardItem = {
      id: Date.now(),
      description: rewardText.trim(),
      value: rewardValue,
      probability: rewardProbability
    }
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, rewards: [...e.rewards, newReward] }
        : e
    ))
    setRewardText('')
    setRewardValue(10)
    setRewardProbability(50)
  }

  function removeRisk(entryId: number, riskId: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, risks: e.risks.filter(r => r.id !== riskId) }
        : e
    ))
  }

  function removeReward(entryId: number, rewardId: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, rewards: e.rewards.filter(r => r.id !== rewardId) }
        : e
    ))
  }

  function updateRiskValue(entryId: number, riskId: number, value: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            risks: e.risks.map(r =>
              r.id === riskId ? { ...r, value } : r
            )
          }
        : e
    ))
  }

  function updateRiskProbability(entryId: number, riskId: number, probability: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            risks: e.risks.map(r =>
              r.id === riskId ? { ...r, probability } : r
            )
          }
        : e
    ))
  }

  function updateRewardValue(entryId: number, rewardId: number, value: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            rewards: e.rewards.map(r =>
              r.id === rewardId ? { ...r, value } : r
            )
          }
        : e
    ))
  }

  function updateRewardProbability(entryId: number, rewardId: number, probability: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? {
            ...e,
            rewards: e.rewards.map(r =>
              r.id === rewardId ? { ...r, probability } : r
            )
          }
        : e
    ))
  }

  function removeEntry(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function calculateExpectedValue(item: RiskRewardItem) {
    return (item.value * item.probability) / 100
  }

  function calculateTotalExpectedValue(entry: Entry) {
    const risksTotal = entry.risks.reduce((sum, risk) => sum + calculateExpectedValue(risk), 0)
    const rewardsTotal = entry.rewards.reduce((sum, reward) => sum + calculateExpectedValue(reward), 0)
    return rewardsTotal + risksTotal // risks already have negative values
  }

  function getValueColor(value: number) {
    if (value > 20) return '#d4edda'
    if (value > 0) return '#d1ecf1'
    if (value === 0) return '#fff3cd'
    if (value > -20) return '#f8d7da'
    return '#f5c6cb'
  }

  function getValueTextColor(value: number) {
    if (value > 20) return '#155724'
    if (value > 0) return '#0c5460'
    if (value === 0) return '#856404'
    if (value > -20) return '#721c24'
    return '#721c24'
  }

  return (
    <div>
      <h2>Risk-Reward Calculator v2</h2>
      <p>Analyze items by calculating expected values: each risk/reward has a value and probability (Expected Value = Value × Probability).</p>
      
      <div className="card">
        <form onSubmit={e => { e.preventDefault(); addEntry() }} style={{display:'grid',gap:8}}>
          <label>
            Item or Decision to Analyze
            <input
              type="text"
              value={item}
              onChange={e => setItem(e.target.value)}
              placeholder="e.g. Starting a new business, buying a car, investing in stocks..."
              required
            />
          </label>
          <button type="submit">Create Analysis</button>
        </form>

        <div style={{marginTop:16}}>
          {entries.map(en => (
            <div key={en.id} className="card" style={{marginBottom:24}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:16}}>
                <h3 style={{margin:0}}>{en.item}</h3>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <span style={{
                    padding:'8px 16px',
                    borderRadius:6,
                    background: getValueColor(calculateTotalExpectedValue(en)),
                    color: getValueTextColor(calculateTotalExpectedValue(en)),
                    fontWeight:'bold',
                    fontSize:'1.1em'
                  }}>
                    Expected Value: {calculateTotalExpectedValue(en).toFixed(1)}
                  </span>
                  <button onClick={() => removeEntry(en.id)}>Delete</button>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
                {/* Risks Column */}
                <div>
                  <h4 style={{color:'#721c24',margin:'0 0 12px 0'}}>Risks (Negative Outcomes)</h4>
                  
                  {/* Add Risk Form */}
                  <div style={{border:'1px solid #f8d7da',padding:12,borderRadius:6,marginBottom:12,background:'#fdf2f2'}}>
                    <input
                      type="text"
                      value={riskText}
                      onChange={e => setRiskText(e.target.value)}
                      placeholder="Describe the risk..."
                      style={{width:'100%',marginBottom:8}}
                    />
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                      <div>
                        <label style={{display:'block',fontSize:'12px',fontWeight:'bold',marginBottom:2}}>
                          Value (-100 to 0)
                        </label>
                        <input
                          type="range"
                          min={-100}
                          max={0}
                          value={riskValue}
                          onChange={e => setRiskValue(Number(e.target.value))}
                          style={{width:'100%'}}
                        />
                        <span style={{fontSize:'12px',fontWeight:'bold',color:'#721c24'}}>{riskValue}</span>
                      </div>
                      <div>
                        <label style={{display:'block',fontSize:'12px',fontWeight:'bold',marginBottom:2}}>
                          Probability (%)
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={100}
                          value={riskProbability}
                          onChange={e => setRiskProbability(Number(e.target.value))}
                          style={{width:'100%'}}
                        />
                        <span style={{fontSize:'12px',fontWeight:'bold'}}>{riskProbability}%</span>
                      </div>
                    </div>
                    <button onClick={() => addRisk(en.id)} style={{width:'100%',background:'#dc3545',color:'white',border:'none',padding:'6px',borderRadius:4}}>
                      Add Risk (Expected: {((riskValue * riskProbability) / 100).toFixed(1)})
                    </button>
                  </div>

                  {/* Risks List */}
                  <div style={{maxHeight:300,overflowY:'auto'}}>
                    {en.risks.map(risk => (
                      <div key={risk.id} style={{
                        border:'1px solid #f8d7da',
                        padding:12,
                        borderRadius:4,
                        marginBottom:8,
                        background:'#fdf2f2'
                      }}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
                          <div style={{flex:1,fontWeight:'bold'}}>{risk.description}</div>
                          <button onClick={() => removeRisk(en.id, risk.id)} style={{marginLeft:8,background:'#dc3545',color:'white',border:'none',padding:'2px 6px',borderRadius:2,fontSize:'12px'}}>
                            ×
                          </button>
                        </div>
                        
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                          <div>
                            <label style={{fontSize:'11px',fontWeight:'bold'}}>Value:</label>
                            <input
                              type="range"
                              min={-100}
                              max={0}
                              value={risk.value}
                              onChange={e => updateRiskValue(en.id, risk.id, Number(e.target.value))}
                              style={{width:'100%'}}
                            />
                            <span style={{fontSize:'11px',fontWeight:'bold',color:'#721c24'}}>{risk.value}</span>
                          </div>
                          <div>
                            <label style={{fontSize:'11px',fontWeight:'bold'}}>Probability:</label>
                            <input
                              type="range"
                              min={1}
                              max={100}
                              value={risk.probability}
                              onChange={e => updateRiskProbability(en.id, risk.id, Number(e.target.value))}
                              style={{width:'100%'}}
                            />
                            <span style={{fontSize:'11px',fontWeight:'bold'}}>{risk.probability}%</span>
                          </div>
                        </div>

                        <div style={{
                          padding:6,
                          background:'#fff',
                          borderRadius:4,
                          textAlign:'center',
                          fontWeight:'bold',
                          color:'#721c24'
                        }}>
                          Expected Value: {calculateExpectedValue(risk).toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {en.risks.length > 0 && (
                    <div style={{marginTop:12,padding:8,background:'#f8d7da',borderRadius:4,textAlign:'center'}}>
                      <strong style={{color:'#721c24'}}>
                        Total Risk Expected: {en.risks.reduce((sum, risk) => sum + calculateExpectedValue(risk), 0).toFixed(1)}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Rewards Column */}
                <div>
                  <h4 style={{color:'#155724',margin:'0 0 12px 0'}}>Rewards (Positive Outcomes)</h4>
                  
                  {/* Add Reward Form */}
                  <div style={{border:'1px solid #d4edda',padding:12,borderRadius:6,marginBottom:12,background:'#f8fff9'}}>
                    <input
                      type="text"
                      value={rewardText}
                      onChange={e => setRewardText(e.target.value)}
                      placeholder="Describe the reward..."
                      style={{width:'100%',marginBottom:8}}
                    />
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                      <div>
                        <label style={{display:'block',fontSize:'12px',fontWeight:'bold',marginBottom:2}}>
                          Value (0 to 100)
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={rewardValue}
                          onChange={e => setRewardValue(Number(e.target.value))}
                          style={{width:'100%'}}
                        />
                        <span style={{fontSize:'12px',fontWeight:'bold',color:'#155724'}}>+{rewardValue}</span>
                      </div>
                      <div>
                        <label style={{display:'block',fontSize:'12px',fontWeight:'bold',marginBottom:2}}>
                          Probability (%)
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={100}
                          value={rewardProbability}
                          onChange={e => setRewardProbability(Number(e.target.value))}
                          style={{width:'100%'}}
                        />
                        <span style={{fontSize:'12px',fontWeight:'bold'}}>{rewardProbability}%</span>
                      </div>
                    </div>
                    <button onClick={() => addReward(en.id)} style={{width:'100%',background:'#28a745',color:'white',border:'none',padding:'6px',borderRadius:4}}>
                      Add Reward (Expected: +{((rewardValue * rewardProbability) / 100).toFixed(1)})
                    </button>
                  </div>

                  {/* Rewards List */}
                  <div style={{maxHeight:300,overflowY:'auto'}}>
                    {en.rewards.map(reward => (
                      <div key={reward.id} style={{
                        border:'1px solid #d4edda',
                        padding:12,
                        borderRadius:4,
                        marginBottom:8,
                        background:'#f8fff9'
                      }}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
                          <div style={{flex:1,fontWeight:'bold'}}>{reward.description}</div>
                          <button onClick={() => removeReward(en.id, reward.id)} style={{marginLeft:8,background:'#dc3545',color:'white',border:'none',padding:'2px 6px',borderRadius:2,fontSize:'12px'}}>
                            ×
                          </button>
                        </div>
                        
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
                          <div>
                            <label style={{fontSize:'11px',fontWeight:'bold'}}>Value:</label>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={reward.value}
                              onChange={e => updateRewardValue(en.id, reward.id, Number(e.target.value))}
                              style={{width:'100%'}}
                            />
                            <span style={{fontSize:'11px',fontWeight:'bold',color:'#155724'}}>+{reward.value}</span>
                          </div>
                          <div>
                            <label style={{fontSize:'11px',fontWeight:'bold'}}>Probability:</label>
                            <input
                              type="range"
                              min={1}
                              max={100}
                              value={reward.probability}
                              onChange={e => updateRewardProbability(en.id, reward.id, Number(e.target.value))}
                              style={{width:'100%'}}
                            />
                            <span style={{fontSize:'11px',fontWeight:'bold'}}>{reward.probability}%</span>
                          </div>
                        </div>

                        <div style={{
                          padding:6,
                          background:'#fff',
                          borderRadius:4,
                          textAlign:'center',
                          fontWeight:'bold',
                          color:'#155724'
                        }}>
                          Expected Value: +{calculateExpectedValue(reward).toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {en.rewards.length > 0 && (
                    <div style={{marginTop:12,padding:8,background:'#d4edda',borderRadius:4,textAlign:'center'}}>
                      <strong style={{color:'#155724'}}>
                        Total Reward Expected: +{en.rewards.reduce((sum, reward) => sum + calculateExpectedValue(reward), 0).toFixed(1)}
                      </strong>
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
                    <div style={{fontWeight:'bold',color:'#495057'}}>Total Risk Expected</div>
                    <div style={{fontSize:'1.2em',fontWeight:'bold',color:'#721c24'}}>
                      {en.risks.reduce((sum, risk) => sum + calculateExpectedValue(risk), 0).toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Total Reward Expected</div>
                    <div style={{fontSize:'1.2em',fontWeight:'bold',color:'#155724'}}>
                      +{en.rewards.reduce((sum, reward) => sum + calculateExpectedValue(reward), 0).toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Net Expected Value</div>
                    <div style={{
                      fontSize:'1.4em',
                      fontWeight:'bold',
                      color: getValueTextColor(calculateTotalExpectedValue(en))
                    }}>
                      {calculateTotalExpectedValue(en) > 0 ? '+' : ''}{calculateTotalExpectedValue(en).toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:'bold',color:'#495057'}}>Recommendation</div>
                    <div style={{
                      fontSize:'1.1em',
                      fontWeight:'bold',
                      color: getValueTextColor(calculateTotalExpectedValue(en))
                    }}>
                      {calculateTotalExpectedValue(en) > 10 ? 'Highly Favorable' : 
                       calculateTotalExpectedValue(en) > 0 ? 'Favorable' :
                       calculateTotalExpectedValue(en) === 0 ? 'Neutral' :
                       calculateTotalExpectedValue(en) > -10 ? 'Unfavorable' : 'Highly Unfavorable'}
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
