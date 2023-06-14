global.kjspkgCompatLayer.legacyOnEvent("chest.loot_tables", event => {
	const tables = { // Loot tables to add the capacitor to
		"buried_treasure": [0, 5],
		"desert_pyramid": [1, 4],
		"simple_dungeon": [1, 2],
		"end_city_treasure": [0, 5],
		"jungle_temple": [1, 2],
		"abandoned_mineshaft": [0 ,2],
		"ruined_portal": [0, 1],
		"shipwreck_treasure": [1, 1],
		"stronghold_corridor": [0, 3],
		"woodland_mansion": [2, 7]
	}
	if (global.kjspkgCompatLayer.versionId>=9) tables["ancient_city"] = [0, 5] // Add ancient_city if the version is or above 1.19

	Object.keys(tables).forEach(t => { // For each table id
		event.modify("minecraft:"+t, table => {
			table.addPool(pool => { // Add the item to the table
				pool.rolls = tables[t] // With a random amount of rolls
				pool.addItem(Item.of("thermaloot:variable_capacitor", {generated: false}))
			})
		})
	})
})