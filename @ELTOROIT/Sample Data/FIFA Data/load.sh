./node_modules/sfdx-cli/bin/run ETCopyData delete --configfolder ./@ELTOROIT/data --loglevel trace --json
sf force data bulk upsert --serial --json --wait 60 --file "@ELTOROIT/Sample Data/FIFA Data/Accounts.csv"  --sobject Account --external-id Id
sf force data bulk upsert --serial --json --wait 60 --file "@ELTOROIT/Sample Data/FIFA Data/Cases.csv"  --sobject Case --external-id Id