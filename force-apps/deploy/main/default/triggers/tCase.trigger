trigger tCase on Case(before insert, before update) {
	Set<Id> contactIds = new Set<Id>();
	for (Case c : Trigger.new) {
		contactIds.add(c.ContactId);
	}

	Map<Id, Contact> contactMap = new Map<Id, Contact>();
	for (Contact c : [SELECT Id, FanId__c FROM Contact WHERE Id IN :contactIds]) {
		contactMap.put(c.Id, c);
	}

	for (Case c : Trigger.new) {
		if (contactMap.containsKey(c.ContactId)) {
			c.FanId__c = contactMap.get(c.ContactId).FanId__c;
		}
	}
}

/*
UPDATE [SELECT Id FROM Case];
*/
