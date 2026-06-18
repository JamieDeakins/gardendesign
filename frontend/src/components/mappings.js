export const geologyOptions = [
  { label: "Acid rock (sandstone, granite)", R_min: 2, R_max: 4 },
  { label: "Neutral rock (mudstone, siltstone)", R_min: 5, R_max: 6 },
  { label: "Limestone (calcite)", R_min: 6, R_max: 8 },
  { label: "Dolomitic limestone", R_min: 7, R_max: 9 },
  { label: "Clay without limestone", R_min: 5, R_max: 7 },
]

export const drainageOptions = [
  { label: "Free draining (never waterlogged)", F_min: 2, F_max: 4 },
  { label: "Moderate (briefly wet after rain)", F_min: 3, F_max: 5 },
  { label: "Poor (waterlogged winter, dry summer)", F_min: 4, F_max: 6 },
  { label: "Permanently wet", F_min: 7, F_max: 9 },
]

export const lightOptions = [
  { label: "Open / full sun", L_min: 7, L_max: 9 },
  { label: "Light dappled shade", L_min: 6, L_max: 7 },
  { label: "Moderate shade", L_min: 4, L_max: 6 },
  { label: "Deep shade", L_min: 1, L_max: 3 },
]

export const fertilityOptions = [
  { label: "Very low (undisturbed, no inputs)", N_min: 1, N_max: 3 },
  { label: "Low (grazed or mown, no feeding)", N_min: 2, N_max: 4 },
  { label: "Medium (garden soil, some feeding)", N_min: 4, N_max: 6 },
  { label: "High (enriched, fertilised)", N_min: 6, N_max: 8 },
]

export const textureOptions = [
  { label: "Sandy / light"},
  { label: "Loamy"},
  { label: "Clay"},
]

export const nativityOptions = [
  { label: "Native species only", values: ["N"] },
  { label: "Native and archaeophytes", values: ["N", "Arch-denizen", "Arch-colonist", "Arch-cultd"] },
  { label: "All species", values: null },
]