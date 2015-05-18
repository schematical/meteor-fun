Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Meteor.subscribe("user_profile");
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    },
    uploadCallbacks: /*function() {
      return */{
        finished: function(index, fileInfo, context) {
          console.log(index, fileInfo, Meteor.user()._id);
        }
    },
    profileImage:function(){
      console.log(Object.keys(Meteor));
      return 'xxx';

      /*console.log(Meteor.user().fields);
      return Meteor.user().fields.profile_image;*/
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date(),            // current time
        owner: Meteor.userId(),           // _id of logged in user
        email: Meteor.user().emails[0].address  // username of logged in user
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });

  /*Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });*/
}
if(Meteor.isServer){


  UploadServer.init({
    tmpDir: '/home/user1a/www/simple-todos/public/uploads/tmp/',
    uploadDir: '/home/user1a/www/simple-todos/public/uploads',
    checkCreateDirectories: true,

     finished: function(fileInfo, formFields) {

       Meteor.publish(null, function() {
         var currentUserId = this.userId;

         Meteor.users.update({ _id: currentUserId }, {$set:{fields: {  profile_image: fileInfo.path }}})

       });

       return null;


    },
    cacheTime: 100,
    mimeTypes: {
      "xml": "application/xml",
      "vcf": "text/x-vcard"
    }
  })

    Meteor.publish('user_profile', function() {
      var user_profile = Meteor.users.findOne({_id: this.userId }, {fields: {profile_image: 1}});
      console.log(user_profile);
      return user_profile;
    });
}

Meteor.startup(function () {



});