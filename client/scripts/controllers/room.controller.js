import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Rooms, Messages } from '../../../lib/collections';

export default class RoomCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.roomId = this.$stateParams.roomId;
    this.userId = Meteor.userId();
    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;


    this.helpers({
      messages() {
        return Messages.find({ roomId: this.roomId });

      },
      data() {
        return Rooms.findOne(this.roomId);
      },
      getUser(){
        return Meteor.userId();
      }
    });
  }

  sendPicture() {
    MeteorCameraUI.getPicture({}, (err, data) => {
      if (err) return this.handleError(err);
      this.callMethod('newMessage', {
        picture: data,
        type: 'picture',
        roomId: this.roomId
      });
    });
  }
    handleError(err) {
    if (err.error == 'cancel') return;
    this.$log.error('Profile save error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
  
  sendMessage() {
    if (_.isEmpty(this.message)) return;

    this.callMethod('newMessage', {
      text: this.message,
      type: 'text',
      roomId: this.roomId

    });

    delete this.message;
  }

  inputUp () {
   if (this.isIOS) {
     this.keyboardHeight = 216;
   }

   this.scrollBottom(true);
  }

  inputDown () {
   if (this.isIOS) {
     this.keyboardHeight = 0;
    }

    this.$ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }

  closeKeyboard () {
    if (this.isCordova) {
      cordova.plugins.Keyboard.close();
    }
  }

  scrollBottom(animate) {
    this.$timeout(() => {
      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
    }, 300);
  }
}

RoomCtrl.$name = 'RoomCtrl';
RoomCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];
