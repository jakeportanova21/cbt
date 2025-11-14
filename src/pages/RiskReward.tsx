import { useState, useEffect } from 'react'

type Entry = {
  id: number
  behavior: string
  risk1: string
  risk2: string
  risk3: string
  reward1: string
  reward2: string
  reward3: string
  riskWeight: number
  rewardWeight: number
}

const STORAGE_KEY = 'riskreward.entries'

export default function RiskReward(){
  const [behavior, setBehavior] = useState('')
  const [risk1, setRisk1] = useState('')
  const [risk2, setRisk2] = useState('')
  const [risk3, setRisk3] = useState('')
  const [reward1, setReward1] = useState('')
  const [reward2, setReward2] = useState('')
  const [reward3, setReward3] = useState('')
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

  function addEntry() {
    if (!behavior.trim()) return
    const e: Entry = {
      id: Date.now(),
      behavior: behavior.trim(),
      risk1: risk1.trim(),
      risk2: risk2.trim(),
      risk3: risk3.trim(),
      reward1: reward1.trim(),
      reward2: reward2.trim(),
      reward3: reward3.trim(),
      riskWeight: riskWeight,
      rewardWeight: rewardWeight
    }
    setEntries(prev => [e, ...prev])
    // reset form
    setBehavior('')
    setRisk1('')
    setRisk2('')
    setRisk3('')
    setReward1('')
    setReward2('')
    setReward3('')
    setRiskWeight(1)
    setRewardWeight(1)
  }

  function removeEntry(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function calculateScore(entry: Entry) {
    const risks = [entry.risk1, entry.risk2, entry.risk3].filter(r => r.trim())
    const rewards = [entry.reward1, entry.reward2, entry.reward3].filter(r => r.trim())
    const riskScore = risks.length * entry.riskWeight
    const rewardScore = rewards.length * entry.rewardWeight
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
              required
            />
          </label>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <fieldset style={{border:'1px solid #eee',padding:8,borderRadius:6}}>
              <legend>Risks</legend>
              <div style={{display:'grid',gap:8}}>
                <input
                  type="text"
                  value={risk1}
                  onChange={e => setRisk1(e.target.value)}
                  placeholder="Risk 1"
                />
                <input
                  type="text"
                  value={risk2}
                  onChange={e => setRisk2(e.target.value)}
                  placeholder="Risk 2"
                />
                <input
                  type="text"
                  value={risk3}
                  onChange={e => setRisk3(e.target.value)}
                  placeholder="Risk 3"
                />
              </div>
            </fieldset>

            <fieldset style={{border:'1px solid #eee',padding:8,borderRadius:6}}>
              <legend>Rewards</legend>
              <div style={{display:'grid',gap:8}}>
                <input
                  type="text"
                  value={reward1}
                  onChange={e => setReward1(e.target.value)}
                  placeholder="Reward 1"
                />
                <input
                  type="text"
                  value={reward2}
                  onChange={e => setReward2(e.target.value)}
                  placeholder="Reward 2"
                />
                <input
                  type="text"
                  value={reward3}
                  onChange={e => setReward3(e.target.value)}
                  placeholder="Reward 3"
                />
              </div>
            </fieldset>
          </div>

          <div style={{display:'flex',gap:16,alignItems:'center'}}>
            <label style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              Risk Weight (1-10)
              <input
                type="range"
                min={1}
                max={10}
                value={riskWeight}
                onChange={e => setRiskWeight(Number(e.target.value))}
                style={{width:100}}
              />
              <div>{riskWeight}</div>
            </label>

            <label style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              Reward Weight (1-10)
              <input
                type="range"
                min={1}
                max={10}
                value={rewardWeight}
                onChange={e => setRewardWeight(Number(e.target.value))}
                style={{width:100}}
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
                  <ul style={{margin:0,paddingLeft:20}}>
                    {en.risk1 && <li>{en.risk1}</li>}
                    {en.risk2 && <li>{en.risk2}</li>}
                    {en.risk3 && <li>{en.risk3}</li>}
                  </ul>
                </div>

                <div>
                  <h4>Rewards (Weight: {en.rewardWeight})</h4>
                  <ul style={{margin:0,paddingLeft:20}}>
                    {en.reward1 && <li>{en.reward1}</li>}
                    {en.reward2 && <li>{en.reward2}</li>}
                    {en.reward3 && <li>{en.reward3}</li>}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
