Meteor.startup(function () {
	Accounts.ui.config({
		passwordSignupFields: 'EMAIL_ONLY'
	});

	AccountsEntry.config({
		homeRoute: '/',
		dashboardRoute: '/dashboard',
		language: 'en',
		showSignupCode: false
	});
});
  