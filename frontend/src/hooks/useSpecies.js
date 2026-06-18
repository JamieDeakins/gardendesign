import { useState } from "react"
import { geologyOptions, drainageOptions, lightOptions, fertilityOptions, nativityOptions } from "../components/mappings"

export function useSpecies() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  async function findPlants({ geology, drainage, light, fertility, nativity }) {
    setLoading(true)

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
    setLoading(false)
  }

  return { results, loading, findPlants }
}