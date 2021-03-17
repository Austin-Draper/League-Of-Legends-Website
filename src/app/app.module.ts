import { RosterTagsService } from './shared/roster-tags.service';
import { RosterChampService } from './shared/roster-champ.service';
import { StaticChampService } from './shared/static-champ.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { UserService } from './shared/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent, DialogDataExampleDialog } from './home/home.component';
import { RosterComponent, RosterDialogDataExampleDialog, RosterCreateDialog, RosterDeleteDialog, RosterTagsDialog } from './navbar/roster/roster.component';
import { AccountComponent } from './navbar/account/account.component';
import { HelpComponent } from './navbar/help/help.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    RosterComponent,
    AccountComponent,
    HelpComponent,
    NavbarComponent,
    DialogDataExampleDialog,
    RosterDialogDataExampleDialog,
    RosterCreateDialog,
    RosterDeleteDialog,
    RosterTagsDialog
  ],
  entryComponents: [DialogDataExampleDialog,
                    RosterDialogDataExampleDialog,
                    RosterCreateDialog,
                    RosterDeleteDialog,
                    RosterTagsDialog],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    MatChipsModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatSlideToggleModule
  ],
  providers: [UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, StaticChampService, RosterChampService, RosterTagsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
