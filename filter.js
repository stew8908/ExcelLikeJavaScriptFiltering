$(document).ready(function() {

    $(".grid thead td").click(function() {
        showFilterOption(this);
    });
    $("#filterInput").keypress(function(e){
        if(e.keyCode == 13)
          search(true);
      });
  
      function search(force) {
        var existingString = $("#filterInput").val()
        if(!force && existingString.length < 3) return;
        window.location = "{% url 'message_list' %}?filter=" + existingString
      }

});
document.getElementById("filterInput").focus(); 
var elementList = [];
var globalListofUncheckedItems = [];

function filterValues() {
    // initialize
    elementList.forEach((ele) => {
        $(ele).show();
    })

    globalListofUncheckedItems.forEach((element, index) => {
        elementList.forEach((ele) => {
            element.forEach((element) => {
                if ($(ele).children()[index].innerHTML == element) {
                    $(ele).hide();
                }
            })
        })
    })
}

function showFilterOption(tdObject) {
    var listOfGridItemsDisplayed = [];
    var listOfUserUncheckedItems = [];
    listOfUserUncheckedItems.push("test")

    if (globalListofUncheckedItems[$(tdObject).attr('index')]) {
        listOfUserUncheckedItems = globalListofUncheckedItems[$(tdObject).attr('index')];
        console.log('empty')
    }
    var filterGrid = $(tdObject).find(".filter");

    if (filterGrid.is(":visible")) {
        filterGrid.hide();
        return;
    }

    $(".filter").hide();

    filterGrid.empty();
    var allSelected = true;
    filterGrid.append('<div><input id="all" type="checkbox" checked>Select All</div>');

    var $rows = $(tdObject).parents("table").find("tbody tr");


    $rows.each(function(ind, ele) {
        var currentTd = $(ele).children()[$(tdObject).attr("index")];

        var eleVisible = false;
        if ($(ele).is(":hidden")) {
            allSelected = false;
        } else {
            eleVisible = true
        }


        var gridItemExists = false;
        for (item of listOfGridItemsDisplayed) {
            console.log('the item is' + item)
            if (item == currentTd.innerHTML) {
                gridItemExists = true;
            }
        }

        // let data = {
        //   name: currentTd.innerHTML,
        //   checked: true
        // }
        var itemUnchecked = false;
        for (item of listOfUserUncheckedItems) {
            if (item == currentTd.innerHTML) {
                itemUnchecked = true;
                console.log('uncheckeditems')
            }

        }

        console.log('item is ' + gridItemExists)
        var displayGridItem = (!gridItemExists && (eleVisible || itemUnchecked))

        if (displayGridItem) {
            listOfGridItemsDisplayed.push(currentTd.innerHTML);
        }

        if (displayGridItem) {
            var div = document.createElement("div");
            div.classList.add("grid-item")

            var str = !itemUnchecked ? 'checked' : '';

            div.innerHTML = '<input type="checkbox" ' + str + ' >' + currentTd.innerHTML;
            div.id = currentTd.innerHTML


            filterGrid.append(div);
        }

        elementList.push(ele);
    });

    if (!allSelected) {
        filterGrid.find("#all").removeAttr("checked");
    }

    filterGrid.append('<div><input id="close" type="button" value="Close"/><input id="ok" type="button" value="Ok"/></div>');
    filterGrid.show();

    var $closeBtn = filterGrid.find("#close");
    var $okBtn = filterGrid.find("#ok");
    var $checkElems = filterGrid.find("input[type='checkbox']");
    var $gridItems = filterGrid.find(".grid-item");
    var $all = filterGrid.find("#all");

    $closeBtn.click(function() {
        filterGrid.hide();
        return false;
    });

    $okBtn.click(function() {
        emptylist = []
        listOfUserUncheckedItems = emptylist;
        filterGrid.find(".grid-item").each(function(ind, ele) {
            var inputId = $(ele).attr("id");
            var checked = $(ele).find("input").is(":checked");
            elementList.forEach(function(ele) {
                var currentTd = $(ele).children()[$(tdObject).attr("index")];
                if (currentTd.innerHTML == inputId) {
                    if (!checked) {
                        console.log('hide ' + currentTd.innerHTML)
                        if (listOfUserUncheckedItems.includes(currentTd.innerHTML) == false) {
                            listOfUserUncheckedItems.push(currentTd.innerHTML)
                        }
                    }
                }
            })
            globalListofUncheckedItems[$(tdObject).attr('index')] = listOfUserUncheckedItems;
            console.log(listOfUserUncheckedItems)
        });
        filterGrid.hide();
        filterValues();
        return false;
    });

    $checkElems.click(function(event) {
        console.log('checked ' + $(this).attr('id'));
        event.stopPropagation();

    });

    $gridItems.click(function(event) {
        var chk = $(this).find("input[type='checkbox']");
        $(chk).prop("checked", !$(chk).is(":checked"));
    });

    $all.change(function() {
        var chked = $(this).is(":checked");
        filterGrid.find(".grid-item [type='checkbox']").prop("checked", chked);
    })

    filterGrid.click(function(event) {
        event.stopPropagation();
    });

    return filterGrid;
}
