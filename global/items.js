

items = {

    // Raw metals used for producing things
    metals: {
        key: "metals",
        items: {
            steel: {
                key: "steel",
                props: {
                    weight: 1.0
                }
                
            }
        }
        
    },

    // Raw materials made from wood. Used in construction
    wood: {
        key: "wood",
        items: {
            planks: {
                key: "planks",
                props: {
                    weight: 1.0
                }
            }
        }
    },

    // Machines used in factories
    machines: {
        key: "machines",
        items: {

        }
    },

    // Research equipment
    research: {
        key: "reseach",
        items: {

        }
    }

};

sortedItems = _.sortBy(items, function(item) {
    return item.key;
});