export default {

	async confirmUserEdit() {
		const userId = appsmith.store.Bearbeit_User;

		// Passwort-Validierung wenn Toggle aktiv
		if (changePassword.isSwitchedOn) {
			if (!newPassword.text) {
				showAlert("Bitte Passwort eingeben", "warning");
				return;
			}
			if (newPassword.text !== newPasswordConfirm.text) {
				showAlert("Passwörter stimmen nicht überein", "error");
				return;
			}
		}

		// Primitive Werte einzeln speichern (kein Objekt — verhindert Doppel-Serialisierung)
		await storeValue("admin_selected_user_id", userId);
		await storeValue("admin_patch_username", userName.text);
		await storeValue("admin_patch_role", RoleSelect.selectedOptionValue);
		await storeValue("admin_patch_active", ActivitySelect.selectedOptionValue === "true");
		await storeValue("admin_patch_password", changePassword.isSwitchedOn ? newPassword.text : "");

		await patchUser.run(
			() => {
				getUsers.run();
				closeModal(UserData.name);
				showAlert("Gespeichert ✓", "success");
			},
			() => {
				showAlert("Fehler beim Speichern", "error");
			}
		);
	},

	async confirmPayment() {
		const userId = appsmith.store.Bearbeit_User;
		const user = getUsers.data.find(u => u.id === userId);
		const isKorrektur = SwtBezahltBearbeiten.isSwitchedOn || SwtOffenBearbeiten.isSwitchedOn;
		const amount = Number(Gezahlt.text);

		// Betrag nur validieren wenn es eine echte Zahlung ist
		if (!isKorrektur) {
			if (!amount || amount <= 0) {
				showAlert("Bitte gültigen Betrag eingeben", "warning");
				return;
			}
			if (amount > Number(user?.open_amount)) {
				showAlert("Betrag größer als offener Betrag!", "warning");
				return;
			}
		}

		// Pfad A: Manuelle Betragskorrektur (Toggle an)
		if (SwtBezahltBearbeiten.isSwitchedOn || SwtOffenBearbeiten.isSwitchedOn) {
			const oldPaid = Number(appsmith.store.old_paid_amount);
			const newPaid = Number(PaidAmount.value);

			await storeValue("selected_user_id", userId);
			await storeValue("patch_open_amount", Number(OffenerBetrag.value));
			await storeValue("patch_paid_amount", newPaid);
			await patchUserAmounts.run();

			// Cashbox-Korrektur nur wenn paid_amount sich geändert hat
			if (SwtBezahltBearbeiten.isSwitchedOn && newPaid !== oldPaid) {
				await storeValue("cashbox_amount", Math.abs(newPaid - oldPaid));
				await storeValue("cashbox_direction", "CORRECTION");
				await storeValue("cashbox_reason", "Manuelle Korrektur Bezahlter Betrag");
				await storeValue("cashbox_payment_type", "");
				await storeValue("cashbox_user_id_paid", userId);
				await postCashboxTransaction.run();
			}

			// Pfad B: Normale Zahlung (Toggle aus)
		} else {
			await storeValue("admin_selected_user_id", userId);
			await storeValue("admin_pay_amount", amount);
			await payUser.run();

			// Cashbox-Eingang buchen
			await storeValue("cashbox_amount", amount);
			await storeValue("cashbox_direction", "IN");
			await storeValue("cashbox_reason", "Manuelle Bezahlung");
			await storeValue("cashbox_payment_type", "Bar");
			await storeValue("cashbox_user_id_paid", userId);
			await postCashboxTransaction.run();
		}

		await getUsers.run();
		closeModal(ManuelBetrag.name);
		showAlert(`€${amount} gebucht ✓`, "success");
	}

}