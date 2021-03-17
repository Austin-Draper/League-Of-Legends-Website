import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit {
  userDetails;

  constructor(private router: Router, private service:UserService) { }

  ngOnInit() {
      this.service.getUserProfile().subscribe(
        res => { 
          this.userDetails = res;
        },
        err => {
          console.log(err);
        },
      );
  }

  onLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);

  }

  //using a href instead of this for now. But this is here incase it's needed in the future
  onCSAClick(){
    this.router.navigate(['/home']);
  }

  onRoster(){
    this.router.navigate(['/navbar/roster']);
    //this.router.navigateByUrl('roster');
  }

  onAccount(){
    this.router.navigate(['/navbar/account']);
    //this.router.navigateByUrl('account');
  }
  onHelp(){
    this.router.navigate(['/navbar/help']);
    //this.router.navigateByUrl('help');
  }


}
