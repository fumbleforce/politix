/* Politician

string name
bool is_president
string party
dict contributions
    corporation: amount
list priorities
    list of things he is in favor of
*/
Politician = new Meteor.Collection('politician');


/* corporation

string name: Name of corporation
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
Corporation = new Meteor.Collection('corporation');


/* Market order

int itemId
string owner
bool buyOrder
float price
int amount
int location
string acceptedBy
int status [0: failed, 1: active, 2: accepted]
date acceptedTime

*/
MarketOrder = new Meteor.Collection('marketOrder');

if (Meteor.isServer) {
    //MarketOrder.find().count() === 0

    MarketOrder.remove({});
    var orders = [
        { itemId: 1, owner:"NPC Corp", buyOrder: true, price: 0.43, amount: 100, location: 1, status: 1 },
        { itemId: 1, owner:"NPC Corp", buyOrder: true, price: 0.43, amount: 100, location: 1, status: 1 },
        { itemId: 1, owner:"NPC Corp", buyOrder: true, price: 0.03, amount: 100, location: 1, status: 1 },
        { itemId: 1, owner:"NPC Corp", buyOrder: true, price: 0.43, amount: 500, location: 1, status: 1 },
        { itemId: 1, owner:"NPC Corp", buyOrder: true, price: 0.33, amount: 1900, location: 1, status: 1 },
        { itemId: 2, owner:"NPC Corp", buyOrder: true, price: 0.43, amount: 100, location: 1, status: 1 },
        { itemId: 2, owner:"NPC Corp", buyOrder: true, price: 33.43, amount: 100, location: 1, status: 1 },
        { itemId: 2, owner:"NPC Corp", buyOrder: true, price: 0.43, amount: 100, location: 1, status: 1 },
        { itemId: 2, owner:"NPC Corp", buyOrder: false, price: 10.43, amount: 100, location: 1, status: 1 },
        { itemId: 2, owner:"NPC Corp", buyOrder: false, price: 6.93, amount: 1300, location: 1, status: 1 },
        { itemId: 2, owner:"NPC Corp", buyOrder: false, price: 0.43, amount: 1040, location: 1, status: 1 },
        { itemId: 1, owner:"NPC Corp", buyOrder: false, price: 0.43333, amount: 1500, location: 1, status: 1 },
        { itemId: 1, owner:"NPC Corp", buyOrder: false, price: 0.403, amount: 200, location: 1, status: 1 },
        { itemId: 1, owner:"NPC Corp", buyOrder: false, price: 0.43, amount: 100, location: 1, status: 1 },
        { itemId: 3, owner:"NPC Corp", buyOrder: false, price: 0.43, amount: 300, location: 1, status: 1 },
        { itemId: 3, owner:"NPC Corp", buyOrder: false, price: 0.43, amount: 100, location: 1, status: 1 },
    ];

    _.each(orders, function (o) {
        MarketOrder.insert(o);
    });
}



/* Chat Message

string channel [global, <city>]
string message
sender: {
    name
    id
}
*/
ChatMessage = new Meteor.Collection('chatMessage');