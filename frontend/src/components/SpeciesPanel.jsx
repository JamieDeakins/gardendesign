import { useState } from "react"
import { GROWTH_FORM_GROUPS, groupByGrowthForm, formatHeight } from "./sortingdata"

function SpeciesCard({ species }) {
  return (
    <div className="card">
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

function GrowthFormGroup({ label, species }) {
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

export function SpeciesPanel({ results, loading }) {
  if (loading) return <p>Loading...</p>
  if (results.length === 0) return <p>Use the dropdowns to search for plants</p>

  const grouped = groupByGrowthForm(results)
  const totalCount = results.length

  return (
    <div className="results-column">
      <div className="panel">
        <div className="panel-header">
          <span>Matched species</span>
          <span>{totalCount} species</span>
        </div>
        <div className="panel-body">
          {GROWTH_FORM_GROUPS.map(({ key, label }) => {
            const species = grouped[key]
            if (!species || species.length === 0) return null
            return (
              <GrowthFormGroup
                key={key}
                label={label}
                species={species}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}