public with sharing class TrialExpirationController {
	@AuraEnabled(cacheable=true)
	public static Map<String, Object> getExpirationDaysLeft() {
		Map<String, Object> data = new Map<String, Object>();

		try {
			Organization org = [SELECT TrialExpirationDate FROM Organization];
			DateTime expDate = org.TrialExpirationDate;
			data.put('orgExpires', expDate != null);
			if (expDate != null) {
				data.put('daysLeft', Date.today().daysBetween(date.valueof(expDate)) - 1);
			}
		} catch (Exception e) {
			system.debug(e);
			throw new AuraHandledException('Unable to get org expiration date');
		}

		return data;
	}
}
