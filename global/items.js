

items = [
    // Raw metals used for producing things
    {
        type:"metal",
        key: 1,
        name: "Steel",
        props: {
            weight: 1.0
        }
    },
    {
        type:"metal",
        key: 7,
        name: "Iron",
        props: {
            weight: 1.0
        }
    },

    // Raw materials made from wood. Used in construction
    {
        type:"wood",
        key: 2,
        name: "Plank",
        props: {
            weight: 1.0
        }
    },

    // Machines used in factories
    {
        type:"machine",
        key: 3,
        name: "Metal Cutter",
        props: {
            weight: 1000.0
        }
    },

    // Research equipment
    {
        type:"research",
        key: 4,
        name: "Glassware",
        props: {
            weight: 50.0
        }
    },

    // Buildings
    {
        type: "buildings",
        key: 5,
        name: "Toy Factory",
        props: {
            weight: 10000000,
            capacity: 10
        }
    },
    {
        type: "machine",
        subType: "miner",
        key: 6,
        name: "Basic Miner",
        props: {
            weight: 10000000,
            miningRate: 0.1,
            cost: 15,
            minWorkers: 1,
            maxWorkers: 3
        },
        actions: [
            {
                name: "Construct",
                func: constructMiner
            },
        ],
        defaultItem: 7
    },

];

itemDict = {};
itemHierarchy = [];

_.each(items, function (i, index) {
    var typeIndex = _.find(itemHierarchy, function (el) { return i.type == el; });

    if (!typeIndex) {
        itemHierarchy.push({
            key: i.type,
            name: capitalize(i.type),
            itemList: [{ itemKey: i.key, itemName: i.name }]
        });
    } else {
        itemHierarchy[typeIndex].itemList.push({ itemKey: i.key, itemName: i.name });
    }


    itemDict[i.key] = index;
});

console.log(itemHierarchy);


sortedItems = _.sortBy(items, function(item) {
    return item.key;
});

getItem = function (id) {
    return items[itemDict[id]];
};