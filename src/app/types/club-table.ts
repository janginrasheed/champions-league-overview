export interface ClubTable {
  clubId: number;
  clubLogo?: string;
  clubName?: string;
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  points?: number;
}
