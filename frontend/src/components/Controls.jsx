import { geologyOptions, drainageOptions, lightOptions, fertilityOptions, nativityOptions, textureOptions } from "./mappings"
import { useState } from "react"

export function Controls({ findPlants }) {
  const [geology, setGeology] = useState(0)
  const [drainage, setDrainage] = useState(0)
  const [light, setLight] = useState(0)
  const [fertility, setFertility] = useState(0)
  const [nativity, setNativity] = useState(0)
  const [texture, setTexture] = useState(0)

  function findPlantButtonClick() {
    findPlants({ geology, drainage, light, fertility, nativity, texture })
  }

  return (
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
      <button onClick={findPlantButtonClick}>Find Plants</button>
    </div>
  )
}