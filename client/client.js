
Template.main.hasName = function () {
    if (Meteor.user().profile)
        return Meteor.user().profile.name;
    return
}

Template.main.hasCompany = function () {
    return Meteor.user().company;
}

Template.companyStatus.company = function () {
    return Companies.findOne(Meteor.user().company);
}


Template.relations.companies = function () {
    return Companies.find();
};

Template.relations.events({
    'click input': function () {
        // template data, if any, is available in 'this'
        if (typeof console !== 'undefined')
            console.log("You pressed the button");
    }
});




Template.createCompany.events({
    'click .save': function (event, template) {
        var name = template.find(".name").value;

        if (name.length) {
            
            var id = createCompany({
                name: name,
            });
            

        } else {
            Session.set("createError", "The company needs a name");
        }
    }

});

Template.nameForm.events({
    'click .save': function (event, template) {
        var ceo = template.find(".ceo").value;

        if (ceo.length) {
            
            setCeoName({ ceo: ceo });

        } else {
            Session.set("createError", "You need to specify a name");
        }
    }

});

Template.createCompany.error = function () {
    return Session.get("createError");
};

Template.nameForm.error = Template.createCompany.error;



Template.navList.page = function () {
    return Session.get("currentPage");
}

Template.pages.onPage = function (p) {
    return p === Session.get("currentPage");
}
    

Template.navList.events({
    'click a': function (event) {
        Session.set("currentPage", event.target.hash.split("#")[1]);
    }
})