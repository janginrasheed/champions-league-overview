export interface Match {
  matchId: number;
  homeClubId: number;
  awayClubId: number;
  homeClubGoals?: string;
  awayClubGoals?: string;
  penaltyShootoutHome?: string;
  penaltyShootoutAway?: string;
  roundId: number;
  seasonId: number;
  date?: Date;
}
