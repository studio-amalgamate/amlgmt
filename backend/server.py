from fastapi import FastAPI
import os

app = FastAPI()

# Debug environment variables
PORT = os.environ.get("PORT", "not set")
print(f"Starting FastAPI app on PORT={PORT}")

# Health check route
@app.get("/")
def root():
    return {"status": "ok", "port": PORT}

# Test API route
@app.get("/api/hello")
def hello():
    return {"message": "Hello, world!"}

# Optional: catch-all for unrecognized paths
@app.get("/{path:path}")
def catch_all(path: str):
    return {"error": "Endpoint not found", "path": path}
    
