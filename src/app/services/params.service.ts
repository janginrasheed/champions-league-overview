import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  private _selectedSeasonId: number;
  private _selectedSeasonName: String;
  private _selectedRoundId: number;

  get selectedSeasonId(): number {
    return this._selectedSeasonId;
  }

  set selectedSeasonId(value: number) {
    this._selectedSeasonId = value;
  }

  get selectedSeasonName(): String {
    return this._selectedSeasonName;
  }

  set selectedSeasonName(value: String) {
    this._selectedSeasonName = value;
  }

  get selectedRoundId(): number {
    return this._selectedRoundId;
  }

  set selectedRoundId(value: number) {
    this._selectedRoundId = value;
  }

  constructor() { }
}
