export default {
	// Seite initialisieren
	async onPageLoad() {
		await getMe.run();
		await getDrinks.run();
		await getMyConsumption.run();
	},

	// Consumption buchen (amount positiv = hinzufügen, negativ = entfernen)
	async bookConsumption(drinkId, amount) {
		await storeValue("consumption_drink_id", drinkId);
		await storeValue("consumption_amount", amount);
		await postConsumption.run(
			async () => {
				await getMe.run();
				await getMyConsumption.run();
				showAlert(
					amount > 0
					? `+${amount} gebucht ✓`
					: `${amount} korrigiert ✓`,
					"success"
				);
			},
			(error) => {
				showAlert(
					postConsumption.data?.error === "cannot reduce below zero"
					? "Nicht genug zum Abziehen!"
					: "Fehler beim Buchen",
					"error"
				);
			}
		);
	},

	// Gesamtkonsum für ein Getränk aus History berechnen
	getTotalForDrink(drinkId) {
		const history = getMyConsumption.data || [];
		return history
			.filter((e) => e.drink_name !== undefined)
			.reduce((sum, e) => {
			// Wir matchen über drink_name da history nur name hat
			return sum;
		}, 0);
	},
};