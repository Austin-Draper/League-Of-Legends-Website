import { RosterTagsService } from './../../shared/roster-tags.service';
import { RosterChamp } from './../../shared/roster-champ.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RosterChampService } from './../../shared/roster-champ.service';
import { UserService } from './../../shared/user.service';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, Inject, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import * as _ from 'underscore';
import 'hammerjs';
import { _MatChipListMixinBase } from '@angular/material/chips';


export interface DialogData{
  //animal: 'panda' | 'unicorn' | 'lion';
  animal: string;
}

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styles: ['./roster.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RosterComponent implements OnInit {
  userDetails;
  rosterToastr;
  rostTags;
  _rosterTagList;
  _rosterChampList;//use this in checked() function
  _filteredChampList;
  _currentChampList;
  initialChecked = true;//this becomes false if ANY of checked array is true
  checked = [];
  _tempTagsList = [];

  constructor(private router: Router, public service:UserService, private Rosterservice:RosterChampService, private Rostertagsservice:RosterTagsService ,public dialog: MatDialog, private toastr:ToastrService) 
  { 
  }

  ngOnInit() {
    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
        this.Rosterservice.refreshList(this.userDetails.Email);
        this._rosterTagList = this.Rostertagsservice.refreshList(this.userDetails.Email);
      },
      err => {
        console.log(err);
      }
    );
    

  }

  rosterTagList(){
    var i = 0;
    var _templist = ["Assassin", "Fighter", "Mage", "Marksman", "Support", "Tank"];
    var _tags = this.Rostertagsservice.formData;
    _tags.Email = null;
    for(var key in _tags)
    {
      if(_tags.hasOwnProperty(key))
      {
        if(_tags[key] != null)
        {
          _templist.push(_tags[key]);
          if(this.checked[i] != true)
          {
            this.checked[i] = false;
          }
          i++;
        }
      }
    }
    this._tempTagsList = _templist;
    return _templist;//this variable never gets used outside this function
  }

  changed(_boolean, _index){
    var _templist = [];
    this.checked[_index] = _boolean;

    /*push all true tags into _templist*/
    for(var i = 0; i < this.checked.length; i++)
    {
      if(this.checked[i] === true)
      {
        _templist.push(this._tempTagsList[i]);
      }
    }

    /*if _templist is empty, all toggles are false so we should display all champions*/
    if(_templist.length < 1)
    {
      this.initialChecked = true;
    }
    else
    {
      this.initialChecked = false;
    }

    var _answerList = this.filterList(_templist);
    return _answerList;//this variable never gets used outside this function





  }

  //1 at a time, go through _templist tags
  //remove any champion that doesn't have the current tag from _templist
  //do this for all tags in _templist then return the result
  filterList(_templist: any[]){
    var _resultList:RosterCards[] = [];
    var _rosterChamps:RosterCards;
    var _rosterChampList = this._rosterChampList;
    var _stringArray = [];

    for(var i = 0; i < _templist.length; i++)
    {
      if(_templist.length > 1 && i > 0)
      {
        _rosterChampList = this._filteredChampList;
      }
      for(var j = 0; j < _rosterChampList.length; j++)
      {
        _rosterChamps = _rosterChampList[j];
        _stringArray = _rosterChamps.rosterArray;
        for(var k = 0; k < _stringArray.length; k++)
        {
          if(_stringArray[k] === _templist[i])
          {
            _resultList.push(_rosterChamps);
            break;
          }
        }

      }
      this._filteredChampList = _resultList;
      _resultList = [];
    }
    return _resultList;
  }

//rosterList runs many times every click.
//we either need to setup a check so that if there's no changes then this function stops immediately
//OR we need to run rosterList once on init and store all the data in a global
  rosterList(){
    var rosterChampList:RosterCards[] = [];
    var rosterChamps:RosterCards;
    var stringArray = [];
    var stringBuilder = '';
    var pictureBuilder = "/assets/champpics/"
    var champBuilder = '';
    var stringlist = this.Rosterservice.list;//put all list data into stringlist for us to manipulate as we need
    stringlist.sort((a: RosterChamp, b: RosterChamp) => a.ChampionName.localeCompare(b.ChampionName));
    stringlist.forEach(function(value){
      //rosterChampion and rosterPicture are already done... just need the tag list
      stringBuilder = '';
      pictureBuilder = "/assets/champpics/";
      champBuilder = '';
      stringArray = [];

      if(value.Tag1 != null)
      {
        stringBuilder = stringBuilder + value.Tag1;
        stringArray.push(value.Tag1);
      }
      if(value.Tag2 != null)
      {
        stringBuilder = stringBuilder + " | " + value.Tag2;
        stringArray.push(value.Tag2);
      }
      if(value.Tag3 != null)
      {
        stringBuilder = stringBuilder + " | " + value.Tag3;
        stringArray.push(value.Tag3);
      }
      if(value.Tag4 != null)
      {
        stringBuilder = stringBuilder + " | " + value.Tag4;
        stringArray.push(value.Tag4);
      }
      if(value.Tag5 != null)
      {
        stringBuilder = stringBuilder + " | " + value.Tag5;
        stringArray.push(value.Tag5);
      }
      if(value.Tag6 != null)
      {
        stringBuilder = stringBuilder + " | " + value.Tag6;
        stringArray.push(value.Tag6);
      }

      pictureBuilder = pictureBuilder + value.ChampionName + ".jpg";
      champBuilder = value.Lane + ': ' + value.ChampionName;
      rosterChamps = {rosterChampion: champBuilder, rosterPicture: pictureBuilder, rosterTags: stringBuilder, rosterArray: stringArray, 
                      rosterLane: value.Lane, rosterPMid: value.PMId};
      rosterChampList.push(rosterChamps);//need to add rosterLane to this after I have it working
    });
    this._rosterChampList = rosterChampList;
    return rosterChampList;
  }

  onCreateSubmit(service, toastr, dialogRef, _userDetails, _tags){
    //need to mess with code so on tag deletion we get all tags to list, re-assign to tags 1-N (N being total number of tags) so the only way tag30!=null is if 
    //all 30 tags are used (need an update/put statement to do this)
    if(_tags.Tag30 != null)
    {
      toastr.show('Tag Creation Failed', 'Max Tags Reached');
    }
    else
    {
    service.rosterCreateTag(_userDetails, _tags).subscribe(
      result => {
        console.log(result);
        toastr.show('Tag Successfully Created!', 'Submit successful.');
      },
      (err) => {
        console.log(err);
        toastr.show('Tag Creation Failed', 'Submit failed');
      },
    );
    }
    dialogRef.close();
    window.location.reload();

  }

  onDeleteSubmit(service, _userDetails, toastr, dialogRef){
    service.rosterDeleteTag(_userDetails).subscribe(
      result => {
        console.log(result);
        //on success, call a new service that will delete the unique tag from the users list of 30
        //still need to edit result to make sure this ONLY RUNS if successful
        toastr.show('Tag Successfully Deleted!', 'Submit successful.');
      },
      (err) => {
        console.log(err);
        toastr.show('Tag Deletion Failed', 'Submit failed');
      },
    );
    service.uniqueDeleteTag(_userDetails).subscribe(
      result => {
        console.log(result);
      },
      (err) => {
        console.log(err);
      },
    );
    dialogRef.close();
    window.location.reload();
    
  }


  onSubmit(service, rostercomponent, toastr, dialogRef, _userDetails, _champion, _rostPMid, _rostArray, _rostLane){
    console.log('in onSubmit');
    service.rosterUpdate(_userDetails, _champion, _rostPMid, _rostArray, _rostLane).subscribe(
      result => {
        console.log(result);
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
    window.location.reload();
  }

  openDialog(rosterChampion, rosterPicture, rosterTags, rosterArray, rosterLane, rosterPMid){
    let _router: Router; let _service: UserService; let _champservice:RosterChampService; let _tagservice:RosterTagsService;let _dialog: MatDialog; let _toastr:ToastrService; 
    let greeter = new RosterComponent(_router, _service, _champservice, _tagservice, _dialog, _toastr);

    //do anything else between here and this.dialog.open()
    var _tags = this.Rostertagsservice.formData;
    //put every tag into an array to be used in TagsDialog
    var tagsResult = _.values(_tags);
    tagsResult.splice(0,1);
    tagsResult.push("Assassin");
    tagsResult.push("Fighter");
    tagsResult.push("Mage");
    tagsResult.push("Marksman");
    tagsResult.push("Support");
    tagsResult.push("Tank");
    //use rosterArray to take away values from tagsResult
    //the remains of tagsResult will be in the Add Tag section
    //everything pulled out of tagsResult goes into the Remove Tag section
    //matching values in both arrays get moved into removeTagArray
    var tagsResultHolder = tagsResult;
    for( var i = 0; i < tagsResult.length; i++){
      for( var e = 0; e < rosterArray.length; e++){
        if(tagsResult[i] === rosterArray[e]){
          tagsResultHolder.splice(i,1);
          i--;
          break;
        }
      }
    }
    tagsResultHolder.sort((a: string, b: string) => 
    {
      a = a || '';
      b = b || '';
      return a.localeCompare(b);
    });

    var _dialogReference = this.dialog.open(RosterDialogDataExampleDialog, {
      data: {
        //all data I need
        _champion: rosterChampion,
        _picture: rosterPicture,
        _tags: rosterTags,
        service: this.service,
        rostercomponent: greeter,
        toastr: this.toastr,
        _userDetails: this.userDetails,
        _rosttags: tagsResultHolder, //list of ALL unique tags user can select from
        _rostArray: rosterArray, //array holding all tags champion is using
        _rostLane: rosterLane,
        _rostPMid: rosterPMid

      }
    });
    _dialogReference.afterClosed().subscribe(result => {
      this.service.homeFormModel.reset();
    });//resets the values in the form after a close
  }

  openCreateDialog(){
    let _router: Router; let _service: UserService; let _champservice:RosterChampService; let _tagservice:RosterTagsService; let _dialog: MatDialog; let _toastr:ToastrService; 
    let greeter = new RosterComponent(_router, _service, _champservice, _tagservice, _dialog, _toastr);

    var _tags = this.Rostertagsservice.formData;
    this.rostTags = this.Rostertagsservice.formData;//this is never used

    //do anything else between here and this.dialog.open()
    var _dialogReference = this.dialog.open(RosterCreateDialog, {
      data: {
        //all data I need
        service: this.service,
        rostercomponent: greeter,
        toastr: this.toastr,
        _userDetails: this.userDetails,
        tags: _tags
      }
    });
    _dialogReference.afterClosed().subscribe(result => {
      this.service.rosterCreateTagFormModel.reset();
    });//resets the values in the form after a close
  }

  openDeleteDialog(){
    let _router: Router; let _service: UserService; let _champservice:RosterChampService; let _tagservice:RosterTagsService; let _dialog: MatDialog; let _toastr:ToastrService; 
    let greeter = new RosterComponent(_router, _service, _champservice, _tagservice, _dialog, _toastr);

    var _tags = this.Rostertagsservice.formData;
    //do anything else between here and this.dialog.open()


    var _dialogReference = this.dialog.open(RosterDeleteDialog, {
      data: {
        //all data I need
        service: this.service,
        rostercomponent: greeter,
        toastr: this.toastr,
        _userDetails: this.userDetails,
        tags: _tags

      }
    });
    _dialogReference.afterClosed().subscribe(result => {
      this.service.rosterDeleteTagFormModel.reset();
    });//resets the values in the form after a close
  }

  openTagsDialog(){
    let _router: Router; let _service: UserService; let _champservice:RosterChampService; let _tagservice:RosterTagsService; let _dialog: MatDialog; let _toastr:ToastrService; 
    let greeter = new RosterComponent(_router, _service, _champservice, _tagservice, _dialog, _toastr);

    //do anything else between here and this.dialog.open()
    var _tags = this.Rostertagsservice.formData;
    //put every tag into an array to be used in TagsDialog

    this.dialog.open(RosterTagsDialog, {
      data: {
        //all data I need
        service: this.service,
        rostercomponent: greeter,
        toastr: this.toastr,
        _userDetails: this.userDetails,
        tags: _tags

      }
    });
  }
}


@Component({
  selector: 'app-roster',
  templateUrl: './rosterDialog.component.html',
})
export class RosterDialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<RosterDialogDataExampleDialog>) {console.log('inside constructor');}
}

@Component({
  selector: 'app-roster',
  templateUrl: './rosterCreateDialog.component.html',
})
export class RosterCreateDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<RosterCreateDialog>) {console.log('inside constructor');}
}

@Component({
  selector: 'app-roster',
  templateUrl: './rosterDeleteDialog.component.html',
})
export class RosterDeleteDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<RosterDeleteDialog>) {console.log('inside constructor');}
}

@Component({
  selector: 'app-roster',
  templateUrl: './rosterTagsDialog.component.html',
})
export class RosterTagsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<RosterTagsDialog>) {console.log('inside constructor');}
}


interface RosterCards {
  rosterChampion: string;
  rosterPicture: string;
  rosterTags: string;
  rosterArray: string[];
  rosterLane: string;
  rosterPMid: number;
}
