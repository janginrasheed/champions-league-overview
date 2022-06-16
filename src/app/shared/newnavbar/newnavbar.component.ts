import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ParamsService} from "../../services/params.service";

@Component({
  selector: 'app-newnavbar',
  templateUrl: './newnavbar.component.html',
  styleUrls: ['./newnavbar.component.scss']
})
export class NewnavbarComponent implements OnInit {

  selectedSeasonName: String;

  constructor(private router: Router,
              private paramsService: ParamsService) {
  }

  ngOnInit(): void {

  }

  public navigateTo(url: string): void {
    this.selectedSeasonName = this.paramsService.selectedSeasonName;
    if (url.includes("about") || url.includes("config")) {
      this.router.navigate([url]);
    } else {
      this.router.navigate([url, this.selectedSeasonName]);
    }
  }

}
