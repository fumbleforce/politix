Meteor.startup(function () {
	Accounts.ui.config({
		passwordSignupFields: 'EMAIL_ONLY'
	});

	AccountsEntry.config({
		homeRoute: '/',
		dashboardRoute: '/home',
		language: 'en',
		showSignupCode: false
	});
});
  