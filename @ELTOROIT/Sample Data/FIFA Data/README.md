# Load CRM Data

-   @ELTOROIT/Sample Data/FIFA Data/other/load.sh

## Loading PersonAccounts

-   Find Person Account RecordTypeId
-   `System.debug([SELECT Id FROM RecordType WHERE IsPersonType = TRUE AND SObjectType='Account' LIMIT 1]);`
-   Replace the RecordType Id from [0127e000002bd8JAAQ] to the one found in the org
-   `sf force data bulk upsert --serial --json --wait 60 --sobject Account --external-id ID --file "@ELTOROIT/Sample Data/FIFA Data/CSV/PersonAccounts.csv" `

## Loading Cases

-   `sf force data bulk upsert --serial --json --wait 60 --sobject Case --file "@ELTOROIT/Sample Data/FIFA Data/CSV/Cases.csv"`

# Excel Viewer

-   https://excelviewer.herokuapp.com/
