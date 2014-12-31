Quest = {};

Quest.quests = [
    {
        id: "looktree",
        title: "Look behind closest tree",
        danger: 0,
        time: 1,
        exp: 10,
        rewards: [

        ]
    },
    {
        id: "peekgates",
        title: "Peek outside city gates",
        danger: 1,
        time: 1,
        exp: 50,
        rewards: [

        ]
    },
    {
        id: "walkpath",
        title: "Walk a well trodden path near town",
        danger: 2,
        time: 1,
        exp: 100,
        rewards: [

        ]
    },
    {
        id: "meadowstown",
        title: "Explore the meadows outside town",
        danger: 3,
        time: 1,
        exp: 300,
        rewards: [

        ]
    },
    {
        id: "darkforest",
        title: "Step into the dark forest",
        danger: 4,
        time: 1,
        exp: 500,
        rewards: [

        ]
    },
    {
        id: "unfamiliarpath",
        title: "Walk an unfamiliar path in the forest",
        danger: 5,
        time: 1,
        exp: 750,
        rewards: [

        ]
    },
    {
        id: "searchclearing",
        title: "Search a clearing in the forest",
        danger: 6,
        time: 1,
        exp: 1000,
        rewards: [

        ]
    },

];


Quest.questDict = {};

_.each(Quest.quests, function (q) {
    Quest.questDict[q.id] = q;
});

Quest.get = function (id) { return Quest.questDict[id]; };

