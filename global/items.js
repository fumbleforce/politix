Item = {};

/*
Item quality:

0 - gray - Junk
1 - white - Material
2 - blue - Consumable
3 - lightbrown - Weak
4 - yellow - Sturdy
5 - red - Terrific
6 - purple - Exemplary
*/

Item.quality = [
    "junk",
    "material",
    "consumable",
    "weak",
    "sturdy",
    "terrific",
    "exemplary"
]

Item.items = [
    // Raw metals used for producing things
    {
        id: "dirt",
        category: "trash",
        type:"metal",
        name: "Dirt",
        desc: "A handful of dirt.",
        buyPrice: 1,
        sellPrice: 0,
        quality: 0,
    },
    {
        id: "steel",
        category: "material",
        type:"metal",
        key: 1,
        name: "Steel",
        buyPrice: 50,
        sellPrice: 100,
        quality: 1,
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
        quality: 1,
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
        desc: "It is a plank! :O",
        quality: 1,
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
        quality: 1,
        buyPrice: 2,
        sellPrice: 5,
        props: {
            weight: 1.0
        }
    },

    {
        id: "fish",
        category: "food",
        quality: 1,
        buyPrice: 3,
        sellPrice: 6,
        name: "Barrel of fish",

    },

    {
        id: "stone",
        category: "material",
        quality: 1,
        buyPrice: 3,
        sellPrice: 6,
        name: "Stack of stones"
    },

    {
        id: "grain",
        category:"food",
        quality: 1,
        buyPrice: 3,
        sellPrice: 6,
        name: "Bundle of grains"
    },

    {
        id: "crudeclub",
        category:"weapon",
        quality: 3,
        buyPrice: 50,
        sellPrice: 150,
        name: "Crude club"
    },

    {
        id: "heavyclub",
        category:"weapon",
        quality: 4,
        buyPrice: 150,
        sellPrice: 250,
        name: "Heavy club"
    },

    {
        id: "greatclub",
        category:"weapon",
        quality: 5,
        buyPrice: 350,
        sellPrice: 850,
        name: "Great club"
    },

    {
        id: "bonebreaker",
        category:"weapon",
        quality: 6,
        buyPrice: 1350,
        sellPrice: 2850,
        name: "Bone Breaker"
    },

];

Item.items = _.map(Item.items, function (i) {
    i.el = "<span class='itemlink "+Item.quality[i.quality]+"' title='"+i.desc+"' data-toggle='tooltip'>"+i.name+"</span>";
    return i
});

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
Item.byQuality = [[], [], [], [], [], [], []];

_.each(Item.items, function (i, index) {
    Item.itemDict[i.id] = index;
    Item.byQuality[i.quality].push(i);
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
    if (id === "none") {
        return {
            id: "none",
            el: "nothing"
        }
    }
    var i = Item.items[Item.itemDict[id]];
    return i;
};


Item.rand = function (quality) {
    return Item.byQuality[quality][Math.floor(Math.random()*(Item.byQuality[quality].length-1))];
};