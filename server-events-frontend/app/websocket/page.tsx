"use client";
import MatchCard from "../_components/match-card";
import { useState, useEffect } from "react";

interface MatchData {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  time: string;
  lastEvent: string;
}

export default function Websocket() {
  const [matchData, setMatchData] = useState<MatchData>({
    homeTeam: "Team A",
    awayTeam: "Team B",
    homeScore: 0,
    awayScore: 0,
    time: "00:00",
    lastEvent: "Match starting...",
  });
  const [wsStatus, setWsStatus] = useState<
    "connected" | "disconnected" | "error"
  >("disconnected");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8001/v1/ws");

    ws.onopen = () => {
      setWsStatus("connected");
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const data: MatchData = JSON.parse(event.data);
        console.log("Received update:", data);
        setMatchData(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsStatus("error");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setWsStatus("disconnected");
    };

    // Cleanup function to close WebSocket connection when component unmounts
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-10">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Live Match</h1>
        <p className="mt-2">
          WebSocket Status:{" "}
          <span
            className={`font-semibold ${
              wsStatus === "connected"
                ? "text-green-500"
                : wsStatus === "error"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {wsStatus}
          </span>
        </p>
      </div>
      <div>
        <MatchCard match_data={matchData} />
      </div>
    </div>
  );
}
