export default {
	myVar1: [],
	myVar2: {},
	myFun1 () {
		//	write code here
		//	this.myVar1 = [1,2,3]
	},


	async bookConsumption(drinkId, amount) {
		 storeValue("consumption_drink_id", drinkId);
		 storeValue("consumption_amount", amount);


		// Aktuellen Fridge-Bestand für dieses Getränk prüfen

		await getFridge.run();

		const fridgeItem = getFridge.data?.find(f => f.id === drinkId);
		const currentStock = fridgeItem?.stock ?? 0;

		if (amount > 0) {
			if (currentStock > 0) {
				subtractFridge.run();
			}
		} else if(amount < 0){
			addFridge.run();
		}

		await postConsumption.run();
		getMe.run();
		getMyConsumption.run();

		showAlert(
			amount > 0 ? `+${amount} gebucht ✓` : `${amount} korrigiert ✓`,
			"success"
		);
	},
}