export interface Match {
  matchId: number;
  homeClubId: number;
  awayClubId: number;
  homeClubGoals?: string;
  awayClubGoals?: string;
  roundId: number;
  seasonId: number;
  date?: Date;
}
