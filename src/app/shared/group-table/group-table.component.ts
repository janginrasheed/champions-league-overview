import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ClubTable} from "../../types/club-table";

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss']
})
export class GroupTableComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['clubLogo', 'clubName', 'played', 'won', 'drawn', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points'];
  displayedColumnsText: string[] = ['', 'Verein', 'Sp.', 'S', 'U', 'N', 'T', 'GT', 'TD', 'P'];

  @Input()
  groupName: string;

  private _clubsData: ClubTable[];

  get clubsData(): ClubTable[] {
    return this._clubsData;
  }

  @Input()
  set clubsData(value: ClubTable[]) {
    this._clubsData = value;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this._clubsData);
  }

}
