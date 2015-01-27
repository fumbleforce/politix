var requireLogin = function () {
    if (Meteor.loggingIn()) {
        this.next();
    }

    if (!Meteor.user() ) {
        console.log("User not logged in,")
        Router.go("/user");
    } else if (!Meteor.user().name) {
        Router.go("/setup");
    } else {
        this.next();
    }
};

Router.configure({
    loadingTemplate: 'Loading',
    layoutTemplate: 'Layout',
    //onBeforeAction: requireLogin
});


//Router.route('/', function () { this.render("Main"); });

Router.route('/dashboard', function () { Router.go("Town"); });
Router.route('/logout', function () {
    AccountsTemplates.logout();
    Router.go("/user");
});

Router.route('/splash', function () {
    this.layout('CleanLayout');
    this.render('Splash');
});

Router.route('/user', function () {
    if (!Meteor.user()) {
        console.log("Rendering user")
        this.layout('WhiteLayout');
        this.render('User');
    } else if (Meteor.user() && !Meteor.user().name) {
        console.log("Redirect to setup");
        Router.go("/setup");
    } else {
        console.log("Redirect to town")
        Router.go("Town");
    }
});

Router.map(function () {
    this.route('home', {
        path: '/',
        template: 'Town',
        onBeforeAction: requireLogin
    });
    this.route('setup', {
        path: '/setup',
        template: 'StartGame',
        layoutTemplate: 'WhiteLayout',
        onBeforeAction: undefined
    });
    this.route('Town');
    this.route('Storage');
    this.route('Barracks');
    this.route('Market');
    this.route('Gathering');
    this.route('Treasury');
    this.route('Exploration');
    this.route('Settings');
    this.route('Settlers');
    this.route('Relations');
    /*this.route('User', {
        path: '/user',
        template: 'User',
        layoutTemplate: 'WhiteLayout'
    });*/
});


//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

// Options
AccountsTemplates.configure({
    //defaultLayout: 'emptyLayout',
    showForgotPasswordLink: true,
    overrideLoginErrors: true,
    enablePasswordChange: true,
    sendVerificationEmail: false,

    //enforceEmailVerification: true,
    //confirmPassword: true,
    //continuousValidation: false,
    //displayFormLabels: true,
    //forbidClientAccountCreation: false,
    //formValidationFeedback: true,
    //homeRoutePath: '/',
    //showAddRemoveServices: false,
    //showPlaceholders: true,

    negativeValidation: true,
    positiveValidation:true,
    negativeFeedback: false,
    positiveFeedback:true,
});