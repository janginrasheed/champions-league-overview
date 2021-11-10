import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {GroupsComponent} from './groups/groups.component';
import {MatchesComponent} from './matches/matches.component';
import {ConfigComponent} from "./config/config.component";
import {AboutComponent} from "./about/about.component";

const routes: Routes = [
  {
    path: 'seasons/:seasonid',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'seasons/:seasonid',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'seasons/:seasonid/groups',
    component: GroupsComponent,
    pathMatch: 'full'
  },
  {
    path: 'seasons/:seasonid/matches',
    component: MatchesComponent,
    pathMatch: 'full'
  },
  {
    path: 'seasons/:seasonid/config',
    component: ConfigComponent,
    pathMatch: 'full'
  },
  {
    path: 'seasons/:seasonid/about',
    component: AboutComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

/*
localhost:4200/seasons/{seasonid}
localhost:4200/seasons/{seasonid}/groups
localhost:4200/seasons/{seasonid}/groups/{groupid}
localhost:4200/seasons/{seasonid}/groups/{groupid}/clubs
localhost:4200/seasons/{seasonid}/groups/{groupid}/clubs/{clubid}
localhost:4200/seasons/{seasonid}/groups/{groupid}/matches
localhost:4200/seasons/{seasonid}/groups/{groupid}/matches/{matchid}
*/
