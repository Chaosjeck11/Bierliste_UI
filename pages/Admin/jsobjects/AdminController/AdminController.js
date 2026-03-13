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

    // Betrag bestimmen: Toggle an = manueller paid_amount Wert, Toggle aus = Gezahlt-Input
    let amount;
    if (SwtBezahltBearbeiten.isSwitchedOn) {
      // Direkt paid_amount setzen — braucht eigene Route, daher als pay-Betrag die Differenz
      showAlert("Direkte paid_amount Bearbeitung noch nicht implementiert", "warning");
      return;
    } else if (SwtBezahltBearbeiten.isSwitchedOn) {
			
		} else {
      amount = Number(Gezahlt.text);
      if (!amount || amount <= 0) {
        showAlert("Bitte gültigen Betrag eingeben", "warning");
        return;
      }
      if (amount > Number(user?.open_amount)) {
        showAlert("Betrag größer als offener Betrag!", "warning");
        return;
      }
    }

    await storeValue("admin_selected_user_id", userId);
    await storeValue("admin_pay_amount", amount);

    await payUser.run(
      () => {
        getUsers.run();
        closeModal(ManuelBetrag.name);
        showAlert(`€${amount} gebucht ✓`, "success");
      },
      () => { showAlert("Fehler beim Buchen", "error"); }
    );
  }

}