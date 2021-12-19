//*Default Cell Properties
let defaultProperties = {
    "text": "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "font-size": "14px",
    "color": "#00000",
    "background-color": "#ffffff",
    "text-align": "left",
    "font-family": "Nato Sans"

}
//*Store Cell Data
let cellData = {
    "Sheet1": {}
};
let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastlyAddedSheet = 1;
$(document).ready(function () {
    //* Decide Row name for the current row
    function getRowName(n) {
        let ans = '';
        while (n > 0) {
            let rem = n % 26;
            if (rem == 0) {
                ans = 'Z' + ans;
                n = Math.floor(n / 26) - 1;
            } else {
                ans = String.fromCharCode(rem - 1 + 65) + ans;
                n = Math.floor(n / 26);
            }
        }
        return ans;
    }

    // let cellContainer = $('.input-shell-container');
    for (let i = 1; i <= 100; i++) {
        let code = getRowName(i);
        //*Append colm name
        let colm = $(` <div class="column-name colCod-${code}" id="colId-${i}">${code}</div>`);
        $(".colum-name-container").append(colm);
        //*Append Row Number
        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);
    }
    //*Append input shell
    for (let i = 1; i <= 100; i++) {
        let row = $(`<div div class="cell-row"></div>`);
        for (let j = 1; j <= 100; j++) {
            //*get Colcode
            let colCode = document.getElementById(`colId-${j}`).innerText;
            let colm = $(` <div class="input-cell" id="row-${i}-col-${j}" data="code-${colCode}" contenteditable="false"></div>`);
            row.append(colm);
        }
        $(".input-shell-container").append(row);
    }
    //*Allign icon selection
    // $(".allign-icon").click(function () {
    //     $(".allign-icon.selected").removeClass("selected");
    //     $(this).addClass("selected");
    // });
    //*Style icon selection
    $(".style-icon").click(function () {
        $(this).toggleClass("selected");
    });
    //*double click to edit
    $(".input-cell").dblclick(function () {
        $(".input-cell.selected").removeClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).addClass("selected");
        $(this).focus();
    });
    $(".input-cell").blur(function () {
        // console.log($(this).text());
        updateCell("text", $(this).text(), true);
    });
    //*Focus off not content editable
    $(".input-cell").focusout(function () {
        $(".input-cell.selected").attr("contenteditable", "false");
    });
    //*scroll to the selected cell
    $(".input-shell-container").scroll(function () {
        // console.log(this.scrollLeft);
        $(".colum-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    });
    //*Multiple cell selection
    $(".input-cell").click(function (event) {
        // console.log(event);
        if (event.altKey) {
            let [rowId, colId] = getRowAndColm(this);
            if (rowId > 1) {
                let topShellSelected = $(`#row-${rowId - 1}-col-${colId}`).hasClass("selected");
                // console.log(topShellSelected);
                if (topShellSelected) {
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected")
                }
            }
            if (rowId < 100) {
                let buttomShellSelected = $(`#row-${rowId + 1}-col-${colId}`).hasClass("selected")
                if (buttomShellSelected) {
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId + 1}-col-${colId}`).addClass("top-cell-selected");
                }
            }
            if (rowId > 1) {
                let leftShellSelected = $(`#row-${rowId}-col-${colId - 1}`).hasClass("selected")
                if (leftShellSelected) {
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId - 1}`).addClass("right-cell-selected");
                }
            }
            if (rowId < 100) {
                let rightShellSelected = $(`#row-${rowId}-col-${colId + 1}`).hasClass("selected")
                if (rightShellSelected) {
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId + 1}`).addClass("left-cell-selected");
                }
            }
        }
        else {
            $(".input-cell.selected").removeClass("selected");
            $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
            $(".input-cell.bottom-cell-selected").removeClass("bottom-cell-selected");
            $(".input-cell.right-cell-selected").removeClass("right-cell-selected");
            $(".input-cell.left-cell-selected").removeClass("left-cell-selected");

        }
        $(this).addClass("selected");

        changeHeader(this);

    });
});
//*Function Change Header
function changeHeader(ele) {
    let [rowId, colId] = getRowAndColm(ele);
    let cellInfo = defaultProperties;
    if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
        cellInfo = cellData[selectedSheet][rowId][colId];
    }
    // console.log(cellInfo);
    //*Change Header
    cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
    cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
    cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");
    let allinment = cellInfo["text-align"];
    $(".align-icon.selected").removeClass("selected");
    $(`.icon-align-${allinment}`).addClass("selected");
    $(".background-color-picker").val(cellInfo["background-color"]);
    $(".font-color-picker").val(cellInfo["color"]);
    $(".font-family-selector").val(cellInfo["font-family"]);
    $(".font-family-selector").css("font-family", cellInfo["font-family"]);
    $(".font-size-selector").val(cellInfo["font-size"]);
}
//*Get Row And Colm
function getRowAndColm(e) {
    // console.log($(e).attr("id"));
    let idArr = $(e).attr("id").split("-");
    let rowId = parseInt(idArr[1]);
    let colId = parseInt(idArr[3]);
    return [rowId, colId];
}

//*icon bold click
$(".icon-bold").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-weight", "normal", true);
    } else {
        updateCell("font-weight", "bold", false);
    }
});
//*icon italic click            
$(".icon-italic").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-style", "normal", true);
    } else {
        updateCell("font-style", "italic", false);
    }
});
//*icon underline click
$(".icon-underline").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-decoration", "none", true);
    } else {
        updateCell("text-decoration", "underline", false);
    }
});
//*Functopn Update Cell
function updateCell(property, value, defaultPossible) {
    $(".input-cell.selected").each(function () {
        $(this).css(property, value);
        let [rowId, colId] = getRowAndColm(this);
        if (cellData[selectedSheet][rowId]) {
            if (cellData[selectedSheet][rowId][colId]) {

                cellData[selectedSheet][rowId][colId][property] = value;
            } else {
                cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
                cellData[selectedSheet][rowId][colId][property] = value;
            }
        } else {
            cellData[selectedSheet][rowId] = {};
            cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
            cellData[selectedSheet][rowId][colId][property] = value;
        }
        if (defaultPossible && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties))) {
            delete cellData[selectedSheet][rowId][colId];
            if (Object.keys(cellData[selectedSheet][rowId]).length === 0) {
                delete cellData[selectedSheet][rowId];
            }
        }
        // console.log(cellData[selectedSheet][rowId][colId]);
    });

}
//*Text Allign Left
$(".icon-align-left").click(function () {
    if (!$(this).hasClass("selected")) {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
        updateCell("text-align", "left", true);
    }
}
);
//*Text Allign Center
$(".icon-align-center").click(function () {
    // console.log("center");
    if (!$(this).hasClass("selected")) {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
        updateCell("text-align", "center", false);
    }
}
);
//*Text Allign Right
$(".icon-align-right").click(function () {
    // console.log("right");
    if (!$(this).hasClass("selected")) {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
        updateCell("text-align", "right", false);
    }
});
//*working with colur picker
$(".color-fill-icon").click(function () {
    $(".background-color-picker").click();
});
$(".color-fill-text").click(function () {
    $(".text-color-picker").click();
});
//*Update Color Cell
$(".background-color-picker").change(function () {
    updateCell("background-color", $(this).val(), true);
});
$(".text-color-picker").change(function () {
    updateCell("color", $(this).val(), true);
});
$(".font-family-selector").change(function () {
    updateCell("font-family", $(this).val(), true);
    $(".font-family-selector").css("font-family", $(this).val());
});
$(".font-size-selector").change(function () {
    updateCell("font-size", $(this).val(), true);
});
//*Sheets FUnction
function emptySheet() {
    let shetInfo = cellData[selectedSheet];
    for (let i of Object.keys(shetInfo)) {
        for (let j of Object.keys(shetInfo[i])) {
            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("background-color", "");
            $(`#row-${i}-col-${j}`).css("color", "");
            $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
            $(`#row-${i}-col-${j}`).css("font-size", "");
            $(`#row-${i}-col-${j}`).css("font-weight", "");
            $(`#row-${i}-col-${j}`).css("text-decoration", "");
            $(`#row-${i}-col-${j}`).css("text-align", "");
            $(`#row-${i}-col-${j}`).css("font-style", "");

        }
    }
};
function loadSheet() {
    let shetInfo = cellData[selectedSheet];
    for (let i of Object.keys(shetInfo)) {
        for (let j of Object.keys(shetInfo[i])) {
            let cellInfo = shetInfo[i][j];
            // console.log(cellInfo);
            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css("background-color", cellInfo["background-color"]);
            $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);
            $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("text-decoration", cellInfo["text-decoration"]);
            $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);

        }
    }
}
//*For Add new Sheet
$(".icon-add").click(function () {
    emptySheet();
    $(".sheet-tab.selected").removeClass("selected");
    $(".sheet-tab.selected").removeClass("selected");
    let sheetName = "Sheet" + (lastlyAddedSheet + 1)
    cellData[sheetName] = {};
    totalSheets += 1;
    lastlyAddedSheet += 1;
    selectedSheet = sheetName;
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`);
    addEventsOnSheet();
});
$(".container").click(function () {
    $(".sheet-option-model").remove();
});
addEventsOnSheet();
//*For Change Between sheet
function selectSheet(ele) {
    emptySheet();
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    // console.log(selectedSheet);
    selectedSheet = $(ele).text();
    // console.log(selectedSheet);
    loadSheet();
}
//*Add Events On Sheet
function addEventsOnSheet() {
    $(".sheet-tab.selected").click(function () {
        if (!($(this).hasClass("selected"))) {
            $(".sheet-tab.selected").removeClass("selected");
            selectSheet(this);
        }
    });

    $(".sheet-tab.selected").contextmenu(function (e) {
        e.preventDefault();
        selectSheet(this);
        if ($(".sheet-option-model").length == 0) {
            $(".container").append(`<div class="sheet-option-model">
        <div class="sheet-rename">Rename</div>
        <div class="sheet-delete">Delete</div>
    </div>`);
            $(".sheet-rename").click(function () {
                $(".container").append(`<div class="sheet-rename-model">
                <h4 class="model-title">Rename Sheets To:</h4>
                <input type="text" name="" id="" class="new-sheet-name" placeholder="Sheet Name">
                <div class="action-button">
                    <div class="submit-button">Rename</div>
                    <div class="cancel-button">Cancel</div>
                </div>
            </div>`);
                $(".cancel-button").click(function () {
                    $(".sheet-rename-model").remove();
                });
                $(".submit-button").click(function () {
                    let newName = $(".new-sheet-name").val();
                    // console.log(newName);
                    let newCellData = {};
                    for (let key in cellData) {
                        // console.log(key);
                        if (key != selectedSheet) {
                            newCellData[key] = cellData[key];
                        } else {
                            newCellData[newName] = cellData[selectedSheet]
                        }
                    }
                    $(".sheet-tab.selected").text(newName)
                    cellData = newCellData
                    selectedSheet = newName;
                    $(".sheet-rename-model").remove();
                    console.log(cellData);
                });

            });
            $(".sheet-delete").click(function () {
                if (Object.keys(cellData).length > 1) {
                    let curSheet = selectedSheet;
                    let curSheetUi = $(".sheet-tab.selected");
                    let currSheetIndex = Object.keys(cellData).indexOf(selectedSheet);
                    console.log(currSheetIndex);
                    if (currSheetIndex == 0) {
                        // selectSheet = Object.keys(cellData)[selectSheet + 1];
                        $(".sheet-tab.selected").next().click();
                    } else {
                        // selectSheet = Object.keys(cellData)[selectSheet - 1];
                        $(".sheet-tab.selected").prev().click();
                    }
                    console.log(curSheetUi);
                    curSheetUi.remove();
                    delete cellData[curSheet];
                    // console.log(cellData);

                } else {
                    alert("Sorry We Can't Delete The Sheet And You Have Only One Sheet");
                }
            });

        }
        $(".sheet-option-model").css("left", e.pageX + "px");
    });
}
let SelectedShells = [];
let cut = false;
$(".icon-copy").click(function () {
    copy()
});
$(".icon-paste").click(function () {
    // console.log($(".input-cell.selected")[0]);
    paste()

})
$(".icon-cut").click(function () {
    copy()
    cut = true;
})
function copy() {
    SelectedShells = []
    $(".input-cell.selected").each(function () {
        SelectedShells.push(getRowAndColm(this))
    })
}
//*Copy Function
function paste() {
    if (SelectedShells.length == 0)
        return
    emptySheet();
    let [rowId, colId] = getRowAndColm($(".input-cell.selected")[0])
    let rowDisTance = rowId - SelectedShells[0][0];
    let colDistance = colId - SelectedShells[0][1];
    for (let cell of SelectedShells) {
        let newRowId = cell[0] + rowDisTance;
        let newColId = cell[1] + colDistance;
        // console.log(cellData);
        if (!cellData[selectedSheet][newRowId])
            cellData[selectedSheet][newRowId] = {}
        cellData[selectedSheet][newRowId][newColId] = { ...cellData[selectedSheet][cell[0]][cell[1]] }
        if (cut) {
            delete cellData[selectedSheet][cell[0]][cell[1]]
            if (Object.keys(cellData[selectedSheet][cell[0]]).length === 0)
                delete cellData[selectedSheet][cell[0]]
        }
    }
    loadSheet();

    if (cut) {
        cut = false;
        SelectedShells = []
    }
    console.log(cellData);
}
