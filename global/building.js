
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
        desc: "The trading post allows your traders to engage in profit-making with the Motherland. You can take a cut in these profits.",
        worker: "trader",
        maxWorkers: [1, 2, 3, 4, 5],
        gatherRates: [1, 2, 5, 7, 12, 15],
        resource: "$",
        upgrade: [
            [   // Level 1
                { id: "plank", qty: 50 },
            ],
            [   // Level 2
                { id: "plank", qty: 150 },
            ],
            [   // Level 3
                { id: "plank", qty: 300 },
            ],
        ]
    },

    "farm": {
        name: "Farm",
        desc: "The farm will, with hard labor, generate grain for your town.",
        worker: "farmer",
        resource: "grain",
        gatherRates: [1, 2, 5, 7, 12, 15],
        maxWorkers: [1, 2, 3, 4, 5],
        upgrade: [
            [   // Level 1
                { id: "plank", qty: 50 },
            ],
            [   // Level 2
                { id: "plank", qty: 150 },
            ],
            [   // Level 3
                { id: "plank", qty: 300 },
            ],
        ]
    },

    "mine": {
        name: "Mine",
        desc: "A deep, damp hole in the ground that contains precious metals and minerals. Generates iron over time.",
        worker: "miner",
        resource: "iron",
        gatherRates: [1, 2, 5, 7, 12, 15],
        maxWorkers: [1, 2, 3, 4, 5],
        upgrade: [
            [   // Level 1
                { id: "plank", qty: 50 },
            ],
            [   // Level 2
                { id: "plank", qty: 150 },
            ],
            [   // Level 3
                { id: "plank", qty: 300 },
            ],
        ]
    },

    "lumberyard": {
        name: "Lumber yard",
        desc: "Your skilled carpenters can use the Lumber yard to craft various wooden materials.",
        worker: "lumberjack",
        resource: "plank",
        consumes: [{ id: "log", qty: 5 }],
        gatherRates: [1, 2, 5, 7, 12, 15],
        maxWorkers: [1, 2, 3, 4, 5],
        upgrade: [
            [   // Level 1
                { id: "plank", qty: 50 },
            ],
            [   // Level 2
                { id: "plank", qty: 150 },
            ],
            [   // Level 3
                { id: "plank", qty: 300 },
            ],
        ]
    },

    "loggingcamp": {
        name: "Logging camp",
        desc: "Deep in the forest the Logging camp provides a base of operations for loggers to gather logs for the town.",
        worker: "logger",
        resource: "log",
        gatherRates: [1, 2, 5, 7, 12, 15],
        maxWorkers: [1, 2, 3, 4, 5],
        upgrade: [
            [   // Level 1
                { id: "plank", qty: 50 },
            ],
            [   // Level 2
                { id: "plank", qty: 150 },
            ],
            [   // Level 3
                { id: "plank", qty: 300 },
            ],
        ]
    },
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