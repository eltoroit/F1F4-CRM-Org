trigger tCase on Case(before insert, before update) {
	Set<Id> contactIds = new Set<Id>();
	Set<String> fandIds = new Set<String>();
	for (Case c : Trigger.new) {
		fandIds.add(c.FanId__c);
		contactIds.add(c.ContactId);
	}

	Map<Id, Contact> mapContactId = new Map<Id, Contact>();
	Map<String, Contact> mapContactFanId = new Map<String, Contact>();
	for (Contact c : [SELECT Id, FanId__c FROM Contact WHERE Id IN :contactIds OR FanId__c IN :fandIds]) {
		mapContactId.put(c.Id, c);
		mapContactFanId.put(c.FanId__c, c);
	}

	for (Case c : Trigger.new) {
		if (c.ContactId == null && c.FanId__c == null) {
			// Not much I can do, sorry!
		} else {
			if (c.ContactId == null && mapContactFanId.containsKey(c.FanId__c)) {
				c.ContactId = mapContactFanId.get(c.FanId__c).Id;
			}
			if (c.FanId__c == null && mapContactId.containsKey(c.ContactId)) {
				c.FanId__c = mapContactId.get(c.ContactId).FanId__c;
			}
		}
	}
}

/*
UPDATE [SELECT Id FROM Case];
*/
