import { Controls } from "./components/Controls"
import { SpeciesPanel } from "./components/SpeciesPanel"
import { useSpecies } from "./hooks/useSpecies"

function App() {
  const { results, loading, findPlants } = useSpecies()

  return (
    <div className="app">
      <h1>Garden Plant Recommender</h1>
      <Controls findPlants={findPlants} />
      <SpeciesPanel results={results} loading={loading} />
    </div>
  )
}

export default App