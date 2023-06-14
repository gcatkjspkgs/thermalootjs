const randrange = (min, max) => Math.round((Math.random() * (max - min) + min) * 100) / 100 // Get a random number and round it to 2nd decimals
const augmentfeatures = { // Thermal augment feature list
	"BaseMod": [0, 3],

	"RFMax": [.1, 4],
	"RFXfer": [3, 6],
	"FluidMax": [.1, 2],

	"Radius": [-2, 3.01],

	"CycProc": [],
	"SecNull": [],
	"XpStr": [],

	"PotionAmp": [-2, 2],
	"PotionDur": [-2, 3],

	"DynamoEnergy": [.1, 2],
	"DynamoThrottle": [],

	"MachineMin": [.01, .6],
	"MachinePri": [-.8, .8],
	"MachineSec": [-1.5, 2],
	"MachineCat": [.1, 1.5],
	"MachineEnergy": [.4, 2],
	"MachinePower": [.6, 3],
	"MachineSpeed": [-.5, 1],
	"MachineXp": [.01, .5]
}
const inverseLuck = [
	"MachineEnergy",
	"MachineCat"
]
const qualities = [ // Quality/tier names
	"terrible",
	"bad",
	"normal",
	"good",
	"amazing"
]
const computeNbt = item => { // Compute nbt
	let nbt = item.nbt // Get already existing nbt
	if (item.id!="thermaloot:variable_capacitor" || nbt==null) return // If the item is not the capacitor or the nbt is empty, skip
	if (!nbt.contains("generated") || nbt.getBoolean("generated")) return // If the capacitor was already generated, skip

	nbt.putBoolean("generated", true) // Set the capacitor as generated

	let augmentData = {Type: "Upgrade"} // AugmentData tag
	let totalluck = 0 // Total luck
	Object.keys(augmentfeatures).forEach(f => { // For each feature
		if (Math.round(randrange(0, 2))!=0) return // 33% chance of adding a feature

		let range = augmentfeatures[f]
		if (range.length) {
			augmentData[f] = randrange(range[0], range[1]) // Get a random number in the range
			if (!inverseLuck.includes(f)) totalluck += (augmentData[f]+Math.abs(range[0]))/(range[1]-range[0]) // Calculate and add to total luck
			else totalluck += (range[1]-augmentData[f])/(range[1]-range[0]) // Calculate the inverse luck if needed
		}
		else { // If the range is empty, set the value to 1
			augmentData[f] = 1
			totalluck++
		}
	})
	nbt.put("AugmentData", augmentData) // Set the augment data

	let luck = totalluck/(Object.keys(augmentData).length-1) // Calculate final luck by dividing total luck by potential luck
	if (luck>1) luck=1 // If it goes above 1 (it shouldn't), set it back to 1
	nbt.putFloat("Luck", luck) // Put the luck in nbt
	let quality = qualities[Math.round(Math.round(luck * 10)/2)-1] // Calculate the quality
	nbt.putString("Tier", quality) // Add it to nbt
	nbt.put("display", {Name:`{"text":"${Text.translate(`attribute.thermaloot.${quality}.${Math.round(randrange(0, quality!="normal" ? 13 : 0))}`, Text.translate("item.thermaloot.variable_capacitor").string).string}"}`}) // Add the name
}

// Call computeNbt when player opens a chest or their inventory changes
global.kjspkgCompatLayer.legacyOnEvent("player.chest.opened", event => {
	for (let i = 0; i < (global.kjspkgCompatLayer.versionId==9 ? event.inventory.containerSize : event.inventory.size); i++) 
		computeNbt(global.kjspkgCompatLayer.versionId==9 ? event.inventory.getItem(i) : event.inventory.get(i))
})
global.kjspkgCompatLayer.legacyOnEvent("player.inventory.changed", event => {
	for (let i = 0; i < (global.kjspkgCompatLayer.versionId==9 ? event.player.inventory.containerSize : event.player.inventory.size); i++) 
		computeNbt(global.kjspkgCompatLayer.versionId==9 ? event.player.inventory.getItem(i) : event.player.inventory.get(i))
})