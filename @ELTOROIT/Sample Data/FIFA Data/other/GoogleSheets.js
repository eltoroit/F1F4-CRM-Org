/*
DOCS:
https://developers.google.com/apps-script/reference/drive/drive-app
https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
https://developers.google.com/apps-script/reference/spreadsheet/range

Steps To Create Project
- Open incognito window
- Login to JS4IoT account
- Navigate to https://script.google.com/home
- Click "+ New Project"
- Rename file from "Code.gs" to "Exporter.gs"
- Paste this code
- Rename Project to "F1F4 Export Data"

Steps to Execute Code
- Open incognito window
- Login to JS4IoT account
- Navigate to https://script.google.com/home
- Click "My Projects"
- Click "F1F4 Export Data"
- Open "Exporter.gs"
- Select "main" method to execute that
- Click Run

Application can be debugged as well!

Authorization Required?
- Click Review Permissions
- Select JS4IoT account
- Click "Advanced"
- Click "Go to F1F4 Export Data (unsafe)"
- Click "Allow"
*/

// https://drive.google.com/drive/u/2/folders/FOLDER_ID
// https://drive.google.com/drive/u/2/folders/1WC6sX6Hws2EvToKHbLq2TXXlSOeBoTRj > My Drive > Data Cloud
const FOLDER_ID = "1WC6sX6Hws2EvToKHbLq2TXXlSOeBoTRj";

// https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0
// https://docs.google.com/spreadsheets/d/1IAasWmqEhY1JuWFc9FpMLFU4QOTl3kF2T-ZYE1y_5EQ/edit#gid=0 > FIFA Data (With formulas)
const SHEET_ID = "1IAasWmqEhY1JuWFc9FpMLFU4QOTl3kF2T-ZYE1y_5EQ";

const FILES = {
	original: `FIFA Data (With formulas)`,
	cleaned: `FIFA Data (Cleaned)`,
	TEMP_SHEET: "TEMP Data"
};

function assert(bool, msg) {
	if (!bool) {
		debugger;
		throw msg;
	}
}

class ExportCSV {
	constructor() {
		console.log("Constructor");
	}

	execute() {
		console.log("execute()");
		let sourceFolder = DriveApp.getFolderById(FOLDER_ID);
		let folderName = new Date().toJSON();
		let newFolder = sourceFolder.createFolder(folderName);
		let newFile = this._copyOriginal(sourceFolder, newFolder);
		let { spreadsheet, sheets } = this._getSpreadsheet(newFile);
		this._removeFormulas(spreadsheet, sheets);
		sheets = this._clearSpreadsheet(spreadsheet, sheets);
		this._makeFilesCSV(newFolder, sheets);
		console.log(`Files created in folder: ${folderName}`);
		console.log("DONE");
	}

	_copyOriginal(sourceFolder, newFolder) {
		console.log("_copyOriginal()");
		let files = sourceFolder.getFilesByName(FILES.original);
		assert(files.hasNext(), "Could not find original spreadsheet");
		let original = files.next();
		let newFile = original.makeCopy(FILES.cleaned);
		newFile.moveTo(newFolder);
		return newFile;
	}

	_getSpreadsheet(newFile) {
		console.log("_getSpreadsheet()");
		let spreadsheet = SpreadsheetApp.openById(newFile.getId());
		let sheets = spreadsheet.getSheets();
		assert(!(sheets === undefined || sheets.length === 0), "Spreadsheet could not be opened");
		return { spreadsheet, sheets };
	}

	_removeFormulas(spreadsheet, sheets) {
		console.log("_removeFormulas()");
		for (let sheet of sheets) {
			console.log(`Remove formulas | Sheet: ${sheet.getName()}`);
			var activeRange = sheet.getDataRange();
			activeRange.copyTo(activeRange, { contentsOnly: true });
		}
		SpreadsheetApp.flush();
	}

	_clearSpreadsheet(spreadsheet, sheets) {
		console.log("_clearSpreadsheet()");

		// Remove TEMP sheet
		console.log("Removing TEMP sheet");
		let sheet = spreadsheet.getSheetByName(FILES.TEMP_SHEET);
		spreadsheet.deleteSheet(sheet);

		// Process remaining sheets
		sheets = SpreadsheetApp.openById(spreadsheet.getId()).getSheets();
		for (let sheet of sheets) {
			let fistBlack = -1;
			var activeRange = sheet.getDataRange();
			let maxColumns = activeRange.getNumColumns();
			for (let idxCol = 1; idxCol <= maxColumns; idxCol++) {
				let cell = activeRange.getCell(1, idxCol);
				let bgColor = cell.getBackground();
				if (bgColor === "#000000") {
					fistBlack = idxCol;
					break;
				}
			}

			assert(fistBlack > 0, `Sheet: ${sheet.getName()} does not have a black column`);
			if (fistBlack > 0) {
				let coords = {
					Row: 1,
					Col: fistBlack,
					NumRows: activeRange.getNumRows(),
					NumCols: maxColumns - fistBlack + 1
				};

				// Clear Columns
				let rangeToclear = sheet.getRange(coords.Row, coords.Col, coords.NumRows, coords.NumCols);
				console.log(`Clear columns | Sheet: ${sheet.getName()} | ${rangeToclear.getA1Notation()}`);
				sheet.deleteColumns(fistBlack, coords.NumCols);

				// Clear background colors
				rangeToclear = sheet.getRange(coords.Row, 1, coords.NumRows, fistBlack - 1);
				rangeToclear.setBackground(null);
			}
		}

		return sheets;
	}

	// CSV
	_makeFilesCSV(newFolder, sheets) {
		for (var sheet of sheets) {
			if (sheet.getName() !== FILES.TEMP_SHEET) {
				newFolder.createFile(sheet.getName() + ".csv", this._convertRangeToCsvFile(sheet));
			}
		}
	}

	_convertRangeToCsvFile(sheet) {
		var csvFile = undefined;
		try {
			// get available data range in the spreadsheet
			var activeRange = sheet.getDataRange();
			console.log(`Export To CSV | Sheet ${sheet.getName()}`);
			var data = activeRange.getValues();

			// loop through the data in the range and build a string with the csv data
			if (data.length > 1) {
				var csv = "";
				for (var row = 0; row < data.length; row++) {
					// Replace fields with commas
					for (var col = 0; col < data[row].length; col++) {
						if (data[row][col].toString().indexOf(",") != -1) {
							data[row][col] = '"' + data[row][col] + '"';
						}
					}

					// Join each row's columns
					if (row < data.length - 1) {
						// Add a carriage return to end of each row, except for the last one
						csv += data[row].join(",") + "\r\n";
					} else {
						csv += data[row];
					}
				}
				csvFile = csv;
			}
		} catch (err) {
			Logger.log(err);
			Browser.msgBox(err);
		}
		return csvFile;
	}
}

function main() {
	let main = new ExportCSV();
	main.execute();
}
