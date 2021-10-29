var defaultId;
var isStartgamevisible;
var isImportRemoveVisible;
var defaultStoryCount;
var activeRoomUserId;
var roomGuid;
var roomlistCount;
var isSearchStory;
var storyCloseIcon = false;
var roomCloseIcon = false;
var roomnameerror;
var roomplayerserror;
var roomtimererror;
var createroomcommon;
var deleteRoomId;
var deletedRoomName;
var roomFilter = "All";
var roomquickfilter = "myroom";
var fileTypeInImportStory = "excel";
var importFileType = "";
var createRoomDialogObj;
var dialogObj;
var deleteRoomDialogObj;
var importdialogObj;
var importedstorycount = 0; 

window.dashboard = function () {
    if (!targetId) {
        targetId = document.getElementById('spinner');
    }

    createRoomDialogObj = document.getElementById("createroomdialog").ej2_instances[0];
    createRoomDialogObj.hide();
    dialogObj = document.getElementById("confirmDialog").ej2_instances[0];
    dialogObj.hide();
    deleteRoomDialogObj = document.getElementById("deleteroomdialog").ej2_instances[0];
    deleteRoomDialogObj.hide();
    importdialogObj = document.getElementById("importdialog").ej2_instances[0];
    importdialogObj.hide();

    var startgamebutton = new ej.buttons.Button({ isPrimary: true });
    startgamebutton.appendTo('#startgamestorybutton');

    var roomdetailsDiv = document.getElementById('roomdetails');
    if (roomdetailsDiv) {
        var activeRoomId = roomdetailsDiv.querySelector('.active').getAttribute("data-roomId");
        if (activeRoomId) {
            getStoriesList(activeRoomId);
        }
    }

    document.getElementById('removestorybutton').onclick = function () {
        var storyIds = [];
        $.each($("input[name='storycheckbox']:checked"), function () {
            storyIds.push($(this).val());
        });
        var storycontent = "stories?";
        if (storyIds.length === 1) {
            storycontent = "story?";
        }
        dialogObj.setProperties({
            content: '<div class="confirmdialog-icon confirmdialog-warning" style="display: block;">!</div><h2 class="confirmdialog-title" id="confirmdialog-title">Are you sure?</h2><div id="confirmdialog-content" class="confirmdialog-content" style="display: block;">You want to remove <span class="confirmdialog-bold-content">' + storyIds.length + '</span> ' + storycontent + ' </div>'
        });
        $("#confirmDialog").removeClass("hide");
        dialogObj.show();
    };

    document.getElementById('myroom').onclick = function () {
        roomquickfilter = "myroom";
        var searchText = document.getElementById('searchrooms');
        if (searchText) {
            searchText.value = "";
        }
        var searchStoryText = document.getElementById('searchstory');
        if (searchStoryText) {
            searchStoryText.value = "";
        }

        var storyCloseInputKey = document.getElementById('storycloseiconid');
        storyCloseInputKey.style.display = "none";

        roomFilter = "All";
        GetQuickFilterRoomDetails();
    };

    document.getElementById('invitedroom').onclick = function () {
        roomquickfilter = "invitedroom";
        var searchText = document.getElementById('searchrooms');
        if (searchText) {
            searchText.value = "";
        }

        var searchStoryText = document.getElementById('searchstory');
        if (searchStoryText) {
            searchStoryText.value = "";
        }

        var storyCloseInputKey = document.getElementById('storycloseiconid');
        storyCloseInputKey.style.display = "none";

        roomFilter = "All";
        GetQuickFilterRoomDetails();
    };

    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            var val = $('#importdialog')[0].ej2_instances[0];
            if (val.visible === true) {
                var validateInputsValue = validateStoryInputs();
                if (validateInputsValue === false) {
                    var message = confirm(messages.datalostalertmessage);
                    if (message === true) {
                        importdialogObj.hide();
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    importdialogObj.hide();
                }
            }
        }
    });

    document.getElementById('createroombutton').onclick = function () {
        $('#createroombutton')[0].ej2_instances[0].disabled = true;
        ej.popups.showSpinner(targetId);
        var ajax = new ej.base.Ajax("createnewroom", "GET", true);
        ajax.send().then(function (data) {
            $('#form-element').html(data);
        });
        ajax.onSuccess = function (data) {
            createRoomDialogObj.setProperties({
                content: data
            });
            roomCreated();

            $('#errorcreateroom').css('display', 'none');
            roomnameerror = document.getElementById('errorroomname');
            roomplayerserror = document.getElementById('errorroomplayers');
            roomtimererror = document.getElementById('errorroomhourminute');
            createroomcommon = document.getElementById('roomnameinput');
            if (createroomcommon) {
                var roomhourminuteerror = document.getElementById('errorroomhourminute');
                var roomplayererror = document.getElementById('errorroomplayers');
                var errorcardtypeinput = document.getElementById('errorcardtype');
                var createroomcommonerror = document.getElementById('errorcreateroom');
                roomnameerror.style.display = "none";
                roomhourminuteerror.style.display = "none";
                roomplayererror.style.display = "none";
                errorcardtypeinput.style.display = "none";
                createroomcommonerror.style.display = "none";
                createroomcommon.autocomplete = "off";
                var roomhourminute;
                var roomhourminuteElem = document.getElementById('roomhourminuteinput');
                if (roomhourminuteElem.value !== null || roomhourminuteElem.value !== "") {
                    roomhourminute = roomhourminuteElem.value;
                }
                var roomdescription = document.getElementById('roomdescriptioninput');
                var roomplayer = document.getElementById('roomplayersinput');
                $('#createroomheader').css('display', 'block');
                createroomcommon.value = "";
                roomhourminute = "00";
                roomdescription.value = "";
                roomplayer.value = "";
                $("#createroomdialog").removeClass("hide");
                createRoomDialogObj.show();

                $('#createroomdialog .e-footer-content .e-primary')[0].ej2_instances[0].disabled = false;
                ej.popups.hideSpinner(targetId);

                var roomnameinputkey = document.getElementById('roomnameinput');
                roomnameinputkey.onkeyup = function (e) {
                    var roomnameinputtext = roomnameinputkey.value.trim();
                    if (roomnameinputtext.length > 50) {
                        roomnameerror.innerHTML = messages.roomNameLengthMessage;
                    } else if (roomnameinputtext.length === 0) {
                        roomnameerror.innerHTML = messages.errorValidationForRequiredField;
                    } else {
                        roomnameerror.innerHTML = "";
                    }
                    roomnameerror.style.display = "block";
                };

                var roomtimerinputkey = document.getElementById('roomhourminuteinput');
                roomtimerinputkey.onkeyup = function (e) {
                    var roomtimerinputtext = roomtimerinputkey.value;
                    if (parseInt(roomtimerinputtext, 10) > 59) {
                        roomtimererror.innerHTML = messages.roomTimerMessage;
                    } else {
                        roomtimererror.innerHTML = "";
                    }
                    roomtimererror.style.display = "block";
                };

                var roomplayersinputkey = document.getElementById('roomplayersinput');
                $("#roomplayersinput").on('keyup contextmenu input', function (event) {
                    var roomplayersinputtext = roomplayersinputkey.value;
                    var emailIds = roomplayersinputtext.split(',');
                    var isCurrentUserPlayer = false;
                    var findfilter;
                    for (var k = 0; k < emailIds.length; k++) {
                        findfilter =
                            emailIds[k].trim().toLowerCase().indexOf(userInfo.EmailId.toLowerCase());
                        if (findfilter > -1) {
                            isCurrentUserPlayer = true;
                        }
                    }

                    var playerIds = [];
                    for (var i = 0; i < emailIds.length; i++) {
                        if (emailIds[i].trim() !== "") {
                            playerIds[i] = emailIds[i];
                        }
                    }
                    var isduplicate = false;
                    playerIds.forEach(function (element, index) {
                        if (playerIds.indexOf(element, index + 1) > -1) {
                            isduplicate = true;
                        }

                        if (isCurrentUserPlayer) {
                            roomplayerserror.innerHTML = messages.ownerEmailErrorMessage;
                        } else if (isduplicate) {
                            roomplayerserror.innerHTML = messages.duplicateEmailIds;
                        } else {
                            roomplayerserror.innerHTML = "";
                        }
                    });
                    roomplayerserror.style.display = "block";
                });
            } else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
                window.location.reload();
            }
        };
    }

    var resizeTimer;
    $(window).resize(function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            ResizeView();
        }, 200);
    });

    ResizeView();
    var windowWidth = $(window).width();
    if (windowWidth < 961) {
        $("#targetId").css("display", "block");
        $("#appHeaderInner").css("display", "flex");
        $("#userProfile").css("display", "flex");
    }

    $("#createroombutton").css("display", "block");
};

function cancelRoomClick() {
    createRoomDialogObj.hide();
    $('#createroombutton')[0].ej2_instances[0].disabled = false;
}

function createRoomClick() {
    $('#createroomdialog .e-footer-content .e-primary')[0].ej2_instances[0].disabled = true;
    var createRoomTexts = document.getElementById('createroomdialog');
    var createRoomDialogValue = createRoomTexts.style.zIndex;

    var loaderIndexValue = $($("#createroomdialog").parent()).find(".e-dlg-overlay").css("z-index");
    $(".e-spinner-pane").css("z-index", (parseInt(loaderIndexValue, 10) + 1).toString());
    ej.popups.showSpinner(targetId);

    var roomnameinput = document.getElementById('roomnameinput');
    var roomdescriptioninput = document.getElementById('roomdescriptioninput');
    var roomhourminuteinput = document.getElementById('roomhourminuteinput');
    var roomplayersinput = document.getElementById('roomplayersinput');
    var ele = document.getElementsByName("cardtype");
    var cardtype;
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            cardtype = ele[i].id.split("_")[1];
            break;
        }
    }

    var minutes;
    if (roomhourminuteinput.value !== null || roomhourminuteinput.value !== "") {
        minutes = roomhourminuteinput.value;
    }
    if (roomnameinput) {
        if (roomnameinput.value !== "" &&
            cardtype !== 0 &&
            roomnameerror.innerHTML === "" &&
            roomplayerserror.innerHTML === "" &&
            roomtimererror.innerHTML === "") {
            $.ajax({
                complete: function () {
                    ej.popups.hideSpinner(targetId);
                },
                data: {
                    'roomName': roomnameinput.value,
                    'roomDescription': roomdescriptioninput.value,
                    'minutes': minutes,
                    'cardtype': cardtype,
                    'players': roomplayersinput.value
                },
                error: function (xmlhttprequest, textstatus, errormessage) {
                    if (textstatus === "timeout") {
                        toastError.content = messages.timeouterrorMessage;
                        toastObj.show(toastError);
                    }
                    else {
                        $('#errorcreateroom').text(messages.ajaxerrorMessage);
                    }
                    $('#errorcreateroom').css('display', 'block');
                    $("#createroomdialog").css("z-index", createRoomDialogValue);
                    $('#createroomdialog .e-footer-content .e-primary')[0].ej2_instances[0].disabled = false;
                },
                success: function (response) {
                    if (response.status === false) {
                        document.getElementById('errorcreateroom').innerHTML = response.errorMessage;
                        document.getElementById("errorcreateroom").style.display = "block";
                        $("#createroomdialog").css("z-index", createRoomDialogValue);

                        $('#createroomdialog .e-footer-content .e-primary')[0].ej2_instances[0].disabled = false;
                    } else if (response.status === true) {
                        document.getElementById("errorcreateroom").style.display = "none";
                        createRoomDialogObj.hide();
                        $("#createroomdialog").css("z-index", createRoomDialogValue);
                        $('#createroombutton')[0].ej2_instances[0].disabled = false;
                        toastSuccess.content = 'New Room ' + '<b>' + $.trim(roomnameinput.value) + '</b>' + ' has been created.';
                        toastObj.show(toastSuccess);
                        if (roomquickfilter === "myroom") {
                            GetQuickFilterRoomDetails();
                        } else {
                            document.getElementById('dashboardquickfilter-divs').querySelector('.active').classList.remove('active');
                            document.getElementById('myroomTab').classList.add('active');
                            roomquickfilter = "myroom";
                            GetQuickFilterRoomDetails();
                        }

                    }
                },
                type: 'POST',
                timeout: defaultValues.timeout,
                url: "addroomdetails",
            });
        } else {
            $('#createroomdialog .e-footer-content .e-primary')[0].ej2_instances[0].disabled = false;
            ej.popups.hideSpinner(targetId);
            $("#createroomdialog").css("z-index", createRoomDialogValue);
            if (roomnameinput.value === "") {
                roomnameerror.innerHTML = messages.errorValidationForRequiredField;
                roomnameerror.style.display = "block";
            }
            if (cardtype === 0) {
                var errorcardtypeinput = document.getElementById('errorcardtype');
                errorcardtypeinput.innerHTML = messages.errorValidationForRequiredField;
                errorcardtypeinput.style.display = "block";
            }
        }
    } else {
        $("#createroomdialog").css("z-index", createRoomDialogValue);
        toastError.content = messages.ajaxerrorMessage;
        toastObj.show(toastError);
        window.location.reload();
    }
}

function roomCreated() {
    var scripts = document.querySelectorAll("#targetId script");
    var length = scripts.length;
    for (var i = 0; i < length; i++) {
        if (scripts[i].id === "" && (scripts[i].text.indexOf("#radio_1") !== -1 || scripts[i].text.indexOf("#roomhourminuteinput") !== -1)) {
            eval(scripts[i].text);
        }
    }
}

function storyDeleteYesBtnClick() {
    dialogObj.hide();
    ej.popups.showSpinner(targetId);
    var storyIds = [];
    $.each($("input[name='storycheckbox']:checked"), function () {
        storyIds.push($(this).val());
    });

    $.ajax({
        cache: false,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        data: {
            'storyId': storyIds,
            'createdBy': activeRoomUserId,
            'roomId': defaultId
        },
        error: function (xmlhttprequest, textstatus, errormessage) {
            if (textstatus === "timeout") {
                toastError.content = messages.timeouterrorMessage;
                toastObj.show(toastError);
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
        success: function (response) {
            if (response.status === true) {
                if (storyIds.length === 1) {
                    toastSuccess.content = messages.removesingleStoryInDashbaordPage;
                    toastObj.show(toastSuccess);
                } else {
                    toastSuccess.content = messages.removeStoryInDashboardPage;
                    toastObj.show(toastSuccess);
                }
                var activestorycount = parseInt($(".dashboardcards.active").attr('data-storycount'), 10);
                defaultStoryCount = activestorycount - storyIds.length;
                var currentstorycount = (activestorycount - storyIds.length).toString();
                if (currentstorycount.length > 3) {
                    var newcurrentstorycount = currentstorycount.substring(0, 3) + "..";
                    $(".dashboardcards.active table .roomstorycount").attr('title', currentstorycount);
                    $(".dashboardcards.active table .roomstorycount").html(newcurrentstorycount);
                } else {
                    $(".dashboardcards.active table .roomstorycount").attr('title', currentstorycount);
                    $(".dashboardcards.active table .roomstorycount").html(currentstorycount);
                }
                $(".dashboardcards.active").attr('data-storycount', currentstorycount);
                searchstorydetails();
            }
            else if (response.errorMessage != null) {
                toastError.content = response.errorMessage;
                toastObj.show(toastError);
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
        timeout: defaultValues.timeout,
        type: 'POST',
        url: 'dashboard/removestory/',
    });
}

function storyDeleteNoBtnClick() {
    dialogObj.hide();
}

function dialogBeforeOpen() {
    $(document.getElementsByTagName('body')[0]).addClass('mainscroller-hide');
    $(document.getElementsByTagName('header')[0]).css("zIndex", "0");
    if (document.getElementById('leftPanel')) {
        $(document.getElementById('leftPanel')).css("zIndex", "0");
    }
    if (document.getElementById('hamburger')) {
        $(document.getElementById('hamburger')).css("zIndex", "0");
    }
    $("#importBtnDiv .e-split-btn-wrapper .e-split-btn").css("z-index", "0");
}

function dialogBeforeClose() {
    $(document.getElementsByTagName('body')[0]).removeClass('mainscroller-hide');
    $(document.getElementsByTagName('header')[0]).css("zIndex", "1000");
    if (document.getElementById('leftPanel')) {
        $(document.getElementById('leftPanel')).css("zIndex", "1000");
    }
    if (document.getElementById('hamburger')) {
        $(document.getElementById('hamburger')).css("zIndex", "10");
    }
    $("#importBtnDiv .e-split-btn-wrapper .e-split-btn").css("z-index", "1");
}

function getActiveFilter() {
    document.getElementById('searchFilters').querySelector('.glyphicon-ok').classList.add('test-icon');
    document.getElementById('searchFilters').querySelector('.glyphicon-ok').classList.remove('glyphicon');
    document.getElementById('searchFilters').querySelector('.glyphicon-ok').classList.remove('glyphicon-ok');
}

function allRoomsDetails() {
    getActiveFilter();
    document.getElementById("all-span").classList.add('glyphicon');
    document.getElementById("all-span").classList.add('glyphicon-ok');
    document.getElementById("all-span").classList.remove('test-icon');
    roomFilter = "All";
    GetFilterRoomDetails();
}

function completedRoomsDetails() {
    getActiveFilter();
    document.getElementById("completed-span").classList.add('glyphicon');
    document.getElementById("completed-span").classList.add('glyphicon-ok');
    document.getElementById("completed-span").classList.remove('test-icon');
    roomFilter = "Completed";
    GetFilterRoomDetails();
}

function pendingRoomsDetails() {
    getActiveFilter();
    document.getElementById("pending-span").classList.add('glyphicon');
    document.getElementById("pending-span").classList.add('glyphicon-ok');
    document.getElementById("pending-span").classList.remove('test-icon');
    roomFilter = "Pending";
    GetFilterRoomDetails();
}

function GetFilterRoomDetails() {
    var searchInputskey = document.getElementById('searchrooms');
    if (searchInputskey.value.trim() === "") {
        roomCloseIcon = true;
    }
    searchroomdetails();
}

function searchroomkeypress(k) {
    var searchInputsvalue = document.getElementById('searchrooms');
    if (searchInputsvalue.value.trim() !== "") {
        isSearchRoom = true;
    }

    if (k.which === 13) {
        if (searchInputsvalue.value.trim() !== "") {
            roomCloseIcon = false;
            searchroomdetails();
        }
    } else if (k.keyCode === 8 || k.keyCode === 46) {
        var searchTexts = document.getElementById('searchrooms');
        if (searchTexts.value.length === 0) {
            if (isSearchRoom) {
                roomCloseIcon = true;
                searchroomdetails();
                isSearchRoom = false;
            }
        }
    }
}

function closeRoomIconsClick() {
    var searchText = document.getElementById('searchrooms');
    searchText.value = "";
    roomCloseIcon = true;
    searchroomdetails();
}

function roomIconsClick() {
    var searchInputs = document.getElementById('searchrooms');
    if (searchInputs.value.trim() !== "") {
        roomCloseIcon = false;
        searchroomdetails();
    }
}

function GetQuickFilterRoomDetails() {
    ej.popups.showSpinner(targetId);
    var searchText = document.getElementById('searchrooms');
    var searchval = "";
    if (searchText) {
        searchval = searchText.value;
    }
    if (roomFilter !== "All" || searchval !== "") {
        GetFilterRoomDetails();
    } else {
        $.ajax({
            complete: function () {
                ej.popups.hideSpinner(targetId);
            },
            data: {
                'searchText': searchval, 'roomFilter': roomFilter, 'roomQuickFilter': roomquickfilter,
            },
            dataType: "html",
            success: function (data) {
                $('#roomsearchandfilterview').html(data);
                if (roomlistCount > 0) {
                    getStoriesList(defaultId);
                } else {
                    getStoriesList(0);
                }
                IsImportDisable();
            },
            error: function (xmlhttprequest, textstatus, errormessage) {
                if (textstatus === "timeout") {
                    toastError.content = messages.timeouterrorMessage;
                    toastObj.show(toastError);
                }
                else {
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
            },
            timeout: defaultValues.timeout,
            type: 'POST',
            url: "roomquickfilter",
        });
    }
}

function searchroomdetails() {
    var searchText = document.getElementById('searchrooms');
    var searchval = "";
    if (searchText) {
        searchval = searchText.value;
    }
    ej.popups.showSpinner(targetId);
    var closeInputKey = document.getElementById('closeiconid');
    if (roomCloseIcon) {
        closeInputKey.style.display = "none";
    }
    else {
        closeInputKey.style.display = "block";
    }
    $.ajax({
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        data: {
            'searchText': searchval, 'roomFilter': roomFilter, 'roomQuickFilter': roomquickfilter,
        },
        dataType: "html",
        success: function (data) {
            $('#roomdetails').html(data);
            storyCloseIcon = true;
            searchstorydetails();
        },
        error: function (xmlhttprequest, textstatus, errormessage) {
            if (textstatus === "timeout") {
                toastError.content = messages.timeouterrorMessage;
                toastObj.show(toastError);
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
        timeout: defaultValues.timeout,
        type: 'POST',
        url: "searchroomlist",
    });
}

function getStoriesList(roomId) {
    ej.popups.showSpinner(targetId);
    $.ajax({
        complete: function () {
            IsImportDisable();
            ej.popups.hideSpinner(targetId);
        },
        data: {
            'roomId': roomId,
        },
        dataType: "html",
        error: function (xmlhttprequest, textstatus, errormessage) {
            if (textstatus === "timeout") {
                toastError.content = messages.timeouterrorMessage;
                toastObj.show(toastError);
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
        success: function (data) {
            $('#importBtnDiv').css("margin-top", "0");
            $('#importBtnDiv .e-split-btn-wrapper').css("display", "table-cell");
            $('#storylistheaderBtns').append($('#importBtnDiv'));
            $('#importstorybutton').css("color", "#1f1f1f").css("background-color", "#e5e5e5");
            $("#importstorybutton_dropdownbtn").attr('style', 'background-color: #e5e5e5 !important; border-color: #e5e5e5 !important');
            $("#importstorybutton_dropdownbtn .e-btn-icon").css('color', 'rgba(0, 0, 0, 0.54)');

            $('#storyList').html(data);
            var activeRow = $(".dashboardcards.active");
            if (activeRow.length > 0) {
                var isImportTextShow = activeRow.data("isimportremovevisible");
                var storiesCount = activeRow.attr("data-storycount");
                if (isImportTextShow.toLowerCase() === "false" || parseInt(storiesCount, 10) > 0) {
                    $("#addStoryImage").attr("src", "https://cdn.syncfusion.com/planningpoker/images/general/NoStories.svg");
                    $("#emptyStoryMessage").text("No stories found.");
                }
                else {
                    $('#div-emptyMessageStoryPage').append($('#importBtnDiv'));
                    if (parseInt(storiesCount, 10) === 0) {
                        $('#importBtnDiv').css("margin-top", "16px");
                        if ((navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.documentMode === true)) {
                            $('#importBtnDiv .e-split-btn-wrapper').css("display", "inline");
                        }
                        else {
                            $('#importBtnDiv .e-split-btn-wrapper').css("display", "initial");
                        }
                    }
                    $('#importstorybutton').css("color", "#FFFFFF").css("background-color", "#E38721");
                    $("#importstorybutton_dropdownbtn").attr('style', 'background-color: #E38721 !important; border-color: #E38721 !important');
                    $("#importstorybutton_dropdownbtn .e-btn-icon").css('color', '#FFFFFF');
                }
            }
            else {
                $("#addStoryImage").attr("src", "https://cdn.syncfusion.com/planningpoker/images/general/NoStories.svg");
                $("#emptyStoryMessage").text("No stories found.");
            }
        },
        timeout: defaultValues.timeout,
        type: 'POST',
        url: "searchstorylist",
    });
}

function storiesDetails(id) { 
    if (!$(id).hasClass("active")) {
        var roomId = id.getAttribute("data-roomId");
        var roomguid = id.getAttribute("data-roomGuid");
        var activeUserId = id.getAttribute("data-activeUserId");
        var storycountnow = id.getAttribute("data-storyCount");
        var startgamevisible = id.getAttribute("data-isstartgamevisible");
        var importremovevisible = id.getAttribute("data-isimportremovevisible");
        document.getElementById('roomdetails').querySelector('.active').classList.remove('active');
        id.classList.add('active');
        defaultId = roomId;
        isStartgamevisible = startgamevisible;
        isImportRemoveVisible = importremovevisible;
        defaultStoryCount = storycountnow;
        activeRoomUserId = activeUserId;
        storyCloseIcon = true;
        searchstorydetails();
        roomGuid = roomguid;
    }
}

function searchstorydetails() {
    var searchText = document.getElementById('searchstory');
    var searchval = "";
    if (searchText) {
        searchval = searchText.value;
    }
    var storyCloseInputKey = document.getElementById('storycloseiconid');
    if (searchText.value.trim() != "") {
        storyCloseInputKey.style.display = "block";
    }
    else {
        storyCloseInputKey.style.display = "none";
    }
    ej.popups.showSpinner(targetId);
    $.ajax({
        complete: function () {
            IsImportDisable();
            ej.popups.hideSpinner(targetId);
        },
        data: {
            'roomId': defaultId,
            'searchText': searchval
        },
        dataType: "html",
        error: function (xmlhttprequest, textstatus, errormessage) {
            if (textstatus === "timeout") {
                toastError.content = messages.timeouterrorMessage;
                toastObj.show(toastError);
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
        success: function (data) {
            $('#importBtnDiv').css("margin-top", "0");
            $('#importBtnDiv .e-split-btn-wrapper').css("display", "table-cell");
            $('#storylistheaderBtns').append($('#importBtnDiv'));
            $('#importstorybutton').css("color", "#1f1f1f").css("background-color", "#e5e5e5");
            $("#importstorybutton_dropdownbtn").attr('style', 'background-color: #e5e5e5 !important; border-color: #e5e5e5 !important');
            $("#importstorybutton_dropdownbtn .e-btn-icon").css('color', 'rgba(0, 0, 0, 0.54)');

            $('#storyList').html(data);
            var activeRow = $(".dashboardcards.active");
            if (activeRow.length > 0) {
                var isImportTextShow = activeRow.data("isimportremovevisible");
                var storiesCount = activeRow.attr("data-storycount");
                if (isImportTextShow.toLowerCase() === "false" || parseInt(storiesCount, 10) > 0) {
                    $("#addStoryImage").attr("src", "https://cdn.syncfusion.com/planningpoker/images/general/NoStories.svg");
                    $("#emptyStoryMessage").text("No stories found.");
                }
                else {
                    $('#div-emptyMessageStoryPage').append($('#importBtnDiv'));
                    if (parseInt(storiesCount, 10) === 0) {
                        $('#importBtnDiv').css("margin-top", "16px");
                        if ((navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.documentMode === true)) {
                            $('#importBtnDiv .e-split-btn-wrapper').css("display", "inline");
                        }
                        else {
                            $('#importBtnDiv .e-split-btn-wrapper').css("display", "initial");
                        }
                    }
                    $('#importstorybutton').css("color", "#FFFFFF").css("background-color", "#E38721");
                    $("#importstorybutton_dropdownbtn").attr('style', 'background-color: #E38721 !important; border-color: #E38721 !important');
                    $("#importstorybutton_dropdownbtn .e-btn-icon").css('color', '#FFFFFF');
                }
            }
            else {
                $("#addStoryImage").attr("src", "https://cdn.syncfusion.com/planningpoker/images/general/NoStories.svg");
                $("#emptyStoryMessage").text("No stories found.");
            }
        },
        timeout: defaultValues.timeout,
        type: 'POST',
        url: "searchstorylist",
    });
}

function IsImportDisable() {
    if (roomquickfilter !== "myroom") {
        document.getElementById("importBtnDiv").style.visibility = "hidden";
        document.getElementById("removestorybutton").style.visibility = "hidden";
        document.getElementById("startgamestorybutton").style.visibility = "hidden";
        $('#removestorybutton')[0].ej2_instances[0].disabled = true;
        $(".story-dashboarddescription").css("padding-left", "0");
        $(".story-checkbox").css("display", "none");
    } else {
        if (isImportRemoveVisible === "True") {
            document.getElementById("importBtnDiv").style.visibility = "visible";
        } else {
            document.getElementById("importBtnDiv").style.visibility = "hidden";
        }

        if (defaultStoryCount > 0) {
            if (isImportRemoveVisible === "True") {
                document.getElementById("removestorybutton").style.visibility = "visible";
                $('#removestorybutton')[0].ej2_instances[0].disabled = true;
                $(".story-dashboarddescription").css("padding-left", "28px");
                $(".story-checkbox").css("display", "block");
            } else {
                document.getElementById("removestorybutton").style.visibility = "hidden";
                $('#removestorybutton')[0].ej2_instances[0].disabled = true;
                $(".story-dashboarddescription").css("padding-left", "0");
                $(".story-checkbox").css("display", "none");
            }

            if (isStartgamevisible === "True") {
                document.getElementById("startgamestorybutton").style.visibility = "visible";
            } else {
                document.getElementById("startgamestorybutton").style.visibility = "hidden";
            }

        } else {
            document.getElementById("removestorybutton").style.visibility = "hidden";
            document.getElementById("startgamestorybutton").style.visibility = "hidden";
        }
    }

    if (typeof roomlistCount === 'undefined' || roomlistCount <= 0) {
        document.getElementById('storylistheader').style.display = 'none';
    } else {
        document.getElementById('storylistheader').style.display = 'flex';
    }
}

function searchstorykeypress(k) {
    var searchStoryTextsvalue = document.getElementById('searchstory');
    if (searchStoryTextsvalue.value.trim() !== "") {
        isSearchStory = true;
    }
    if (k.which === 13) {
        if (searchStoryTextsvalue.value.trim() !== "") {
            storyCloseIcon = false;
            searchstorydetails();
        }
    } else if (k.keyCode === 8 || k.keyCode === 46) {
        var searchStoryTexts = document.getElementById('searchstory');
        if (searchStoryTexts.value.length === 0) {
            if (isSearchStory) {
                storyCloseIcon = true;
                searchstorydetails();
                isSearchStory = false;
            }
        }
    }
}

function closeStoryIconsClick() {
    var searchText = document.getElementById('searchstory');
    searchText.value = "";
    storyCloseIcon = true;
    searchstorydetails();
}

function storyIconsClick() {
    var storySearchInputs = document.getElementById('searchstory');
    if (storySearchInputs.value.trim() !== "") {
        storyCloseIcon = false;
        searchstorydetails();
    }
}

function getCardType(args) {
    $.ajax({
        data: {
            'type': args.value,
        },
        dataType: "html",
        success: function (data) {
            $('#cardTypeValuediv').html(data);
        },
        error: function () {
            toastError.content = messages.ajaxerrorMessage;
            toastObj.show(toastError);
        },
        type: 'POST',
        url: "getcardvalue",
    });
}

function onCheckBoxClick() {
    var storyIds = [];
    $.each($("input[name='storycheckbox']:checked"), function () {
        storyIds.push($(this).val());
    });

    if (storyIds.length > 0) {
        $('#removestorybutton')[0].ej2_instances[0].disabled = false;
    } else {
        $('#removestorybutton')[0].ej2_instances[0].disabled = true;
    }
}

function deleteRoomClick(roomId, roomName) {
    deleteRoomId = roomId;
    deletedRoomName = roomName;
    $("#deleteroomdialog").removeClass("hide");
    deleteRoomDialogObj.show();
}

function cancelDeleteRoomClick() {
    deleteRoomDialogObj.hide();
}

function deleteRoomBtnClick() {
    $('#deleteroomdialog .e-footer-content .e-primary')[0].ej2_instances[0].disabled = true;
    var deleteRoomTexts = document.getElementById('deleteroomdialog');
    var deleteRoomDialogValue = deleteRoomTexts.style.zIndex;
    var loaderIndexValue = $($("#deleteroomdialog").parent()).find(".e-dlg-overlay").css("z-index");
    $(".e-spinner-pane").css("z-index", (parseInt(loaderIndexValue, 10) + 1).toString());
    ej.popups.showSpinner(targetId);
    $.ajax({
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        data: { 'roomId': deleteRoomId },
        error: function (xmlhttprequest, textstatus, errormessage) {
            if (textstatus === "timeout") {
                toastError.content = messages.timeouterrorMessage;
                toastObj.show(toastError);
            }
            else {
                $('#errorcreateroom').text(messages.ajaxerrorMessage);
            }
            $("#deleteroomdialog").css("z-index", deleteRoomDialogValue);
            $('#deleteroomdialog .e-footer-content .e-primary')[0].ej2_instances[0].disabled = false;
        },
        success: function (response) {
            $('#deleteroomdialog .e-footer-content .e-primary')[0].ej2_instances[0].disabled = false;
            if (response.status === true) {
                $("#deleteroomdialog").css("z-index", deleteRoomDialogValue);
                deleteRoomDialogObj.hide();
                roomCloseIcon = true;
                if (roomsCounts === 1 && roomFilter === "All") {
                    var searchText = document.getElementById('searchrooms');
                    searchText.value = "";
                    GetQuickFilterRoomDetails();
                }
                var searchTexts = document.getElementById('searchrooms');
                if (searchTexts.value.trim() !== "") {
                    roomCloseIcon = false;
                }
                searchroomdetails();
                toastSuccess.content = '<b>' + deletedRoomName + '</b>' + ' Room has been deleted.';
                toastObj.show(toastSuccess);
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
                $("#deleteroomdialog").css("z-index", deleteRoomDialogValue);
            }
        },
        timeout: defaultValues.timeout,
        type: 'POST',
        url: 'dashboard/deleteroom/',
    });
}

function ImportClick() {
    $("#importBtnDiv .e-split-btn-wrapper .e-split-btn").css("z-index", "0");
    fileTypeInImportStory = "excel";
    importStoryBtnClick(fileTypeInImportStory);
}

function ImportSelect(args) {
    if (args.element.innerText.toLowerCase() === "from excel") {
        $("#importBtnDiv .e-split-btn-wrapper .e-split-btn").css("z-index", "0");
        fileTypeInImportStory = "excel";
        importStoryBtnClick(fileTypeInImportStory);
    }
    else if (args.element.innerText.toLowerCase() === "from csv") {
        $("#importBtnDiv .e-split-btn-wrapper .e-split-btn").css("z-index", "0");
        fileTypeInImportStory = "csv";
        importStoryBtnClick(fileTypeInImportStory);
    }
}

function importStoryBtnClick(fileType) {
    importFileType = fileType;
    $.ajax({
        data: {
            'fileType': fileType
        },
        dataType: "html",
        success: function (data) {
            var headerText = "Import from Excel";
            if (fileType === "csv") {
                headerText = "Import from CSV";
            }
            importdialogObj.setProperties({
                header: headerText,
                content: data
            });

            var scripts = document.querySelectorAll("#targetId script");
            var length = scripts.length;
            for (var i = 0; i < length; i++) {
                if (scripts[i].id === "" && scripts[i].text.indexOf("#UploadXmlFile") !== -1) {
                    eval(scripts[i].text);
                }
            }
            importdialogObj.show();
        },
        error: function (xmlhttprequest, textstatus, errormessage) {
            if (textstatus === "timeout") {
                toastError.content = messages.timeouterrorMessage;
                toastObj.show(toastError);
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
        type: 'POST',
        url: 'importstory',
    }).done(function(data) {
        $('#importstoryForm').html(data);
    });

    $("#uploads").html(messages.nofilechosenMessage);
    var errorimporystory = document.getElementById('errorimporystory');
    if (errorimporystory) {
        document.getElementById("errorimporystory").style.display = "none";
    }
    $('#importdialog .e-footer-content .e-primary')[0].ej2_instances[0].disabled = true;
    $('.app-header').removeClass("navbar-fixed-top");
    $("#importdialog").removeClass("hide");
}

function importBtnClick() {
    document.getElementsByClassName("importStorySavebuttons")[0].disabled = true;
    var uploadObj = document.getElementById("UploadXmlFile").ej2_instances[0];
    if (sessionStorage.isSaveButtonEnable !== null && sessionStorage.isSaveButtonEnable !== undefined && sessionStorage.isSaveButtonEnable === "false") {
        if (uploadObj.getFilesData().length === 0) {
            document.getElementById('errorimporystory').innerHTML = messages.nofilechosenMessage;
        }
        document.getElementById("errorimporystory").style.display = "block";
    } else {
        if (uploadObj.getFilesData().length > 0) {
            var fileSize = uploadObj.getFilesData()[0].size;
            fileSize = ((fileSize / 1000) / 1024).toFixed(4);
            if (Math.round(fileSize) > 28) {
                sessionStorage.isSaveButtonEnable = false;
                document.getElementsByClassName("importStorySavebuttons")[0].disabled = true;
                document.getElementById('errorimporystory').innerHTML = messages.importstoryfilesizemessage;
                document.getElementById("errorimporystory").style.display = "block";
            }
            else {
                var importTexts = document.getElementById('importdialog');
                var importDialogValue = importTexts.style.zIndex;
                var loaderIndexValue = $($("#importdialog").parent()).find(".e-dlg-overlay").css("z-index");
                $(".e-spinner-pane").css("z-index", (parseInt(loaderIndexValue, 10) + 1).toString());
                ej.popups.showSpinner(targetId);
                var file = uploadObj.getFilesData()[0].rawFile;
                var uploaddata = new FormData();
                uploaddata.append('file', file);
                uploaddata.append('roomId', defaultId);
                uploaddata.append('activeUserId', activeRoomUserId);
                uploaddata.append('fileType', fileTypeInImportStory);
                $.ajax({
                    complete: function () {
                        ej.popups.hideSpinner(targetId);
                    },
                    contentType: false,
                    data: uploaddata,
                    error: function (xmlhttprequest, textstatus, errormessage) {
                        if (textstatus === "timeout") {
                            toastError.content = messages.timeouterrorMessage;
                            toastObj.show(toastError);
                        }
                        else {
                            $('#errorimporystory').text(messages.ajaxerrorMessage);
                        }
                        $("#importdialog").css("z-index", importDialogValue);
                    },
                    processData: false,
                    success: function (response) {
                        if (response.status === false) {
                            if (response.result === messages.importstorycommonerrormessgage) {
                                if (fileTypeInImportStory === "excel" || fileTypeInImportStory === "csv") {
                                    window.location = "/download/" + response.fileName + "/" + response.fileType;
                                }
                            }
                            document.getElementById('errorimporystory').innerHTML = response.result;
                            document.getElementById("errorimporystory").style.display = "block";
                            $("#importdialog").css("z-index", importDialogValue);
                            if (response.ImportedStoryCount > 0) {
                                importedstorycount = response.ImportedStoryCount;
                            }
                        } else if (response.status === true) {
                            document.getElementById("errorimporystory").style.display = "none";
                            var isDuplication = response.TotalStoryCounts - response.DuplicationStoryCount;
                            if (isDuplication === 0 && response.TotalStoryCounts > 0) {
                                document.getElementById('errorimporystory').innerHTML = messages.importStoryDuplicateToastrMessage;
                                document.getElementById("errorimporystory").style.display = "block";
                                $("#importdialog").css("z-index", importDialogValue);
                            } else {
                                importdialogObj.hide();
                                $("#importdialog").css("z-index", importDialogValue);
                                if (response.ImportedStoryCount === 1) {
                                    toastSuccess.content = response.ImportedStoryCount + " " + messages.singlestoryImport;
                                    toastObj.show(toastSuccess);
                                }
                                else {
                                    toastSuccess.content = response.ImportedStoryCount + " " + messages.multiplestoryImport;
                                    toastObj.show(toastSuccess);
                                }
                                var activestorycount = parseInt($(".dashboardcards.active").attr('data-storycount'), 10);
                                var x = activestorycount + response.ImportedStoryCount;
                                defaultStoryCount = activestorycount + response.ImportedStoryCount;
                                var currentstorycount = (activestorycount + response.ImportedStoryCount).toString();

                                if (currentstorycount.length > 3) {
                                    var newcurrentstorycount = currentstorycount.substring(0, 3) + "..";
                                    $(".dashboardcards.active table .roomstorycount").attr('title', currentstorycount);
                                    $(".dashboardcards.active table .roomstorycount").html(newcurrentstorycount);
                                } else {
                                    $(".dashboardcards.active table .roomstorycount").attr('title', currentstorycount);
                                    $(".dashboardcards.active table .roomstorycount").html(currentstorycount);
                                }
                                $(".dashboardcards.active").attr('data-storycount', currentstorycount);
                                storyCloseIcon = true;
                                searchstorydetails();
                            }
                        }
                    },
                    timeout: defaultValues.timeout,
                    type: 'POST',
                    url: "importstorydetails",
                });
            }
        }
        else {
            sessionStorage.isSaveButtonEnable = false;
            document.getElementsByClassName("importStorySavebuttons")[0].disabled = true;
            document.getElementById('errorimporystory').innerHTML = messages.nofilechosenMessage;
            document.getElementById("errorimporystory").style.display = "block";
        }
    }
}

function importCancelClick() {
    importdialogObj.hide();
    if (importedstorycount > 0) {
        if (importedstorycount === 1) {
            toastSuccess.content = importedstorycount + " " + messages.singlestoryImport;
            toastObj.show(toastSuccess);
        } else {
            toastSuccess.content = importedstorycount + " " + messages.multiplestoryImport;
            toastObj.show(toastSuccess);
        }

        var activestorycount = parseInt($(".dashboardcards.active").attr('data-storycount'), 10);
        defaultStoryCount = activestorycount + importedstorycount;
        var currentstorycount = (activestorycount + importedstorycount).toString();
        if (currentstorycount.length > 3) {
            var newcurrentstorycount = currentstorycount.substring(0, 3) + "..";
            $(".dashboardcards.active table .roomstorycount").attr('title', currentstorycount);
            $(".dashboardcards.active table .roomstorycount").html(newcurrentstorycount);
        } else {
            $(".dashboardcards.active table .roomstorycount").attr('title', currentstorycount);
            $(".dashboardcards.active table .roomstorycount").html(currentstorycount);
        }
        $(".dashboardcards.active").attr('data-storycount', currentstorycount);
        storyCloseIcon = true;
        searchstorydetails();
        importedstorycount = 0;
    }
}

function fileremoving() {
    document.getElementById('errorimporystory').innerHTML = '';
    document.getElementsByClassName("importStorySavebuttons")[0].disabled = true;
}

function uploadFileChange(args) {
    var errorimporystorymsg = document.getElementById('errorimporystory');
    errorimporystorymsg.innerHTML = '';
    var importstoryfileext = [];
    var validationfileMessage = '';
    if (importFileType === "excel") {
        importstoryfileext = ["xls", "xlsx"];
        validationfileMessage = messages.importexcelvalidFileMessage;
    }
    else if (importFileType === "csv") {
        importstoryfileext = [importFileType];
        validationfileMessage = messages.importcsvvalidFileMessage;
    }
    var filesData = args.filesData;
    if (filesData && filesData.length > 0) {
        if (TestFileType(filesData[0].name, importstoryfileext)) {
            errorimporystorymsg.innerHTML = '';
            sessionStorage.isSaveButtonEnable = true;
            document.getElementsByClassName("importStorySavebuttons")[0].disabled = false;
        } else {
            sessionStorage.isSaveButtonEnable = false;
            document.getElementsByClassName("importStorySavebuttons")[0].disabled = true;
            errorimporystorymsg.innerHTML = validationfileMessage;
            document.getElementById("errorimporystory").style.display = "block";
        }
    }

    if (sessionStorage.isSaveButtonEnable !== null && sessionStorage.isSaveButtonEnable !== undefined && sessionStorage.isSaveButtonEnable === "true") {
        if (filesData && filesData.length > 0) {
            var fileSize = filesData[0].size;
            fileSize = ((fileSize / 1000) / 1024).toFixed(4);
            if (Math.round(fileSize) > 28) {
                sessionStorage.isSaveButtonEnable = false;
                document.getElementsByClassName("importStorySavebuttons")[0].disabled = true;
                errorimporystorymsg.innerHTML = messages.importstoryfilesizemessage;
                document.getElementById("errorimporystory").style.display = "block";
            }
        }
    }

    $('#uploads').html($('input[type=file]').val().replace(/^.*[\\\/]/, ''));
    var maxLength = 22;
    var myStr = $("#uploads").text();
    if ($.trim(myStr).length > maxLength) {
        var newStr = myStr.substring(0, maxLength) + "...";
        $('#uploads').html(newStr);
        document.getElementById('uploads').setAttribute('title', myStr);
    } else if ($.trim(myStr).length <= 0) {
        $("#uploads").html(messages.nofilechosenMessage);
    }
    else {
        $("#uploads").removeAttr("title");
    }
}

function TestFileType(fileName, fileTypes) {
    if (!fileName) {
        return;
    }
    var dots = fileName.split(".");
    var fileType = dots[dots.length - 1];
    return (fileTypes.indexOf(fileType) !== -1) ? true : false;
}

function validateStoryInputs() {
    if ($("#uploads").text().trim() !== "" && $("#uploads").text().trim() !== messages.nofilechosenMessage) {
        return false;
    }
    else {
        return true;
    }
}

function ResizeView() {
    $("body").css("padding-top", "47px");
    var windowWidth = $(window).width();
    if (windowWidth < 961) {
        $("#targetId").css("display", "block");
        $("#appHeaderInner").css("display", "flex");
        $("#userProfile").css("display", "flex");
        $("#layourcurrentusernameDiv").addClass("hide");
        $("#createroombutton").addClass("hide");
        $("#div-storyPage").removeAttr("class");
        $("#dashboardroomsid").removeAttr("class");
        $("#dashboardroomsid").addClass("col-lg-12 col-sm-12 col-md-12 col-xs-12");
        $("#div-storyPage").addClass("hide");
        $(".usersetting").addClass("hide");
        $(".userprofile").removeClass("hide");
        $("#signout-dropdown").css("width", "130px");
    }
    else {
        $("#layourcurrentusernameDiv").removeClass("hide");
        $("#createroombutton").removeClass("hide");
        $("#div-storyPage").removeAttr("class");
        $("#div-storyPage").addClass("col-lg-8 col-sm-8 col-md-8 col-xs-8");
        $("#dashboardroomsid").removeAttr("class");
        $("#dashboardroomsid").addClass("col-lg-4 col-sm-4 col-md-4 col-xs-4");
        $(".usersetting").removeClass("hide");
        $(".userprofile").addClass("hide");
        $("#signout-dropdown").css("width", "");
    }

    var emptyDivClass = "col-xs-2 col-sm-2 col-lg-2 col-md-2";
    var btnDivClass = "col-xs-5 col-sm-5 col-lg-5 col-md-5 no-padding";
    if (windowWidth > 1366) {
        emptyDivClass = "col-xs-3 col-sm-3 col-lg-3 col-md-3";
        btnDivClass = "col-xs-4 col-sm-4 col-lg-4 col-md-4 no-padding";
    }
    $("#storylistheaderEmpty").removeAttr("class");
    $("#storylistheaderEmpty").addClass(emptyDivClass);
    $("#storylistheaderBtns").removeAttr("class");
    $("#storylistheaderBtns").addClass(btnDivClass);
}
