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
		await patchFridge.run(
			() => { this.refresh(); showAlert('+1 gebucht ✓', 'success'); },
			() => { showAlert('Fehler', 'error'); }
		);
		await getFridge.run();
	},

	async subtractOne() {
		await storeValue('fridge_drink_id', drpGetraenk.selectedOptionValue);
		await storeValue('fridge_mode', 'subtract');
		await storeValue('fridge_amount', 1);
		await storeValue('fridge_stock', 0);
		await patchFridge.run(
			() => { this.refresh(); showAlert('-1 gebucht ✓', 'success'); },
			() => { showAlert('Fehler', 'error'); }
		);
		await getFridge.run();
	},

	async addKasten(mode) {
		const kastenAmount = Number(drpKasten.selectedOptionValue);
		if (!kastenAmount) { showAlert('Bitte Kastenart wählen', 'warning'); return; }
		await storeValue('fridge_drink_id', drpGetraenk.selectedOptionValue);
		await storeValue('fridge_mode', mode);
		await storeValue('fridge_amount', kastenAmount);
		await storeValue('fridge_stock', 0);
		await patchFridge.run(
			() => { this.refresh(); showAlert((mode === 'add' ? '+' : '-') + kastenAmount + ' Flaschen ✓', 'success'); },
			() => { showAlert('Fehler', 'error'); }
		);
		await getFridge.run();
	},

	async setManuel() {
		const val = Number(inpManuel.text);
		if (Number.isNaN(val) || val < 0) { showAlert('Ungültige Menge', 'warning'); return; }
		await storeValue('fridge_drink_id', drpGetraenk.selectedOptionValue);
		await storeValue('fridge_mode', 'set');
		await storeValue('fridge_amount', 0);
		await storeValue('fridge_stock', val);
		await patchFridge.run(
			() => { this.refresh(); showAlert('Bestand gesetzt ✓', 'success'); },
			() => { showAlert('Fehler', 'error'); }
		);
		await getFridge.run();
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
      getDrinks.run();
			getFridge.run();
      closeModal('Modal1');
      showAlert('Getränk angelegt ✓', 'success');
    },
    () => { showAlert('Getränk existiert bereits', 'error'); }
  );
},

}
