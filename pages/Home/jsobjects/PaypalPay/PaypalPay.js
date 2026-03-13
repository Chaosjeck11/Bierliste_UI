export default {
	myVar1: [],
	myVar2: {},
	myFun1 () {
		//	write code here
		//	this.myVar1 = [1,2,3]
	},
	async PayPaypal () {
		navigateTo("https://paypal.me/Chaosjeck11/" + getMe.data.open_amount, {}, "NEW_WINDOW");
		
		storeValue("cashbox_amount", getMe.data.open_amount);
		storeValue("cashbox_direction", "IN");
		storeValue("cashbox_reason", "PayPal-Zahlung");
		storeValue("cashbox_payment_type", "Paypal");
		storeValue("cashbox_user_id_paid", getMe.data.id);
		markAsPaid.run();	
		postCashboxTransaction.run();
		getDrinks.run();
		getMe.run();
		getFridge.run();
	
	}
}