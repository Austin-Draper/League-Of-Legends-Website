import { RosterChamp } from './roster-champ.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RosterChampService {
  formData: RosterChamp;
  readonly rootURL = 'http://localhost:51840/api';
  list: RosterChamp[];

  constructor(private http: HttpClient) { }

  refreshList(email){//get Roster by email
    //console.log('start of Roster refreshList... email= ' + email);
    this.http.get(this.rootURL + '/Roster/GetTheRoster/' + email).toPromise()
    .then(res => this.list = res as RosterChamp[]);
    //console.log('end of Roster refreshList');
  }
}
