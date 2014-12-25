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

MarketOrderCollection = new Meteor.Collection('marketOrder');

if (Meteor.isServer) {
    //MarketOrder.find().count() === 0

    Meteor.startup(function () {
        MarketOrderCollection.remove({});
        Market.resupplyGovernmentContracts();
    });

}
*/


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

