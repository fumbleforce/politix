

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

        var id = options._id || Random.id();
        
        Companies.insert({
            _id: id,
            owner: this.userId,
            name: options.name,
            cash: 10000,
            employees: [],
        });
        return id;
    },
});















NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

