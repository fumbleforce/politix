/* Politician

string name
bool is_president
string party
dict contributions
    corporation: amount
list priorities
    list of things he is in favor of
*/
PoliticianCollection = new Meteor.Collection('politician');


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
CorporationCollection = new Meteor.Collection('corporation');

if (Meteor.isServer) {

    var npc;

    if (CorporationCollection.find({ name: "The Government" }).count() === 0) {
        Corporation.insert({
            name: "The Government",
            cash: 999999999999999999,
        });
    }

    npc = CorporationCollection.findOne({ name: "The Government" });
}


/* Storage

string corporation

*/
StorageCollection = new Meteor.Collection('storage');





EmployeeCollection = new Meteor.Collection('employee');



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
MarketOrderCollection = new Meteor.Collection('marketOrder');

if (Meteor.isServer) {
    //MarketOrder.find().count() === 0

    Meteor.startup(function () {
        npc.id = npc._id;
        MarketOrderCollection.remove({});
        Market.resupplyGovernmentContracts();
    });

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
MarketReportCollection = new Meteor.Collection("marketReport");



/* Chat Message

string channel [global, <city>]
string message
sender: {
    name
    id
}
*/
ChatMessageCollection = new Meteor.Collection('chatMessage');



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
TransactionCollection = new Meteor.Collection("transaction");



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
FactoryCollection = new Meteor.Collection("factory");

/* Miner

double rate (/hour)
string corporation
int item (id)

*/
MinerCollection = new Meteor.Collection("miner");