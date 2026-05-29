from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd




species_df = None
communities_df = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global species_df, communities_df
    
    species_df = pd.read_csv("data/nvc_species_ellenberg.csv")
    communities_df = pd.read_csv("data/nvc_community_profiles.csv")
    
    print(f"Loaded {len(species_df)} species rows")
    print(f"Loaded {len(communities_df)} communities")
    
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Garden Design API is running"}

@app.get("/communities")
def get_communities():
    return communities_df.fillna("").to_dict(orient="records")

@app.get("/recommend")
def recommend_species(
    R_min: float, R_max: float,
    F_min: float, F_max: float,
    L_min: float, L_max: float,
    N_min: float, N_max: float,
    nativity: str = "N"
):
    df = species_df.copy()

    df = df[
        df["ellenberg_R"].between(R_min, R_max) &
        df["ellenberg_F"].between(F_min, F_max) &
        df["ellenberg_L"].between(L_min, L_max) &
        df["ellenberg_N"].between(N_min, N_max)
    ]

    # Apply nativity filter unless "all" is passed
    if nativity != "all":
        nativity_list = nativity.split(",")
        df = df[df["StaceIV_nativity"].isin(nativity_list)]

    constancy_order = {"V": 5, "IV": 4, "III": 3, "II": 2, "I": 1}
    df["constancy_num"] = df["constancy"].map(constancy_order)
    df = df.sort_values("constancy_num", ascending=False)
    df = df.drop_duplicates(subset="resolved_name", keep="first")

    cols = [
        "resolved_name", "community_level",
        "constancy", "growth_form", "life_form",
        "mean_veg_height", "max_veg_height",
        "ellenberg_R", "ellenberg_F", "ellenberg_L", "ellenberg_N",
        "predicted_CSR", "StaceIV_nativity"
    ]

    return df[cols].fillna("").to_dict(orient="records")

@app.get("/recommend/summary")
def recommend_summary(R: float, F: float, L: float, N: float):
    
    df = species_df.copy()
    
    df["score_R"] = abs(df["ellenberg_R"] - R)
    df["score_F"] = abs(df["ellenberg_F"] - F)
    df["score_L"] = abs(df["ellenberg_L"] - L)
    df["score_N"] = abs(df["ellenberg_N"] - N)
    df["total_score"] = df["score_R"] + df["score_F"] + df["score_L"] + df["score_N"]
    
    df = df[df["StaceIV_nativity"] == "N"]
    df = df.sort_values("total_score")
    df = df.drop_duplicates(subset="resolved_name", keep="first")
    
    results = df.head(50)
    
    return [
        {
            "name": str(row["resolved_name"]) if pd.notna(row["resolved_name"]) else "",
            "growth_form": str(row["growth_form"]) if pd.notna(row["growth_form"]) else "",
            "score": row["total_score"],
            "constancy": str(row["constancy"]) if pd.notna(row["constancy"]) else ""
        }
        for _, row in results.iterrows()
    ]