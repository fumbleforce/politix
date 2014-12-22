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

    if (Corporation.find({ name: "The Government" }).count() === 0) {
        Corporation.insert({
            name: "The Government",
            cash: 999999999999999999,
        });
    }

    npc = Corporation.findOne({ name: "The Government" });
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

    npc.id = npc._id;

    MarketOrder.remove({});
    resupplyGovernmentContracts();
}


/* Market report

date
itemId
sellHigh
sellLow
buyLow
buyHigh
avgBuy
avgSell
demand
supply
movement
sold
bought

*/
MarketReport = new Meteor.Collection("marketReport");



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
    itemId
    quantity
    type

*/
Transaction = new Meteor.Collection("transaction");



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