import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Flag } from "lucide-react";

interface MatchData {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  time: string;
  lastEvent: string;
}

export default function MatchCard({ match_data }: { match_data: MatchData }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Football Match</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-between items-center mb-4">
          <div className="text-2xl font-bold gap-5 flex">
            <span>{match_data.homeTeam}</span>
            <span>{match_data.awayTeam}</span>
          </div>

          <div className="text-3xl font-bold">
            {match_data.homeScore} - {match_data.awayScore}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-center items-center space-x-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{match_data.time}</span>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center space-x-2">
          <Flag className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">Last Event:</span>
          <span>{match_data.lastEvent || "No events yet"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
