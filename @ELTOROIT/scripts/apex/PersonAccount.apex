// System.debug([SELECT Id FROM PersonAccount]);
System.debug([SELECT COUNT() FROM Account]);
System.debug([SELECT COUNT() FROM Contact]);
Contact c = [SELECT Id, AccountId FROM Contact LIMIT 1];
System.debug([SELECT Id, AccountId, Account.Id, FanId__c FROM Contact WHERE Id = :c.Id]);
System.debug(
	[
		SELECT Id, FanId__pc
		FROM Account
		WHERE Id = :c.AccountId
	]
);
