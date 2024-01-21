/*
DOCS:
https://developers.google.com/apps-script/reference/drive/drive-app
https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
https://developers.google.com/apps-script/reference/spreadsheet/range
*/

const FOLDER_ID = "1WC6sX6Hws2EvToKHbLq2TXXlSOeBoTRj"; // https://drive.google.com/drive/u/2/folders/FOLDER_ID
const SHEET_ID = "1NVE3z33tqAeEA21G7fIvI30kBnlMugkqp55XDt6yRCE"; // https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=1761503630

const FILES = {
	original: `FIFA Data (With formulas)`,
	cleaned: `FIFA Data (Cleaned)`
};

function assert(bool, msg) {
	if (!bool) throw msg;
}

class ExportCSV {
	constructor() {
		console.log("Constructor");
	}

	execute() {
		console.log("execute()");
		let folder = DriveApp.getFolderById(FOLDER_ID);
		// // RECREATE
		// this._deleteCleanedSheet(folder);
		// let newFile = this._copyOriginal(folder);
		// REUSE
		let newFile = DriveApp.getFileById(SHEET_ID);
		let { spreadsheet, sheets } = this._getSpreadsheet(newFile);
		// this._removeFormulas(sheets);
		// this._clearColumns(spreadsheet);
		this._makeFilesCSV(folder, sheets);
		console.log("DONE");
	}

	_deleteCleanedSheet(folder) {
		console.log("_deleteCleanedSheet()");
		let trash = folder.getFoldersByName(`TRASH`);
		assert(trash.hasNext, "TRASH folder does not exist");
		trash = trash.next();

		let count = 0;
		let files = folder.getFilesByName(FILES.cleaned);
		while (files.hasNext()) {
			count++;
			files.next().moveTo(trash);
		}
		assert(count <= 1, "Too many files found");
	}

	_copyOriginal(folder) {
		console.log("_copyOriginal()");
		let files = folder.getFilesByName(FILES.original);
		assert(files.hasNext(), "Could not find original spreadsheet");
		let original = files.next();
		let newFile = original.makeCopy(FILES.cleaned);
		return newFile;
	}

	_getSpreadsheet(file) {
		console.log("_getSpreadsheet()");
		let spreadsheet = SpreadsheetApp.openById(file.getId());
		let sheets = spreadsheet.getSheets();
		assert(!(sheets === undefined || sheets.length === 0), "Spreadsheet could not be opened");
		return { spreadsheet, sheets };
	}

	// _removeFormulas(sheets) {
	//   console.log("_removeFormulas()");
	//   for (let sheetIdx in sheets) {
	//     let sheet = sheets[sheetIdx];
	//     var activeRange = sheet.getDataRange();
	//   }

	//   let sheetCount = sheets.length;
	//   for (let idxSheet = 0; idxSheet < sheetCount; idxSheet++) {
	//     let sheet = sheets[idxSheet];
	//     console.log(`Sheet: ${sheet.getName()}`);
	//     let range = sheet.getDataRange();
	//     range.copyTo(range, { contentsOnly: true });
	//   }
	// }

	_makeFilesCSV(rootFolder, sheets) {
		let folder = rootFolder.getFoldersByName("CSV").next();
		for (var s in sheets) {
			let content = this._convertRangeToCsvFile(sheets[s]);
			if (content) {
				folder.createFile(sheets[s].getName() + ".csv", content);
			}
		}
	}

	_convertRangeToCsvFile(sheet) {
		var csvFile = undefined;
		try {
			// get available data range in the spreadsheet
			var activeRange = sheet.getDataRange();

			// find the first black column
			let fistBlack = -1;
			let range = sheet.getDataRange();
			let maxColumns = range.getNumColumns();
			for (let idxCol = 1; idxCol <= maxColumns; idxCol++) {
				let cell = range.getCell(1, idxCol);
				let bgColor = cell.getBackground();
				if (bgColor === "#000000") {
					fistBlack = idxCol;
					break;
				}
			}
			console.log(`Sheet ${sheet.getName()}: ${fistBlack}/${maxColumns} columns`);

			if (fistBlack > 0) {
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
							csv += data[row].slice(0, fistBlack - 1).join(",") + "\r\n";
						} else {
							csv += data[row];
						}
					}
					csvFile = csv;
				}
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

/*


// _clearColumns(spreadsheet) {
//   let namedRanges = spreadsheet.getNamedRanges();
//   namedRanges.forEach(namedRange => namedRange.getRange().clear());
// }
*/
