import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styles: []
})
export class AccountComponent implements OnInit {
  userDetails;

  constructor(public service:UserService, private router: Router) { }

  ngOnInit() {
    this.service.getUserProfile().subscribe(
      async res => { 
        this.userDetails = res;
      },
      err => {
        console.log(err);
      },
    );
  }

  onUnsubscribe(){
    this.service.unsubscribe(this.userDetails.Email, this.router);
  }
  



}
