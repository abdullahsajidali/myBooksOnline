// Application variable 
var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});


// Application Router (paths for our ember application)
// Router? Used to define routes our application accepts.
App.Router.map(
  function()
  {
	this.route('register');
	this.route('login');
	this.resource('account');
	this.route('book');
  }
);


// Auth Functionality
App.Auth = Ember.Object.extend({

	loggedin: false,
	isAdmin: false,
	session_User: null
});

Auth = App.Auth.create();


// Application's Controllers
App.IndexController = Ember.Controller.extend({
    views: 1000,
	actions:
	{
	pagereload: function()
		{
			console.log('here');
			window.location.reload(true);
		}
	
	}
});


App.LoginController = Ember.Controller.extend({

});

App.RegisterController = Ember.Controller.extend({

});

App.AccountController = Ember.Controller.extend({
	Log: false,
	admin: false,
	init: function()
	{
		this.set('admin',Auth.get('isAdmin'));
		this.set('Log',Auth.get('loggedin'));
		
		console.log(Auth.get('loggedin'));
		console.log(Auth.get('isAdmin'));
		console.log(Auth.get('session_User'));
		
	},
	actions:
	{
	test: function()
		{
			var _USER = Auth.get('session_User');
				console.log(_USER);
				
						$.ajax('rest_api/index.php', {
								type: 'POST',
									async: false,
								dataType: 'json',
								data: {User:_USER, action: 'getWishList'},
								context: this,

								success: function(data) 
								{
									this.set('model',data);
								}
							  });
		},
		itemToUnWish: function(itemID)
		{
			var _ISBN = itemID;
			var _USER = Auth.get('session_User');
			
			Ember.$.ajax('rest_api/index.php', {
					        type: 'POST',
							async: false,
							dataType: 'json',
							data: {Isbn:_ISBN , User:_USER, action: 'removeItemFromWishlist'},
							context: this,

					        success: function(data) 
							{
								if(data.status == 'success')
								{	
									alert('Successfully Deleted');
								}
								else if(data.status == 'error')
								{
									alert('Some Error Occoured. Please try again later');
								}
					        },
							error: function(error) 
							{
								alert('Some Error Occoured. Please try again later');
							}
					      });
		}
	
	}

});

App.BookController = Ember.Controller.extend({

	is_ADMIN: false,
	isAdded: false,
	isNotAdded:false,
	init: function()
	{
		console.log(Auth.get('loggedin'));
		console.log(Auth.get('isAdmin'));
		console.log(Auth.get('session_User'));
	
		this.set('is_ADMIN',Auth.get('isAdmin'));
		this.set('isAdded',false);
		this.set('isNotAdded',false);
	},
	
	actions: 
	{
		itemToWishlist: function(myWish)
		{
			var _ISBN = myWish;
			var _USER = Auth.get('session_User');
			
			Ember.$.ajax('rest_api/index.php', {
					        type: 'POST',
							async: false,
							dataType: 'json',
							data: {Isbn:_ISBN , User:_USER, action: 'addItemToWishlist'},
							context: this,

					        success: function(data) 
							{
								if(data.status == 'success')
								{	
									this.set('isAdded',true);
								}
								else if(data.status == 'error')
								{
									this.set('isNotAdded',true);
								}
					        },
							error: function(error) 
							{
								this.set('isNotAdded',true);
							}
					      });
		}
	}

});


// Application Routes (implementation of MODEL of each template)
App.AccountRoute = Ember.Route.extend({


	

	actions: 
	{
		validate: function()
		{
			var _Email = this.get('controller').get('email');
			var _Password = this.get('controller').get('password');
			
			Ember.$.ajax('rest_api/index.php', {
					        type: 'POST',
							async: false,
							dataType: 'json',
							data: {Email:_Email , Password:_Password, action: 'validateUser'},
							context: this,

					        success: function(data) 
							{
								if(data.status == 'success')
								{	
									if(data.isAdmin == '1')
									{
										//Auth.set('isAdmin',true);
										Account.set('isAdmin',true);
									}
									//Auth.set('loggedIn',true);
									//Auth.set('session_User',data.login_user);
									
								}
								else if(data.status == 'error')
								{
									this.controller.set('wrongInput',true);
								}
					        }
					      });
		},
		
		addItem: function()
		{
			var _Isbn = this.get('controller').get('isbn');
			var _Title = this.get('controller').get('title');
			var _Author = this.get('controller').get('author');
			var _Genre = this.get('controller').get('genre');
			var _Item = this.get('controller').get('item');
			var _Image = this.get('controller').get('image');
			
			console.log(_Isbn);
			console.log(_Title);
			console.log(_Author);
			console.log(_Genre);
			console.log(_Item);
			console.log(_Image);
			
			Ember.$.ajax('rest_api/index.php', {
					        type: 'POST',
							async: false,
							dataType: 'json',
							data: {Isbn:_Isbn , Title:_Title, Author: _Author, Genre:_Genre, Item:_Item, Image:_Image, action: 'insertItem'},
							context: this,

					        success: function(data) 
							{
								
					        }
					      });
		}, 
	logOut: function()
	{
		this.transitionTo('index');
		Auth.set('loggedin',false);
		Auth.set('isAdmin',false);
		Auth.set('session_User',null);	
	}
		
	}
});

App.LoginRoute = Ember.Route.extend({
	actions: 
	{	
		validate: function()
		{
			var _Email = this.get('controller').get('email');
			var _Password = this.get('controller').get('password');
			
			$.ajax('rest_api/index.php', {
					        type: 'POST',
								async: false,
							dataType: 'json',
							data: {Email:_Email , Password:_Password, action: 'validateUser'},
							context: this,

					        success: function(data) 
							{
							//console.log('r1');
								if(data.status == 'success')
								{	
									this.transitionTo('account');
									Auth.set('loggedin',true);
									Auth.set('isAdmin',data.isAdmin);
									Auth.set('session_User',data.login_user);	
									
								
									//Auth.set('loggedin',true);
									//Auth.set('isAdmin',data.isAdmin);
									//Auth.set('session_User',data.login_user);	
									//this.transitionTo('account');
								}
								else if(data.status == 'error')
								{
							//	console.log('w');
									this.controller.set('wrongInput',true);
								}
					        },
							error: function(error) {
							/*
								if(error.responseText == 1)
								{
									console.log('aa gaya hai per begarti lga rha hai')
								}
								else if(error.responseText == 0)
								{
									console.log('wrong values baby')
								}
							*/
					        }
					      });
						  
						  			  
		}
	}
});

App.RegisterRoute = Ember.Route.extend({
	actions: 
	{
		addUser: function()
		{
			var _Name = this.get('controller').get('name');
			var _Email = this.get('controller').get('email');
			var _Password = this.get('controller').get('password');
			
			Ember.$.ajax('rest_api/index.php', {
					        type: 'POST',
							async: false,
							dataType: 'json',
							data: {Name:_Name , Email:_Email , Password:_Password, action: 'insertUser'},
							context: this,

					        success: function(data) 
							{
								if(data.status == 'success')
								{	
									this.controller.set('isRegistered',true);
								}
								else if(data.status == 'error')
								{
									alert("Error on query!");
								}
					        }
					      });
		}
	}
});

App.BookRoute = Ember.Route.extend({
	
	
	model: function()
	{
		var books = Ember.A();
		
					$.ajax('rest_api/index.php', {
					        type: 'POST',
								async: false,
							dataType: 'json',
							data: { action: 'getBooks'},
							context: this,

					        success: function(data) 
							{
								books = data;
					        }
					      });
						  return books;
	},
	
	
	
});