import {Directive, Injectable, OnInit} from "@angular/core";
import {filter} from "rxjs/operators";
import {NavigationEnd, Router} from "@angular/router";

@Directive()
export abstract class ComponentBase implements OnInit {
  public constructor(public router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)).
    subscribe( event => {
      this.init();
    });
  }

  public abstract init();
}
