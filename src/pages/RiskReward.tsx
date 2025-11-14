import { useState, useEffect } from 'react'

type Entry = {
  id: number
  behavior: string
  risks: string[]
  rewards: string[]
  riskWeight: number
  rewardWeight: number
}

const STORAGE_KEY = 'riskreward.entries'

export default function RiskReward(){
  const [behavior, setBehavior] = useState('')
  const [risk, setRisk] = useState('')
  const [reward, setReward] = useState('')
  const [riskWeight, setRiskWeight] = useState(1)
  const [rewardWeight, setRewardWeight] = useState(1)

  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) as Entry[] : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) } catch {}
  }, [entries])

  function addRisk(entryId: number) {
    if (!risk.trim()) return
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, risks: [...e.risks, risk.trim()] }
        : e
    ))
    setRisk('')
  }

  function addReward(entryId: number) {
    if (!reward.trim()) return
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, rewards: [...e.rewards, reward.trim()] }
        : e
    ))
    setReward('')
  }

  function removeRisk(entryId: number, riskIndex: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, risks: e.risks.filter((_, i) => i !== riskIndex) }
        : e
    ))
  }

  function removeReward(entryId: number, rewardIndex: number) {
    setEntries(prev => prev.map(e =>
      e.id === entryId
        ? { ...e, rewards: e.rewards.filter((_, i) => i !== rewardIndex) }
        : e
    ))
  }

  function addEntry() {
    if (!behavior.trim()) return
    const e: Entry = {
      id: Date.now(),
      behavior: behavior.trim(),
      risks: [],
      rewards: [],
      riskWeight: riskWeight,
      rewardWeight: rewardWeight
    }
    setEntries(prev => [e, ...prev])
    setBehavior('')
    setRiskWeight(1)
    setRewardWeight(1)
  }

  function updateWeights(id: number, riskW: number, rewardW: number) {
    setEntries(prev => prev.map(e =>
      e.id === id
        ? { ...e, riskWeight: riskW, rewardWeight: rewardW }
        : e
    ))
  }

  function removeEntry(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function calculateScore(entry: Entry) {
    const riskScore = entry.risks.length * entry.riskWeight
    const rewardScore = entry.rewards.length * entry.rewardWeight
    return rewardScore - riskScore
  }

  return (
    <div>
      <h2>Risk-Reward Calculation</h2>
      <div className="card">
        <form onSubmit={e => { e.preventDefault(); addEntry() }} style={{display:'grid',gap:8}}>
          <label>
            Behavior or Decision to Evaluate
            <input
              type="text"
              value={behavior}
              onChange={e => setBehavior(e.target.value)}
              placeholder="e.g. Eating junk food, avoiding social situations, etc."
            />
          </label>

          <div style={{display:'flex',gap:8,alignItems:'end'}}>
            <label>
              Risk Weight (1-10)
              <input
                type="range"
                min={1}
                max={10}
                value={riskWeight}
                onChange={e => setRiskWeight(Number(e.target.value))}
              />
              <div>{riskWeight}</div>
            </label>

            <label>
              Reward Weight (1-10)
              <input
                type="range"
                min={1}
                max={10}
                value={rewardWeight}
                onChange={e => setRewardWeight(Number(e.target.value))}
              />
              <div>{rewardWeight}</div>
            </label>
          </div>

          <button type="submit">Add Entry</button>
        </form>

        <div style={{marginTop:16}}>
          {entries.map(en => (
            <div key={en.id} className="card" style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                <h3 style={{margin:0}}>{en.behavior}</h3>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <span style={{
                    padding:'4px 8px',
                    borderRadius:4,
                    background: calculateScore(en) > 0 ? '#d4edda' : calculateScore(en) < 0 ? '#f8d7da' : '#fff3cd',
                    color: calculateScore(en) > 0 ? '#155724' : calculateScore(en) < 0 ? '#721c24' : '#856404'
                  }}>
                    Score: {calculateScore(en)}
                  </span>
                  <button onClick={() => removeEntry(en.id)}>Delete</button>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:16}}>
                <div>
                  <h4>Risks (Weight: {en.riskWeight})</h4>
                  <div style={{display:'flex',gap:8,marginBottom:8}}>
                    <input
                      type="text"
                      value={risk}
                      onChange={e => setRisk(e.target.value)}
                      placeholder="Add a risk..."
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addRisk(en.id))}
                    />
                    <button onClick={() => addRisk(en.id)}>Add</button>
                  </div>
                  <ul style={{margin:0,paddingLeft:20}}>
                    {en.risks.map((r, i) => (
                      <li key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span>{r}</span>
                        <button onClick={() => removeRisk(en.id, i)} style={{marginLeft:8}}>×</button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>Rewards (Weight: {en.rewardWeight})</h4>
                  <div style={{display:'flex',gap:8,marginBottom:8}}>
                    <input
                      type="text"
                      value={reward}
                      onChange={e => setReward(e.target.value)}
                      placeholder="Add a reward..."
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addReward(en.id))}
                    />
                    <button onClick={() => addReward(en.id)}>Add</button>
                  </div>
                  <ul style={{margin:0,paddingLeft:20}}>
                    {en.rewards.map((r, i) => (
                      <li key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span>{r}</span>
                        <button onClick={() => removeReward(en.id, i)} style={{marginLeft:8}}>×</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{marginTop:16,padding:8,background:'#f8f9fa',borderRadius:4}}>
                <label style={{display:'flex',gap:8,alignItems:'center'}}>
                  Adjust Weights:
                  <span>Risk: </span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={en.riskWeight}
                    onChange={e => updateWeights(en.id, Number(e.target.value), en.rewardWeight)}
                  />
                  <span>{en.riskWeight}</span>
                  <span>Reward: </span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={en.rewardWeight}
                    onChange={e => updateWeights(en.id, en.riskWeight, Number(e.target.value))}
                  />
                  <span>{en.rewardWeight}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
