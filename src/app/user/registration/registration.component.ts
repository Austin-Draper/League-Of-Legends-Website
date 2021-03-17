import { UserService } from './../../shared/user.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(public service: UserService, private toastr:ToastrService) { }

  ngOnInit() {
    this.service.formModel.reset();
  }

  ///res = response
  onSubmit(){
    var holder = this.service.formModel.value.Email;
    this.service.register().subscribe(
      (res:any) =>{
        if(res.Succeeded){
          console.log('register succeeded');
          //this.service.rosterInitialCreateTag(holder);
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successful.');
        }
        else{
          console.log('register failed');
          console.log(res);
          res.errors.forEach(element => {
            switch(element.code){
              case 'DuplicateUserName':
                this.toastr.error('Username is already taken', 'Registration failed.');
                break;
              default:
                this.toastr.error(element.description, 'Registration failed.');
                break;
            }
          })

        }

      },
      err => {
        console.log(err);
      }
    );
  this.service.rosterInitialCreateTag(holder).subscribe(
    (res:any) =>{
      if(res.Succeeded){
        console.log('Initial create tag succeeded');

      }
      else{
        console.log('Initial create tag failed');
      }
    }
  )
  }

}
