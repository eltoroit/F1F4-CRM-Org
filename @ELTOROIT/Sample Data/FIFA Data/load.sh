# Create files using https://script.google.com/u/2/home/projects/1kvYOWAkutTlV3s62vAv54T5-8uKp5lniKZyb-24IUXd9aCCuCIqIV_Xj/edit
# ./node_modules/sfdx-cli/bin/run ETCopyData delete --configfolder ./@ELTOROIT/data --loglevel trace --json
echo "Did you delete the data in the org?"
echo "Press a key to continue"
read
sf force data bulk upsert --serial --json --wait 60 --file "@ELTOROIT/Sample Data/FIFA Data/PersonAccounts.csv"  --sobject Account --external-id Id
sf force data bulk upsert --serial --json --wait 60 --file "@ELTOROIT/Sample Data/FIFA Data/Cases.csv"  --sobject Case --external-id Id
echo "Remember to export it when it has been loaded"
# ./node_modules/sfdx-cli/bin/run ETCopyData export --configfolder ./@ELTOROIT/data --loglevel trace --json