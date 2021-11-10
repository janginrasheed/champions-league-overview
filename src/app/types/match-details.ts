export interface MatchDetails {
  homeClub: {
    name: string;
    id: number;
    goals: string;
    logo: string;
  };
  awayClub: {
    name: string;
    id: number;
    goals: string;
    logo: string;
  };
  round: number;
  date: Date;
  group: string;
}
