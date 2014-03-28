


Template.companyStatus.company = function () {
    return Companies.findOne(Session.get('companyId'));
}

Template.companyList.companies = function () {
    return Companies.find();
};

Template.companyList.events({
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
            
            Session.set('companyId', id);

        } else {
            Session.set("createError", "The company needs a name");
        }
    },

    'click .cancel': function () {

    }
});

Template.createCompany.error = function () {
    return Session.get("createError");
};
