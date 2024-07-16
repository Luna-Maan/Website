let strike_boon = null;

const items = [
    'Broken Resolve',
    'Healthy Rebound',
    'Heart Breaker',
    'Secret Crush',
    'Shameless Attitude',
    'Sweet Surrender',

    'Back Burner',
    'Dazzling Display',
    'Extra Dose',
    'Light Smite',
    'Prominence Flare',
    'Super Nova',

    'Cold Storage',
    'Local Climate',
    'Plentiful Forage',
    'Rare Crop',
    'Snow Queen',
    'Weed Killer',

    'Furnace Blast',
    'Grand Caldera',
    'Heavy Metal',
    'Molten Touch',
    'Mint Condition',
    'Trusty Shield',
    'Uncanny Fortitude',

    'Blood Line',
    'Bridal Glow',
    'Dying Wish',
    'Rousing Reception',
    'Hereditary Bane',
    'Nasty Comeback',
    'Uncommon Grace',

    'Burnt Offering',
    'Controlled Burn',
    'Crispy Coating',
    'Glowing Coal',
    'Highly Flammable',
    'Natural Gas',
    'Pyro Technique',

    'Double Up',
    'Flood Control',
    'Geyser Spout',
    'Hydraulic Might',
    "Ocean's Bounty",
    'Slippery Slope',
    'Splash Fount',

    'Divine Vengeance',
    'Double Strike',
    'Electric Overload',
    'Lightning Lance',
    'Static Shock',
    'Toasting Fork',
    'Spirit Surge',

    'Flame Strike',
    'Flutter Strike',
    'Heaven Strike',
    'Ice Strike',
    'Nova Srtike',
    'Sworn Strike',
    'Volcanic Strike',
    'Wave Strike',
    'Flame Flourish',
    'Flutter Flourish',
    'Heaven Flourish',
    'Ice Flourish',
    'Nova Flourish',
    'Sworn Flourish',
    'Volcanic Flourish',
    'Wave Flourish',
    'Anvil Ring',
    'Arctic Ring',
    'Engagement Ring',
    'Tidal Ring',
    'Rapture Ring',
    'Smolder Ring',
    'Storm Ring',
    'Blinding Sprint',
    'Breaker Sprint',
    'Frigid Sprint',
    'Nexus Sprint',
    'Passion Rush',
    'Smithy Sprint',
    'Soot Sprint',
    'Thunder Sprint',
    'Born Gain',
    'Fixed Gain',
    'Fluid Gain',
    'Glamour Gain',
    'Hearth Gain',
    'Ionic Gain',
    'Lucid Gain',
    'Tranquil Gain',
];

const strike_list = [
    'Flame Strike',
    'Flutter Strike',
    'Heaven Strike',
    'Ice Strike',
    'Nova Srtike',
    'Sworn Strike',
    'Volcanic Strike',
    'Wave Strike',
]

const flourish_list = [
    'Flame Flourish',
    'Flutter Flourish',
    'Heaven Flourish',
    'Ice Flourish',
    'Nova Flourish',
    'Sworn Flourish',
    'Volcanic Flourish',
    'Wave Flourish',
]

const ring_list = [
    'Anvil Ring',
    'Arctic Ring',
    'Engagement Ring',
    'Tidal Ring',
    'Rapture Ring',
    'Smolder Ring',
    'Storm Ring',
]

const sprint_list = [
    'Blinding Sprint',
    'Breaker Sprint',
    'Frigid Sprint',
    'Nexus Sprint',
    'Passion Rush',
    'Smithy Sprint',
    'Soot Sprint',
    'Thunder Sprint',
]

const gain_list = [
    'Born Gain',
    'Fixed Gain',
    'Fluid Gain',
    'Glamour Gain',
    'Hearth Gain',
    'Ionic Gain',
    'Lucid Gain',
    'Tranquil Gain',
]

// Sample data structure with multiple options for each requirement
const rows = [
    {
        id: "Killer Current", gods: ['Poseidon', 'Zeus'], subrows: [
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Slippery Slope',
                other2: '',
                other3: '',
            },
            {
                strike: 'Heaven Strike',
                flourish: 'Heaven Flourish',
                ring: 'Storm Ring',
                sprint: 'Thunder Sprint',
                gain: '',
                other1: 'Divine Vengeance',
                other2: 'Lightning Lance',
                other3: '',
            },
        ]
    },
    {
        id: "Scalding Vapor", gods: ['Hestia', 'Poseidon'], subrows: [
            {
                strike: 'Flame Strike',
                flourish: 'Flame Flourish',
                ring: 'Smolder Ring',
                sprint: '',
                gain: '',
                other1: 'Controlled Burn',
                other2: 'Glowing Coal',
                other3: 'Highly Flammable',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Slippery Slope',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Spiteful Strength", gods: ['Hephaestus', 'Hera'], subrows: [
            {
                strike: '',
                flourish: 'Furnace Blast',
                ring: 'Grand Caldera',
                sprint: 'Heavy Metal',
                gain: 'Molten Touch',
                other1: 'Mint Condition',
                other2: 'Trusty Shield',
                other3: 'Uncanny Fortitude',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: 'Blood Line',
                gain: 'Dying Wish',
                other1: 'Family Trade',
                other2: 'Hereditary Bane',
                other3: 'Nasty Comeback',
            }
        ]
    },
    {
        id: "Romantic Spark", gods: ['Aphrodite', 'Zeus'], subrows: [
            {
                strike: 'Flutter Strike',
                flourish: 'Flutter Flourish',
                ring: 'Rapture Ring',
                sprint: 'Passion Rush',
                gain: 'Glamour Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Heaven Strike',
                flourish: 'Heaven Flourish',
                ring: '',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Natural Selection", gods: ['Demeter', 'Poseidon'], subrows: [
            {
                strike: '',
                flourish: '',
                ring: 'Arctic Ring',
                sprint: 'Frigid Sprint',
                gain: 'Tranquil Gain',
                other1: 'Cold Storage',
                other2: 'Rare Crop',
                other3: 'Snow Queen',
            },
            {
                strike: '',
                flourish: '',
                ring: 'Tidal Ring',
                sprint: 'Breaker Sprint',
                gain: 'Fluid Gain',
                other1: "Ocean's Bounty",
                other2: 'Double Up',
                other3: '',
            }
        ]
    },
    {
        id: "Seismic Hammer", gods: ['Poseidon', 'Hephaestus'], subrows: [
            {
                strike: '',
                flourish: '',
                ring: 'Tidal Ring',
                sprint: '',
                gain: '',
                other1: 'Geyser Spout',
                other2: '',
                other3: '',
            },
            {
                strike: 'Volcanic Strike',
                flourish: 'Volcanic Flourish',
                ring: '',
                sprint: 'Smithy Sprint',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Thermal Dynamic", gods: ['Hestia', 'Zeus'], subrows: [
            {
                strike: 'Flame Strike',
                flourish: 'Flame Flourish',
                ring: 'Smolder Ring',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Heaven Strike',
                flourish: 'Heaven Flourish',
                ring: '',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',

            }
        ]
    },
    {
        id: "Hail Storm", gods: ['Demeter', 'Zeus'], subrows: [
            {
                strike: 'Ice Strike',
                flourish: 'Ice Flourish',
                ring: 'Arctic Ring',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Heaven Strike',
                flourish: 'Heaven Flourish',
                ring: 'Storm Ring',
                sprint: 'Thunder Sprint',
                gain: 'Ionic Gain',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Glorious Disaster", gods: ['Apollo', 'Zeus'], subrows: [
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Prominence Flare',
                other2: '',
                other3: '',
            },
            {
                strike: 'Heaven Strike',
                flourish: 'Heaven Flourish',
                ring: 'Storm Ring',
                sprint: 'Thunder Sprint',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Queen's Ransom", gods: ['Hera', 'Zeus'], subrows: [
            {
                strike: 'Sworn Strike',
                flourish: 'Sworn Flourish',
                ring: 'Engagement Ring',
                sprint: 'Nexus Sprint',
                gain: 'Born Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: 'Storm Ring',
                sprint: 'Thunder Sprint',
                gain: 'Iomnic Gain',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Master Conductor", gods: ['Hephaestus', 'Zeus'], subrows: [
            {
                strike: 'Volcanic Strike',
                flourish: 'Volcanic Flourish',
                ring: 'Anvil Ring',
                sprint: 'Smithy Sprint',
                gain: 'Fixed Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Electric Overload',
                other2: 'Static Shock',
                other3: '',
            }
        ]
    },
    {
        id: "Phoenix King", gods: ['Apollo', 'Hestia', 'Hestia'], subrows: [
            {
                strike: 'Nova Strike',
                flourish: 'Nova Flourish',
                ring: 'Solar Ring',
                sprint: 'Blinding Sprint',
                gain: 'Lucid Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Flame Strike',
                flourish: 'Flame Flourish',
                ring: 'Smolder Ring',
                sprint: 'Soot Sprint',
                gain: 'Hearth Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Burnt Offering',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Hot Flash", gods: ['Aphrodite', 'Hestia'], subrows: [
            {
                strike: '',
                flourish: '',
                ring: 'Rapture Ring',
                sprint: 'Passion Rush',
                gain: 'Glamour Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Flame Strike',
                flourish: 'Flame Flourish',
                ring: 'Smolder Ring',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Ecstatic Obsession", gods: ['Aphrodite', 'Hera'], subrows: [
            {
                strike: '',
                flourish: '',
                ring: 'Rapture Ring',
                sprint: 'Passion Rush',
                gain: 'Glamour Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Sworn Strike',
                flourish: 'Sworn Flourish',
                ring: 'Engagement Ring',
                sprint: 'Nexus Sprint',
                gain: '',
                other1: 'Nasty Comeback',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Love Handles", gods: ['Aphrodite', 'Hephaestus'], subrows: [
            {
                strike: 'Flutter Strike',
                flourish: 'Flutter Flourish',
                ring: 'Rapture Ring',
                sprint: 'Passion Rush',
                gain: 'Glamour Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Volcanic Strike',
                flourish: 'Volcanic Flourish',
                ring: '',
                sprint: 'Smithy Sprint',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Hearty Appetite", gods: ['Aphrodite', 'Demeter'], subrows: [
            {
                strike: 'Flutter Strike',
                flourish: 'Flutter Flourish',
                ring: 'Rapture Ring',
                sprint: '',
                gain: 'Glamour Gain',
                other1: 'Healthy Rebound',
                other2: '',
                other3: '',
            },
            {
                strike: 'Ice Strike',
                flourish: 'Ice Flourish',
                ring: '',
                sprint: 'Frigid Sprint',
                gain: 'Tranquil Gain',
                other1: 'Plentiful Forage',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Island Getaway", gods: ['Aphrodite', 'Poseidon'], subrows: [
            {
                strike: 'Flutter Strike',
                flourish: 'Flutter Flourish',
                ring: '',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Wave Strike',
                flourish: 'Wave Flourish',
                ring: 'Tidal Ring',
                sprint: 'Breaker Sprint',
                gain: 'Fluid Gain',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Beach Ball", gods: ['Apollo', 'Poseidon', '-'], subrows: [
            {
                strike: 'Nova Strike',
                flourish: 'Nova FLourish',
                ring: 'Solar Ring',
                sprint: 'Blinding Sprint',
                gain: 'Lucid Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Wave Strike',
                flourish: 'Wave Flourish',
                ring: 'Tidal Ring',
                sprint: 'Breaker Sprint',
                gain: 'Fluid Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: 'Blinding Sprint',
                gain: 'Breaker Sprint',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Elementary Particles", gods: ['Hera', 'Hestia'], subrows: [
            {
                strike: 'Sworn Strike',
                flourish: 'Sworn FLourish',
                ring: 'Engagement Ring',
                sprint: 'Nexus Sprint',
                gain: 'Born Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Flame Strike',
                flourish: 'Flame Flourish',
                ring: 'Smolder Ring',
                sprint: 'Soot Sprint',
                gain: 'Hearth Gain',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Chain Reaction", gods: ['Hephaestus', 'Hestia'], subrows: [
            {
                strike: 'Volcanic Strike',
                flourish: 'Volcanic Flourish',
                ring: '',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Flame Strike',
                flourish: 'Flame Flourish',
                ring: 'Smolder Ring',
                sprint: 'Soot Sprint',
                gain: 'Hearth Gain',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Freezer Burn", gods: ['Demeter', 'Hestia'], subrows: [
            {
                strike: 'Ice Strike',
                flourish: 'Ice Flourish',
                ring: 'Arctic Ring',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Flame Strike',
                flourish: 'Flame Flourish',
                ring: 'Smolder Ring',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Golden Rule", gods: ['Hera', 'Poseidon'], subrows: [
            {
                strike: 'Sworn Strike',
                flourish: 'Sworn Flourish',
                ring: 'Engagement Ring',
                sprint: 'Nexus Sprint',
                gain: 'Born Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: "Ocean's Bounty",
                other2: 'Double Up',
                other3: '',
            }
        ]
    },
    {
        id: "Cherished Heirloom", gods: ['Demeter', 'Hera'], subrows: [
            {
                strike: 'Ice Strike',
                flourish: 'Ice Flourish',
                ring: 'Arctic Ring',
                sprint: 'Frigid Sprint',
                gain: 'Tranquil Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Sworn Strike',
                flourish: 'Sworn Flourish',
                ring: 'Engagement Ring',
                sprint: 'Nexus Sprint',
                gain: 'Born Gain',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Sun Worshipper", gods: ['Apollo', 'Hera'], subrows: [
            {
                strike: '',
                flourish: '',
                ring: 'Solar Ring',
                sprint: 'Blinding Sprint',
                gain: 'Lucid Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: 'Engagement Ring',
                sprint: 'Nexus Sprint',
                gain: 'Born Gain',
                other1: '   ',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Room Temperature", gods: ['Demeter', 'Hephaestus'], subrows: [
            {
                strike: 'Ice Strike',
                flourish: 'Ice Flourish',
                ring: 'Arctic Ring',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: 'Volcanic Strike',
                flourish: 'Volcanic Flourish',
                ring: '',
                sprint: 'Smithy Sprint',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Rude Awakening", gods: ['Apollo', 'Hephaestus'], subrows: [
            {
                strike: '',
                flourish: '',
                ring: 'Solar Ring',
                sprint: 'Blinding Sprint',
                gain: '',
                other1: 'Dazzling Display',
                other2: 'Light Smite',
                other3: '',
            },
            {
                strike: 'Volcanic Strike',
                flourish: 'Volcanic Flourish',
                ring: '',
                sprint: 'Smithy Sprint',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Sunny Disposition", gods: ['Aphrodite', 'Apollo'], subrows: [
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Heart Breaker',
                other2: '',
                other3: '',
            },
            {
                strike: 'Nova Strike',
                flourish: 'Nova Flourish',
                ring: 'Solar Ring',
                sprint: 'Blinding Sprint',
                gain: 'Lucid Gain',
                other1: '',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Boreal Gust", gods: ['Apollo', 'Demeter'], subrows: [
            {
                strike: 'Nova Strike',
                flourish: 'Nova Flourish',
                ring: 'Solar Ring',
                sprint: 'Blinding Sprint',
                gain: 'Lucid Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: 'Frigid Sprint',
                gain: '',
                other1: 'Gale Force',
                other2: '',
                other3: '',
            }
        ]
    },
    {
        id: "Shocking Loss", gods: ['Zeus', 'Zeus', 'Zeus'], subrows: [
            {
                strike: 'Heaven Strike',
                flourish: 'Heaven Flourish',
                ring: 'Storm Ring',
                sprint: 'Thunder Sprint',
                gain: 'Ionic Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Double Strike',
                other2: 'Electtric Overload',
                other3: 'Toasting Fork',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: 'Divine Vengeance',
                other1: 'Lightning Lance',
                other2: 'Spirit Surge',
                other3: 'Static Shock',
            }
        ]
    },
    {
        id: "King Tide", gods: ['Poseidon', 'Poseidon', 'Poseidon'], subrows: [
            {
                strike: 'Wave Strike',
                flourish: 'Wave Flourish',
                ring: 'Tidal Ring',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: 'Breaker Sprint',
                gain: 'Fluid Gain',
                other1: 'Geyser Spout',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: 'Hydraulic Might',
                other1: 'Splash Fount',
                other2: 'Slippery Slope',
                other3: 'Flood Control',
            }
        ]
    },
    {
        id: "Fine Tuning", gods: ['Hephaestus', 'Hephaestus', 'Hephaestus'], subrows: [
            {
                strike: 'Volcanic Strike',
                flourish: 'Volcanic Flourish',
                ring: '',
                sprint: 'Smithy Sprint',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Heavy Metal',
                other2: 'Mint Condition',
                other3: 'Trusty Shield',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Furnace Blast',
                other2: 'Grand Caldera',
                other3: 'Molten Touch',
            }
        ]
    },
    {
        id: "Winter Harvest", gods: ['Demeter', 'Demeter', 'Demeter'], subrows: [
            {
                strike: 'Ice Strike',
                flourish: 'Ice Flourish',
                ring: 'Arctic Ring',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Plentiful Forage',
                other2: 'Rare Crop',
                other3: 'Snow Queen',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Cold Storage',
                other2: 'Local Climate',
                other3: 'Weed Killer',
            }
        ]
    },
    {
        id: "Fire Walk", gods: ['Hestia', 'Hestia', 'Hestia'], subrows: [
            {
                strike: 'Flame Strike',
                flourish: 'Flame Flourish',
                ring: 'Smolder Ring',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: '',
                other2: 'Controlled Burn',
                other3: 'Glowing Coal',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: 'Crispy Coating',
                other1: 'Highly Flammable',
                other2: 'Natural Gas',
                other3: 'Pyro Technique',
            }
        ]
    },
    {
        id: "Nervous Wreck", gods: ['Aphrodite', 'Aphrodite', 'Aphrodite'], subrows: [
            {
                strike: 'Flutter Strike',
                flourish: 'Flutter Flourish',
                ring: '',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: 'Rapture Ring',
                sprint: 'Passion Rush',
                gain: 'Glamour Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: 'Broken Resolve',
                other1: 'Secret Crush',
                other2: 'Shameless Attitude',
                other3: 'Sweet Surrender',
            }
        ]
    },
    {
        id: "Brave Face", gods: ['Hera', 'Hera', 'Hera'], subrows: [
            {
                strike: 'Sworn Strike',
                flourish: 'Sworn Flourish',
                ring: 'Engagement Ring',
                sprint: 'Nexus Sprint',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: '',
                other2: 'Hereditary Bane',
                other3: 'Rousing Reception',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: '',
                other1: 'Blood Line',
                other2: 'Bridal Glow',
                other3: 'Uncommon Grace',
            }
        ]
    },
    {
        id: "Exceptional Talent", gods: ['Apollo', 'Apollo', 'Apollo'], subrows: [
            {
                strike: 'Nova Strike',
                flourish: 'Nova Flourish',
                ring: '',
                sprint: '',
                gain: '',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: 'Solar Ring',
                sprint: 'Blinding Sprint',
                gain: 'Lucid Gain',
                other1: '',
                other2: '',
                other3: '',
            },
            {
                strike: '',
                flourish: '',
                ring: '',
                sprint: '',
                gain: 'Back Burner',
                other1: 'Extra Dose',
                other2: 'Prominence Flare',
                other3: 'Super Nova',
            }
        ]
    }
    // Add more rows as needed
];

let gottenRequirements = {
    strike: null,
    flourish: null,
    ring: null,
    sprint: null,
    gain: null,
    others: [],
}

function calculatePercentageMet(row) {
    const totalSubrows = row.subrows.length;
    let metSubrows = 0;
    for (let i = 0; i < totalSubrows; i++) {
        const subrow = row.subrows[i];
        if (subrow.strike === gottenRequirements.strike || gottenRequirements.flourish === subrow.flourish || gottenRequirements.ring === subrow.ring || gottenRequirements.sprint === subrow.sprint || gottenRequirements.gain === subrow.gain || gottenRequirements.others.includes(subrow.strike) || gottenRequirements.others.includes(subrow.flourish) || gottenRequirements.others.includes(subrow.ring) || gottenRequirements.others.includes(subrow.sprint) || gottenRequirements.others.includes(subrow.gain) || gottenRequirements.others.includes(subrow.other1) || gottenRequirements.others.includes(subrow.other2) || gottenRequirements.others.includes(subrow.other3)) {
            metSubrows += 1;
        }
    }
    return (metSubrows / totalSubrows) * 100;
}

function getRowClass(percentageMet) {
    if (percentageMet >= 75) return 'high';
    if (percentageMet >= 30) return 'medium';
    return 'low';
}

function renderRows() {
    const list = document.getElementById('other_list');
    list.innerHTML = gottenRequirements.others.map(req => `<li>${req}</li>`).join('');

    const container = document.getElementById('rows-container');
    container.innerHTML = '';

    // Sort rows by the percentage of subrows that have at least one requirement met
    const sortedRows = rows.slice().sort((a, b) => {
        const aPercentageMet = calculatePercentageMet(a);
        const bPercentageMet = calculatePercentageMet(b);
        return bPercentageMet - aPercentageMet;
    });

    // Render rows
    sortedRows.forEach(row => {
        const percentageMet = calculatePercentageMet(row);
        const rowClass = getRowClass(percentageMet);

        row.subrows.forEach((subrow, index) => {
            const rowElement = document.createElement('tr');
            if (index === 0) {
                const idCell = document.createElement('td');
                idCell.className = rowClass;
                idCell.rowSpan = row.subrows.length;
                idCell.textContent = `${row.id}`;
                rowElement.appendChild(idCell);
            }

            const godCell = document.createElement('td');
            if (index === 0) {
                godCell.className = 'boon_god_top';
                godCell.id = row.gods[index];
            }
            else {
                godCell.className = 'boon_god';
                godCell.id = row.gods[index];
            }
            godCell.textContent = row.gods[index];
            rowElement.appendChild(godCell);

            renderCell(subrow, index, rowElement, 'strike');
            renderCell(subrow, index, rowElement, 'flourish');
            renderCell(subrow, index, rowElement, 'ring');
            renderCell(subrow, index, rowElement, 'sprint');
            renderCell(subrow, index, rowElement, 'gain');
            renderCell(subrow, index, rowElement, 'other1');
            renderCell(subrow, index, rowElement, 'other2');
            renderCell(subrow, index, rowElement, 'other3');

            container.appendChild(rowElement);
        });
    });
}

function renderCell(subrow, index, rowElement, boon_type) {
    const reqCell = document.createElement('td');
    if (index === 0) {
        reqCell.className = 'boon_req_top';
    }
    else {
        reqCell.className = 'boon_req';
    }
    if (subrow[boon_type] !== '') {
        if (gottenRequirements[boon_type] === subrow[boon_type]) {
            reqCell.classList.add('met');
        }
        else if (gottenRequirements["others"].includes(subrow[boon_type])) {
            reqCell.classList.add('met');
        }
        reqCell.textContent = subrow[boon_type];
        reqCell.addEventListener('click', () => handleRequirementClick(subrow[boon_type], boon_type));
    }
    else {
        reqCell.textContent = "";
    }
    rowElement.appendChild(reqCell);
}

function handleRequirementClick(option, boon_type) {
    console.log(option, boon_type);
    console.log(gottenRequirements);
    if (gottenRequirements[boon_type] === option) {
        gottenRequirements[boon_type] = null;
        if (boon_type !== "other1" && boon_type !== "other2" && boon_type !== "other3") {
            dropdowns[boon_type].value = '0';
        }
    }
    else if (gottenRequirements["others"].includes(option)) {
        gottenRequirements["others"] = gottenRequirements["others"].filter(req => req !== option);
    }
    else {
        if (boon_type !== "other1" && boon_type !== "other2" && boon_type !== "other3") {
            if (hasOption(dropdowns[boon_type], option)) {
                gottenRequirements[boon_type] = option;
                dropdowns[boon_type].value = option;
            }
            else {
                gottenRequirements["others"].push(option);
            }
        }
        else {
            gottenRequirements["others"].push(option);
        }
    }

    renderRows();
}

function hasOption(select, valueToCheck) {
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === valueToCheck) {
            return true;
        }
    }
    return false;
}

const dropdowns = []

dropdowns['strike'] = document.getElementById('strike');
dropdowns['strike'].addEventListener('change', () => {
    console.log(strike.value);
    gottenRequirements["strike"] = strike.value;
    renderRows();
});

dropdowns['flourish'] = document.getElementById('flourish');
dropdowns['flourish'].addEventListener('change', () => {
    console.log(flourish.value);
    gottenRequirements["flourish"] = flourish.value;
    renderRows();
});

dropdowns['ring'] = document.getElementById('ring');
dropdowns['ring'].addEventListener('change', () => {
    console.log(ring.value);
    gottenRequirements["ring"] = ring.value;
    renderRows();
});

dropdowns['sprint'] = document.getElementById('sprint');
dropdowns['sprint'].addEventListener('change', () => {
    console.log(sprint.value);
    gottenRequirements["sprint"] = sprint.value;
    renderRows();
});

dropdowns['gain'] = document.getElementById('gain');
dropdowns['gain'].addEventListener('change', () => {
    console.log(gain.value);
    gottenRequirements["gain"] = gain.value;
    renderRows();
});

const searchField = document.getElementById('searchField');
const dropdown = document.getElementById('dropdown');

searchField.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    dropdown.innerHTML = '';
    if (query) {
        const filteredItems = items.filter(item => item.toLowerCase().includes(query));
        filteredItems.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('dropdown-item');
            div.textContent = item;
            div.addEventListener('click', function () {
                if (strike_list.includes(item)) {
                    gottenRequirements["strike"] = item;
                    dropdowns['strike'].value = item;
                }
                else if (flourish_list.includes(item)) {
                    gottenRequirements["flourish"] = item;
                    dropdowns['flourish'].value = item;
                }
                else if (ring_list.includes(item)) {
                    gottenRequirements["ring"] = item;
                    dropdowns['ring'].value = item;
                }
                else if (sprint_list.includes(item)) {
                    gottenRequirements["sprint"] = item;
                    dropdowns['sprint'].value = item;
                }
                else if (gain_list.includes(item)) {
                    gottenRequirements["gain"] = item;
                    dropdowns['gain'].value = item;
                }
                else if (gottenRequirements["others"].includes(item)) {
                    gottenRequirements["others"] = gottenRequirements["others"].filter(req => req !== item);
                }
                else {
                    gottenRequirements["others"].push(item);
                }

                searchField.value = "";
                dropdown.innerHTML = '';
                dropdown.style.display = 'none';
                renderRows();
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
});

document.addEventListener('click', function (e) {
    if (!e.target.closest('.autocomplete-container')) {
        dropdown.style.display = 'none';
    }
});

// Initial render
renderRows();