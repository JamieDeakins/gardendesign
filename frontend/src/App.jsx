import { useState } from "react"
import { geologyOptions, drainageOptions, lightOptions, fertilityOptions, textureOptions, nativityOptions } from "./mappings"

function groupByGrowthForm(results) {
  const groups = {}
  for (const s of results) {
    const key = s.growth_form || "Other"
    if (!groups[key]) groups[key] = []
    groups[key].push(s)
  }
  return groups
}

const GROWTH_FORM_GROUPS = [
  { key: "Tree",      label: "Trees",               icon: "ti-tree" },
  { key: "Shrub",     label: "Shrubs",              icon: "ti-plant" },
  { key: "Graminoid", label: "Grasses & sedges",    icon: "ti-wave-sine" },
  { key: "Herb",      label: "Herbs & wildflowers", icon: "ti-flower" },
  { key: "Fern",      label: "Ferns",               icon: "ti-seeding" },
  { key: "Aquatic",   label: "Aquatics",            icon: "ti-ripple" },
]

function formatHeight(mean, max) {
  if (!mean && !max) return null
  const val = max || mean
  if (val < 1) return `${Math.round(val * 100)} cm`
  return `${val.toFixed(1)} m`
}

function SpeciesCard({ species }) {
  function handleDragStart(e) {
    e.dataTransfer.setData("application/json", JSON.stringify(species))
  }

  return (
    <div className="card" draggable="true" onDragStart={handleDragStart}>
      <div className="card-name">{species.resolved_name}</div>
      <div className="card-meta">
        {species.constancy && (
          <span className="pill">{species.constancy}</span>
        )}
        {formatHeight(species.mean_veg_height, species.max_veg_height) && (
          <span className="pill">{formatHeight(species.mean_veg_height, species.max_veg_height)}</span>
        )}
        {species.predicted_CSR && (
          <span className="pill">{species.predicted_CSR}</span>
        )}
      </div>
    </div>
  )
}

function GrowthFormGroup({ label, icon, species }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="group">
      <div className="group-header" onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <span>{species.length}</span>
      </div>
      {open && (
        <div className="card-list">
  {species.map((s, i) => (
    <SpeciesCard key={i} species={s} />
  ))}
</div>
      )}
    </div>
  )
}

function Canvas() {
  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
    e.preventDefault()
    const data = e.dataTransfer.getData("application/json")
    const species = JSON.parse(data)
    console.log("dropped:", species)
  }

  return (
    <div className="canvas" onDragOver={handleDragOver} onDrop={handleDrop}>
      <p>Drop plants here</p>
    </div>
  )
}

function App() {
  const [geology, setGeology] = useState(0)
  const [drainage, setDrainage] = useState(0)
  const [light, setLight] = useState(0)
  const [fertility, setFertility] = useState(0)
  const [texture, setTexture] = useState(0)
  const [nativity, setNativity] = useState(0)
  const [results, setResults] = useState([])

  async function findPlants() {
    const geo = geologyOptions[geology]
    const drain = drainageOptions[drainage]
    const lit = lightOptions[light]
    const fert = fertilityOptions[fertility]
    const nat = nativityOptions[nativity]

    const nativityParam = nat.values ? nat.values.join(",") : "all"

    const url = `http://localhost:8000/recommend?R_min=${geo.R_min}&R_max=${geo.R_max}&F_min=${drain.F_min}&F_max=${drain.F_max}&L_min=${lit.L_min}&L_max=${lit.L_max}&N_min=${fert.N_min}&N_max=${fert.N_max}&nativity=${nativityParam}`

    const response = await fetch(url)
    const data = await response.json()
    setResults(data)
  }

  const grouped = groupByGrowthForm(results)
  const totalCount = results.length

  return (
  <div className="app">
    <h1>Garden Plant Recommender</h1>

    <div className="controls">
      <div className="field">
        <label>Native?</label>
        <select onChange={e => setNativity(Number(e.target.value))} value={nativity}>
          {nativityOptions.map((opt, i) => (
            <option key={i} value={i}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Geology / Parent Material</label>
        <select onChange={e => setGeology(Number(e.target.value))} value={geology}>
          {geologyOptions.map((opt, i) => (
            <option key={i} value={i}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Soil Texture</label>
        <select onChange={e => setTexture(Number(e.target.value))} value={texture}>
          {textureOptions.map((opt, i) => (
            <option key={i} value={i}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Drainage</label>
        <select onChange={e => setDrainage(Number(e.target.value))} value={drainage}>
          {drainageOptions.map((opt, i) => (
            <option key={i} value={i}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Light</label>
        <select onChange={e => setLight(Number(e.target.value))} value={light}>
          {lightOptions.map((opt, i) => (
            <option key={i} value={i}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Fertility</label>
        <select onChange={e => setFertility(Number(e.target.value))} value={fertility}>
          {fertilityOptions.map((opt, i) => (
            <option key={i} value={i}>{opt.label}</option>
          ))}
        </select>
      </div>
      <button onClick={findPlants}>Find Plants</button>
    </div>

    <div className="results-column">
      {results.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <span>Matched species</span>
            <span>{totalCount} species</span>
          </div>
          <div className="panel-body">
            {GROWTH_FORM_GROUPS.map(({ key, label, icon }) => {
              const species = grouped[key]
              if (!species || species.length === 0) return null
              return (
                <GrowthFormGroup
                  key={key}
                  label={label}
                  icon={icon}
                  species={species}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
    <Canvas />
  </div>
)
}

export default App