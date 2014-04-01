

/* Politician
string name
bool is_president
string party
dict contributions
    company: amount
list priorities
    list of things he is in favor of
*/
Politicians = new Meteor.Collection('politicians');

/* Company
string name: Name of company
float cash: Amount of cash at hand
dict employees
    string name
    int age
    string role
    float base_motivation
    float salary
dict inventory
    item
        amount
        value
*/
Companies = new Meteor.Collection('companies');





if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}

setCeoName = function (options) {
    Meteor.call('setCeoName', _.extend({}, options));
}

createCompany = function (options) {
    var id = Random.id();
    Meteor.call('createCompany', _.extend({ _id: id }, options));
    return id;
};

Meteor.methods({
    createCompany: function (options) {
        check(options, {
            name: NonEmptyString,
            _id: Match.Optional(NonEmptyString)
        });

        if (options.name.length > 100)
            throw new Meteor.Error(413, "Name too long");

        if (!this.userId)
            throw new Meteor.Error(401, "Must be logged in");

        if (Companies.find({ name: options.name }).count())
            throw new Meteor.Error(400, "Company name exists");

        var id = options._id || Random.id();
        
        Companies.insert({
            _id: id,
            owner: this.userId,
            name: options.name,
            cash: 10000.0,
            employees: [],
            inventory: {}
        });

        if (Meteor.isServer) {
            console.log("adding company to user");
            Meteor.users.update(Meteor.user()._id, 
                { 
                    $set: {
                        "company": id
                    }
                }
            )
        }
        return id;
    },

    setCeoName: function (options) {
        check(options, {
            ceo: NonEmptyString,
        });

        if (options.ceo.length > 100)
            throw new Meteor.Error(413, "Name too long");

        if (!this.userId)
            throw new Meteor.Error(401, "Must be logged in");

        Meteor.users.update(
            { _id:Meteor.user()._id }, 
            { 
                $set: { 
                    "profile.name":options.ceo,
            }
        })
        
        return options.ceo;
    },
});






UI.registerHelper('objToArray', function(obj) {
    var result = [];
    for (var key in obj)
        result.push({ key:key, value:obj[key] });
    return result;
});





NonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length !== 0;
});

