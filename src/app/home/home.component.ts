import { StaticChamp } from './../shared/static-champ.model';
import { StaticChampService } from './../shared/static-champ.service';
import { UserService } from './../shared/user.service';
import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RosterTagsService } from '../shared/roster-tags.service';
import * as _ from 'underscore';

export interface DialogData{
  //animal: 'panda' | 'unicorn' | 'lion';
  animal: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  userDetails;
  homeToastr;
  homeListOfChamps:HomeCards[];

  constructor(private router: Router, public service:UserService, private Champservice:StaticChampService, private Rostertagservice:RosterTagsService, public dialog: MatDialog, private toastr:ToastrService) { }

  ngOnInit() {
    this.service.getUserProfile().subscribe(
      async res => { 
        this.userDetails = res;
        this.Rostertagservice.refreshList(this.userDetails.Email);
        this.Champservice.refreshList();
        this.service.homeFormModel.reset();
      },
      err => {
        console.log(err);
      },
    );

  }

  onSubmit(service, homecomponent, toastr, dialogRef, _userDetails, _champion, _removeList){
    console.log('in onSubmit');
    service.rosterPost(_userDetails, _champion, _removeList).subscribe(
      result => {
        console.log(result);
        //toastr for success
        toastr.show('New champion added to roster!', 'Submit successful.');
        
      },
      (err) => {
        console.log(err)
        //toastr for something went wrong
        toastr.show('Champion was not added to roster!', 'Submit failed');
      },
      
    );
    //close the modal
    dialogRef.close();
  }

  //currently unused toastr
  showSuccess() {
    this.toastr.show('Hello world!', 'Toastr fun!');
  }

  champList(){
    var staticList:HomeCards[] = []; //make sure size of array is correct
    var staticListChamps:HomeCards
    var counter = 0;
    var isAssassin = "";
    var isFighter = "";
    var isMage = "" 
    var isMarksman = ""; 
    var isSupport = ""; 
    var isTank = "";
    var stringBuilder = '';
    var pictureBuilder = "/assets/champpics/"
    var stringlist = this.Champservice.list;
    stringlist.sort((a: StaticChamp, b: StaticChamp) => a.ChampionName.localeCompare(b.ChampionName));
    stringlist.forEach(function (value){
      counter = 0;
      isAssassin = "";
      isFighter = "";
      isMage = "";
      isMarksman = "";
      isSupport = "";
      isTank = "";
      stringBuilder = '';
      pictureBuilder = "/assets/champpics/"
      //1 at a time work with the data in a manner for the html to display each card
      if(value.Assassin)
      {
        isAssassin = "Assassin";
        if(counter == 0){
          stringBuilder = stringBuilder + "Assassin";
          counter++;
        }
        else{
          stringBuilder = stringBuilder + " | Assassin";
        }
      }
      if(value.Fighter)
      {
        isFighter = "Fighter";
        if(counter == 0){
          stringBuilder = stringBuilder + "Fighter";
          counter++;
        }
        else{
          stringBuilder = stringBuilder + " | Fighter";
        }
      }
      if(value.Mage)
      {
        isMage = "Mage";
        if(counter == 0){
          stringBuilder = stringBuilder + "Mage";
          counter++;
        }
        else{
          stringBuilder = stringBuilder + " | Mage";
        }
      }
      if(value.Marksman)
      {
        isMarksman = "Marksman";
        if(counter == 0){
          stringBuilder = stringBuilder + "Marksman";
          counter++;
        }
        else{
          stringBuilder = stringBuilder + " | Marksman";
        }
      }
      if(value.Support)
      {
        isSupport = "Support";
        if(counter == 0){
          stringBuilder = stringBuilder + "Support";
          counter++;
        }
        else{
          stringBuilder = stringBuilder + " | Support";
        }
      }
      if(value.Tank)
      {
        isTank = "Tank";
        if(counter == 0){
          stringBuilder = stringBuilder + "Tank";
          counter++;
        }
        else{
          stringBuilder = stringBuilder + " | Tank";
        }
      }
      pictureBuilder = pictureBuilder + value.ChampionName + ".jpg";
      staticListChamps = {_champion: value.ChampionName, _tags: stringBuilder, _picture: pictureBuilder,
                          _Assassin: isAssassin, _Fighter: isFighter, _Mage: isMage, _Marksman: isMarksman,
                          _Support: isSupport, _Tank: isTank};
      staticList.push(staticListChamps);
    });

    this.homeListOfChamps = staticList;
    return staticList;
  }

  onLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);

  }

  onCSAClick(){
    this.router.navigate(['/home']);
  }

  onRoster(){
    this.router.navigate(['/navbar/roster']);
  }

  onAccount(){
    this.router.navigate(['/navbar/account']);
  }
  onHelp(){
    this.router.navigate(['/navbar/help']);
  }

  //function for testing if modal is working properly
  testChampion(tester:string){
    console.log(tester);
  }

  openDialog(champion:string, picture:string, tags:string, assassin:string, fighter:string, mage:string, marksman:string, support:string, tank:string) {
    let _router: Router; let _service: UserService; let _champservice:StaticChampService; let _rostertagsservice:RosterTagsService; let _dialog: MatDialog; let _toastr:ToastrService; 
    let greeter = new HomeComponent(_router, _service, _champservice, _rostertagsservice, _dialog, _toastr);
    
    var _rostertags = this.Rostertagservice.formData;
    var tagsResult = _.values(_rostertags);
    tagsResult.splice(0,1);
      
    //create a list of all currently existing added tags to this specific champion... need to remove selected ones from list and add remaining ones to tags before adding the new tags
    //pass removeList all the way to user.service... remove anything selected... then add remaining strings to tag list starting from "Tag1"
    var removeList:string[] = [];
    if(assassin != ""){
      removeList.push(assassin);
    }
    if(fighter != ""){
      removeList.push(fighter);
    }
    if(mage != ""){
      removeList.push(mage);
    }
    if(marksman != ""){
      removeList.push(marksman);
    }
    if(support != ""){
      removeList.push(support);
    }
    if(tank != ""){
      removeList.push(tank);
    }

    var _dialogReference = this.dialog.open(DialogDataExampleDialog, {
      data: {
        //animal: 'panda'
        _champion: champion,
        _picture: picture,
        _tags: tags,
        _assassin: assassin,
        _fighter: fighter,
        _mage: mage,
        _marksman: marksman,
        _support: support,
        _tank: tank,
        service: this.service,
        homecomponent: greeter,
        toastr: this.toastr,
        _userDetails: this.userDetails,
        _removeList: removeList,
        _rosttags: tagsResult
      }
    });
    _dialogReference.afterClosed().subscribe(result => {
      this.service.homeFormModel.reset();
    });//resets the values in the form after a close
  }


}

/**
 * testing angular material modal
 */

@Component({
  selector: 'app-home',
  templateUrl: './homeDialog.component.html',
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<DialogDataExampleDialog>) {console.log('inside constructor');}
}

/**
 * End of testing angular material modal
 */

interface HomeCards {
  _champion: string;
  //need to use _champion to display correct picture per card
  _picture: string;
  _tags: string;
  _Assassin: string;
  _Fighter: string;
  _Mage: string;
  _Marksman: string;
  _Support: string;
  _Tank: string;
}