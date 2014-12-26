Item = {};

Item.items = [
    // Raw metals used for producing things
    {
        id: "steel",
        category: "material",
        type:"metal",
        key: 1,
        name: "Steel",
        buyPrice: 50,
        sellPrice: 100,
        props: {
            weight: 1.0
        }
    },
    {
        id: "iron",
        category: "material",
        type:"metal",
        key: 7,
        name: "Iron",
        buyPrice: 25,
        sellPrice: 50,
        props: {
            weight: 1.0
        }
    },

    // Raw materials made from wood. Used in construction
    {
        id: "plank",
        category: "material",
        type:"wood",
        key: 2,
        name: "Plank",
        buyPrice: 5,
        sellPrice: 10,
        props: {
            weight: 1.0
        }
    },
    {
        id: "log",
        category: "material",
        type:"wood",
        key: 2,
        name: "Logs",
        buyPrice: 2,
        sellPrice: 5,
        props: {
            weight: 1.0
        }
    },

    {
        id: "fish",
        category: "food",
        buyPrice: 3,
        sellPrice: 6,
        name: "Barrel of fish",

    },

    {
        id: "stone",
        category: "material",
        buyPrice: 3,
        sellPrice: 6,
        name: "Stack of stones"
    },

    {
        id: "grain",
        category:"food",
        buyPrice: 3,
        sellPrice: 6,
        name: "Bundle of grains"
    }

];

Item.workers = [
    {
        workerId: 0,
        type: "manual",
        wage: 5
    },
    {   
        workerId: 1,
        type: "economics",
        wage: 10,
    }
];


Item.itemDict = {};
Item.itemHierarchy = [];

_.each(Item.items, function (i, index) {
    Item.itemDict[i.id] = index;
});

Item.byCategory = {};
_.each(Item.items, function (i, index) {
    if (!(i.category in Item.byCategory)) Item.byCategory[i.category] = []
    Item.byCategory[i.category].push(i);
});



Item.sortedItems = _.sortBy(Item.items, function(item) {
    return item.key;
});

Item.get = function (id) {
    return Item.items[Item.itemDict[id]];
};