from fastapi import FastAPI
from routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="KAVACHIN Backend")
app.include_router(router)

# Allow React (usually port 5173 or 3000) to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, "*" is fine
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "KAVACHIN backend running"}