import { NavbarComponent } from './../navbar/navbar.component';
import { forEach } from '@angular/router/src/utils/collection';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as _ from 'underscore';
import { identity } from 'underscore';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder, private http:HttpClient) { }
  readonly BaseURI = 'http://localhost:51840/api';

//form for registration
  formModel = this.fb.group({
    UserName :['',Validators.required],
    Email :['',Validators.email],
    FullName :[''],
    Passwords : this.fb.group({
      Password :['',[Validators.required,Validators.minLength(4)]],
      ConfirmPassword :['',Validators.required]
    },{validator : this.comparePasswords })

  });

  //form for home page and roster page champs added to database
  homeFormModel = this.fb.group({
    Email:['',Validators.email],
    ChampionName:['',Validators.required],
    Lane:['',Validators.required],
    addTagList:[''],
    removeTagList:['']
    //Tag1:[''],
    //Tag2:[''],
    //Tag3:[''],
    //Tag4:[''],
    //Tag5:[''],
    //Tag6:['']
  });

  rosterCreateTagFormModel = this.fb.group({
    Tag:['',Validators.required]
  });

  rosterDeleteTagFormModel = this.fb.group({
    Tag:['',Validators.required]
  });


  comparePasswords(fb:FormGroup){
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={requiredMismatch:true}
    if(confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors){
      if(fb.get('Password').value != confirmPswrdCtrl.value){
        confirmPswrdCtrl.setErrors({passwordMismatch: true});
      }
      else{
        confirmPswrdCtrl.setErrors(null);
      }
    }
  }
//upload register info to database
  register(){
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };
    //this.rosterInitialCreateTag(this.formModel.value.Email);//make a return statement to check if I should post a toastr or continue with next statement
    //make an empty body for this.http.post(this.BaseURI+'/UniqueTags',body)... 30 empty tags and one filled email
    return this.http.post(this.BaseURI+'/ApplicationUser/Register',body);
  }
//upload new roster champion to database
  rosterPost(_userDetails, _champion, _removeList){
    console.log('in rosterPost');
    let ifbool = true;
    var _Tag1 = null;
    var _Tag2 = null;
    var _Tag3 = null;
    var _Tag4 = null;
    var _Tag5 = null;
    var _Tag6 = null;
    /*for each addTagList... console.log each value
    for(let tester of this.homeFormModel.value.addTagList){
      console.log(this.homeFormModel.value.addTagList.length);//# of tags selected
      console.log(tester);
    }*/

    //tag removal
    var result = _.difference(_removeList, this.homeFormModel.value.removeTagList);
    while(ifbool)
    {
      if(result.length > 0 && _Tag1 === null){
        _Tag1 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag2 === null){
        _Tag2 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag3 === null){
        _Tag3 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag4 === null){
        _Tag4 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag5 === null){
        _Tag5 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag6 === null){
        _Tag6 = result[result.length-1];
        result.pop();
      }
      if(result.length === 0){
        ifbool=false;
      }
      ifbool=false;
      //might need a try and except here... except catches if we're trying to exceed the 6 tag limit
      //AND catches any other default error (if there's > or < 0 size but the code somehow gets all the way to the bottom when it should never reach the bottom)
    }

    //run tag removal BEFORE running this tag addition
    //tag addition
    ifbool=true;
    while(ifbool)
    {
      console.log('start of addition while loop');
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag1 === null){
        _Tag1 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag2 === null){
        _Tag2 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag3 === null){
        _Tag3 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag4 === null){
        _Tag4 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag5 === null){
        _Tag5 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag6 === null){
        _Tag6 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length === 0){
        ifbool=false;
      }
      ifbool=false;
      //might need a try and except here... except catches if we're trying to exceed the 6 tag limit
      //AND catches any other default error (if there's > or < 0 size but the code somehow gets all the way to the bottom when it should never reach the bottom)
    }


    var body = {
      Email: _userDetails.Email,
      ChampionName: _champion,
      Lane: this.homeFormModel.value.Lane,
      Tag1: _Tag1,
      Tag2: _Tag2,
      Tag3: _Tag3,
      Tag4: _Tag4,
      Tag5: _Tag5,
      Tag6: _Tag6
    };
    console.log(_Tag1);
    console.log(_Tag2);
    console.log(_Tag3);
    console.log(_Tag4);
    console.log(_Tag5);
    console.log(_Tag6);
    return this.http.post(this.BaseURI+'/Roster',body);
  }

  rosterUpdate(_userDetails, _champion, _rostPMid, _rostArray, _rostLane)
  {
    //_rostArray holds every current roster tag
    //this.homeFormModel.value.removeTagList holds the tags selected to be removed from _rostArray

    let ifbool = true;
    var _Tag1 = null;
    var _Tag2 = null;
    var _Tag3 = null;
    var _Tag4 = null;
    var _Tag5 = null;
    var _Tag6 = null;
    /*for each addTagList... console.log each value
    for(let tester of this.homeFormModel.value.addTagList){
      console.log(this.homeFormModel.value.addTagList.length);//# of tags selected
      console.log(tester);
    }*/

    //tag removal
    var result = _.difference(_rostArray, this.homeFormModel.value.removeTagList);
    while(ifbool)
    {
      if(result.length > 0 && _Tag1 === null){
        _Tag1 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag2 === null){
        _Tag2 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag3 === null){
        _Tag3 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag4 === null){
        _Tag4 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag5 === null){
        _Tag5 = result[result.length-1];
        result.pop();
      }
      if(result.length > 0 && _Tag6 === null){
        _Tag6 = result[result.length-1];
        result.pop();
      }
      if(result.length === 0){
        ifbool=false;
      }
      ifbool=false;
      //might need a try and except here... except catches if we're trying to exceed the 6 tag limit
      //AND catches any other default error (if there's > or < 0 size but the code somehow gets all the way to the bottom when it should never reach the bottom)
    }

    //run tag removal BEFORE running this tag addition
    //tag addition
    ifbool=true;
    while(ifbool)
    {
      console.log('start of addition while loop');
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag1 === null){
        _Tag1 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag2 === null){
        _Tag2 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag3 === null){
        _Tag3 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag4 === null){
        _Tag4 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag5 === null){
        _Tag5 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length > 0 && _Tag6 === null){
        _Tag6 = this.homeFormModel.value.addTagList[this.homeFormModel.value.addTagList.length-1];
        this.homeFormModel.value.addTagList.pop();
      }
      if(this.homeFormModel.value.addTagList.length === 0){
        ifbool=false;
      }
      ifbool=false;
      //might need a try and except here... except catches if we're trying to exceed the 6 tag limit
      //AND catches any other default error (if there's > or < 0 size but the code somehow gets all the way to the bottom when it should never reach the bottom)
    }

    //start of playing around with champion name
    console.log("length of _champion is: " + _champion.length);
    //var champresult = _champion.slice(_rostLane.length+2,0);
    //console.log("champresult is: " + champresult);
    //console.log("length of champresult is: " + champresult.length);
    let str = _champion.split('');
    console.log("_rostLane length is: " + _rostLane.length);
    str.splice(0,_rostLane.length+2);
    str = str.join('');
    console.log("str is: " + str);


    //end of playing around with champion name




    var body = {
      PMId: _rostPMid,
      Email: _userDetails.Email,
      ChampionName: str,
      Lane: this.homeFormModel.value.Lane,
      Tag1: _Tag1,
      Tag2: _Tag2,
      Tag3: _Tag3,
      Tag4: _Tag4,
      Tag5: _Tag5,
      Tag6: _Tag6
    };
    //console.log('Lane is: ' + body.Lane);
    return this.http.put(this.BaseURI+'/Roster/' + _rostPMid, body);
  }

  rosterInitialCreateTag(_email){
    console.log('in rosterInitialCreateTag');
    console.log('email is: ' + _email);
    var body = {
      Email: _email,
      Tag1: null,
      Tag2: null,
      Tag3: null,
      Tag4: null,
      Tag5: null,
      Tag6: null,
      Tag7: null,
      Tag8: null,
      Tag9: null,
      Tag10: null,
      Tag11: null,
      Tag12: null,
      Tag13: null,
      Tag14: null,
      Tag15: null,
      Tag16: null,
      Tag17: null,
      Tag18: null,
      Tag19: null,
      Tag20: null,
      Tag21: null,
      Tag22: null,
      Tag23: null,
      Tag24: null,
      Tag25: null,
      Tag26: null,
      Tag27: null,
      Tag28: null,
      Tag29: null,
      Tag30: null
    };
    return this.http.post(this.BaseURI+'/UniqueTags', body);
    //return this.http.put(this.BaseURI+'/UniqueTags/'+ _email, body);
  }


  rosterCreateTag(_userDetails, _tags){

    //testing
    //run one time, break as soon as a tag is null
    for(var i = 0; i < 1; i++)
    {
      if(_tags.Tag1 === null)
      {
        _tags.Tag1 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag2 === null)
      {
        _tags.Tag2 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag3 === null)
      {
        _tags.Tag3 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag4 === null)
      {
        _tags.Tag4 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag5 === null)
      {
        _tags.Tag5 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag6 === null)
      {
        _tags.Tag6 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag7 === null)
      {
        _tags.Tag7 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag8 === null)
      {
        _tags.Tag8 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag9 === null)
      {
        _tags.Tag9 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag10 === null)
      {
        _tags.Tag10 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag11 === null)
      {
        _tags.Tag11 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag12 === null)
      {
        _tags.Tag12 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag13 === null)
      {
        _tags.Tag13 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag14 === null)
      {
        _tags.Tag14 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag15 === null)
      {
        _tags.Tag15 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag16 === null)
      {
        _tags.Tag16 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag17 === null)
      {
        _tags.Tag17 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag18 === null)
      {
        _tags.Tag18 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag19 === null)
      {
        _tags.Tag19 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag20 === null)
      {
        _tags.Tag20 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag21 === null)
      {
        _tags.Tag21 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag22 === null)
      {
        _tags.Tag22 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag23 === null)
      {
        _tags.Tag23 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag24 === null)
      {
        _tags.Tag24 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag25 === null)
      {
        _tags.Tag25 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag26 === null)
      {
        _tags.Tag26 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag27 === null)
      {
        _tags.Tag27 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag28 === null)
      {
        _tags.Tag28 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag29 === null)
      {
        _tags.Tag29 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }
      if(_tags.Tag30 === null)
      {
        _tags.Tag30 = this.rosterCreateTagFormModel.value.Tag;
        break;
      }



    }

    console.log('in rosterCreateTag');
    console.log('_tags.Tag1 is: ' + _tags.Tag1);
    console.log('_tags.Tag7 is: ' + _tags.Tag7);

    //end of testing


    var body = {
      Email: _userDetails.Email,
      Tag1: _tags.Tag1,
      Tag2: _tags.Tag2,
      Tag3: _tags.Tag3,
      Tag4: _tags.Tag4,
      Tag5: _tags.Tag5,
      Tag6: _tags.Tag6,
      Tag7: _tags.Tag7,
      Tag8: _tags.Tag8,
      Tag9: _tags.Tag9,
      Tag10: _tags.Tag10,
      Tag11: _tags.Tag11,
      Tag12: _tags.Tag12,
      Tag13: _tags.Tag13,
      Tag14: _tags.Tag14,
      Tag15: _tags.Tag15,
      Tag16: _tags.Tag16,
      Tag17: _tags.Tag17,
      Tag18: _tags.Tag18,
      Tag19: _tags.Tag19,
      Tag20: _tags.Tag20,
      Tag21: _tags.Tag21,
      Tag22: _tags.Tag22,
      Tag23: _tags.Tag23,
      Tag24: _tags.Tag24,
      Tag25: _tags.Tag25,
      Tag26: _tags.Tag26,
      Tag27: _tags.Tag27,
      Tag28: _tags.Tag28,
      Tag29: _tags.Tag29,
      Tag30: _tags.Tag30
    };
    return this.http.put(this.BaseURI+'/UniqueTags/'+ _userDetails.Email, body);
    //return this.http.post(this.BaseURI+'/UniqueTags'+ _userDetails.Email, body);

  }

  rosterDeleteTag(_userDetails){

    //console.log(this.rosterDeleteTagFormModel.value.Tag);
    //console.log(_userDetails.Email);
    //this.BaseURI+'/Roster/RemoveTagPutRoster/Insane/fTest@gmail.com' send this with an empty second variable if I can't get it to work
    return this.http.put(this.BaseURI+'/Roster/RemoveTagPutRoster/' +this.rosterDeleteTagFormModel.value.Tag + '/' + _userDetails.Email, _userDetails.Email);
  }

  uniqueDeleteTag(_userDetails){
    console.log(this.rosterDeleteTagFormModel.value.Tag);
    return this.http.put(this.BaseURI+'/UniqueTags/RemoveTagPutUniqueTags/' +this.rosterDeleteTagFormModel.value.Tag + '/' + _userDetails.Email, _userDetails.Email);
  }

  login(formData){

    return this.http.post(this.BaseURI+'/ApplicationUser/Login',formData);
  }

  //must delete every item in...
  //1. UniqueTags using email
  //2. RosterChamps using Email
  //3. AspNetUsers (only one item) using Email
  unsubscribe(Email, _router){
    
    const _deleteRoster = this.http.delete(this.BaseURI+'/Roster/DeleteRoster/' + Email, Email);
    const _deleteUniqueTags = this.http.delete(this.BaseURI+'/UniqueTags/DeleteUniqueTags/' + Email, Email);
    //return this.http.delete(this.BaseURI+'/ApplicationUser/Unsubscribe/' + Email, Email);
    const _deleteUnsubscribe = this.http.delete(this.BaseURI+'/ApplicationUser/Unsubscribe/' + Email, Email);
    forkJoin(_deleteRoster, _deleteUniqueTags, _deleteUnsubscribe).subscribe(
      res => {
        console.log(res);
        //below code is same as navbars onLogout() function
        localStorage.removeItem('token');
        _router.navigate(['/user/login']);
      });

  }

  getUserProfile(){
    return this.http.get(this.BaseURI+'/UserProfile');
  }

}
