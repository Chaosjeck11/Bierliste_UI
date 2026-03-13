export default {

	// Hilfsfunktion: Fridge nach Aktion neu laden
	async refresh() {
		await getFridge.run();
	},

	// Single +1
	async addOne() {
		await storeValue('fridge_drink_id', drpGetraenk.selectedOptionValue);
		await storeValue('fridge_mode', 'add');
		await storeValue('fridge_amount', 1);
		await storeValue('fridge_stock', 0);
		await patchFridge.run();
		getFridge.run();
	},

	async subtractOne() {
		await storeValue('fridge_drink_id', drpGetraenk.selectedOptionValue);
		await storeValue('fridge_mode', 'subtract');
		await storeValue('fridge_amount', 1);
		await storeValue('fridge_stock', 0);
		await patchFridge.run();
		getFridge.run();
	},

	async addKasten(mode) {
		const kastenAmount = Number(drpKasten.selectedOptionValue);
		if (!kastenAmount) { showAlert('Bitte Kastenart wählen', 'warning'); return; }
		await storeValue('fridge_drink_id', drpGetraenk.selectedOptionValue);
		await storeValue('fridge_mode', mode);
		await storeValue('fridge_amount', kastenAmount);
		await storeValue('fridge_stock', 0);
		await patchFridge.run();
		getFridge.run();
	},

	async setManuel() {
		const val = Number(inpManuel.text);
		if (Number.isNaN(val) || val < 0) { showAlert('Ungültige Menge', 'warning'); return; }
		await storeValue('fridge_drink_id', drpGetraenk.selectedOptionValue);
		await storeValue('fridge_mode', 'set');
		await storeValue('fridge_amount', 0);
		await storeValue('fridge_stock', val);
		await patchFridge.run(
			() => { this.refresh()},
			() => { showAlert('Fehler', 'error'); }
		);
		getFridge.run();
	},

	// Neues Getränk anlegen
	async createDrink() {
		if (!inpNewDrinkName.text || !inpNewDrinkPrice.text) {
			showAlert('Name und Preis erforderlich', 'warning');
			return;
		}
		await storeValue('drink_name', inpNewDrinkName.text);
		await storeValue('drink_price', Number(inpNewDrinkPrice.text));
		await postDrink.run(
			() => {

				storeValue('upload_drink_id', postDrink.data.id);
				uploadDrinkImageCreate.run();
				getFridge.run();
				getDrinks.run();
				closeModal(Modal1.name);
				showAlert('Getränk angelegt ✓', 'success');
			},
			() => { showAlert('Getränk existiert bereits', 'error'); }
		);
	},

	updateDrink: async () => {
		await storeValue('edit_drink_id', drpGetraenk.selectedOptionValue);

		await patchDrink.run();

		// Bild hochladen, nur wenn eines ausgewählt wurde
		if (FilePicker_DrinkImageChange.files.length > 0) {
			await storeValue('upload_drink_id', drpGetraenk.selectedOptionValue);
			uploadDrinkImageChange.run();
			showAlert("klappt")
		}
		getDrinks.run();
		closeModal(ChangeDrinkData.name);
	},



}
