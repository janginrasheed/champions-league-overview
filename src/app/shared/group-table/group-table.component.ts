import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {GroupDetails} from "../../types/group-details";
import {Match} from "../../types/match";
import {ClubTable} from "../../types/club-table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss']
})
export class GroupTableComponent implements OnInit {
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['clubLogo', 'clubName', 'played', 'won', 'drawn', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points'];
  displayedColumnsText: string[] = ['', 'Verein', 'Sp.', 'S', 'U', 'N', 'T', 'GT', 'TD', 'P'];

  @Input()
  clubsData: ClubTable[];

  @Input()
  groupName: string;

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.clubsData);
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
  }

}
