import { HttpClient } from '@angular/common/http';
import { RosterTags } from './roster-tags.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RosterTagsService {
  formData: RosterTags;
  readonly rootURL = 'http://localhost:51840/api';
  //list: RosterTags[]; //should never need this as we only grab one at a time

  constructor(private http: HttpClient) { }

  refreshList(email){
    this.http.get(this.rootURL + '/UniqueTags/' + email).toPromise()
    .then(res => this.formData = res as RosterTags);
  }
}
