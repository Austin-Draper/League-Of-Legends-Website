import { NavbarComponent } from './navbar/navbar.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { RosterComponent } from './navbar/roster/roster.component';
import { AccountComponent } from './navbar/account/account.component';
import { HelpComponent } from './navbar/help/help.component';

const routes: Routes = [
  {path:'',redirectTo:'/user/login',pathMatch:'full'},
  {
    path:'user', component:UserComponent,
    children:[
      { path:'registration', component: RegistrationComponent }, // /user/registration
      { path: 'login', component: LoginComponent }
    ]
  },
  {path:'home',component:HomeComponent,canActivate:[AuthGuard]},
  {//apply AuthGuard to the navbar after it's fully working
    path:'navbar', component:NavbarComponent,
    children:[
      { path:'account', component:AccountComponent},
      { path:'help', component:HelpComponent},
      { path:'roster', component:RosterComponent}
    ]
  }
  
  //{path:'roster',component:RosterComponent,canActivate:[AuthGuard]},
  //{path:'account',component:AccountComponent,canActivate:[AuthGuard]},
  //{path:'help',component:HelpComponent,canActivate:[AuthGuard]} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
