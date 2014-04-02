
Router.map(function() {
	this.route('main', {
		path: '/',
		onBeforeAction: function () {
			AccountsEntry.signInRequired(this);
		}
	});
	this.route('home', {
		path: '/home',
		onBeforeAction: function () {
			AccountsEntry.signInRequired(this);
		}
	});
	this.route('employees', {
		path: '/employees',
		onBeforeAction: function () {
			AccountsEntry.signInRequired(this);
		}
	});
	this.route('economy', {
		path: '/economy',
		onBeforeAction: function () {
			AccountsEntry.signInRequired(this);
		}
	});
	this.route('production', {
		path: '/production',
		onBeforeAction: function () {
			AccountsEntry.signInRequired(this);
		}
	});
	this.route('relations', {
		path: '/relations',
		onBeforeAction: function () {
			AccountsEntry.signInRequired(this);
		}
	});
	this.route('politics', {
		path: '/politics',
		onBeforeAction: function () {
			AccountsEntry.signInRequired(this);
		}
	});
	this.route('market', {
		path: '/market',
		onBeforeAction: function () {
			AccountsEntry.signInRequired(this);
		}
	});
	
});


Router.configure({
	loadingTemplate: 'loading',
	layoutTemplate: 'layout',
	yieldTemplates: {
		header: { to: 'header' },
		footer: { to: 'footer'}
	},
	before: function () {
		$('meta[name^="description"]').remove();
	}
});
  