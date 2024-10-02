"use client";

import { useState, useEffect } from "react";
import MatchCard from "../_components/match-card";

interface MatchData {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  time: string;
  lastEvent: string;
}

const DEFAULT_MATCH_DATA: MatchData = {
  homeTeam: "Team A",
  awayTeam: "Team B",
  homeScore: 0,
  awayScore: 0,
  time: "00:00",
  lastEvent: "",
};

export default function SSEStreaming() {
  const [matchData, setMatchData] = useState<MatchData>(DEFAULT_MATCH_DATA);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8000/api/v1/live-updates"
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMatchData(data);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
        setError("Error receiving match updates");
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setError("Connection to match updates lost");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-10">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Live Match Updates</h1>
        <p className="mt-4">
          Watch the match progress with real-time updates via SSE streaming
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div>
        <MatchCard match_data={matchData} />
      </div>
    </div>
  );
}
