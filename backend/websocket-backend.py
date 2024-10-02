from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS policy for local development
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",  # NextJS default port
    # You can add other origins here, like production URLs
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated match data
match_data = {
    "homeTeam": "Team A",
    "awayTeam": "Team B",
    "homeScore": 0,
    "awayScore": 0,
    "time": "00:00",
    "lastEvent": ""
}

# List of possible events
events = [
    "Goal for {}!",
    "Yellow card for {} player.",
    "Corner kick for {}.",
    "Free kick awarded to {}.",
    "Offside called on {} player.",
]

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        disconnected = set()
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except WebSocketDisconnect:
                disconnected.add(connection)
            except Exception as e:
                logger.error(f"Error sending message: {e}")
                disconnected.add(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

async def update_match():
    global match_data
    minutes = 0
    seconds = 0

    while minutes < 90:
        await asyncio.sleep(1)  # Update every second
        seconds += 1
        if seconds == 60:
            minutes += 1
            seconds = 0

        match_data["time"] = f"{minutes:02d}:{seconds:02d}"

        # Simulate random events
        if random.random() < 0.3:  # 30% chance of an event occurring
            team = random.choice([match_data["homeTeam"], match_data["awayTeam"]])
            event = random.choice(events).format(team)
            match_data["lastEvent"] = event

            if "Goal" in event:
                if team == match_data["homeTeam"]:
                    match_data["homeScore"] += 1
                else:
                    match_data["awayScore"] += 1

        # Broadcast updates to all connected clients
        if manager.active_connections:
            message = json.dumps(match_data)
            await manager.broadcast(message)

@app.websocket("/v1/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive and wait for any client messages
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_match())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)