import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SeasonDetails} from "../types/season-details";
import {Club} from "../types/club";
import {Season} from "../types/season";
import {forkJoin} from "rxjs";
import {Match} from "../types/match";
import {ClubTable} from "../types/club-table";
import {Round} from "../types/round";
import {ParamsService} from "../services/params.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  seasons: Season[];
  seasonDetails: SeasonDetails;
  seasonMatches: Match[];
  rounds: Round[];
  roundMatches: Match[] = [];
  seasonName: String = this.activatedRoute.snapshot.params.selectedSeasonName;
  private _selectedSeasonName: String;
  private _selectedRoundId: number;
  selectedRound: String;
  isClubSelected = false;
  selectedClub: Club = {clubId: 0, clubName: "", clubLogo: ""};
  groupOfSelectedClub: String;
  clubMatches: Match[] = [];
  clubsData = new Array<ClubTable>(3) // Warum 3? TODO
  clubsGroupsData: ClubTable[][] = [[], [], [], [], [], [], [], []];
  groupsNames: string[] = [];
  inputNotActive = true;
  isLoading = true;
  errorText: string = '';
  dummyClubData: ClubTable;
  breakEqualPoints: {
    firstClubId: number,
    secondClubId: number,
    firstClubPoints: number,
    secondClubPoints: number,
    firstClubGoals: number,
    secondClubGoals: number
  }

  get selectedSeasonName(): String {
    return this._selectedSeasonName;
  }

  set selectedSeasonName(value: String) {
    this._selectedSeasonName = value;
    this.paramsService.selectedSeasonName = value;
    this.changeUrl(); // Damit Saisonname im URL steht
    this.getData(); // Nach Saison-Änderung, die Daten neu laden
    this.clearSelectedClub(); // Nach Saison-Änderung, die Daten vom ausgewählten Verein löschen
  }

  get selectedRoundId(): number {
    return this._selectedRoundId;
  }

  set selectedRoundId(value: number) {
    this._selectedRoundId = value;
    this.paramsService.selectedRoundId = this.selectedRoundId
    this.getRoundMatches(this.selectedRoundId);
  }

  constructor(private dataService: DataService,
              private paramsService: ParamsService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.checkSeasonName()) {
      this.paramsService.selectedSeasonName = this.activatedRoute.snapshot.params.selectedSeasonName;
      this.selectedSeasonName = this.paramsService.selectedSeasonName;
    } else {
      if (this.paramsService.selectedSeasonName) {
        this.selectedSeasonName = this.paramsService.selectedSeasonName;
      } else {
        this.getCurrentSeason();
      }
    }

    if (this.paramsService.selectedRoundId) {
      this.selectedRoundId = this.paramsService.selectedRoundId;
    }

    this.initializeClubsGroupsData();

  }

  /**
   * @function getData()
   * Holt die Daten von Service.
   * Wird aufgerufen nach dem Saisonname eingesetzt ist.
   */
  getData() {
    const seasons = this.dataService.getSeasons();
    const seasonDetails = this.dataService.getSeasonDetails(this.selectedSeasonName);
    const matches = this.dataService.getSeasonMatches(this.selectedSeasonName);
    const rounds = this.dataService.getAllRounds();
    forkJoin([seasons, seasonDetails, matches, rounds]).subscribe(result => {
      this.seasons = result[0];
      this.seasonDetails = result[1];
      this.seasonMatches = result[2];
      this.rounds = result[3];
      this.isLoading = false;
      this.initializeClubsGroupsData();
      this.fillClubsData();
      if (this.paramsService.selectedRoundId) {
        this.selectedRoundId = this.paramsService.selectedRoundId;
      } else {
        this.selectedRoundId = 13;
      }
      if (!this.seasonDetails) {
        this.getCurrentSeason();
        this.fillClubsData();
      }
    });

  }

  /**
   * @function initializeClubsGroupsData()
   * clubsGroupsData initialisieren
   */
  initializeClubsGroupsData() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++)
        this.clubsGroupsData[i][j] = {
          clubId: 0,
          clubLogo: '',
          clubName: '',
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        };
    }

  }

  /**
   * @function fillClubsData()
   * Rechnet Verein Ergebnisse und fügt die in clubsGroupsData, um in den Tabellen einzutragen
   */
  fillClubsData(): void {
    if (!this.isLoading) {

      //Schleift durch jede Gruppe
      this.seasonDetails.seasonGroups.forEach((group, i) => {

        //Speichert Gruppenname in Array
        this.groupsNames[i] = group.groupName;

        //Schleift durch jeden Verein in der Gruppe
        group.groupClubs.forEach((club, j) => {
          this.clubsGroupsData[i][j].clubId = club.clubId;
          this.clubsGroupsData[i][j].clubLogo = club.clubLogo;
          this.clubsGroupsData[i][j].clubName = club.clubName;
        });
        if (this.seasonMatches) {
          this.clubsGroupsData[i].forEach(clubTable => {
              clubTable.played = 0;
              clubTable.won = 0;
              clubTable.drawn = 0;
              clubTable.lost = 0;
              clubTable.goalsFor = 0;
              clubTable.goalsAgainst = 0;
              clubTable.goalDifference = 0;
              clubTable.points = 0;
              this.seasonMatches.forEach(match => {
                if (match.homeClubGoals != ""
                  && match.homeClubGoals != null
                  && match.awayClubGoals != ""
                  && match.awayClubGoals != null
                  && match.roundId < 7
                ) {

                  //Rechnet die Daten nur wenn Spielergebnisse eingetragen sind und das Spiel in Gruppenphase ist.
                  if (clubTable.clubId == match.homeClubId) {
                    clubTable.played += 1;
                    clubTable.goalsFor += +match.homeClubGoals;
                    clubTable.goalsAgainst += +match.awayClubGoals;
                    if (match.homeClubGoals > match.awayClubGoals) {
                      clubTable.won += 1;
                      clubTable.points += 3;
                    } else if (match.homeClubGoals == match.awayClubGoals) {
                      clubTable.drawn += 1;
                      clubTable.points += 1;
                    } else if (match.homeClubGoals < match.awayClubGoals) {
                      clubTable.lost += 1;
                    }
                  } else if (clubTable.clubId == match.awayClubId) {
                    clubTable.played += 1;
                    clubTable.goalsFor += +match.awayClubGoals;
                    clubTable.goalsAgainst += +match.homeClubGoals;
                    if (match.awayClubGoals > match.homeClubGoals) {
                      clubTable.won += 1;
                      clubTable.points += 3;
                    } else if (match.awayClubGoals == match.homeClubGoals) {
                      clubTable.drawn += 1;
                      clubTable.points += 1;
                    } else if (match.awayClubGoals < match.homeClubGoals) {
                      clubTable.lost += 1;
                    }
                  }
                  let index = this.clubsGroupsData[i].indexOf(clubTable);
                  this.clubsGroupsData[i][index].played = clubTable.played;
                  this.clubsGroupsData[i][index].won = clubTable.won;
                  this.clubsGroupsData[i][index].drawn = clubTable.drawn;
                  this.clubsGroupsData[i][index].lost = clubTable.lost;
                  this.clubsGroupsData[i][index].goalsFor = clubTable.goalsFor;
                  this.clubsGroupsData[i][index].goalsAgainst = clubTable.goalsAgainst;
                  this.clubsGroupsData[i][index].goalDifference = clubTable.goalsFor - clubTable.goalsAgainst;
                  this.clubsGroupsData[i][index].points = clubTable.points;
                }
              });
            }
          );
        }
      });
    }
    this.sortTable();
    console.log(this.clubsGroupsData);
  }

  /**
   * @function changeUrl()
   * Fügt Saisonname in der URL hinzu.
   */
  public changeUrl() {
    this.router.navigate(['home/', this.selectedSeasonName]);
  }

  /**
   * @function getRoundMatches(roundId)
   * @param roundId
   * Filtert SeasonMatches nach eingegebene roundId
   */
  public getRoundMatches(roundId: number) {
    this.roundMatches = [];
    if (this.seasonMatches) {
      this.seasonMatches.forEach(match => {
        if (match.roundId == roundId) {
          this.roundMatches.push(match);
        }
      });
    }
  }

  /**
   * @function checkSeasonName()
   * Prüft, ob eine Saison im URL eingegeben ist und ob, sie valid ist.
   * Wenn nicht, die aktuelle Saison holen.
   */
  public checkSeasonName(): boolean {
    if (this.seasonName) {
      if (this.seasonName.length != 9) {
        return false;
      } else return +this.seasonName.substring(0, 4) + 1 === +this.seasonName.substring(5, 9);
    }
  }

  /**
   * @function getCurrentSeason()
   * Ermittelt die aktuelle Saison durch das heutige Datum.
   * * Jänner - Juli: die Saison ist letztes Jahr - dieses Jahr
   * * August - Dezember: die Saison ist dieses Jahr - nächstes Jahr
   */
  public getCurrentSeason() {
    let today = new Date();

    if ((today.getMonth() + 1) < 8) {
      this.selectedSeasonName = (today.getFullYear() - 1) + "-" + today.getFullYear();
    } else {
      this.selectedSeasonName = today.getFullYear() + "-" + (today.getFullYear() + 1);
    }
  }

  /**
   * @function updateMatchScore(updatedMatch: Match)
   * @param updatedMatch
   * Schickt das neue Spielergebnis dann wird die Seite aktualisiert
   */
  public updateMatchScore(updatedMatch: Match): void {
    this.dataService.updateMatchByMatchId(updatedMatch).subscribe();
    //TODO - Reload Match & Group
    this.navigateTo();
  }

  /**
   * @function navigateTo()
   * aktualisiert die Seite
   */
  public navigateTo() {
    this.router.navigate(['/']);
  }

  /**
   * @function clubSelected(selectedClub, groupName)
   * @param selectedClub
   * @param groupName
   * holt die Daten von dem ausgewählten Verein
   */
  public clubSelected(selectedClub: Club, groupName: String) {
    this.clubMatches = [];
    this.selectedClub = selectedClub;
    this.groupOfSelectedClub = groupName;
    this.seasonMatches.forEach(match => {
      if (this.selectedClub.clubId == match.homeClubId ||
        this.selectedClub.clubId == match.awayClubId) {
        this.clubMatches.push(match);
      }
    });

    this.clubsGroupsData.forEach(clubsGroupData => {
      clubsGroupData.forEach(club => {
        if (club.clubId == selectedClub.clubId) {
          this.clubsData = clubsGroupData;
        }
      });
    });

    this.isClubSelected = true;
  }

  /**
   * @function clearSelectedClub()
   * Ausgewählter Verein löschen
   */
  public clearSelectedClub() {
    this.selectedClub = {clubId: 0, clubName: "", clubLogo: ""};
    this.isClubSelected = false;
  }

  /**
   * higher number of points obtained in the group matches played among the teams in question;

   * superior goal difference from the group matches played among the teams in question;

   * higher number of goals scored in the group matches played among the teams in question;

   * if, after having applied criteria a) to c), teams still have an equal ranking,
   criteria a) to c) are reapplied exclusively to the matches between the remaining teams to
   determine their final rankings. If this procedure does not lead to a decision,
   criteria e) to k) apply in the order given to the two or more teams still equal;
   */
  sortTable(): void {
    this.clubsGroupsData.forEach(clubsData => {
      //Nach Punkte sortieren
      clubsData.sort(function (a, b) {
        let keyA = a.points, keyB = b.points;
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
/*
      this.seasonMatches.forEach(match => {
        if (match.roundId < 7) {
          if (match.homeClubId == this.breakEqualPoints.firstClubId
            && match.awayClubId == this.breakEqualPoints.secondClubId) {
            this.breakEqualPoints.firstClubGoals += +match.homeClubGoals;
            this.breakEqualPoints.secondClubGoals += +match.awayClubGoals;
            if (match.homeClubGoals > match.awayClubGoals) {
              this.breakEqualPoints.firstClubPoints += 3;
            } else if (match.homeClubGoals < match.awayClubGoals) {
              this.breakEqualPoints.secondClubPoints += 3;
            }
          } else if (match.awayClubId == this.breakEqualPoints.firstClubId
            && match.homeClubId == this.breakEqualPoints.secondClubId) {
            this.breakEqualPoints.firstClubGoals += +match.awayClubGoals;
            this.breakEqualPoints.secondClubGoals += +match.homeClubGoals;
            if (match.homeClubGoals > match.awayClubGoals) {
              this.breakEqualPoints.secondClubPoints += 3;
            } else if (match.homeClubGoals < match.awayClubGoals) {
              this.breakEqualPoints.firstClubPoints += 3;
            }
          }
        }
      });
*/
      // TODO - vorher diesen Sort zwischen Vereine in den direkten Spiele gegeneinander
      //Nach Tordifferenz sortieren
      for (let i = 0; i < clubsData.length - 1; i++) {
        if (clubsData[i].points == clubsData[i + 1].points) {
          if (clubsData[i].goalDifference < clubsData[i + 1].goalDifference) {
            this.dummyClubData = clubsData[i];
            clubsData[i] = clubsData[i + 1];
            clubsData[i + 1] = this.dummyClubData;
          } else if (clubsData[i].goalDifference == clubsData[i + 1].goalDifference) {
            //Nach Tore sortieren
            if (clubsData[i].goalsFor < clubsData[i + 1].goalsFor) {
              this.dummyClubData = clubsData[i];
              clubsData[i] = clubsData[i + 1];
              clubsData[i + 1] = this.dummyClubData;
            }
          }
        }
      }
    });

  }

}
