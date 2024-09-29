from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import asyncio
import json
import random

app = FastAPI()

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
        if random.random() < 0.3:  # 10% chance of an event occurring
            team = random.choice(
                [match_data["homeTeam"], match_data["awayTeam"]])
            event = random.choice(events).format(team)
            match_data["lastEvent"] = event

            if "Goal" in event:
                if team == match_data["homeTeam"]:
                    match_data["homeScore"] += 1
                else:
                    match_data["awayScore"] += 1


async def event_generator():
    while True:
        # Convert match_data to JSON and yield it
        yield f"data: {json.dumps(match_data)}\n\n"
        await asyncio.sleep(1)  # Send an update every second


@app.get("/api/v1/live-updates")
async def live_updates(request: Request):
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(update_match())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
