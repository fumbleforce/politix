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