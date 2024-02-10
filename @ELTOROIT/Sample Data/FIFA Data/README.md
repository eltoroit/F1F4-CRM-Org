# Loading PersonAccounts

-   Find Person Account RecordTypeId
-   `System.debug([SELECT Id FROM RecordType WHERE IsPersonType = TRUE AND SObjectType='Account' LIMIT 1]);`
-   Replace the RecordType Id from [0127e000002bd8JAAQ] to the one found in the org
-   `sf force data bulk upsert --file "@ELTOROIT/Sample Data/FIFA Data/CSV/PersonAccounts.csv" --sobject Account --external-id ID --wait 60 --serial`

# Loading Cases

-   `sf force data bulk upsert --file "@ELTOROIT/Sample Data/FIFA Data/CSV/Cases.csv" --sobject Case --external-id ID --wait 60 --serial`
