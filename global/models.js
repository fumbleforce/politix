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
*/
Corporation = new Meteor.Collection('corporation');

if (Meteor.isServer) {

    var npc;

    if (Corporation.find({ name: "NPC corp" }).count() === 0) {
        Corporation.insert({
            name: "NPC corp",
            cash: 999999999999999999,
        });
    }

    npc = Corporation.findOne({ name: "NPC corp" });
}


/* Storage

string corporation

*/
Storage = new Meteor.Collection('storage');




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

    npc.id = npc._id

    MarketOrder.remove({});
    var orders = [
        { itemId: 1, owner: npc, buyOrder: true, price: 0.43, quantity: 100, location: 1, status: 1 },
        { itemId: 1, owner: npc, buyOrder: true, price: 0.43, quantity: 100, location: 1, status: 1 },
        { itemId: 1, owner: npc, buyOrder: true, price: 0.03, quantity: 100, location: 1, status: 1 },
        { itemId: 1, owner: npc, buyOrder: true, price: 0.43, quantity: 500, location: 1, status: 1 },
        { itemId: 1, owner: npc, buyOrder: true, price: 0.33, quantity: 1900, location: 1, status: 1 },
        { itemId: 2, owner: npc, buyOrder: true, price: 0.43, quantity: 100, location: 1, status: 1 },
        { itemId: 2, owner: npc, buyOrder: true, price: 33.43, quantity: 100, location: 1, status: 1 },
        { itemId: 2, owner: npc, buyOrder: true, price: 0.43, quantity: 100, location: 1, status: 1 },
        { itemId: 2, owner: npc, buyOrder: false, price: 10.43, quantity: 100, location: 1, status: 1 },
        { itemId: 2, owner: npc, buyOrder: false, price: 6.93, quantity: 1300, location: 1, status: 1 },
        { itemId: 2, owner: npc, buyOrder: false, price: 0.43, quantity: 1040, location: 1, status: 1 },
        { itemId: 1, owner: npc, buyOrder: false, price: 0.43333, quantity: 1500, location: 1, status: 1 },
        { itemId: 1, owner: npc, buyOrder: false, price: 0.403, quantity: 200, location: 1, status: 1 },
        { itemId: 1, owner: npc, buyOrder: false, price: 0.43, quantity: 100, location: 1, status: 1 },
        { itemId: 3, owner: npc, buyOrder: false, price: 0.43, quantity: 300, location: 1, status: 1 },
        { itemId: 3, owner: npc, buyOrder: false, price: 0.43, quantity: 100, location: 1, status: 1 },
        { itemId: 5, owner: npc, buyOrder: false, price: 0.43, quantity: 1, location: 1, status: 1 },
        { itemId: 5, owner: npc, buyOrder: false, price: 0.43, quantity: 1, location: 1, status: 1 },
        { itemId: 6, owner: npc, buyOrder: false, price: 0.43, quantity: 1, location: 1, status: 1 },
        { itemId: 6, owner: npc, buyOrder: false, price: 0.43, quantity: 1, location: 1, status: 1 },
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



/* Transaction

    time
    description
    amount
    sender
    receiver
    type

*/
Transaction = new Meteor.Collection("transaction")



/* Factory

string corporation id
string type
int durability
int capacity
float cost

machines: [
    {
        string type
        string config
        int maxworkers
        int workers
        int minworkers
        int cost
        float efficiency
        float rate
    }
]
*/
Factory = new Meteor.Collection("factory");

/* Miner

double rate (/hour)
string corporation
int item (id)

*/
Miner = new Meteor.Collection("miner");