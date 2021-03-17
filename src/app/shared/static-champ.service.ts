import { HttpClient } from '@angular/common/http';
import { StaticChamp } from './static-champ.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticChampService {
  formData:StaticChamp;
  readonly rootURL = 'http://localhost:51840/api';
  list: StaticChamp[];

  constructor(private http: HttpClient) { }

  refreshList(){
    this.http.get(this.rootURL + '/StaticChamp').toPromise()
    .then(res => this.list = res as StaticChamp[]);
  }
}
