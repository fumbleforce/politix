

items = {

    // Raw metals used for producing things
    metals: {
        key: "metals",
        subitems: {
            steel: {
                subkey: "steel",
                props: {
                    weight: 1.0
                }
                
            }
        }
        
    },

    // Raw materials made from wood. Used in construction
    wood: {
        key: "wood",
        subitems: {
            planks: {
                subkey: "planks",
                props: {
                    weight: 1.0
                }
            }
        }
    },

    // Machines used in factories
    machines: {
        key: "machines",
        subitems: {

        }
    },

    // Research equipment
    research: {
        key: "reseach",
        subitems: {

        }
    }

};

sortedItems = _.sortBy(items, function(item) {
    return item.key;
});

getItem = function (name) {
    console.log("finding " + name);
    var result;
    _.each(items, function (type) {
        console.log(type.subitems[name]);
        if (_.has(type.subitems, name)) {
            result = type.subitems[name];
        }
    });
    console.log(result);
    return result;
};