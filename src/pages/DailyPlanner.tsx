import { useState, useEffect } from 'react'

type TodoItem = {
  id: number
  text: string
  completed: boolean
}

type ProCon = {
  id: number
  text: string
  type: 'pro' | 'con'
}

type TicToc = {
  id: number
  text: string
  type: 'tic' | 'toc'
}

type ActivityDetails = {
  id: string
  proscons: ProCon[]
  tictocs: TicToc[]
  pleasurePrediction: number
  difficultyPrediction: number
  actualPleasure: number
  actualDifficulty: number
  todos: TodoItem[]
  notes: string
}

type ScheduleBlock = {
  hour: number
  activity: string
  details?: ActivityDetails
}

const STORAGE_KEY = 'dailyplanner.schedule'

const HOUR_LABELS = [
  '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
]

export default function DailyPlanner() {
  const [schedule, setSchedule] = useState<ScheduleBlock[]>(
    Array.from({ length: 24 }, (_, i) => ({ 
      hour: i, 
      activity: '' 
    }))
  )
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'proscons' | 'tictocs' | 'pleasure' | 'todos' | 'notes'>('proscons')

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ScheduleBlock[]
        setSchedule(parsed)
      }
    } catch (error) {
      console.error('Failed to load schedule:', error)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule))
    } catch (error) {
      console.error('Failed to save schedule:', error)
    }
  }, [schedule])

  function updateActivity(hour: number, activity: string) {
    setSchedule(prev => prev.map(block =>
      block.hour === hour ? { ...block, activity } : block
    ))
  }

  function getOrCreateDetails(hour: number): ActivityDetails {
    const block = schedule.find(b => b.hour === hour)
    if (block?.details) return block.details
    
    return {
      id: `hour-${hour}`,
      proscons: [],
      tictocs: [],
      pleasurePrediction: 5,
      difficultyPrediction: 5,
      actualPleasure: 5,
      actualDifficulty: 5,
      todos: [],
      notes: ''
    }
  }

  function updateDetails(hour: number, details: Partial<ActivityDetails>) {
    setSchedule(prev => prev.map(block =>
      block.hour === hour 
        ? { 
            ...block, 
            details: { 
              ...getOrCreateDetails(hour), 
              ...details 
            } 
          }
        : block
    ))
  }

  function addProCon(hour: number, type: 'pro' | 'con') {
    const currentDetails = getOrCreateDetails(hour)
    const newProCon: ProCon = {
      id: Date.now(),
      text: '',
      type
    }
    updateDetails(hour, {
      proscons: [...currentDetails.proscons, newProCon]
    })
  }

  function updateProCon(hour: number, id: number, text: string) {
    const currentDetails = getOrCreateDetails(hour)
    updateDetails(hour, {
      proscons: currentDetails.proscons.map(pc =>
        pc.id === id ? { ...pc, text } : pc
      )
    })
  }

  function removeProCon(hour: number, id: number) {
    const currentDetails = getOrCreateDetails(hour)
    updateDetails(hour, {
      proscons: currentDetails.proscons.filter(pc => pc.id !== id)
    })
  }

  function addTicToc(hour: number, type: 'tic' | 'toc') {
    const currentDetails = getOrCreateDetails(hour)
    const newTicToc: TicToc = {
      id: Date.now(),
      text: '',
      type
    }
    updateDetails(hour, {
      tictocs: [...currentDetails.tictocs, newTicToc]
    })
  }

  function updateTicToc(hour: number, id: number, text: string) {
    const currentDetails = getOrCreateDetails(hour)
    updateDetails(hour, {
      tictocs: currentDetails.tictocs.map(tt =>
        tt.id === id ? { ...tt, text } : tt
      )
    })
  }

  function removeTicToc(hour: number, id: number) {
    const currentDetails = getOrCreateDetails(hour)
    updateDetails(hour, {
      tictocs: currentDetails.tictocs.filter(tt => tt.id !== id)
    })
  }

  function addTodo(hour: number) {
    const currentDetails = getOrCreateDetails(hour)
    const newTodo: TodoItem = {
      id: Date.now(),
      text: '',
      completed: false
    }
    updateDetails(hour, {
      todos: [...currentDetails.todos, newTodo]
    })
  }

  function updateTodo(hour: number, id: number, updates: Partial<TodoItem>) {
    const currentDetails = getOrCreateDetails(hour)
    updateDetails(hour, {
      todos: currentDetails.todos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    })
  }

  function removeTodo(hour: number, id: number) {
    const currentDetails = getOrCreateDetails(hour)
    updateDetails(hour, {
      todos: currentDetails.todos.filter(todo => todo.id !== id)
    })
  }

  const selectedBlock = selectedHour !== null ? schedule.find(b => b.hour === selectedHour) : null
  const selectedDetails = selectedHour !== null ? getOrCreateDetails(selectedHour) : null

  return (
    <div>
      <h2>24-Hour Daily Planner</h2>
      <p>Plan your day with detailed analysis tools for each hour block.</p>

      <div style={{ display: 'grid', gridTemplateColumns: selectedHour !== null ? '1fr 1fr' : '1fr', gap: 24 }}>
        {/* Schedule Grid */}
        <div className="card">
          <h3>Daily Schedule</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {schedule.map((block, index) => (
              <div key={block.hour} style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: 12,
                alignItems: 'center',
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 6,
                background: selectedHour === block.hour ? '#e3f2fd' : index % 2 === 0 ? '#fafafa' : '#fff',
                cursor: 'pointer'
              }} onClick={() => setSelectedHour(selectedHour === block.hour ? null : block.hour)}>
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {HOUR_LABELS[block.hour]}
                </div>
                
                <input
                  type="text"
                  value={block.activity}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateActivity(block.hour, e.target.value)
                  }}
                  placeholder="Enter activity..."
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />

                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {block.details?.proscons.length ? (
                    <span title="Has pros/cons analysis">📊</span>
                  ) : null}
                  {block.details?.tictocs.length ? (
                    <span title="Has tic-toc analysis">⚖️</span>
                  ) : null}
                  {block.details?.todos.length ? (
                    <span title="Has todo items">✅</span>
                  ) : null}
                  {block.details?.notes ? (
                    <span title="Has notes">📝</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Analysis Panel */}
        {selectedHour !== null && selectedBlock && selectedDetails && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>{HOUR_LABELS[selectedHour]} - {selectedBlock.activity || 'No Activity'}</h3>
              <button onClick={() => setSelectedHour(null)}>✕</button>
            </div>

            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 16,
              borderBottom: '1px solid #ddd',
              paddingBottom: 8
            }}>
              {[
                { id: 'proscons', label: 'Pros/Cons', icon: '📊' },
                { id: 'tictocs', label: 'Tic-Toc', icon: '⚖️' },
                { id: 'pleasure', label: 'Predictions', icon: '🎯' },
                { id: 'todos', label: 'Todo List', icon: '✅' },
                { id: 'notes', label: 'Notes', icon: '📝' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: 4,
                    background: activeTab === tab.id ? '#2196f3' : '#f5f5f5',
                    color: activeTab === tab.id ? 'white' : '#666',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'proscons' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <h4 style={{ margin: 0, color: '#2e7d32' }}>Pros</h4>
                      <button onClick={() => addProCon(selectedHour, 'pro')}>+ Add Pro</button>
                    </div>
                    {selectedDetails.proscons.filter(pc => pc.type === 'pro').map(pro => (
                      <div key={pro.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          value={pro.text}
                          onChange={(e) => updateProCon(selectedHour, pro.id, e.target.value)}
                          placeholder="Enter pro..."
                          style={{ flex: 1 }}
                        />
                        <button onClick={() => removeProCon(selectedHour, pro.id)}>✕</button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <h4 style={{ margin: 0, color: '#c62828' }}>Cons</h4>
                      <button onClick={() => addProCon(selectedHour, 'con')}>+ Add Con</button>
                    </div>
                    {selectedDetails.proscons.filter(pc => pc.type === 'con').map(con => (
                      <div key={con.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          value={con.text}
                          onChange={(e) => updateProCon(selectedHour, con.id, e.target.value)}
                          placeholder="Enter con..."
                          style={{ flex: 1 }}
                        />
                        <button onClick={() => removeProCon(selectedHour, con.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tictocs' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <h4 style={{ margin: 0, color: '#2e7d32' }}>Task-Interfering Cognitions (TICs)</h4>
                      <button onClick={() => addTicToc(selectedHour, 'tic')}>+ Add TIC</button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                      Thoughts that make the task seem harder
                    </p>
                    {selectedDetails.tictocs.filter(tt => tt.type === 'tic').map(tic => (
                      <div key={tic.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          value={tic.text}
                          onChange={(e) => updateTicToc(selectedHour, tic.id, e.target.value)}
                          placeholder="Enter task-interfering thought..."
                          style={{ flex: 1 }}
                        />
                        <button onClick={() => removeTicToc(selectedHour, tic.id)}>✕</button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <h4 style={{ margin: 0, color: '#1976d2' }}>Task-Orienting Cognitions (TOCs)</h4>
                      <button onClick={() => addTicToc(selectedHour, 'toc')}>+ Add TOC</button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                      Thoughts that make the task seem easier
                    </p>
                    {selectedDetails.tictocs.filter(tt => tt.type === 'toc').map(toc => (
                      <div key={toc.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          value={toc.text}
                          onChange={(e) => updateTicToc(selectedHour, toc.id, e.target.value)}
                          placeholder="Enter task-orienting thought..."
                          style={{ flex: 1 }}
                        />
                        <button onClick={() => removeTicToc(selectedHour, toc.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pleasure' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <h4>Predictions</h4>
                    <div style={{ marginBottom: 16 }}>
                      <label>
                        Predicted Pleasure (1-10)
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={selectedDetails.pleasurePrediction}
                            onChange={(e) => updateDetails(selectedHour, {
                              pleasurePrediction: Number(e.target.value)
                            })}
                            style={{ flex: 1 }}
                          />
                          <span>{selectedDetails.pleasurePrediction}</span>
                        </div>
                      </label>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label>
                        Predicted Difficulty (1-10)
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={selectedDetails.difficultyPrediction}
                            onChange={(e) => updateDetails(selectedHour, {
                              difficultyPrediction: Number(e.target.value)
                            })}
                            style={{ flex: 1 }}
                          />
                          <span>{selectedDetails.difficultyPrediction}</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4>Actual Experience</h4>
                    <div style={{ marginBottom: 16 }}>
                      <label>
                        Actual Pleasure (1-10)
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={selectedDetails.actualPleasure}
                            onChange={(e) => updateDetails(selectedHour, {
                              actualPleasure: Number(e.target.value)
                            })}
                            style={{ flex: 1 }}
                          />
                          <span>{selectedDetails.actualPleasure}</span>
                        </div>
                      </label>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label>
                        Actual Difficulty (1-10)
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={selectedDetails.actualDifficulty}
                            onChange={(e) => updateDetails(selectedHour, {
                              actualDifficulty: Number(e.target.value)
                            })}
                            style={{ flex: 1 }}
                          />
                          <span>{selectedDetails.actualDifficulty}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Prediction vs Reality Analysis */}
                <div style={{
                  marginTop: 16,
                  padding: 12,
                  background: '#f8f9fa',
                  borderRadius: 6,
                  border: '1px solid #dee2e6'
                }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>Analysis</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '14px' }}>
                    <div>
                      <strong>Pleasure Accuracy:</strong><br />
                      Predicted: {selectedDetails.pleasurePrediction} | Actual: {selectedDetails.actualPleasure}<br />
                      Difference: {selectedDetails.actualPleasure - selectedDetails.pleasurePrediction > 0 ? '+' : ''}{selectedDetails.actualPleasure - selectedDetails.pleasurePrediction}
                    </div>
                    <div>
                      <strong>Difficulty Accuracy:</strong><br />
                      Predicted: {selectedDetails.difficultyPrediction} | Actual: {selectedDetails.actualDifficulty}<br />
                      Difference: {selectedDetails.actualDifficulty - selectedDetails.difficultyPrediction > 0 ? '+' : ''}{selectedDetails.actualDifficulty - selectedDetails.difficultyPrediction}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'todos' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ margin: 0 }}>Todo List</h4>
                  <button onClick={() => addTodo(selectedHour)}>+ Add Todo</button>
                </div>

                {selectedDetails.todos.length === 0 ? (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No todos for this time block</p>
                ) : (
                  <div>
                    {selectedDetails.todos.map(todo => (
                      <div key={todo.id} style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                        marginBottom: 8,
                        padding: 8,
                        background: todo.completed ? '#e8f5e8' : '#fafafa',
                        borderRadius: 4,
                        border: '1px solid #ddd'
                      }}>
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={(e) => updateTodo(selectedHour, todo.id, {
                            completed: e.target.checked
                          })}
                        />
                        <input
                          type="text"
                          value={todo.text}
                          onChange={(e) => updateTodo(selectedHour, todo.id, {
                            text: e.target.value
                          })}
                          placeholder="Enter todo item..."
                          style={{
                            flex: 1,
                            border: 'none',
                            background: 'transparent',
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            outline: 'none'
                          }}
                        />
                        <button onClick={() => removeTodo(selectedHour, todo.id)}>✕</button>
                      </div>
                    ))}

                    <div style={{
                      marginTop: 12,
                      padding: 8,
                      background: '#e3f2fd',
                      borderRadius: 4,
                      fontSize: '14px'
                    }}>
                      Progress: {selectedDetails.todos.filter(t => t.completed).length} / {selectedDetails.todos.length} completed
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <h4>Notes & Reflections</h4>
                <textarea
                  value={selectedDetails.notes}
                  onChange={(e) => updateDetails(selectedHour, { notes: e.target.value })}
                  placeholder="Add notes, reflections, or insights about this time block..."
                  style={{
                    width: '100%',
                    minHeight: 150,
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
