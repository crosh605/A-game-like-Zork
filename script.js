// --- GAME DATA ---
const game = {
    // 1. Game World (Locations and their properties) - Initial State
    // NOTE: This is the default state. Dynamic changes are saved separately.
    initialLocations: {
        "starting_room": {
            name: "Starting Room",
            description: "You are in a small, dimly lit room. There's a dusty old wooden door to the north.",
            exits: {
                "north": "dusty_hallway"
            },
            items: ["old_key"], // Items present in this location
            npcs: [] // NPCs present in this location
        },
        "dusty_hallway": {
            name: "Dusty Hallway",
            description: "A long, narrow hallway, covered in cobwebs. It continues north and south.",
            exits: {
                "south": "starting_room",
                "north": "grand_chamber",
                "east": "old_library"
            },
            items: [],
            npcs: []
        },
        "grand_chamber": {
            name: "Grand Chamber",
            description: "This vast chamber echoes with silence. Ancient tapestries depicting forgotten wars hang on the walls. There's a large, ornate chest in the center. A dark passage leads west.",
            exits: {
                "south": "dusty_hallway",
                "west": "dark_passage"
            },
            items: ["ornate_chest"],
            npcs: []
        },
        "old_library": {
            name: "Old Library",
            description: "Dust motes dance in the faint light filtering through grimy windows. Shelves filled with ancient, decaying books line the walls. A ladder leads up to a loft.",
            exits: {
                "west": "dusty_hallway",
                "up": "library_loft"
            },
            items: ["dusty_tome"],
            npcs: []
        },
        "library_loft": {
            name: "Library Loft",
            description: "A rickety wooden loft overlooking the main library. More books are here, along with a strange, glowing orb on a pedestal. The ladder leads back down.",
            exits: {
                "down": "old_library"
            },
            items: ["glowing_orb"],
            npcs: []
        },
        "dark_passage": {
            name: "Dark Passage",
            description: "The air grows colder here, and the darkness is absolute. You can barely make out the path forward. It continues west into deeper gloom.",
            exits: {
                "east": "grand_chamber",
                "west": "gloomy_cavern"
            },
            items: [],
            npcs: []
        },
        "gloomy_cavern": {
            name: "Gloomy Cavern",
            description: "A vast underground cavern. Water drips from the stalactites, echoing eerily. A narrow crevice is to the north, and the passage leads back east.",
            exits: {
                "east": "dark_passage",
                "north": "narrow_crevice"
            },
            items: ["smooth_stone"],
            npcs: []
        },
        "narrow_crevice": {
            name: "Narrow Crevice",
            description: "You squeeze through a tight opening. Beyond, the air is surprisingly fresh, and a faint light can be seen above.",
            exits: {
                "south": "gloomy_cavern",
                "up": "forest_clearing"
            },
            items: [],
            npcs: []
        },
        "forest_clearing": {
            name: "Forest Clearing",
            description: "Sunlight bathes this peaceful clearing. Tall trees surround you, and a winding path leads south. You can see the crevice entrance below.",
            exits: {
                "south": "winding_path",
                "down": "narrow_crevice"
            },
            items: ["wild_berries"],
            npcs: []
        },
        "winding_path": {
            name: "Winding Path",
            description: "A dirt path winds through the dense forest. It leads north back to the clearing, and disappears into the trees to the east.",
            exits: {
                "north": "forest_clearing",
                "east": "ancient_ruins"
            },
            items: [],
            npcs: []
        },
        "ancient_ruins": {
            name: "Ancient Ruins",
            description: "Crumbling stone walls and overgrown statues stand testament to a forgotten civilization. A faint magical aura hangs in the air. The winding path is to the west.",
            exits: {
                "west": "winding_path"
            },
            items: ["ancient_tablet"],
            npcs: []
        }
    },

    // 2. Game Items (Descriptions and properties) - Initial State
    // NOTE: This is the default state. Dynamic changes are saved separately.
    initialItems: {
        "old_key": {
            name: "old key",
            description: "A small, tarnished brass key. It looks like it might open an old lock."
        },
        "ornate_chest": {
            name: "ornate chest",
            description: "A large, heavy chest, made of dark, polished wood with intricate carvings. It seems to be locked.",
            isLocked: true,
            unlockItem: "old_key",
            contents: ["gold_coin", "silver_amulet"]
        },
        "gold_coin": {
            name: "gold coin",
            description: "A shiny gold coin, perhaps valuable."
        },
        "silver_amulet": {
            name: "silver amulet",
            description: "A silver amulet, cool to the touch. It hums faintly."
        },
        "dusty_tome": {
            name: "dusty tome",
            description: "An old book, its pages brittle with age. You can barely make out the title: 'Forgotten Lore'."
        },
        "glowing_orb": {
            name: "glowing orb",
            description: "A small, smooth orb that emits a soft, pulsating light. It feels warm to the touch."
        },
        "smooth_stone": {
            name: "smooth stone",
            description: "A perfectly smooth, grey stone, worn by centuries of water flow."
        },
        "wild_berries": {
            name: "wild berries",
            description: "A cluster of plump, red berries. They look edible."
        },
        "ancient_tablet": {
            name: "ancient tablet",
            description: "A stone tablet inscribed with strange, glowing runes. You can't decipher them."
        },
        "rift_sword": {
            name: "Rift Sword",
            description: "A blade of pure energy, humming with unimaginable power. It deals infinite damage and can never break.",
            damage: 9999999999999,
            unbreakable: true
        },
        "rift_armor": {
            name: "Rift Armor",
            description: "Armor woven from the fabric of reality itself. Wearing it renders you completely impervious to all harm.",
            damageReduction: 1.0,
            unbreakable: true
        }
    },

    // Current game state (will be modified during play)
    locations: {}, // Will be initialized from initialLocations and updated by loadGame
    items: {},     // Will be initialized from initialItems and updated by loadGame
    player: {
        currentLocation: "starting_room",
        inventory: [],
        name: "Adventurer",
        status: {
            strength: "average",
            agility: "average",
            cunning: "average",
            health: 100
        }
    },

    // --- AUDIO ---
    backgroundMusic: null, // Will hold the Audio object for background music
    backgroundMusicStarted: false, // Flag to track if background music has successfully started

    // --- GAME FUNCTIONS ---

    // Elements from HTML
    outputDiv: document.getElementById('game-output'),
    inputField: document.getElementById('player-input'),
    commandsUl: document.getElementById('commands-ul'), // Reference to the command list UL

    // Function to display text in the game output area
    displayMessage: function(message) {
        const p = document.createElement('p');
        p.innerHTML = message;
        this.outputDiv.appendChild(p);
        this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
    },

    // Function to process player commands
    processCommand: function(command) {
        command = command.toLowerCase().trim();
        this.displayMessage(`> ${command}`);

        // Attempt to start background music on first interaction if not already started
        if (!this.backgroundMusicStarted && this.backgroundMusic) {
            this.backgroundMusic.play()
                .then(() => {
                    this.backgroundMusicStarted = true;
                    console.log("Background music started on user interaction.");
                })
                .catch(e => {
                    console.warn("Background music still blocked after interaction:", e);
                });
        }


        if (command === "look" || command === "l") {
            this.lookAtLocation();
        } else if (command.startsWith("go ")) {
            const direction = command.substring(3);
            this.movePlayer(direction);
        } else if (command.startsWith("take ")) {
            const itemName = command.substring(5);
            this.takeItem(itemName);
        } else if (command === "inventory" || command === "i") {
            this.showInventory();
        } else if (command.startsWith("use ")) {
            const itemToUse = command.substring(4);
            this.useItem(itemToUse);
        }
        // This block handles the ID55329 functionality
        else if (command === "id55329") {
            this.player.inventory.push("rift_sword");
            this.player.inventory.push("rift_armor");
            this.displayMessage("A surge of power washes over you! You've acquired the **Rift Sword** and **Rift Armor**!");
            this.displayMessage("Type 'inventory' to see your new gear.");
        }
        // --- RICKROLL COMMAND (Now playing local audio and resuming background music) ---
        else if (command === "id555329") {
            this.displayMessage("Suddenly, a catchy tune fills the air! You've been... well, you know.");

            // Pause background music
            if (this.backgroundMusic && this.backgroundMusicStarted) {
                this.backgroundMusic.pause();
            }

            // Play the local MP3
            const localAudio = new Audio('audio/you-know-the-rules-and-so-do-i-say-goodbye.mp3');
            localAudio.volume = 0.5; // Adjust volume as needed
            localAudio.play().catch(e => console.error("Error playing local audio:", e));

            // When local audio ends, resume background music
            localAudio.onended = () => {
                if (this.backgroundMusic && this.backgroundMusicStarted) { // Only resume if it was originally playing
                    this.backgroundMusic.play().catch(e => console.error("Error resuming background music:", e));
                }
            };
        }
        // --- END RICKROLL COMMAND ---
        else if (command === "save") {
            this.saveGame();
        } else if (command === "load") {
            this.loadGame(true); // true means display message
        } else if (command === "clearsave") {
            this.clearSave();
        }
        else if (command === "help" || command === "?") {
            this.displayMessage("--- Available Commands ---");
            this.displayMessage(this.getCommandList().join(", "));
            this.displayMessage("--------------------------");
        }
        else {
            this.displayMessage("I don't understand that command.");
        }
    },

    // --- GAME ACTIONS ---

    // Display current location's description and items/exits
    lookAtLocation: function() {
        const currentLocationData = this.locations[this.player.currentLocation];
        this.displayMessage(`\n${currentLocationData.name}`);
        this.displayMessage(currentLocationData.description);

        if (Object.keys(currentLocationData.exits).length > 0) {
            this.displayMessage(`Exits: ${Object.keys(currentLocationData.exits).join(", ")}`);
        }

        if (currentLocationData.items && currentLocationData.items.length > 0) {
            const itemNames = currentLocationData.items.map(itemId => this.items[itemId].name);
            this.displayMessage(`You see: ${itemNames.join(", ")}`);
        }
    },

    // Move player between locations
    movePlayer: function(direction) {
        const currentLocationData = this.locations[this.player.currentLocation];
        const nextLocationId = currentLocationData.exits[direction];

        if (nextLocationId && this.locations[nextLocationId]) {
            this.player.currentLocation = nextLocationId;
            this.displayMessage(`You go ${direction}.`);
            this.lookAtLocation();
        } else {
            this.displayMessage("You can't go that way.");
        }
    },

    // Player takes an item from the room
    takeItem: function(itemName) {
        const currentLocationData = this.locations[this.player.currentLocation];
        const itemKeysInRoom = currentLocationData.items;

        const foundItemId = itemKeysInRoom.find(id => this.items[id].name.toLowerCase() === itemName.toLowerCase());

        if (foundItemId) {
            currentLocationData.items = itemKeysInRoom.filter(id => id !== foundItemId);
            this.player.inventory.push(foundItemId);
            this.displayMessage(`You take the ${this.items[foundItemId].name}.`);
        } else {
            this.displayMessage(`There's no ${itemName} here.`);
        }
    },

    // Show player's inventory
    showInventory: function() {
        if (this.player.inventory.length === 0) {
            this.displayMessage("Your inventory is empty.");
        } else {
            const itemNames = this.player.inventory.map(itemId => this.items[itemId].name);
            this.displayMessage(`Inventory: ${itemNames.join(", ")}`);
        }
    },

    // Use an item from inventory
    useItem: function(itemToUseName) {
        const itemInInventoryId = this.player.inventory.find(id => this.items[id].name.toLowerCase() === itemToUseName.toLowerCase());

        if (!itemInInventoryId) {
            this.displayMessage(`You don't have a ${itemToUseName}.`);
            return;
        }

        const itemData = this.items[itemInInventoryId];
        const currentLocationData = this.locations[this.player.currentLocation];

        if (itemToUseName.toLowerCase() === "old key") {
            if (currentLocationData.items.includes("ornate_chest") && this.items["ornate_chest"].isLocked) {
                this.items["ornate_chest"].isLocked = false;
                this.displayMessage("You use the old key to unlock the ornate chest!");
                this.displayMessage("The chest creaks open, revealing its contents.");
                currentLocationData.items.push(...this.items["ornate_chest"].contents);
                this.items["ornate_chest"].contents = [];
            } else {
                this.displayMessage("The old key doesn't seem to work on anything here, or the chest is already open.");
            }
        } else if (itemToUseName.toLowerCase() === "rift sword") {
            this.displayMessage("You brandish the Rift Sword. The air crackles around you. You feel invincible!");
        } else if (itemToUseName.toLowerCase() === "rift armor") {
            this.displayMessage("You don the Rift Armor. Its ethereal form molds to your body, offering ultimate protection.");
        } else {
            this.displayMessage(`You can't seem to 'use' the ${itemToUseName} in any meaningful way here.`);
        }
    },

    // --- SAVE/LOAD FUNCTIONS ---
    saveGame: function() {
        const gameState = {
            player: {
                currentLocation: this.player.currentLocation,
                inventory: [...this.player.inventory],
                // Add other player properties if they become dynamic (e.g., health, name)
            },
            // Store the current state of items in each location
            locationItems: {},
            // Store dynamic properties of specific items (e.g., chest locked status)
            dynamicItemStates: {
                "ornate_chest": {
                    isLocked: this.items.ornate_chest.isLocked,
                    contents: [...this.items.ornate_chest.contents]
                }
            }
        };

        // Populate locationItems with the current items in each room
        for (const locId in this.locations) {
            if (this.locations[locId].items) {
                gameState.locationItems[locId] = [...this.locations[locId].items];
            }
        }

        try {
            localStorage.setItem('textAdventureSave', JSON.stringify(gameState));
            this.displayMessage("Game saved successfully!");
        } catch (e) {
            this.displayMessage("Error saving game: " + e.message);
            console.error("Error saving game:", e);
        }
    },

    loadGame: function(displayMessage = false) {
        try {
            const savedData = localStorage.getItem('textAdventureSave');
            if (savedData) {
                const gameState = JSON.parse(savedData);

                // Restore player state
                this.player.currentLocation = gameState.player.currentLocation;
                this.player.inventory = gameState.player.inventory;
                // Restore other player properties if saved

                // Restore location items
                // First, reset all locations to their initial items
                for (const locId in this.initialLocations) {
                    this.locations[locId].items = [...this.initialLocations[locId].items];
                }
                // Then, apply saved items for each location
                for (const locId in gameState.locationItems) {
                    if (this.locations[locId]) { // Ensure location exists
                        this.locations[locId].items = gameState.locationItems[locId];
                    }
                }

                // Restore dynamic item states
                if (gameState.dynamicItemStates && gameState.dynamicItemStates.ornate_chest) {
                    this.items.ornate_chest.isLocked = gameState.dynamicItemStates.ornate_chest.isLocked;
                    this.items.ornate_chest.contents = gameState.dynamicItemStates.ornate_chest.contents;
                }

                if (displayMessage) {
                    this.displayMessage("Game loaded successfully!");
                    this.lookAtLocation(); // Describe the loaded location
                }
                return true; // Indicate successful load
            } else {
                if (displayMessage) {
                    this.displayMessage("No saved game found.");
                }
                return false; // Indicate no save found
            }
        } catch (e) {
            this.displayMessage("Error loading game: " + e.message);
            console.error("Error loading game:", e);
            return false; // Indicate error
        }
    },

    clearSave: function() {
        try {
            localStorage.removeItem('textAdventureSave');
            this.displayMessage("Saved game cleared!");
            // Optionally, reload the game to its initial state
            this.init(true); // Re-initialize, forcing a fresh start
        } catch (e) {
            this.displayMessage("Error clearing save: " + e.message);
            console.error("Error clearing save:", e);
        }
    },

    // --- COMMAND LISTING FUNCTIONS ---
    // Returns an array of all recognized commands
    getCommandList: function() {
        return [
            "look (l)",
            "go [direction]",
            "take [item]",
            "inventory (i)",
            "use [item]",
            "save",
            "load",
            "clearsave",
            "help (?)"
            // id555329 is intentionally not listed here to keep it a secret
        ];
    },

    // Displays commands in the dedicated command-list div
    showCommandsInBar: function() {
        this.commandsUl.innerHTML = ''; // Clear existing list
        const commands = this.getCommandList();
        commands.forEach(cmd => {
            const li = document.createElement('li');
            li.textContent = cmd;
            this.commandsUl.appendChild(li);
        });
    },

    // --- GAME INITIALIZATION ---
    init: function(forceNewGame = false) {
        // Reset locations and items to their initial states
        this.locations = JSON.parse(JSON.stringify(this.initialLocations)); // Deep copy
        this.items = JSON.parse(JSON.stringify(this.initialItems)); // Deep copy

        // Set up the input field listener if not already set
        if (!this.inputField.hasAttribute('data-listener-added')) {
            this.inputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const command = this.inputField.value;
                    this.inputField.value = '';
                    this.processCommand(command); // Process command
                }
            });
            this.inputField.setAttribute('data-listener-added', 'true');

            // Add a one-time listener for any click on the document body to start music
            // This is a common workaround for browser autoplay policies.
            const startMusicOnInteraction = () => {
                if (this.backgroundMusic && !this.backgroundMusicStarted) {
                    this.backgroundMusic.play()
                        .then(() => {
                            this.backgroundMusicStarted = true;
                            console.log("Background music started on user interaction.");
                        })
                        .catch(err => console.error("Failed to start background music on interaction:", err));
                }
                // Remove these listeners once music has started or attempted to start
                document.removeEventListener('click', startMusicOnInteraction);
                // The keydown listener on inputField already handles interaction, no need for a document-wide one
            };
            document.addEventListener('click', startMusicOnInteraction, { once: true });
        }

        // Clear output if forcing a new game or starting fresh
        if (forceNewGame) {
            this.outputDiv.innerHTML = ''; // Clear previous output
            this.player.currentLocation = "starting_room";
            this.player.inventory = [];
            // Reset other player stats if necessary
        }

        // Display commands in the bar
        this.showCommandsInBar();

        // Attempt to load game unless forcing a new game
        if (!forceNewGame && this.loadGame()) {
            this.displayMessage("Welcome back, Adventurer! Game loaded from last save.");
            this.lookAtLocation();
        } else {
            this.displayMessage("Welcome, Adventurer! Type 'look' to observe your surroundings.");
            this.lookAtLocation();
        }

        // --- Initialize background music object ---
        if (!this.backgroundMusic) { // Only create if it doesn't exist
            this.backgroundMusic = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
            this.backgroundMusic.loop = true; // Make it loop continuously
            this.backgroundMusic.volume = 0.3; // Set a lower volume for background

            // Attempt to play immediately (might be blocked by autoplay policies)
            this.backgroundMusic.play().catch(e => {
                console.warn("Background music autoplay prevented. User interaction required:", e);
                // Message shown to user by the click/keydown listener setup above
            });
        }
    }
};

// Call the init function to start the game when the script loads
game.init();
