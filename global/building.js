
Building = {};

Building.buildings = {
    "towncenter": {
        name: "Town Center",
        worker: "administrator",
        maxWorkers: [1, 2, 3, 4, 5, 6],
        popCaps: [10, 20, 30, 50, 100, 200],
        buildCaps: [3, 4, 5, 6, 7, 8, 9, 10],
        upgrade: [
            [   // Level 1
                { id: "plank", qty: 50 },
            ],
            [   // Level 2
                { id: "plank", qty: 50 },
            ],
            [   // Level 3
                { id: "plank", qty: 50 },
            ],
            [   // Level 4
                { id: "plank", qty: 50 },
            ],
            [   // Level 5
                { id: "plank", qty: 50 },
            ],
            [   // Level 6
                { id: "plank", qty: 50 },
            ],
        ]
    },

    "tradepost": {
        name: "Trading Post",
        worker: "trader",
        maxWorkers: [1, 2, 3, 4, 5],
        gatherRates: [1, 2, 5, 7, 12, 15],
        resource: "$",
        upgrade: [
            [   // Level 1
                { id: "plank", qty: 50 },
            ],
            [   // Level 2
                { id: "plank", qty: 50 },
            ],
            [   // Level 3
                { id: "plank", qty: 50 },
            ],
        ]
    },

    "farm": {
        name: "Farm",
        worker: "farmer",
        resource: "log",
        gatherRates: [1, 2, 5, 7, 12, 15],
        maxWorkers: [1, 2, 3, 4, 5],
        upgrade: [
            [   // Level 1
                { id: "plank", qty: 50 },
            ],
            [   // Level 2
                { id: "plank", qty: 50 },
            ],
            [   // Level 3
                { id: "plank", qty: 50 },
            ],
        ]
    }
};

Building.get = function (key) {
    return Building.buildings[key];
}

Building.expand = function (id, owned) {
    var stock = Building.get(id);
    stock.id = id;
    for (var attrname in stock) {
        owned[attrname] = stock[attrname];
    }
    owned.maxLevel = owned.level >= owned.upgrade.length;
    return owned;
};

Building.getWorkerBuilding = function (worker) {
    for (var b in Building.buildings) {
        if (Building.buildings[b].worker === worker) {
            return b;
        }
    }
    return;
};