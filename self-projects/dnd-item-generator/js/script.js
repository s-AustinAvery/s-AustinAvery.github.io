document.addEventListener("DOMContentLoaded", () => {
    const itemTypeSelect = document.getElementById("itemType");
    const itemSelect = document.getElementById("itemSelect");
    const itemSelectContainer = document.getElementById("itemSelectContainer");

    // Initialize UI on load
    updateItemDropdown(itemTypeSelect.value);

    itemTypeSelect.addEventListener("change", () => {
        updateItemDropdown(itemTypeSelect.value);
    });

    function updateItemDropdown(type) {
        // If random hide the item dropdown
        if (type === "random") {
            itemSelectContainer.style.display = "none";
            return;
        }

        // Otherwise show it
        itemSelectContainer.style.display = "block";

        // Clear existing options
        itemSelect.innerHTML = "";

        // Add the 'Random' option first
        const randomOption = document.createElement("option");
        randomOption.value = "random";
        randomOption.textContent = "Random";
        itemSelect.appendChild(randomOption);

        // Determine list to populate
        let list = [];
        if (type === "weapon") list = ItemDB.weapons;
        if (type === "armor") list = ItemDB.armor;

        // Populate item list
        list.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.textContent = item.name;
            itemSelect.appendChild(option);
        });
    }
});

function determineAffixMode(includePrefix, includeSuffix) {
    let roll;

    // both selected, guaranteed both
    if (includePrefix && includeSuffix) {
        return "both";
    }

    // only suffix selected
    if (!includePrefix && includeSuffix) {
        return "suffix";
    }

    // only prefix selected
    if (includeSuffix === false && includePrefix === true) {
        return "prefix";
    }

    // neither selected, random roll
    roll = Math.floor(Math.random() * 100) + 1;

    if (roll <= 35) return "suffix";
    if (roll <= 70) return "prefix";
    return "both";
}

const ItemDB = {
    weapons: [
        { name: "Club", damage: "1d4", type: "Bludgeoning" },
        { name: "Dagger", damage: "1d4", type: "Piercing" },
        { name: "Greatclub", damage: "1d8", type: "Bludgeoning" },
        { name: "Handaxe", damage: "1d6", type: "Slashing" },
        { name: "Javelin", damage: "1d6", type: "Piercing" },
        { name: "Light Hammer", damage: "1d4", type: "Bludgeoning" },
        { name: "Mace", damage: "1d6", type: "Bludgeoning" },
        { name: "Quarterstaff", damage: "1d6", type: "Bludgeoning" },
        { name: "Sickle", damage: "1d4", type: "Slashing" },
        { name: "Spear", damage: "1d6", type: "Piercing" },
        { name: "Light Crossbow", damage: "1d8", type: "Piercing" },
        { name: "Dart", damage: "1d4", type: "Piercing" },
        { name: "Shortbow", damage: "1d6", type: "Piercing" },
        { name: "Sling", damage: "1d4", type: "Bludgeoning" },
        { name: "Battleaxe", damage: "1d8", type: "Slashing" },
        { name: "Flail", damage: "1d8", type: "Bludgeoning" },
        { name: "Glaive", damage: "1d10", type: "Slashing" },
        { name: "Greataxe", damage: "1d12", type: "Slashing" },
        { name: "Greatsword", damage: "2d6", type: "Slashing" },
        { name: "Halberd", damage: "1d10", type: "Slashing" },
        { name: "Lance", damage: "1d12", type: "Piercing" },
        { name: "Longsword", damage: "1d8", type: "Slashing" },
        { name: "Maul", damage: "2d6", type: "Bludgeoning" },
        { name: "Morningstar", damage: "1d8", type: "Piercing" },
        { name: "Pike", damage: "1d10", type: "Piercing" },
        { name: "Rapier", damage: "1d8", type: "Piercing" },
        { name: "Scimitar", damage: "1d6", type: "Slashing" },
        { name: "Shortsword", damage: "1d6", type: "Slashing" },
        { name: "Trident", damage: "1d6", type: "Piercing" },
        { name: "Warpick", damage: "1d8", type: "Piercing" },
        { name: "Warhammer", damage: "1d8", type: "Bludgeoning" },
        { name: "Whip", damage: "1d4", type: "Slashing" },
        { name: "Hand Crossbow", damage: "1d6", type: "Piercing" },
        { name: "Heavy Crossbow", damage: "1d10", type: "Piercing" },
        { name: "Longbow", damage: "1d8", type: "Piercing" },
    ],

    armor: [
        { name: "Padded" },
        { name: "Leather" },
        { name: "Studded Leather" },
        { name: "Hide" },
        { name: "Chain Shirt" },
        { name: "Scale Mail" },
        { name: "Breastplate" },
        { name: "Half Plate" },
        { name: "Ring Mail" },
        { name: "Chain Mail" },
        { name: "Splint" },
        { name: "Plate" },
        { name: "Shield" }
    ]
};

const affixDB = {
    prefixes: [
        {id: "warrior", name: "Warrior's", type: "both", attribute: " "},
        {id: "acrobat", name: "Acrobat's", type: "both", attribute: " "},
        {id: "titan", name: "Titan's", type: "both", attribute: " "},
        {id: "scholar", name: "Scholar's", type: "both", attribute: " "},
        {id: "sage", name: "Sage's", type: "both", attribute: " "},
        {id: "jester", name: "Jester's", type: "both", attribute: " "},
        {id: "fleetfoot", name: "Fleetfoot", type: "both", attribute: " "},
        {id: "readied", name: "Readied", type: "both", attribute: " "},
        {id: "pathfinder", name: "Pathfinder's", type: "both", attribute: " "},
        {id: "everlasting", name: "Everlasting", type: "both", attribute: " "},
        {id: "mageslayer", name: "Mage Slayer's", type: "weapon", attribute: " "},
        {id: "sanctified", name: "Sanctified", type: "weapon", attribute: " "},
        {id: "freezing", name: "Freezing", type: "weapon", attribute: " "},
        {id: "burning", name: "Burning", type: "weapon", attribute: " "},
        {id: "sparking", name: "Sparking", type: "weapon", attribute: " "},
        {id: "captain", name: "Captain's", type: "armor", attribute: " "},
        {id: "stalwart", name: "Stalwart", type: "armor", attribute: " "},
        {id: "indomitable", name: "Indomitable", type: "armor", attribute: " "},
        {id: "evasive", name: "Evasive", type: "armor", attribute: " "},
        {id: "barbed", name: "Barbed", type: "armor", attribute: " "},
    ],

    suffixes: [
        {id: "brawn", name: "of brawn", type: "both", attribute: " "},
        {id: "agility", name: "of agility", type: "both", attribute: " "},
        {id: "vigot", name: "of vigor", type: "both", attribute: " "},
        {id: "brilliance", name: "of brilliance", type: "both", attribute: " "},
        {id: "wit", name: "of wit", type: "both", attribute: " "},
        {id: "resolve", name: "of resolve", type: "both", attribute: " "},
        {id: "strider", name: "of the strider", type: "both", attribute: " "},
        {id: "vigilance", name: "of vigilance", type: "both", attribute: " "},
        {id: "light", name: "of light", type: "both", attribute: " "},
        {id: "ease", name: "of ease", type: "both", attribute: " "},
        {id: "parrying", name: "of parrying", type: "weapon", attribute: " "},
        {id: "magi", name: "of the magi", type: "weapon", attribute: " "},
        {id: "slaying", name: "of slaying", type: "weapon", attribute: " "},
        {id: "ruin", name: "of ruin", type: "weapon", attribute: " "},
        {id: "wrath", name: "of wrath", type: "weapon", attribute: " "},
        {id: "colossus", name: "of the colossus", type: "armor", attribute: " "},
        {id: "thorns", name: "of thorns", type: "armor", attribute: " "},
        {id: "restoration", name: "of restoration", type: "armor", attribute: " "},
        {id: "fortitude", name: "of fortitude", type: "armor", attribute: " "},
        {id: "warding", name: "of warding", type: "armor", attribute: " "}
    ]
}