import { LightningElement, wire } from "lwc";
import getExpirationDaysLeft from "@salesforce/apex/TrialExpirationController.getExpirationDaysLeft";

export default class TrialExpiration extends LightningElement {
	daysLeft;
	orgExpires = false;

	@wire(getExpirationDaysLeft)
	wired_getExpirationDaysLeft({ data, error }) {
		if (data) {
			this.orgExpires = data.orgExpires;
			if (data.orgExpires) {
				this.daysLeft = `This trial org will expire in ${data.daysLeft} days`;
			}
		} else if (error) {
			alert(JSON.stringify(error));
		}
	}
}
