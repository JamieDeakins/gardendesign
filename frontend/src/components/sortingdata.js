export function groupByGrowthForm(results) {
  const groups = {}
  for (const s of results) {
    const key = s.growth_form || "Other"
    if (!groups[key]) groups[key] = []
    groups[key].push(s)
  }
  return groups
}

export const GROWTH_FORM_GROUPS = [
  { key: "Tree",      label: "Trees",               icon: "ti-tree" },
  { key: "Shrub",     label: "Shrubs",              icon: "ti-plant" },
  { key: "Graminoid", label: "Grasses & sedges",    icon: "ti-wave-sine" },
  { key: "Herb",      label: "Herbs & wildflowers", icon: "ti-flower" },
  { key: "Fern",      label: "Ferns",               icon: "ti-seeding" },
  { key: "Aquatic",   label: "Aquatics",            icon: "ti-ripple" },
]

export function formatHeight(mean, max) {
  if (!mean && !max) return null
  const val = max || mean
  if (val < 1) return `${Math.round(val * 100)} cm`
  return `${val.toFixed(1)} m`
}