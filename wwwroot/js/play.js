var isTeamAvgView;
var selectedCard;
var showLoader = true;
var isRemoveStoryClick = false;
var fromSearchOrFilter = false;
sessionStorage.checkPendingStory = null;
var pathname = window.location.pathname;
var findGroupId = pathname.split("/");
var roomGuid = findGroupId[findGroupId.length - 1];
var finishVotingBtn;
var estimateBtnText;
var estimateBtnIcon;
var roomId;
var isSearchPlayer;
var createdBy;
var isShowMoreContainer;
var isCurrentStoryContainer;
var storyStatusContainer;
var mapperStoryContainer;
var isOwnerContainer;
var hasTimerContainer;
var roomStatusContainer;
var startButton;
var pauseButton;
var isCurrentUserVotedContainer;
var storyTimerContainer;
var currentTimeContainer;
var roomTotTimeElement;
var roomStartTimeContainer;
var roomEndTimeContainer;
var roomIdleTimeContainer;
var storyTotTimeElement;
var storyStartTimeContainer;
var storyEndTimeContainer;
var storyIdleTimeContainer;
var isEveryUserVoted;
var toggleStartBtn;
var togglePauseBtn;
var isShowMore;
var isCurrentStory;
var currentStoryStatus;
var mapperStoryId;
var isOwner;
var hasTimer;
var roomStatus;
var isAllStoryEstimated;
var isStoryEstimated;
var isAvgCalculated;
var storyListGridObj;
var storyListGridData;
var circulargauge;
var teamAverageChartObj;
var centerTitle = document.createElement('div');
var isCurrentUserVoted;
var defStartValue = 0;
var defMinValue = 0;
var defMaxValue = 5;
var defMidRangeValue = 3;
var timerInterval;
var gameIsPaused = false;
var defaultSidebar;
var fileTypeInImportStory = '';
var importedstorycount = 0;
var confirmDialogObj;
var informationDialogObj;
var pauseDialogObj;
var qrCodeDialogObj;
var playerListGrid;

window.play = function () {
    if (!targetId) {
        targetId = document.getElementById('spinner');
    }

    finishVotingBtn = document.getElementById('finishVoting');
    isShowMoreContainer = document.getElementById('isShowMore');
    isCurrentStoryContainer = document.getElementById('isCurrentStory');
    storyStatusContainer = document.getElementById('currentStoryStatus');
    mapperStoryContainer = document.getElementById('mapperStoryId');
    isOwnerContainer = document.getElementById('isOwner');
    hasTimerContainer = document.getElementById('hasTimer');
    roomStatusContainer = document.getElementById('roomStatus');
    startButton = document.getElementById('startBtn');
    pauseButton = document.getElementById('pauseBtn');
    isCurrentUserVotedContainer = document.getElementById('isCurrentUserVoted');
    storyTimerContainer = document.getElementById('storyTimer');
    currentTimeContainer = document.getElementById('currentTime');
    roomTotTimeElement = document.getElementById('roomTotalTime');
    roomStartTimeContainer = document.getElementById('roomStartTime');
    roomEndTimeContainer = document.getElementById('roomEndTime');
    roomIdleTimeContainer = document.getElementById('roomIdleTime');
    storyTotTimeElement = document.getElementById('storyTotalTime');
    storyStartTimeContainer = document.getElementById('storyStartTime');
    storyEndTimeContainer = document.getElementById('storyEndTime');
    storyIdleTimeContainer = document.getElementById('storyIdleTime');
    isEveryUserVoted = document.getElementById('isEveryUserVoted');
    var roomIdContainer = document.getElementById('roomId');
    roomId = roomIdContainer !== null ? roomIdContainer.value : "";
    var createdByContainer = document.getElementById('createdById');
    createdBy = createdByContainer !== null ? createdByContainer.value : "";

    confirmDialogObj = document.getElementById("confirmDialog").ej2_instances[0];
    confirmDialogObj.hide();
    informationDialogObj = document.getElementById("informationDialog").ej2_instances[0];
    informationDialogObj.hide();
    pauseDialogObj = document.getElementById("pauseGameDialog").ej2_instances[0];
    pauseDialogObj.hide();
    qrCodeDialogObj = document.getElementById("qrCodeDialog").ej2_instances[0];
    qrCodeDialogObj.hide();

    if (startButton) {
        toggleStartBtn = document.getElementById("startBtn").ej2_instances[0];
        startButton.onclick = function() {
            if (startButton.textContent.toLowerCase().startsWith('start') === true) {
                StartGame();
            }
            else if (startButton.textContent.toLowerCase().startsWith('end') === true) {
                EndGame();
            }
            else {
                StopGame();
            }
        };
    }
    if (pauseButton) {
        togglePauseBtn = document.getElementById("pauseBtn").ej2_instances[0];
        pauseButton.onclick = function () {
            if (pauseButton.textContent.toLowerCase() === "pause") {
                PauseGame();
            } else {
                ResumeGame();
            }
        };
    }

    playerListGrid = document.getElementById("playerListGrid").ej2_instances[0];
    var searchKey = document.getElementsByClassName('search-player')[0];
    if (searchKey) {
        searchKey.onkeyup = function (e) {
            if (searchKey.value.trim() !== "") {
                isSearchPlayer = true;
            }
            if (e.keyCode === 13) {
                var searchKeysinput = document.getElementsByClassName('search-player')[0];
                if (searchKeysinput.value.trim() !== "") {
                    var playerCloseInputKey = document.getElementById('playercloseiconid');
                    playerCloseInputKey.style.display = "block";
                    var playerBorderWidthInput = document.getElementById('player-increased-width-Id');
                    playerBorderWidthInput.style.width = "122%";
                    $("#player-increased-width-Id").removeClass("increased-width");
                    playerListGrid.search(searchKey.value);
                }

            } else if (e.keyCode === 8 || e.keyCode === 46) {
                var searchKeyLength = document.getElementsByClassName('search-player')[0];
                if (searchKeyLength.value.length === 0) {
                    if (isSearchPlayer) {
                        searchKeyLength.value = "";
                        playerListGrid.search(searchKeyLength.value);
                        var playerCloseInputKeys = document.getElementById('playercloseiconid');
                        playerCloseInputKeys.style.display = "none";
                        $("#player-increased-width-Id").addClass("increased-width");
                        isSearchPlayer = false;
                    }
                }
            }
        };

        document.getElementsByClassName('search-player-btn')[0].onclick = function () {
            var searchKeys = document.getElementsByClassName('search-player')[0];
            if (searchKeys.value.trim() !== "") {
                var playerCloseInputKey = document.getElementById('playercloseiconid');
                playerCloseInputKey.style.display = "block";
                var playerBorderWidthInput = document.getElementById('player-increased-width-Id');
                playerBorderWidthInput.style.width = "122%";
                $("#player-increased-width-Id").removeClass("increased-width");
                playerListGrid.search(searchKey.value);
            }
        };
    }

    defaultSidebar = document.getElementById("leftPanel").ej2_instances[0];
    initialize();
    if (document.getElementById("storyListGrid")) {
        BindGridData(null);
    }
    $("#wrapper").css("overflow-y", "auto");
    $("#wrapper").css("position", "fixed");
    $("#wrapper").css("width", "100%");
    var windowWidth = $(window).width();
    if (windowWidth < 961) {
        $("#targetId").css("display", "block");
        $("#appHeaderInner").css("display", "flex");
        $("#userProfile").css("display", "flex");
        $(".search-wrapper").removeClass("hide");
        $("#hamburger").removeClass("hide");
    }
    else {
        $(".search-wrapper").removeClass("hide");
        $("#hamburger").removeClass("hide");
    }
    AdjustFooter();
    ResizeHeight();
};

function playerCloseIconsClick() {
    var searchKey = document.getElementsByClassName('search-player')[0];
    searchKey.value = "";
    var playerCloseInputKey = document.getElementById('playercloseiconid');
    playerCloseInputKey.style.display = "none";
    playerListGrid.search(searchKey.value);
    $("#player-increased-width-Id").addClass("increased-width");
}

function AdjustFooter() {
    if (!$(".btn-footer").is(":visible")) {
        var playAreaHeight = parseInt($(".play-area").css("height"));
        var footerHeight = parseInt($('.btn-footer').css("height"));
        playAreaHeight = playAreaHeight + footerHeight;
        $(".play-area").css("height", playAreaHeight);
        var chartContainer = document.getElementById('teamAverageChart');
        if (chartContainer) {
            $(".play-area-content").css("height", playAreaHeight);
        }
    }
    else {
        if (isOwner === "false" && $(window).width() < 961) {
            isCurrentUserVoted = isCurrentUserVotedContainer != null ? isCurrentUserVotedContainer.value.toLowerCase() : "false";
            if (isCurrentUserVoted === "false") {
                var playAreaHeight = $(window).height() - (48 + parseInt($('.btn-footer').css("height")) + parseInt($(".play-area").css("padding-top")));
                $(".play-area").css("height", playAreaHeight);
            }
        }
    }
}

function initialize() {
    var isAllStoryEstimatedContainer = document.getElementById('isAllStoryEstimated');
    var isStoryEstimatedContainer = document.getElementById('isStoryEstimated');
    var isAvgCalculatedContainer = document.getElementById('isAvgCalculated');
    var leftPanelContainer = document.getElementById('leftPanel');

    storyTotTimeElement = document.getElementById('storyTotalTime');
    storyStartTimeContainer = document.getElementById('storyStartTime');
    storyEndTimeContainer = document.getElementById('storyEndTime');
    storyIdleTimeContainer = document.getElementById('storyIdleTime');

    isShowMore = isShowMoreContainer != null ? isShowMoreContainer.value : "";
    isCurrentStory = isCurrentStoryContainer != null ? isCurrentStoryContainer.value : "";
    currentStoryStatus = storyStatusContainer != null ? storyStatusContainer.value : "";
    mapperStoryId = mapperStoryContainer != null ? mapperStoryContainer.value : "";
    isOwner = isOwnerContainer != null ? isOwnerContainer.value.toLowerCase() : "";
    hasTimer = hasTimerContainer != null ? hasTimerContainer.value.toLowerCase() : "";
    isCurrentUserVoted = isCurrentUserVotedContainer != null ? isCurrentUserVotedContainer.value.toLowerCase() : "false";
    roomStatus = roomStatusContainer != null ? roomStatusContainer.value.toLowerCase() : "open";
    isAllStoryEstimated = isAllStoryEstimatedContainer != null ? isAllStoryEstimatedContainer.value.toLowerCase() : "";
    isStoryEstimated = isStoryEstimatedContainer != null ? isStoryEstimatedContainer.value.toLowerCase() : "";
    isAvgCalculated = isAvgCalculatedContainer != null ? isAvgCalculatedContainer.value.toLowerCase() : "";
    if (finishVotingBtn) {
        var button = new ej.buttons.Button();
        button.appendTo('#finishVoting');
    }
    var button = new ej.buttons.Button();
    button.appendTo('#estimateButton');
    var flipButton = new ej.buttons.Button();
    flipButton.appendTo('#flipButton');
    EnableAnchor();
    if (roomStatus === "paused") {
        gameIsPaused = true;
        var chartContainer = document.getElementById('teamAverageChart');
        if (chartContainer) {
            $(".blink").text("Paused...");
        }
        $.each($(".card"), function (key, value) {
            $(this).attr('disabled', 'disabled');
        });
    }
    else if (roomStatus === "stopped") {
        roomStatus = "open";
    }

    var windowWidth = $(window).width();
    if (isOwner === "true") {
        if (startButton) {
            startButton.classList.remove('hide');
        }

        if ((roomStatus === "inprogress" || roomStatus === "paused") && isCurrentStory.toLowerCase() === "true") {
            if (isAllStoryEstimated.toLocaleLowerCase() === "true") {
                if (windowWidth < 961) {
                    toggleStartBtn.content = 'End';
                    startButton.style.cssText = "width : auto";
                }
                else {
                    toggleStartBtn.content = 'End Game';
                    startButton.style.cssText = "width : 140px";
                }
                toggleStartBtn.cssClass = 'start-btn e-warning';
            }
            else {
                if (windowWidth < 961) {
                    toggleStartBtn.content = 'Stop';
                    startButton.style.cssText = "width : auto";
                }
                else {
                    toggleStartBtn.content = 'Stop Playing';
                    startButton.style.cssText = "width : 140px";
                }
                toggleStartBtn.cssClass = 'start-btn e-danger';
                togglePauseBtn.cssClass = 'pause-btn e-flat';
                $(".pause-btn-div").removeClass("hide");
                if (currentStoryStatus.toLowerCase() === "inprogress" || currentStoryStatus.toLowerCase() === "estimated") {
                    if (roomStatus === "paused") {
                        togglePauseBtn.content = 'Resume';
                        togglePauseBtn.iconCss = 'e-icons e-play-icon';
                        pauseButton.classList.add('e-active');
                    }
                    else {
                        togglePauseBtn.content = 'Pause';
                        togglePauseBtn.iconCss = 'e-icons e-pause-icon';
                    }
                }
                else if (currentStoryStatus.toLowerCase() === "paused") {
                    togglePauseBtn.content = 'Resume';
                    togglePauseBtn.iconCss = 'e-icons e-play-icon';
                    pauseButton.classList.add('e-active');
                }
            }
            toggleStartBtn.disabled = false;
        }
        CreateSidebar();
    }
    else {
        var leftPanelContainer = document.getElementById('leftPanel');
        var playAreaContainer = document.getElementsByClassName('play-area')[0];
        if (roomStatus === "inprogress" || roomStatus === "paused") {
            if (isAvgCalculated === "true" || isStoryEstimated === "true") {
                var actStoryId = $("#storyContent").find(".shown").data("id");
                LoadChart(actStoryId);
            }

            $("#leftPanel").empty();
            $("#hamburger").css("display", "none");
            $(".e-content-animation").css("margin-left", "0");

            if (windowWidth < 961) {
                $("#targetId").css("display", "block");
                $("#appHeaderInner").css("display", "flex");
                $("#userProfile").css("display", "flex");
                $($(".right-panel")[0]).addClass("hide");
                $("#wrapper-inner").removeAttr("class");
                $("#wrapper-inner").addClass("col-lg-12 col-sm-12 col-md-12 col-xs-12 no-padding");
                $("#logo").css("margin-left", "-5px");
                $("#logo").css("line-height", "84px");
                $("#estVsTotStories").text($("#estVsTotStories").text().replace("Completed", "").trim());
                $("#totStoryPoints").text($("#totStoryPoints").text().replace("Total Story Points:", "").trim());
                $("#layourcurrentusernameDiv").addClass("hide");
                $("#roomDigitalTimerText").addClass("hide");
                $("#timerGauge").css("display", "none");

                $(".app-header").css("height", "84px");
                $("body").css("padding-top", "83px");
                $(".e-sidebar.e-left").attr('style', 'top:84px !important; z-index: 1000');
                $("#summaryText").css("text-align", "left");
                var titleWidth = windowWidth * 0.7;
                $(".customLogo").css("font-size", "20px").css("width", titleWidth + "px");
                $(".header-icons").attr('style', 'font-size: 20px !important; line-height: inherit !important');
                $(".header-icon-text").css("font-size", "16px").css("padding-bottom", "0");
                $(".header-icons-separator").css("font-size", "16px").css("top", "0");
                $("#userProfile").css("margin-top", "25px");
                $('.customLogoText').css("margin-top", "6px");

                $("#div-nostoryimage").attr("src", "https://cdn.syncfusion.com/planningpoker/images/general/NoStories.svg");
                $("#nostoryemptymessage").text("No stories found");
                $("#importBtnDiv").css("display", "none");

                $("#roomDigitalTimer").css("font-size", "16px").css("display", "table-cell").css("vertical-align", "middle");
                $("#timerDivider").removeClass("hide");
                $(".header-divider").addClass("hide");
                $('.customLogoText').append($('#roomDigitalTimer'));
                $(".usersetting").addClass("hide");
                $("#about").addClass("hide");
                $(".userprofile").removeClass("hide");
                $("#signout-dropdown").css("width", "130px");

                if ((isAvgCalculated && isAvgCalculated === "true") || (isStoryEstimated && isStoryEstimated === "true")) {
                    $(".final-time-div").removeClass("col-lg-3 col-md-3 col-sm-3 col-xs-3");
                    $(".stroy-detail-div").removeClass("col-lg-9 col-md-9 col-sm-9 col-xs-9");
                    $(".stroy-detail-div").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                    $('.mobile-story-timer').append($('.final-time-header'));
                    $('.mobile-story-timer').append($('.final-time-value'));
                    $(".final-time-header").css("display", "initial");
                    $(".final-time-value").css("display", "initial");
                    $(".mobile-story-timer").removeClass("hide");
                    var txt = "Story Timer: ";
                    if (isStoryEstimated === "true") {
                        txt = "Time Taken: ";
                    }
                    $(".final-time-header").text(txt);
                    $(".final-time-header").css("font-size", "15px");
                    $(".final-time-div").css("display", "block");
                }
                else {
                    if (hasTimer && hasTimer === "true") {
                        $(".story-timer-div").removeClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
                        $(".stroy-detail-div").removeClass("col-lg-8 col-md-8 col-sm-8 col-xs-8");
                        $(".stroy-detail-div").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                        $('.mobile-story-timer').append($('#storyDigitalTimerText'));
                        $('.mobile-story-timer').append($('#storyDigitalTimer'));
                        $(".mobile-story-timer").removeClass("hide");
                        $(".mobile-story-timer").css("display", "flex").css("justify-content", "center");
                        $("#storyDigitalTimerText").css("font-size", "15px").css("padding-top", "4px").css("padding-right", "2px");
                    }
                }
            }
            else {
                $($(".right-panel")[0]).removeClass("hide");
                $("#wrapper-inner").removeAttr("class");
                $("#wrapper-inner").addClass("col-lg-9 col-sm-9 col-md-9 col-xs-9 no-padding");
                $("#logo").css("margin-left", "0px");
                $("#logo").css("line-height", "48px");
                if ($("#estVsTotStories").text().indexOf("Completed") === -1) {
                    $("#estVsTotStories").text($("#estVsTotStories").text() + " Completed");
                }
                if ($("#totStoryPoints").text().indexOf("Total Story Points") === -1) {
                    $("#totStoryPoints").text("Total Story Points: " + $("#totStoryPoints").text());
                }
                $("#layourcurrentusernameDiv").removeClass("hide");
                $("#roomDigitalTimerText").removeClass("hide");
                $("#timerGauge").css("display", "block");

                $("#div-nostoryimage").attr("src", "https://cdn.syncfusion.com/planningpoker/images/general/AddStories.svg");
                $("#nostoryemptymessage").text("Add your stories");
                $("#importBtnDiv").css("display", "block");


                $(".app-header").css("height", "48px");
                $("body").css("padding-top", "47px");
                $(".e-sidebar.e-left").attr('style', 'top:48px !important; z-index: 1000');
                $("#summaryText").css("text-align", "initial");
                $(".customLogo").css("font-size", "14px").css("width", "auto");
                if (windowWidth > 1366) {
                    $(".header-icons").attr('style', 'font-size: 15px !important; line-height: 1.25 !important');
                }
                else {
                    $(".header-icons").attr('style', 'font-size: 13px !important; line-height: 1 !important');
                }
                $(".header-icon-text").css("font-size", "11px").css("padding-bottom", "6px");
                $(".header-icons-separator").css("font-size", "11px").css("top", "-3px");
                $("#userProfile").css("margin-top", "10px");
                $('.customLogoText').css("margin-top", "0");

                $("#roomDigitalTimer").css("font-size", "13px").css("display", "block").css("vertical-align", "initial");
                $("#timerDivider").addClass("hide");
                $('#rTimer').append($('#roomDigitalTimer'));
                $('#userProfile').prepend($('#rTimer'));
                $(".header-divider").removeClass("hide");
                $(".usersetting").removeClass("hide");
                $("#about").removeClass("hide");
                $(".userprofile").addClass("hide");
                $("#signout-dropdown").css("width", "");

                if ((isAvgCalculated && isAvgCalculated === "true") || (isStoryEstimated && isStoryEstimated === "true")) {
                    $(".stroy-detail-div").removeClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                    $(".stroy-detail-div").addClass("col-lg-9 col-md-9 col-sm-9 col-xs-9");
                    $(".final-time-div").addClass("col-lg-3 col-md-3 col-sm-3 col-xs-3");
                    $('.final-time-div').append($('.final-time-header'));
                    $('.final-time-div').append($('.final-time-value'));
                    $(".final-time-header").css("display", "table-row");
                    $(".final-time-value").css("display", "table-row");
                    $(".mobile-story-timer").addClass("hide");
                    var txt = "Story Timer";
                    if (isStoryEstimated === "true") {
                        txt = "Time Taken";
                    }
                    $(".final-time-header").text(txt);
                    $(".final-time-header").css("font-size", "13px");
                    $(".final-time-div").css("display", "table");
                }
                else {
                    if (hasTimer && hasTimer === "true") {
                        $(".stroy-detail-div").removeClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                        $(".stroy-detail-div").addClass("col-lg-8 col-md-8 col-sm-8 col-xs-8");
                        $(".story-timer-div").addClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
                        $('#gaugeContent').prepend($('#storyDigitalTimerText'));
                        $('#gaugeContent').append($('#storyDigitalTimer'));
                        $(".mobile-story-timer").addClass("hide");
                        $(".mobile-story-timer").css("display", "flex").css("justify-content", "center");
                        $("#storyDigitalTimerText").css("font-size", "12px").css("padding-top", "0").css("padding-right", "0");
                    }
                }
            }
        }
        else {
            CreateSidebar();
        }

        if (roomStatus === "closed") {
            if (windowWidth < 961) {
                $("#roomDigitalTimer").css("font-size", "16px").css("display", "table-cell").css("vertical-align", "middle");
                $("#timerDivider").removeClass("hide");
                $(".header-divider").addClass("hide");
                $('.customLogoText').append($('#roomDigitalTimer'));
            }
            else {
                $("#roomDigitalTimer").css("font-size", "13px").css("display", "block").css("vertical-align", "initial");
                $("#timerDivider").addClass("hide");
                $('#rTimer').append($('#roomDigitalTimer'));
                $('#userProfile').prepend($('#rTimer'));
                $(".header-divider").removeClass("hide");
            }
        }
    }

    if (roomStatus === "inprogress" || roomStatus === "paused" || roomStatus === "closed") {
        var timer = 0;
        if (roomStartTimeContainer) {
            timer = InProgressTimeInSeconds(roomStartTimeContainer.value, roomEndTimeContainer != null ? roomEndTimeContainer.value : null, roomIdleTimeContainer != null ? roomIdleTimeContainer.value : null);
        }
        var roomTimerStartTime = 0;
        if (roomTotTimeElement) {
            roomTimerStartTime = parseInt(roomTotTimeElement.value, 10);
        }

        $("#roomDigitalTimer").timer({
            format: '%H:%M:%S',
            seconds: (timer + roomTimerStartTime),
        });
        if (roomStatus === "paused" || roomStatus === "closed") {
            $("#roomDigitalTimer").timer("pause");
        }
        if (windowWidth > 960) {
            $("#roomDigitalTimerText").removeClass("hide");
        }
        else {
            $("#roomDigitalTimerText").addClass("hide");
        }
        $('#userProfile').prepend($('#rTimer'));
        if (windowWidth > 960) {
            $(".header-divider").removeClass("hide");
        }
        $("#roomDigitalTimer").removeClass("hide");
    }

    if (roomStatus === "paused" && isOwner === "true") {
        pauseDialogObj.header = "Game is Paused";
        pauseDialogObj.content = '<div class="confirmdialog-icon confirmdialog-success" style="display: block;border-color:skyblue !important;border:1px solid transparent"><span class="material-icons" style="font-size: 45px;margin-top: 19px;color:skyblue;opacity:100%;radius:0px;">pause</span></div><h2 class="confirmdialog-title" id="confirmdialog-title" style="font-size:16px !important;opacity:100%;color:#000000 !important;line-height:19px;" >Game paused </h2><div id="confirmdialog-content" class="confirmdialog-content" style="display:block;font-size:14px !important;opacity:100%;color:#757575 !important;line-height:16px;">No one can vote. If you want to continue, click the Resume button.</div>';
        $("#pauseGameDialog").removeClass("hide");
        pauseDialogObj.show();
        var pauseButton = document.getElementById('pauseBtn');
        pauseButton.style.cssText = "display : none";
    }

    if (hasTimer && hasTimer === "true") {
        LoadGauge();
    }
    if ($("#storylengthtext").is(":visible")) {
        RefreshStoryDescription();
    }
    if (isShowMore.toLowerCase() === "true") {
        ShowMore();
    }
}

function confirmDlgYesBtnClick() {
    confirmDialogObj.hide();
    ej.popups.showSpinner(targetId);

    if (confirmDialogObj.header === "Remove Story") {
        $.ajax({
            cache: false,
            data: { 'storyId': confirmDialogObj.id },
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
                $.ajax({
                    cache: false,
                    complete: function () {
                        ej.popups.hideSpinner(targetId);
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
                    success: function (response) {
                        document.getElementById('targetId').innerHTML = '';
                        document.getElementById('targetId').innerHTML = response.toString();

                        if (response.indexOf("Page Not Found") === -1) {
                            var scripts = document.querySelectorAll("#targetId script");
                            var length = scripts.length;
                            for (var i = 0; i < length; i++) {
                                if (scripts[i].id === "")
                                    eval(scripts[i].text);
                            }
                            window.play();
                        }
                    },
                    timeout: defaultValues.timeout,
                    type: "GET",
                    url: 'playpage',
                });
            },
            timeout: defaultValues.timeout,
            type: 'POST',
            url: 'removestory/',
        });
    }
    else if (confirmDialogObj.header === "Reset Story") {
        var filter = "";
        if (confirmDialogObj.filterValue !== null) {
            filter = confirmDialogObj.filterValue;
        }
        var checkPendingStory = false;
        if (sessionStorage.checkPendingStory !== "null" && sessionStorage.checkPendingStory === "true") {
            checkPendingStory = true;
        }
        var searchKey = document.getElementsByClassName('search-txt')[0];
        var searchval = "";
        if (searchKey) {
            searchval = searchKey.value;
        }
        $.ajax({
            cache: false,
            complete: function () {
                ej.popups.hideSpinner(targetId);
            },
            data: {
                'roomId': confirmDialogObj.roomId,
                'currentStoryId': confirmDialogObj.currStoryId,
                'nextStoryId': confirmDialogObj.nxtStoryId,
                'filter': filter,
                'checkPendingStory': checkPendingStory,
                'searchText': searchval,
            },
            dataType: 'json',
            timeout: defaultValues.timeout,
            type: "POST",
            url: 'resetstory',
            error: function (xmlhttprequest, textstatus, errormessage) {
                sessionStorage.checkPendingStory = null;
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
                if (response.success) {
                    if (checkPendingStory) {
                        sessionStorage.checkPendingStory = true;
                    }
                    else {
                        sessionStorage.checkPendingStory = null;
                    }

                    if (confirmDialogObj.rowObj) {
                        $.each($(".grid-row"), function (key, value) {
                            if (confirmDialogObj.rowObj.id === this.id) {
                                var stryListGrid = confirmDialogObj.storyListGridObj;
                                if (stryListGrid) {
                                    var currentPage = stryListGrid.pageSettings.currentPage - 1;
                                    var pageSize = stryListGrid.pageSettings.pageSize;
                                    var storyId = (currentPage * pageSize) + key;
                                    GetNextStory(storyId);
                                }
                                else {
                                    GetNextStory(0);
                                }
                            }
                            $(this).removeClass('active');
                        });
                        $(confirmDialogObj.rowObj).addClass('active');
                    }
                    else {
                        GetNextStory(confirmDialogObj.nxtStoryIdx);
                    }
                }
                else {
                    sessionStorage.checkPendingStory = null;
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
            },
        });
    }
    else if (confirmDialogObj.header === "Stop Game") {
        $.ajax({
            cache: false,
            complete: function () {
                ej.popups.hideSpinner(targetId);
            },
            data: {
                'roomId': confirmDialogObj.roomId,
                'currentStoryId': confirmDialogObj.currStoryId,
                'filter': confirmDialogObj.filterValue,
            },
            dataType: 'json',
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
                if (response.success === true) {
                    window.location.href = "#/dashboard";
                }
                else {
                    if (response.errorMsg) {
                        toastError.content = response.errorMsg;
                        toastObj.show(toastError);
                    }
                    else {
                        toastError.content = messages.ajaxerrorMessage;
                        toastObj.show(toastError);
                    }
                }
            },
            timeout: defaultValues.timeout,
            type: "POST",
            url: 'stopplan',
        });
    }
    else if (confirmDialogObj.header === "End Game") {
        $.ajax({
            cache: false,
            complete: function () {
                ej.popups.hideSpinner(targetId);
            },
            data: {
                'roomId': confirmDialogObj.roomId,
                'currentStoryId': confirmDialogObj.currStoryId,
            },
            dataType: 'json',
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
                if (response.success === true) {
                    window.location.href = "#/dashboard";
                }
                else {
                    if (response.errorMsg) {
                        toastError.content = response.errorMsg;
                        toastObj.show(toastError);
                    }
                    else {
                        toastError.content = messages.ajaxerrorMessage;
                        toastObj.show(toastError);
                    }
                }
            },
            timeout: defaultValues.timeout,
            type: "POST",
            url: 'endgame',
        });
    }
}

function confirmDlgNoBtnClick() {
    confirmDialogObj.hide();
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
    if (document.getElementById('qrCode')) {
        document.getElementById('qrCode').innerHTML = "";
    }
    $("#importBtnDiv .e-split-btn-wrapper .e-split-btn").css("z-index", "1");
}

function pauseDlgBtnClick() {
    pauseDialogObj.hide();
    ResumeGame();
}

function qrCloseBtnClick() {
    qrCodeDialogObj.hide();
}

function infoDlgCloseBtnClick() {
    informationDialogObj.hide();
    window.location.href = "#/dashboard";
}

function InProgressTimeInSeconds(startTime, endTime, idleTime) {
    var progressTime = 0;

    if (startTime) {
        var timeDiff;
        if (endTime) {
            timeDiff = Math.abs(new Date(endTime).getTime() - new Date(startTime).getTime());
        }
        else {
            if (currentTimeContainer) {
                timeDiff = Math.abs(new Date(currentTimeContainer.value).getTime() - new Date(startTime).getTime());
            }
        }

        if (timeDiff != null && timeDiff > 0) {
            var totSec = timeDiff / 1000;
            progressTime = Math.round(totSec) - (idleTime != null ? parseInt(idleTime, 10) : 0);
        }
    }

    return progressTime;
}

function CreateSidebar() {
    var windowWidth = $(window).width();
    var resizeTimer;
    ResizeSidebar();
    defaultSidebar.refresh();

    if (windowWidth < 961) {
        defaultSidebar.hide();
    }
    else {
        defaultSidebar.show();
    }

    document.getElementById('close').onclick = function () {
        windowWidth = $(window).width();
        if (windowWidth < 961) {
            $("#wrapper").css("position", "fixed");
        }
        else {
            $("#storyPoint").parent().css("visibility", "hidden");
        }
        defaultSidebar.hide();
        RefreshStoryDescription();
        if ($('#no-stories-div').length > 0) {
            ResizeHeight();
        }
        if (windowWidth > 960) {
            setTimeout(function () {
                if (isAvgCalculated === "true" || isStoryEstimated === "true") {
                    teamAverageChartObj.refresh();
                    $("#storyPoint").parent().css("display", "block");
                }
            }, 500);
        }
    };

    document.getElementById('hamburger').onclick = function () {
        windowWidth = $(window).width();
        if (windowWidth < 961) {
            $("#wrapper").css("position", "initial");
        }
        else {
            $("#storyPoint").parent().css("visibility", "hidden");
        }
        defaultSidebar.show();
        RefreshStoryDescription();
        if ($('#no-stories-div').length > 0) {
            ResizeHeight();
        }
        if (windowWidth > 960) {
            setTimeout(function () {
                if (isAvgCalculated === "true" || isStoryEstimated === "true") {
                    teamAverageChartObj.refresh();
                    $("#storyPoint").parent().css("display", "block");
                }
            }, 500);
        }
    };

    setTimeout(function () {
        if (isAvgCalculated === "true" || isStoryEstimated === "true") {
            var actStoryId = $("#storyContent").find(".shown").data("id");
            LoadChart(actStoryId);
        }
    }, 300);
}

function ResizeSidebar() {
    var windowWidth = $(window).width();
    if (windowWidth < 961) {
        $(".usersetting").addClass("hide");
        $("#about").addClass("hide");
        $(".userprofile").removeClass("hide");
        $("#signout-dropdown").css("width", "130px");
        $("#targetId").css("display", "block");
        $("#appHeaderInner").css("display", "flex");
        $("#userProfile").css("display", "flex");
        $($(".right-panel")[0]).addClass("hide");
        $("#wrapper-inner").removeAttr("class");
        $("#wrapper-inner").addClass("col-lg-12 col-sm-12 col-md-12 col-xs-12 no-padding");
        $("#logo").css("margin-left", "-5px");
        $("#logo").css("line-height", "84px");
        $("#estVsTotStories").text($("#estVsTotStories").text().replace("Completed", "").trim());
        $("#totStoryPoints").text($("#totStoryPoints").text().replace("Total Story Points:", "").trim());
        $("#layourcurrentusernameDiv").addClass("hide");
        $("#timerGauge").css("display", "none");
        $("#waitforOrganizer").css("padding-top", "5px");
        $("#organizerMessage").removeClass("warningmsguser");

        $(".app-header").css("height", "84px");
        $("body").css("padding-top", "83px");
        $(".e-sidebar.e-left").attr('style', 'top:84px !important; z-index: 1000');
        $("#summaryText").css("text-align", "left");
        var titleWidth = windowWidth * 0.7;
        $(".customLogo").css("font-size", "20px").css("width", titleWidth + "px");
        $(".header-icons").attr('style', 'font-size: 20px !important; line-height: inherit !important');
        $(".header-icon-text").css("font-size", "16px").css("padding-bottom", "0");
        $(".header-icons-separator").css("font-size", "16px").css("top", "0");
        $("#userProfile").css("margin-top", "25px");
        $('.customLogoText').css("margin-top", "6px");

        $("#div-nostoryimage").attr("src", "https://cdn.syncfusion.com/planningpoker/images/general/NoStories.svg");
        $("#nostoryemptymessage").text("No stories found");
        $("#importBtnDiv").css("display", "none");

        $('.play-area-inner').prepend($('.header-btns'));
        if (isOwner === "true") {
            $($(".header-btns")[0]).css("margin-top", "0").css("display", "flex");
            if (roomStatus !== "closed") {
                $("#hamburger.menu").css("position", "absolute");
            }
            else {
                $("#hamburger.menu").css("position", "relative");
            }
        }
        else {
            $($(".header-btns")[0]).css("margin-top", "0").css("display", "none");
            $("#hamburger.menu").css("position", "relative");
        }
        $($(".pause-btn-div")[0]).css("margin-right", "0").css("margin-left", "0").css("text-align", "right");
        $("#pauseBtn").css("color", "black");
        if (isAllStoryEstimated && (typeof isAllStoryEstimated === "string") && isAllStoryEstimated.toLocaleLowerCase() === "true" || roomStatus === "open") {
            $($(".start-btn-div")[0]).css("text-align", "right");
        }
        else {
            $($(".start-btn-div")[0]).css("text-align", "left");
        }
        $("#roomDigitalTimer").css("font-size", "16px").css("display", "table-cell").css("vertical-align", "middle");

        if (roomStatus === "inprogress" || roomStatus === "paused" || roomStatus === "closed") {
            $("#roomDigitalTimerText").addClass("hide");
            $("#timerDivider").removeClass("hide");
            $(".header-divider").addClass("hide");
            $('.customLogoText').append($('#roomDigitalTimer'));
        }

        if ((isAvgCalculated && isAvgCalculated === "true") || (isStoryEstimated && isStoryEstimated === "true")) {
            $(".final-time-div").removeClass("col-lg-3 col-md-3 col-sm-3 col-xs-3");
            $(".stroy-detail-div").removeClass("col-lg-9 col-md-9 col-sm-9 col-xs-9");
            $(".stroy-detail-div").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
            $('.mobile-story-timer').append($('.final-time-header'));
            $('.mobile-story-timer').append($('.final-time-value'));
            $(".final-time-header").css("display", "initial");
            $(".final-time-value").css("display", "initial");
            $(".mobile-story-timer").removeClass("hide");
            var txt = "Story Timer: ";
            if (isStoryEstimated === "true") {
                txt = "Time Taken: ";
            }
            $(".final-time-header").text(txt);
            $(".final-time-header").css("font-size", "15px");
            $(".final-time-div").css("display", "block");
            if (roomStatus === "open" || roomStatus === "closed") {
                $("#hamburger.menu").css("position", "absolute");
                $(".mobile-story-timer").css("padding-top", "4px");
            }
        }
        else {
            if (hasTimer && hasTimer === "true") {
                $(".story-timer-div").removeClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
                $(".stroy-detail-div").removeClass("col-lg-8 col-md-8 col-sm-8 col-xs-8");
                $(".stroy-detail-div").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                $('.mobile-story-timer').append($('#storyDigitalTimerText'));
                $('.mobile-story-timer').append($('#storyDigitalTimer'));
                $(".mobile-story-timer").removeClass("hide");
                $(".mobile-story-timer").css("display", "flex").css("justify-content", "center");
                $("#storyDigitalTimerText").css("font-size", "15px").css("padding-top", "4px").css("padding-right", "2px");
                if (roomStatus === "open") {
                    if (isOwner === "true") {
                        $("#hamburger.menu").css("position", "absolute");
                    }
                    else {
                        $("#hamburger.menu").css("position", "relative");
                    }
                    $(".mobile-story-timer").css("padding-top", "4px").css("padding-bottom", "6px");
                }
            }
        }

        if (startButton) {
            if (toggleStartBtn.content !== "") {
                var btnValue = toggleStartBtn.content.split(' ');
                if (btnValue.length > 0) {
                    toggleStartBtn.content = btnValue[0];
                }
            }
            else if (startButton.textContent.toLowerCase().startsWith('start') === true) {
                toggleStartBtn.content = "Start";
            }
            startButton.style.cssText = "width : auto";
        }

        var finishVotingBtnElem = $("#finishVoting");
        if (finishVotingBtnElem.length > 0) {
            finishVotingBtnElem.find('span').text("Finish");
            finishVotingBtn.style.cssText = "width : auto";
        }
        var skipStoryElem = $("#skipStory");
        if (skipStoryElem.length > 0) {
            skipStoryElem.find('span').text("SKIP");
        }
        var nextStoryElem = $("#nextStory");
        if (nextStoryElem.length > 0) {
            nextStoryElem.find('span').text("NEXT");
        }

        defaultSidebar.type = "Over";
        defaultSidebar.closeOnDocumentClick = true;
        defaultSidebar.showBackdrop = true;
    }
    else {
        $(".usersetting").removeClass("hide");
        $("#about").removeClass("hide");
        $(".userprofile").addClass("hide");
        $("#signout-dropdown").css("width", "");
        $($(".right-panel")[0]).removeClass("hide");
        $("#wrapper-inner").removeAttr("class");
        $("#wrapper-inner").addClass("col-lg-9 col-sm-9 col-md-9 col-xs-9 no-padding");
        $("#logo").css("margin-left", "0px");
        $("#logo").css("line-height", "48px");
        if ($("#estVsTotStories").text().indexOf("Completed") === -1) {
            $("#estVsTotStories").text($("#estVsTotStories").text() + " Completed");
        }
        if ($("#totStoryPoints").text().indexOf("Total Story Points") === -1) {
            $("#totStoryPoints").text("Total Story Points: " + $("#totStoryPoints").text());
        }
        $("#layourcurrentusernameDiv").removeClass("hide");
        $("#timerGauge").css("display", "block");

        $("#div-nostoryimage").attr("src", "https://cdn.syncfusion.com/planningpoker/images/general/AddStories.svg");
        $("#nostoryemptymessage").text("Add your stories");
        $("#importBtnDiv").css("display", "block");

        $(".app-header").css("height", "48px");
        $("body").css("padding-top", "47px");
        $(".e-sidebar.e-left").attr('style', 'top:48px !important; z-index: 1000');
        $("#summaryText").css("text-align", "initial");
        $(".customLogo").css("font-size", "14px").css("width", "auto");
        if (windowWidth > 1366) {
            $(".header-icons").attr('style', 'font-size: 15px !important; line-height: 1.25 !important;');
        }
        else {
            $(".header-icons").attr('style', 'font-size: 13px !important; line-height: 1 !important;');
        }
        $(".header-icon-text").css("font-size", "11px").css("padding-bottom", "6px");
        $(".header-icons-separator").css("font-size", "11px").css("top", "-3px");
        $("#userProfile").css("margin-top", "10px");
        $('.customLogoText').css("margin-top", "0");
        $("#waitforOrganizer").css("padding-top", "12px");
        $("#organizerMessage").addClass("warningmsguser");

        $("#hamburger.menu").css("position", "absolute");
        $('.header-btns').insertBefore($('#userProfile'));
        $($(".header-btns")[0]).css("margin-top", "7px").css("display", "flex");
        $($(".pause-btn-div")[0]).css("margin-right", "6px").css("margin-left", "6px").css("text-align", "initial");
        $("#pauseBtn").css("color", "#FFFFFF");
        if ((isAllStoryEstimated && (typeof isAllStoryEstimated === "string") && isAllStoryEstimated.toLocaleLowerCase() === "true") || roomStatus === "open") {
            $($(".start-btn-div")[0]).css("text-align", "left");
        }
        else {
            $($(".start-btn-div")[0]).css("text-align", "initial");
        }

        if (roomStatus === "inprogress" || roomStatus === "paused" || roomStatus === "closed") {
            $("#roomDigitalTimerText").removeClass("hide");
            $("#roomDigitalTimer").css("font-size", "13px").css("display", "block").css("vertical-align", "initial");
            $("#timerDivider").addClass("hide");
            $('#rTimer').append($('#roomDigitalTimer'));
            $('#userProfile').prepend($('#rTimer'));
            $(".header-divider").removeClass("hide");
        }

        if ((isAvgCalculated && isAvgCalculated === "true") || (isStoryEstimated && isStoryEstimated === "true")) {
            $(".stroy-detail-div").removeClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
            $(".stroy-detail-div").addClass("col-lg-9 col-md-9 col-sm-9 col-xs-9");
            $(".final-time-div").addClass("col-lg-3 col-md-3 col-sm-3 col-xs-3");
            $('.final-time-div').append($('.final-time-header'));
            $('.final-time-div').append($('.final-time-value'));
            $(".final-time-header").css("display", "table-row");
            $(".final-time-value").css("display", "table-row");
            $(".mobile-story-timer").addClass("hide");
            var txt = "Story Timer";
            if (isStoryEstimated === "true") {
                txt = "Time Taken";
            }
            $(".final-time-header").text(txt);
            $(".final-time-header").css("font-size", "13px");
            $(".final-time-div").css("display", "table");
        }
        else {
            if (hasTimer && hasTimer === "true") {
                $(".stroy-detail-div").removeClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                $(".stroy-detail-div").addClass("col-lg-8 col-md-8 col-sm-8 col-xs-8");
                $(".story-timer-div").addClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
                $('#gaugeContent').prepend($('#storyDigitalTimerText'));
                $('#gaugeContent').append($('#storyDigitalTimer'));
                $(".mobile-story-timer").addClass("hide");
                $(".mobile-story-timer").css("display", "flex").css("justify-content", "center");
                $("#storyDigitalTimerText").css("font-size", "12px").css("padding-top", "0").css("padding-right", "0");
            }
        }

        if (startButton && toggleStartBtn.content !== "") {
            var btnValue = toggleStartBtn.content;
            if (btnValue.toLowerCase().startsWith("start")) {
                toggleStartBtn.content = 'Start Playing';
            }
            else if (btnValue.toLowerCase().startsWith("stop")) {
                toggleStartBtn.content = 'Stop Playing';
            }
            else {
                toggleStartBtn.content = 'End Game';
            }
            startButton.style.cssText = "width : 140px";
        }
        var finishVotingBtnElem = $("#finishVoting");
        if (finishVotingBtnElem.length > 0) {
            finishVotingBtnElem.find('span').text("Finish Voting");
            finishVotingBtn.style.cssText = "width : 165px";
        }
        var skipStoryElem = $("#skipStory");
        if (skipStoryElem.length > 0) {
            skipStoryElem.find('span').text("SKIP THE STORY");
        }
        var nextStoryElem = $("#nextStory");
        if (nextStoryElem.length > 0) {
            nextStoryElem.find('span').text("NEXT STORY");
        }

        defaultSidebar.type = "Push";
        defaultSidebar.closeOnDocumentClick = false;
        defaultSidebar.showBackdrop = false;
    }
}

function BindGridData(dataSource) {
    storyListGridObj = document.getElementById("storyListGrid").ej2_instances[0];
    storyListGridData = storyListGridObj.dataSource;
    if (dataSource) {
        storyListGridObj.dataSource = dataSource;
    }

    var isSeachStoryInPlan;
    var searchKey = document.getElementsByClassName('search-txt')[0];
    if (searchKey) {
        searchKey.onkeyup = function (e) {
            if (searchKey.value.trim() !== "") {
                isSeachStoryInPlan = true;
            }
            if (e.keyCode === 13) {
                var searchKeys = document.getElementsByClassName('search-txt')[0];
                if (searchKeys.value.trim() !== "") {
                    fromSearchOrFilter = true;
                    var planCloseInputKey = document.getElementById('plancloseiconid');
                    planCloseInputKey.style.display = "block";
                    var planBorderWidthInput = document.getElementById('increased-width-Id');
                    planBorderWidthInput.style.width = "122%";
                    $("#increased-width-Id").removeClass("increased-width");
                    storyListGridObj.search(searchKey.value);
                }

            }
            else if (e.keyCode === 8 || e.keyCode === 46) {
                var searchKeyLength = document.getElementsByClassName('search-txt')[0];
                if (searchKeyLength.value.length === 0) {
                    if (isSeachStoryInPlan) {
                        searchKeyLength.value = "";
                        storyListGridObj.search(searchKeyLength.value);
                        var planCloseInputKeys = document.getElementById('plancloseiconid');
                        planCloseInputKeys.style.display = "none";
                        $("#increased-width-Id").addClass("increased-width");
                        isSeachStoryInPlan = false;
                        if (storyListGridObj.dataSource.length === 0) {
                            var searchKeyss = document.getElementsByClassName('search-txt')[0];
                            if (searchKeyss.value.trim() === "") {
                                $('#increased-width-Id').attr('readonly', true);
                                $('#increased-width-Id').addClass('input-disabled');
                                $(".search").find('span').addClass("disabled");
                            }

                        } else {
                            $('#increased-width-Id').attr('readonly', false);
                            $('#increased-width-Id').removeClass('input-disabled');
                            $(".search").find('span').removeClass("disabled");
                            var filterText = $(".story-filter-ul .glyphicon-ok").parent().text();
                            var filters = filterText !== undefined ? filterText.trim().toLowerCase() : "all";
                            FilterGrid(filters);
                        }
                    }
                }

            }
        };

        document.getElementsByClassName('search-btn')[0].onclick = function () {
            var searchKeys = document.getElementsByClassName('search-txt')[0];
            if (searchKeys.value.trim() !== "") {
                fromSearchOrFilter = true;
                var planCloseInputKey = document.getElementById('plancloseiconid');
                planCloseInputKey.style.display = "block";
                var planBorderWidthInput = document.getElementById('increased-width-Id');
                planBorderWidthInput.style.width = "122%";
                $("#increased-width-Id").removeClass("increased-width");
                storyListGridObj.search(searchKey.value);
            }

        };
    }

    $(".story-filter-ul li a").click(function () {
        var proxy = $(this);
        $.each($(".story-filter-ul li"), function (key, value) {
            var spanElement = $(this).find('span');
            if (proxy[0].parentElement.id === $(this)[0].id) {
                spanElement.removeClass('no-icon');
                spanElement.addClass('glyphicon-ok');
            }
            else {
                if (!spanElement.hasClass('no-icon')) {
                    spanElement.addClass('no-icon');
                    spanElement.removeClass('glyphicon-ok');
                }
            }
        });

        if (this.innerText) {
            var filterValue = this.innerText.trim().toLowerCase();
            var filterWrapper = document.getElementsByClassName('filter-text-outer')[0];
            if (filterWrapper) {
                filterWrapper.classList.remove('hide');
                var searchWrapper = document.getElementsByClassName('search-wrapper')[0];
                searchWrapper.style.paddingTop = "20px";
                if (filterValue === "pending") {
                    var text = $("#filterWrapper").find(".filter-text").text("Pending");
                }
                else if (filterValue === "completed") {
                    var text = $("#filterWrapper").find(".filter-text").text("Completed");
                }
                else {
                    filterWrapper.classList.add('hide');
                    searchWrapper.style.paddingTop = "15px";
                }
            }

            FilterGrid(filterValue);
        }
    });
}

function storyCloseIconsClick() {
    var searchKey = document.getElementsByClassName('search-txt')[0];
    searchKey.value = "";
    var planCloseInputKey = document.getElementById('plancloseiconid');
    planCloseInputKey.style.display = "none";
    storyListGridObj.search(searchKey.value);
    $("#increased-width-Id").addClass("increased-width");
    if (storyListGridObj.dataSource.length === 0) {
        var searchKeyss = document.getElementsByClassName('search-txt')[0];
        if (searchKeyss.value.trim() === "") {
            $('#increased-width-Id').attr('readonly', true);
            $('#increased-width-Id').addClass('input-disabled');
            $(".search").find('span').addClass("disabled");
        }

    } else {
        $('#increased-width-Id').attr('readonly', false);
        $('#increased-width-Id').removeClass('input-disabled');
        $(".search").find('span').removeClass("disabled");
    }

    var filterValues = $(".story-filter-ul .glyphicon-ok").parent().text();
    var filter = filterValues !== undefined ? filterValues.trim().toLowerCase() : "all";
    FilterGrid(filter);
}

function RefreshStoryList(isRefresh) {
    var filterValue = $(".story-filter-ul .glyphicon-ok").parent().text();
    $.ajax({
        cache: false,
        type: 'POST',
        url: 'play/storieslist',
        dataType: 'json',
        data: {
            'roomId': roomId,
            'filter': filterValue !== undefined ? filterValue.trim().toLowerCase() : "all",
        },
        timeout: defaultValues.timeout,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        success: function (response) {
            if (isRefresh) {
                var activemapperstoryid = $("#storyContent").find(".shown").data("id");
                mapperStoryId = activemapperstoryid.toString();
                storyListGridObj.dataSource = response.result;
            }
            else {
                if (document.getElementById("storyListGrid")) {
                    BindGridData(response.result);
                }
            }
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
    });
}

function StartGame() {
    var crntStoryId = $("#storyContent").find(".shown").data("id");
    if (crntStoryId && crntStoryId > 0) {
        ej.popups.showSpinner(targetId);
        $.ajax({
            cache: false,
            data: {
                'roomId': roomId,
                'currentStoryId': crntStoryId,
            },
            dataType: 'html',
            timeout: defaultValues.timeout,
            complete: function () {
                ej.popups.hideSpinner(targetId);
            },
            type: "POST",
            url: 'startplan',
            error: function (xmlhttprequest, textstatus, errormessage) {
                roomStatus = "open";
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
                var votingStatusContent = $(response).find("#votingStatusContainer");
                if (votingStatusContent.length > 0) {
                    if (response.toLowerCase().indexOf("access denied") !== -1) {
                        toastError.content = messages.accessDeniedMessage;
                        toastObj.show(toastError);
                    }
                    else if (response.indexOf("server error") !== -1 || response.toLowerCase().indexOf("unable to process the request") !== -1) {
                        toastError.content = messages.ajaxerrorMessage;
                        toastObj.show(toastError);
                    }
                    else {
                        roomStatus = "inprogress";
                        $(".pause-btn-div").removeClass("hide");
                        var cardsAreaContainer = document.getElementsByClassName('cards-area')[0];
                        if (cardsAreaContainer) {
                            cardsAreaContainer.innerHTML = "";
                            cardsAreaContainer.innerHTML = response;
                        }

                        startButton = document.getElementById('startBtn');
                        storyTimerContainer = document.getElementById('storyTimer');
                        currentTimeContainer = $(response).find('#currentTime')[0];
                        roomTotTimeElement = $(response).find('#roomTotalTime')[0];
                        roomStartTimeContainer = $(response).find('#roomStartTime')[0];
                        storyTotTimeElement = $(response).find('#storyTotalTime')[0];
                        storyStartTimeContainer = $(response).find('#storyStartTime')[0];
                        var footerTopElement = document.getElementById('btnFooterTop');
                        var skipStory = document.getElementById('skipStory');
                        var flipButton = document.getElementById('flipButton');
                        var footerBtn = document.getElementsByClassName('btn-footer')[0];

                        if (storyTimerContainer) {
                            var storyTimer = 0;
                            if (storyStartTimeContainer) {
                                storyTimer = InProgressTimeInSeconds(storyStartTimeContainer.value, null, null);
                            }
                            var storyTimerStartTime = 0;
                            if (storyTotTimeElement) {
                                storyTimerStartTime = parseInt(storyTotTimeElement.value, 10);
                            }

                            var startValue = 0;
                            var minValue = 0;
                            var maxValue = parseInt(storyTimerContainer.value, 10);
                            var midRangeValue = maxValue * .75;

                            var inProgressValue = (storyTimer + storyTimerStartTime) / 60;
                            if (inProgressValue < maxValue) {
                                startValue = inProgressValue;
                                var interval = startValue;
                                timerInterval = setInterval(function () {
                                    if (!gameIsPaused) {
                                        interval = interval + 0.0167;
                                        if (interval <= maxValue) {
                                            circulargauge.setPointerValue(0, 0, interval);
                                        }
                                        else {
                                            clearInterval(timerInterval);
                                        }
                                    }
                                }, 1000);
                            }
                            else {
                                startValue = maxValue;
                            }
                            RefreshGauge(startValue, minValue, maxValue, midRangeValue);

                            $("#storyDigitalTimer").timer('remove');
                            $("#storyDigitalTimer").timer({
                                format: '%H:%M:%S',
                                seconds: (storyTimer + storyTimerStartTime),
                            });
                        }

                        var timer = 0;
                        if (roomStartTimeContainer) {
                            timer = InProgressTimeInSeconds(roomStartTimeContainer.value, null, null);
                        }
                        var roomTimerStartTime = 0;
                        if (roomTotTimeElement) {
                            roomTimerStartTime = parseInt(roomTotTimeElement.value, 10);
                        }
                        $("#roomDigitalTimer").timer({
                            format: '%H:%M:%S',
                            seconds: (timer + roomTimerStartTime),
                        });

                        var windowWidth = $(window).width();
                        if (windowWidth > 960) {
                            $("#roomDigitalTimerText").removeClass("hide");
                            toggleStartBtn.content = 'Stop Playing';
                            startButton.style.cssText = "width : 140px";
                        }
                        else {
                            toggleStartBtn.content = 'Stop';
                            startButton.style.cssText = "width : auto";
                            $("#roomDigitalTimer").css("font-size", "16px").css("display", "table-cell").css("vertical-align", "middle");
                            $("#timerDivider").removeClass("hide");
                            $(".header-divider").addClass("hide");
                            $('.customLogoText').append($('#roomDigitalTimer'));
                            $($(".start-btn-div")[0]).css("text-align", "left");
                        }
                        toggleStartBtn.disabled = false;
                        $('#userProfile').prepend($('#rTimer'));
                        if (windowWidth > 960) {
                            $(".header-divider").removeClass("hide");
                        }
                        $("#roomDigitalTimer").removeClass("hide");

                        if (footerTopElement) {
                            footerTopElement.classList.remove('hide');
                        }
                        if (skipStory && skipStory.classList.contains("hide")) {
                            skipStory.classList.remove("hide");
                        }
                        if (flipButton && flipButton.classList.contains("hide")) {
                            flipButton.classList.remove("hide");
                        }
                        if (footerBtn && footerBtn.classList.contains("hide")) {
                            footerBtn.classList.remove("hide");
                            var playAreaHeight = parseInt($(".play-area").css("height"));
                            var footerHeight = parseInt($('.btn-footer').css("height"));
                            playAreaHeight = playAreaHeight - footerHeight;
                            $(".play-area").css("height", playAreaHeight);
                        }

                        toggleStartBtn.cssClass = 'start-btn e-danger';
                        togglePauseBtn.content = 'Pause';
                        togglePauseBtn.iconCss = 'e-icons e-pause-icon';
                        togglePauseBtn.cssClass = 'pause-btn e-flat';

                        pauseButton.classList.remove('hide');
                        mapperStoryContainer = $(response).find('#mapperStoryId')[0];
                        if (mapperStoryContainer) {
                            mapperStoryId = mapperStoryContainer.value;
                        }
                        RefreshPlayerList();
                        ResizeHeight();
                        toastSuccess.content = messages.startPlanMessage;
                        toastObj.show(toastSuccess);
                    }
                }
                else {
                    roomStatus = "open";
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
            },
        });
    }
}

function PauseGame() {
    ej.popups.showSpinner(targetId);
    var crntStoryId = $("#storyContent").find(".shown").data("id");
    if (crntStoryId && crntStoryId > 0) {
        $.ajax({
            cache: false,
            data: {
                'roomId': roomId,
                'currentStoryId': crntStoryId,
            },
            dataType: 'json',
            timeout: defaultValues.timeout,
            complete: function () {
                ej.popups.hideSpinner(targetId);
            },
            type: "POST",
            url: 'pauseplan',
            error: function (xmlhttprequest, textstatus, errormessage) {
                roomStatus = "inprogress";
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
                if (response.success) {
                    gameIsPaused = true;
                    if (response.hasTimer) {
                        $("#storyDigitalTimer").timer("pause");
                    }
                    $("#roomDigitalTimer").timer("pause");
                    roomStatus = "paused";
                    togglePauseBtn.content = 'Resume';
                    togglePauseBtn.iconCss = 'e-icons e-play-icon';
                    toastSuccess.content = messages.pausePlanMessage;
                    toastObj.show(toastSuccess);
                    var waitOrgContainer = document.getElementById('waitforOrganizer');
                    if (waitOrgContainer) {
                        waitOrgContainer.innerText = messages.gamePausedOwnerMessage;
                        waitOrgContainer.classList.remove('hide');
                        $("#waitforOrganizer").css("padding-top", "12px");
                        $("#organizerMessage").addClass("warningmsguser");
                    }

                    pauseDialogObj.header = "Game is Paused";
                    pauseDialogObj.content = '<div class="confirmdialog-icon confirmdialog-success" style="display: block;border-color:skyblue !important;border:1px solid transparent"><span class="material-icons" style="font-size: 45px;margin-top: 19px;color:skyblue;opacity:100%;radius:0px;">pause</span></div><h2 class="confirmdialog-title" id="confirmdialog-title" style="font-size:16px !important;opacity:100%;color:#000000 !important;line-height:19px;" >Game paused </h2><div id="confirmdialog-content" class="confirmdialog-content" style="display:block;font-size:14px !important;opacity:100%;color:#757575 !important;line-height:16px;">No one can vote. If you want to continue, click the Resume button.</div>';
                    $("#pauseGameDialog").removeClass("hide");
                    pauseDialogObj.show();
                    var pauseButton = document.getElementById('pauseBtn');
                    pauseButton.style.cssText = "display : none";
                }
                else {
                    roomStatus = "inprogress";
                    if (response.errorMsg) {
                        toastError.content = response.errorMsg;
                        toastObj.show(toastError);
                    }
                    else {
                        toastError.content = messages.ajaxerrorMessage;
                        toastObj.show(toastError);
                    }
                }
            },
        });
    }
}

function ResumeGame() {
    ej.popups.showSpinner(targetId);
    var crntStoryId = $("#storyContent").find(".shown").data("id");
    if (crntStoryId && crntStoryId > 0) {
        $.ajax({
            cache: false,
            data: {
                'roomId': roomId,
                'currentStoryId': crntStoryId,
            },
            dataType: 'json',
            timeout: defaultValues.timeout,
            complete: function () {
                ej.popups.hideSpinner(targetId);
            },
            type: "POST",
            url: 'resumeplan',
            error: function (xmlhttprequest, textstatus, errormessage) {
                roomStatus = "paused";
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
                if (response.success) {
                    gameIsPaused = false;
                    if (response.hasTimer && response.storyStatus.toLowerCase() !== "estimated") {
                        $("#storyDigitalTimer").timer("resume");
                    }
                    $("#roomDigitalTimer").timer("resume");
                    roomStatus = "inprogress";
                    togglePauseBtn.content = 'Pause';
                    togglePauseBtn.iconCss = 'e-icons e-pause-icon';
                    toastSuccess.content = messages.resumePlanMessage;
                    toastObj.show(toastSuccess);
                    var waitOrgContainer = document.getElementById('waitforOrganizer');
                    if (waitOrgContainer) {
                        waitOrgContainer.innerText = messages.waitForOrganizerMessage;
                        waitOrgContainer.classList.add('hide');
                    }
                    var pauseButton = document.getElementById('pauseBtn');
                    pauseButton.classList.remove('e-active');
                    pauseButton.style.cssText = "display : inline-table";
                    var windowWidth = $(window).width();
                    if (windowWidth > 960) {
                        pauseButton.style.cssText = "color : #FFFFFF";
                    }
                    else {
                        pauseButton.style.cssText = "color : black";
                    }
                }
                else {
                    roomStatus = "paused";
                    if (response.errorMsg) {
                        toastError.content = response.errorMsg;
                        toastObj.show(toastError);
                    }
                    else {
                        toastError.content = messages.ajaxerrorMessage;
                        toastObj.show(toastError);
                    }
                }
            },
        });
    }
}

function StopGame() {
    if (roomStatus !== "open") {
        var crntStoryStatus = $("#storyContent").find(".shown").data("status");
        var msgContent = "Once the game is stopped you will be redirected to dashboard page.";
        var crntStoryId = $("#storyContent").find(".shown").data("id");
        if (crntStoryId && crntStoryId > 0) {
            var filter = $(".story-filter-ul").find(".glyphicon-ok").parent().text().trim().toLowerCase();
            confirmDialogObj.header = "Stop Game";
            confirmDialogObj.content = '<div class="confirmdialog-icon confirmdialog-warning" style="display: block;">!</div><h2 class="confirmdialog-title  stopgame-title" id="confirmdialog-title">Do you want to stop the game?</h2><div id="confirmdialog-content" class="confirmdialog-content stopgame-content" style="display: block;">' + msgContent + '</div>';
            confirmDialogObj.currStoryId = crntStoryId;
            confirmDialogObj.roomId = roomId;
            confirmDialogObj.filterValue = filter;
            $("#confirmDialog").removeClass("hide");
            confirmDialogObj.show();
        }
        else {
            toastError.content = messages.ajaxerrorMessage;
            toastObj.show(toastError);
        }
    }
    else {
        toastError.content = messages.ajaxerrorMessage;
        toastObj.show(toastError);
    }
}

function EndGame() {
    if (roomStatus !== "open") {
        var crntStoryId = $("#storyContent").find(".shown").data("id");
        if (crntStoryId && crntStoryId > 0) {
            confirmDialogObj.header = "End Game";
            confirmDialogObj.content = '<div class="confirmdialog-icon confirmdialog-warning" style="display: block;">!</div><h2 class="confirmdialog-title" id="confirmdialog-title">Are you sure?</h2><div id="confirmdialog-content" class="confirmdialog-content" style="display: block;">You want to end the game? Once the game is ended you cant do any changes in this room.</div>';
            confirmDialogObj.currStoryId = crntStoryId;
            confirmDialogObj.roomId = roomId;
            $("#confirmDialog").removeClass("hide");
            confirmDialogObj.show();
        }
        else {
            toastError.content = messages.ajaxerrorMessage;
            toastObj.show(toastError);
        }
    }
    else {
        toastError.content = messages.ajaxerrorMessage;
        toastObj.show(toastError);
    }
}

function ResetEstimatedStory(nxtStoryId) {
    ej.popups.showSpinner(targetId);
    var crntStoryId = $("#storyContent").find(".shown").data("id");
    var filter = $(".story-filter-ul").find(".glyphicon-ok").parent().text().trim().toLowerCase();
    var checkPendingStory = false;
    if (sessionStorage.checkPendingStory !== "null" && sessionStorage.checkPendingStory === "true") {
        checkPendingStory = true;
    }
    var searchKeyValue = document.getElementsByClassName('search-txt')[0];
    var searchval = "";
    if (searchKeyValue) {
        searchval = searchKeyValue.value;
    }
    $.ajax({
        cache: false,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        data: {
            'roomId': roomId,
            'currentStoryId': crntStoryId,
            'nextStoryId': nxtStoryId,
            'filter': filter,
            'checkPendingStory': checkPendingStory,
            'searchText': searchval,
        },
        dataType: 'json',
        timeout: defaultValues.timeout,
        type: "POST",
        url: 'resetestimatedstory',
        error: function (xmlhttprequest, textstatus, errormessage) {
            sessionStorage.checkPendingStory = null;
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
            if (response.success) {
                if (checkPendingStory) {
                    sessionStorage.checkPendingStory = true;
                }
                else {
                    sessionStorage.checkPendingStory = null;
                }

                if (sessionStorage.ResetFrom === "gridrow") {
                    var rowId = sessionStorage.rowId;
                    $.each($(".grid-row"), function (key, value) {
                        if (rowId === this.id) {
                            var currentPage = storyListGridObj.pageSettings.currentPage - 1;
                            var pageSize = storyListGridObj.pageSettings.pageSize;
                            var storyId = (currentPage * pageSize) + key;
                            GetNextStory(storyId);
                        }
                        else {
                            $(this).removeClass('active');
                        }
                    });
                    sessionStorage.ResetFrom = "";
                }
                else if (sessionStorage.ResetFrom === "nextlink") {
                    var storyid = sessionStorage.StryId;
                    GetNextStory(storyid);
                    sessionStorage.ResetFrom = "";
                }
            }
            else {
                sessionStorage.checkPendingStory = null;
                roomStatus = "open";
                if (response.errorMsg) {
                    toastError.content = response.errorMsg;
                    toastObj.show(toastError);
                }
                else {
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
            }
        },
    });
}

function EstimateClick(args) {
    ej.popups.showSpinner(targetId);
    var crntStoryId = $("#storyContent").find(".shown").data("id");
    var filter = $(".story-filter-ul").find(".glyphicon-ok").parent().text().trim().toLowerCase();
    var loggedInUser = parseInt($('#groupOwnerId').html(), 10);
    var sss = CurrentStoryRowIndex();

    if (selectedCard === "½") {
        selectedCard = 0.5;
    }
    UpdateEstimatedVote(crntStoryId, selectedCard, filter, loggedInUser);

    setTimeout(function () {
        var randomVotedCardUser1 = defaultRoomCardList[Math.floor(Math.random() * defaultRoomCardList.length)];
        UpdateEstimatedVote(crntStoryId, randomVotedCardUser1, filter, 1);
        setTimeout(function () {
            var randomVotedCardUser2 = defaultRoomCardList[Math.floor(Math.random() * defaultRoomCardList.length)];
            UpdateEstimatedVote(crntStoryId, randomVotedCardUser2, filter, 2);
        }, 2000);
    }, 2000);
}

function UpdateEstimatedVote(crntStoryId, selectedCard, filter, loggedInUser) {
    $.ajax({
        cache: false,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        data: {
            'roomId': roomId,
            'storyId': crntStoryId,
            'estimatedPoint': selectedCard,
            'currentStoryIndex': CurrentStoryRowIndex(),
            'filter': filter,
            'userId': loggedInUser
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
            var storyContent = $(response).find("#storyTemplate");
            if (storyContent.length > 0) {
                if (response.indexOf("No stories found") !== -1) {
                    var playAreaContainer = document.getElementsByClassName('play-area')[0];
                    playAreaContainer.innerHTML = "";
                    playAreaContainer.innerHTML = response;
                }
                else if (response.indexOf("server error") !== -1 || response.toLowerCase().indexOf("unable to process the request") !== -1) {
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
                else if (response.toLowerCase().indexOf("access denied") !== -1) {
                    toastError.content = messages.accessDeniedMessage;
                    toastObj.show(toastError);
                }
                else {
                    var playAreaContainer = document.getElementsByClassName('play-area')[0];
                    playAreaContainer.innerHTML = "";
                    playAreaContainer.innerHTML = response;
                    EnableAnchor();

                    var stryStsContainer = document.getElementById('storyStatus');
                    currentStoryStatus = stryStsContainer != null ? stryStsContainer.value : "";
                    storyTimerContainer = document.getElementById('storyTimer');
                    currentTimeContainer = $(response).find('#currentTime')[0];
                    roomTotTimeElement = document.getElementById('roomTotalTime');
                    roomStartTimeContainer = document.getElementById('roomStartTime');
                    roomEndTimeContainer = document.getElementById('roomEndTime');
                    roomIdleTimeContainer = document.getElementById('roomIdleTime');
                    storyTotTimeElement = document.getElementById('storyTotalTime');
                    storyStartTimeContainer = document.getElementById('storyStartTime');
                    storyEndTimeContainer = document.getElementById('storyEndTime');
                    storyIdleTimeContainer = document.getElementById('storyIdleTime');
                    hasTimerContainer = $(response).find('#hasTimer')[0];
                    hasTimer = hasTimerContainer != null ? hasTimerContainer.value.toLowerCase() : "";

                    var windowWidth = $(window).width();
                    if (windowWidth < 961) {
                        $("#timerGauge").css("display", "none");

                        if (hasTimer && hasTimer === "true") {
                            $(".story-timer-div").removeClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
                            $(".stroy-detail-div").removeClass("col-lg-8 col-md-8 col-sm-8 col-xs-8");
                            $(".stroy-detail-div").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                            $('.mobile-story-timer').append($('#storyDigitalTimerText'));
                            $('.mobile-story-timer').append($('#storyDigitalTimer'));
                            $(".mobile-story-timer").removeClass("hide");
                            $(".mobile-story-timer").css("display", "flex").css("justify-content", "center");
                            $("#storyDigitalTimerText").css("font-size", "15px").css("padding-top", "4px").css("padding-right", "2px");
                        }
                    }
                    else {
                        $("#timerGauge").css("display", "block");
                    }

                    if (hasTimer && hasTimer === "true") {
                        LoadGauge();
                    }
                    isTeamAvgView = false;
                    ResizeHeight();
                    AdjustFooter();
                    RefreshPlayerList();
                    RefreshStoryDescription();
                }
            }
            else {
                if (!response.message) {
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
                else {
                    if (response.message === "cant vote") {
                        toastError.content = messages.cantVoteMessage;
                        toastObj.show(toastError);
                    }
                    else if (response.message === "invalid status to vote") {
                        toastError.content = messages.invalidStatusVoteMessage;
                        toastObj.show(toastError);
                    }
                }
            }
        },
        timeout: defaultValues.timeout,
        type: "POST",
        url: 'updatevote'
    });
}

function FlipClick(args) {
    ej.popups.showSpinner(targetId);
    var crntStoryId = $("#storyContent").find(".shown").data("id");
    var filter = $(".story-filter-ul").find(".glyphicon-ok").parent().text().trim().toLowerCase();
    $.ajax({
        cache: false,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        data: {
            'roomId': roomId,
            'storyId': crntStoryId,
            'currentStoryIndex': CurrentStoryRowIndex(),
            'filter': filter,
        },
        dataType: 'html',
        timeout: defaultValues.timeout,
        type: "POST",
        url: 'completevote',
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
            var playAreaContent = $(response).find(".play-area-inner");
            if (playAreaContent.length > 0) {
                if (response.toLowerCase().indexOf("access denied") !== -1) {
                    toastError.content = messages.accessDeniedMessage;
                    toastObj.show(toastError);
                }
                else if (response.indexOf("server error") !== -1 || response.toLowerCase().indexOf("unable to process the request") !== -1) {
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
                else {
                    var windowWidth = $(window).width();
                    if (windowWidth < 961) {
                        $('#appHeaderInner').append($('.header-btns'));
                    }
                    var playAreaContainer = document.getElementsByClassName('play-area')[0];
                    playAreaContainer.innerHTML = "";
                    playAreaContainer.innerHTML = response;
                    RefreshStoryDescription();
                    if (windowWidth < 961) {
                        $('.play-area-inner').prepend($('.header-btns'));
                    }

                    currentTimeContainer = $(response).find('#currentTime')[0];
                    roomTotTimeElement = document.getElementById('roomTotalTime');
                    roomStartTimeContainer = document.getElementById('roomStartTime');
                    roomEndTimeContainer = document.getElementById('roomEndTime');
                    roomIdleTimeContainer = document.getElementById('roomIdleTime');
                    storyTotTimeElement = document.getElementById('storyTotalTime');
                    storyStartTimeContainer = document.getElementById('storyStartTime');
                    storyEndTimeContainer = document.getElementById('storyEndTime');
                    storyIdleTimeContainer = document.getElementById('storyIdleTime');
                    finishVotingBtn = document.getElementById('finishVoting');

                    if (timerInterval) {
                        clearInterval(timerInterval);
                    }

                    var storyTimer = 0;
                    if (storyStartTimeContainer) {
                        storyTimer = InProgressTimeInSeconds(storyStartTimeContainer.value, storyEndTimeContainer != null ? storyEndTimeContainer.value : null, storyIdleTimeContainer != null ? storyIdleTimeContainer.value : null);
                    }
                    var storyTimerStartTime = 0;
                    if (storyTotTimeElement) {
                        storyTimerStartTime = parseInt(storyTotTimeElement.value, 10);
                    }

                    $("#storyDigitalTimer").timer({
                        format: '%H:%M:%S',
                        seconds: (storyTimer + storyTimerStartTime),
                    });
                    if (roomStatus === "paused" || currentStoryStatus.toLowerCase() === "estimated") {
                        $("#storyDigitalTimer").timer("pause");
                    }
                    isAvgCalculated = "true";
                    isStoryEstimated = "false";
                    LoadChart(crntStoryId);
                    var button = new ej.buttons.Button();
                    button.appendTo('#finishVoting');

                    if (windowWidth < 961) {
                        var finishVotingBtnElem = $("#finishVoting");
                        if (finishVotingBtnElem.length > 0) {
                            finishVotingBtnElem.find('span').text("Finish");
                            finishVotingBtn.style.cssText = "width : auto";
                        }
                        var nextStoryElem = $("#nextStory");
                        if (nextStoryElem.length > 0) {
                            nextStoryElem.find('span').text("NEXT");
                        }

                        $(".final-time-div").removeClass("col-lg-3 col-md-3 col-sm-3 col-xs-3");
                        $(".stroy-detail-div").removeClass("col-lg-9 col-md-9 col-sm-9 col-xs-9");
                        $(".stroy-detail-div").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                        $('.mobile-story-timer').append($('.final-time-header'));
                        $('.mobile-story-timer').append($('.final-time-value'));
                        $(".final-time-header").css("display", "initial");
                        $(".final-time-value").css("display", "initial");
                        $(".mobile-story-timer").removeClass("hide");
                        $(".final-time-header").text("Story Timer: ");
                        $(".final-time-header").css("font-size", "15px");
                        $(".final-time-div").css("display", "block");
                    }
                    else {
                        var finishVotingBtnElem = $("#finishVoting");
                        if (finishVotingBtnElem.length > 0) {
                            finishVotingBtnElem.find('span').text("Finish Voting");
                            finishVotingBtn.style.cssText = "width : 165px";
                        }
                        var nextStoryElem = $("#nextStory");
                        if (nextStoryElem.length > 0) {
                            nextStoryElem.find('span').text("NEXT STORY");
                        }
                    }

                    isTeamAvgView = true;
                    RefreshPlayerList();
                    ResizeHeight();
                }
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
    });
}

function FinishVotingClick(args) {
    ej.popups.showSpinner(targetId);
    var crntStoryId = $("#storyContent").find(".shown").data("id");
    var filter = $(".story-filter-ul").find(".glyphicon-ok").parent().text().trim().toLowerCase();
    $.ajax({
        cache: false,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        data: {
            'roomId': roomId,
            'storyId': crntStoryId,
            'currentStoryIndex': CurrentStoryRowIndex(),
            'filter': filter,
        },
        dataType: 'html',
        timeout: defaultValues.timeout,
        type: "POST",
        url: 'finishvoting',
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
            var playAreaContent = $(response).find(".play-area-inner");
            if (playAreaContent.length > 0) {
                if (response.toLowerCase().indexOf("access denied") !== -1) {
                    toastError.content = messages.accessDeniedMessage;
                    toastObj.show(toastError);
                }
                if (response.toLowerCase().indexOf("estimated already") !== -1) {
                    toastError.content = messages.alreadyEstimatedMessag;
                    toastObj.show(toastError);
                }
                else if (response.indexOf("server error") !== -1 || response.toLowerCase().indexOf("unable to process the request") !== -1) {
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
                else {
                    var windowWidth = $(window).width();
                    if (windowWidth < 961) {
                        $('#appHeaderInner').append($('.header-btns'));
                    }
                    var playAreaContainer = document.getElementsByClassName('play-area')[0];
                    playAreaContainer.innerHTML = "";
                    playAreaContainer.innerHTML = response;
                    storyTotTimeElement = document.getElementById('storyTotalTime');
                    storyStartTimeContainer = document.getElementById('storyStartTime');
                    storyEndTimeContainer = document.getElementById('storyEndTime');
                    storyIdleTimeContainer = document.getElementById('storyIdleTime');

                    if (timerInterval) {
                        clearInterval(timerInterval);
                    }

                    var storyTimer = 0;
                    if (storyStartTimeContainer) {
                        storyTimer = InProgressTimeInSeconds(storyStartTimeContainer.value, storyEndTimeContainer != null ? storyEndTimeContainer.value : null, storyIdleTimeContainer != null ? storyIdleTimeContainer.value : null);
                    }
                    var storyTimerStartTime = 0;
                    if (storyTotTimeElement) {
                        storyTimerStartTime = parseInt(storyTotTimeElement.value, 10);
                    }

                    $("#storyDigitalTimer").timer({
                        format: '%H:%M:%S',
                        seconds: (storyTimer + storyTimerStartTime),
                    });
                    $("#storyDigitalTimer").timer("pause");

                    RefreshStoryDescription();
                    if (windowWidth < 961) {
                        $('.play-area-inner').prepend($('.header-btns'));
                    }
                    isAvgCalculated = "true";
                    isStoryEstimated = "true";
                    LoadChart(crntStoryId);

                    var totalStories = $(response).find("#totalStories");
                    var totalEstimatedStories = $(response).find("#totalEstimatedStories");
                    var totalEstimatedStoryPoints = $(response).find("#totalEstimatedStoryPoints");
                    if (totalStories && totalEstimatedStories) {
                        if (windowWidth < 961) {
                            $("#estVsTotStories").text(totalEstimatedStories.val() + "/" + totalStories.val());
                        }
                        else {
                            $("#estVsTotStories").text(totalEstimatedStories.val() + "/" + totalStories.val() + " Completed");
                        }
                    }
                    if (totalEstimatedStoryPoints) {
                        var elem = document.getElementById("totStoryPoints");
                        if (windowWidth < 961) {
                            elem.innerText = totalEstimatedStoryPoints.val();
                        }
                        else {
                            elem.innerText = "Total Story Points: " + totalEstimatedStoryPoints.val();
                        }
                    }

                    if (windowWidth < 961) {
                        if (document.getElementById("nextStory")) {
                            $(document.getElementById("nextStory")).find('span').text("NEXT");
                        }

                        $(".final-time-div").removeClass("col-lg-3 col-md-3 col-sm-3 col-xs-3");
                        $(".stroy-detail-div").removeClass("col-lg-9 col-md-9 col-sm-9 col-xs-9");
                        $(".stroy-detail-div").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                        $('.mobile-story-timer').append($('.final-time-header'));
                        $('.mobile-story-timer').append($('.final-time-value'));
                        $(".final-time-header").css("display", "initial");
                        $(".final-time-value").css("display", "initial");
                        $(".mobile-story-timer").removeClass("hide");
                        $(".final-time-header").text("Time Taken: ");
                        $(".final-time-header").css("font-size", "15px");
                        $(".final-time-div").css("display", "block");
                    }
                    else {
                        if (document.getElementById("nextStory")) {
                            $(document.getElementById("nextStory")).find('span').text("NEXT STORY");
                        }
                    }

                    isAllStoryEstimated = $(response).find("#isAllStoryEstimated").val();
                    if (isAllStoryEstimated.toLocaleLowerCase() === "true") {
                        $(".pause-btn-div").addClass("hide");
                        if (windowWidth < 961) {
                            toggleStartBtn.content = 'End';
                            startButton.style.cssText = "width : auto";
                            $($(".start-btn-div")[0]).css("text-align", "right");
                        }
                        else {
                            toggleStartBtn.content = 'End Game';
                            startButton.style.cssText = "width : 140px";
                            $($(".start-btn-div")[0]).css("text-align", "left");
                        }
                        toggleStartBtn.cssClass = 'start-btn e-warning';
                        toggleStartBtn.disabled = false;
                    }

                    isTeamAvgView = true;
                    ResizeHeight();
                    toastSuccess.content = messages.estimationCompletedMessage;
                    toastObj.show(toastSuccess);

                    RefreshStoryList(true);
                }
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
    });
}

function CurrentStoryRowIndex() {
    var index = 0;
    $.each($("#storyListGrid_content_table .grid-row"), function (key, value) {
        index++;
        if ($(this).hasClass("active")) {
            return false;
        }
    });
    return index;
}

function LoadChart(storyId) {
    ej.popups.showSpinner(targetId);
    $.ajax({
        cache: false,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        data: {
            'roomId': roomId,
            'storyId': storyId,
        },
        dataType: 'json',
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
            if (response.success) {
                var dataSourceList = response.result.ChartDataList;
                var avgEst = response.result.FinalPoint;

                var allowEditable = false;
                if (isOwner === "true" && isStoryEstimated === "false") {
                    allowEditable = true;
                }
                centerTitle.innerHTML = '<span id="storyPoint" class="editable-story-point" data-type="text" data-pk="1" style="font-size:30px;" >' + avgEst + '</span><br><p style="color: #1F1F1F; font-size:16px; text-align:center;">Point(s)</p>' + (allowEditable === true ? '<a id="editStoryPointLink" href="javascript:void(0)" class="link-colored-content" style="font-size: 15px;text-decoration: underline;">Edit Point</a>' : "");
                centerTitle.style.position = 'absolute';
                centerTitle.style.visibility = 'hidden';
                centerTitle.style.textAlign = 'center';

                var radius = "80%";
                var innerRadius = "65%";
                var legendHeight = "20%";
                var legendWidth = "50%";
                var windowWidth = $(window).width();
                if (windowWidth > 1366) {
                    radius = "100%";
                    innerRadius = "75%";
                    legendHeight = "15%";
                    legendWidth = "40%";
                }

                if (!document.getElementById("teamAverageChart").ej2_instances) {
                    var scripts = document.querySelectorAll("#targetId script");
                    var length = scripts.length;
                    for (var i = 0; i < length; i++) {
                        if (scripts[i].id === "" && scripts[i].text.indexOf("#teamAverageChart") !== -1) {
                            eval(scripts[i].text);
                            break;
                        }
                    }
                }

                teamAverageChartObj = document.getElementById("teamAverageChart").ej2_instances[0];
                teamAverageChartObj.series[0].dataSource = dataSourceList;
                teamAverageChartObj.series[0].radius = radius;
                teamAverageChartObj.series[0].innerRadius = innerRadius;
                teamAverageChartObj.legendSettings.height = legendHeight;
                teamAverageChartObj.legendSettings.width = legendWidth;
                teamAverageChartObj.refresh();
                document.getElementById('teamAverageChart').appendChild(centerTitle);

                if (allowEditable) {
                    $('#storyPoint').editable({
                        validate: function (value) {
                            if ($.trim(value) === '') {
                                return 'This field is required.';
                            }
                            else if ($.trim(value).length > 6) {
                                return 'Maximum length is 6.';
                            }
                            else if (!$.isNumeric($.trim(value))) {
                                return 'Enter valid story point.';
                            }
                        },
                        display: function (value) {
                            var x = value.replace(/^0+(?!\.|$)/, '');
                            $(this).text(x);
                        },
                        url: function (params) {
                            return $.ajax({
                                cache: false,
                                type: 'POST',
                                url: 'editavgestimation/',
                                data: { 'roomId': roomId, 'storyId': storyId, "estimatedPoint": params.value },
                                dataType: 'json',
                                success: function (response) {
                                    if (!response.success) {
                                        return response.msg;
                                    }
                                    else {
                                        teamAverageChartObj.refresh();
                                        toastSuccess.content = messages.editEstimatedPointMessage;
                                        toastObj.show(toastSuccess);
                                    }
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
                            });
                        },
                    });
                    $('#storyPoint').on('shown', function (e, editable) {
                        $(".editable-container .editable-input .input-sm").keydown(function (event) {
                            var key = window.event ? event.keyCode : event.which;
                            if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 35 || event.keyCode === 36 || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 190) {
                                return true;
                            }
                            else if (key < 48 || key > 57) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        });
                    });

                    $("#editStoryPointLink").click(function (e) {
                        e.stopPropagation();
                        $("#storyPoint").editable("toggle");
                    });
                }
                else {
                    $('#storyPoint').removeClass('editable-story-point');
                }
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
        timeout: defaultValues.timeout,
        type: 'GET',
        url: 'teamavglist',
    });
}

function chartAnimationComplete(args) {
    centerTitle.style.fontSize = getFontSize(args.accumulation.initialClipRect.width);
    var rect = centerTitle.getBoundingClientRect();
    centerTitle.style.top = (args.accumulation.center.y - rect.height / 2) + 'px';
    centerTitle.style.left = (args.accumulation.center.x - rect.width / 2) + 'px';
    centerTitle.style.visibility = 'visible';
    var points = args.accumulation.visibleSeries[0].points;
    for (var point in points) {
        if (point.labelPosition === 'Outside' && point.labelVisible) {
            var label = document.getElementById('teamAverageChart_datalabel_Series_0_text_' + point.index);
            label.setAttribute('fill', 'black');
        }
    }
}

function chartTextRender(args) {
    args.series.dataLabel.font.size = getFontSize(teamAverageChartObj.initialClipRect.width);
    teamAverageChartObj.animateSeries = true;
}

function LoadGauge() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    if (storyTimerContainer) {
        defMaxValue = parseFloat(storyTimerContainer.value);
        defMidRangeValue = defMaxValue * .75;

        if (roomStatus === "paused") {
            gameIsPaused = true;
        }
        else {
            gameIsPaused = false;
        }

        var storyTimer = 0;
        if (storyStartTimeContainer) {
            storyTimer = InProgressTimeInSeconds(storyStartTimeContainer.value, storyEndTimeContainer != null ? storyEndTimeContainer.value : null, storyIdleTimeContainer != null ? storyIdleTimeContainer.value : null);
        }
        var storyTimerStartTime = 0;
        if (storyTotTimeElement) {
            storyTimerStartTime = parseInt(storyTotTimeElement.value, 10);
        }

        var inProgressValue = (storyTimer + storyTimerStartTime) / 60;
        if (inProgressValue < defMaxValue) {
            defStartValue = inProgressValue;
            if (roomStatus === "inprogress") {
                var interval = defStartValue;
                timerInterval = setInterval(function () {
                    if (!gameIsPaused) {
                        interval = interval + 0.0167;
                        if (interval <= defMaxValue) {
                            circulargauge.setPointerValue(0, 0, interval);
                        }
                        else {
                            clearInterval(timerInterval);
                        }
                    }
                }, 1000);
            }
        }
        else {
            defStartValue = defMaxValue;
        }

        $("#storyDigitalTimer").timer({
            format: '%H:%M:%S',
            seconds: (storyTimer + storyTimerStartTime),
        });
        if (roomStatus === "inprogress" && currentStoryStatus.toLowerCase() !== "estimated") {
            $("#storyDigitalTimer").timer("resume");
        }
        else if (roomStatus === "open" || roomStatus === "paused" || roomStatus === "closed" || currentStoryStatus.toLowerCase() === "estimated") {
            $("#storyDigitalTimer").timer("pause");
        }
    }
    else {
        var storyTimer = 0;
        if (storyStartTimeContainer) {
            storyTimer = InProgressTimeInSeconds(storyStartTimeContainer.value, storyEndTimeContainer != null ? storyEndTimeContainer.value : null, storyIdleTimeContainer != null ? storyIdleTimeContainer.value : null);
        }
        var storyTimerStartTime = 0;
        if (storyTotTimeElement) {
            storyTimerStartTime = parseInt(storyTotTimeElement.value, 10);
        }

        $("#storyDigitalTimer").timer({
            format: '%H:%M:%S',
            seconds: (storyTimer + storyTimerStartTime),
        });
        if (roomStatus === "inprogress" && currentStoryStatus.toLowerCase() !== "estimated") {
            $("#storyDigitalTimer").timer("resume");
        }
        else if (roomStatus === "open" || roomStatus === "paused" || roomStatus === "closed" || currentStoryStatus.toLowerCase() === "estimated") {
            $("#storyDigitalTimer").timer("pause");
        }

        if (!storyTimerContainer) {
            $("#gaugeContent").addClass("story-dig-timer-pos");
        }
        else {
            $("#gaugeContent").removeClass("story-dig-timer-pos");
        }
    }
    BindGauge(defStartValue, defMinValue, defMaxValue, defMidRangeValue);
}

function BindGauge(startValue, minValue, maxValue, midRangeValue) {
    var gaugeHeight = "150px";
    var gaugeWidth = "200px";
    var gaugeSVGHeight = "90px";
    var windowWidth = $(window).width();
    if (windowWidth > 1366) {
        gaugeHeight = "200px";
        gaugeWidth = "300px";
        gaugeSVGHeight = "140px";
    }
    if (!document.getElementById("timerGauge").ej2_instances) {
        var scripts = document.querySelectorAll("#targetId script");
        var length = scripts.length;
        for (var i = 0; i < length; i++) {
            if (scripts[i].id === "" && scripts[i].text.indexOf("#timerGauge") !== -1) {
                eval(scripts[i].text);
                break;
            }
        }
    }

    circulargauge = document.getElementById("timerGauge").ej2_instances[0];
    circulargauge.heigth = gaugeHeight;
    circulargauge.width = gaugeWidth;
    circulargauge.axes[0].minimum = minValue;
    circulargauge.axes[0].maximum = maxValue;
    circulargauge.axes[0].pointers[0].value = startValue;
    circulargauge.axes[0].ranges[0].start = minValue;
    circulargauge.axes[0].ranges[0].end = midRangeValue;
    circulargauge.axes[0].ranges[1].start = midRangeValue;
    circulargauge.axes[0].ranges[1].end = maxValue;
    circulargauge.refresh();

    $("#timerGauge_svg").height(gaugeSVGHeight);
    $("#timerGauge_svg").css("margin-top", "10px");
}

function RefreshGauge(startValue, minValue, maxValue, midRangeValue) {
    var gaugeWidth = "200px";
    var gaugeSVGHeight = "90px";
    var windowWidth = $(window).width();
    if (windowWidth > 1366) {
        gaugeWidth = "300px";
        gaugeSVGHeight = "140px";
    }

    circulargauge.axes[0].minimum = minValue;
    circulargauge.axes[0].maximum = maxValue;
    circulargauge.axes[0].ranges[0].start = minValue;
    circulargauge.axes[0].ranges[0].end = midRangeValue;
    circulargauge.axes[0].ranges[1].start = midRangeValue;
    circulargauge.axes[0].ranges[1].end = maxValue;
    circulargauge.axes[0].pointers[0].value = startValue;
    circulargauge.refresh();
    $("#timerGauge_svg").width(gaugeWidth).height(gaugeSVGHeight);
    $("#timerGauge_svg").css("margin-top", "10px");
}

function getFontSize(width) {
    if (width > 300) {
        return '13px';
    } else if (width > 250) {
        return '8px';
    } else {
        return '6px';
    }
}

function tooltip(querycell) {
    if (querycell.data[querycell.column.field]) {
        querycell.cell.setAttribute('title', querycell.data[querycell.column.field]);
    }
}

function load() {
    if (targetId) {
        ej.popups.showSpinner(targetId);
    }
}

function create() {
    if (targetId) {
        ej.popups.hideSpinner(targetId);
    }
}

function dataBoundEvt() {
    if (storyListGridData && storyListGridData.length > 0) {
        var intMapperStoryId = parseInt(mapperStoryId, 10);
        var isCheckPendingStoryTeam = document.getElementById('isCheckPendingStoryTeam');
        var isCheckPendingStoryTemplate = document.getElementById('isCheckPendingStoryTemplate');
        if (intMapperStoryId > 0) {
            var lastIndex = 0;
            $("#storyListGrid_content_table tr").each(function (key, value) {
                if (parseInt(this.id, 10) === intMapperStoryId) {
                    $(this).addClass("active");
                    lastIndex = key;
                }
                else {
                    $(this).removeClass("active");
                }
            });
            if (roomStatus !== "open") {
                if ($("#storyListGrid_content_table tr").length === (lastIndex + 1)) {
                    if (!isCheckPendingStoryTeam) {
                        $("#nextStory").addClass("hide");
                    }
                    if (!isCheckPendingStoryTemplate) {
                        $("#skipStory").addClass("hide");
                    }
                }
                else {
                    $("#skipStory").removeClass("hide");
                    $("#nextStory").removeClass("hide");
                }
            }
        }
        else {
            if (!fromSearchOrFilter) {
                $("#storyListGrid_content_table>tbody>tr:first").addClass("active");
            }
            else {
                fromSearchOrFilter = false;
                var lastIndex = 0;
                $("#storyListGrid_content_table tr").each(function (key, value) {
                    var activeStoryId = $("#storyContent").find(".shown").data("id");
                    if (parseInt(this.id, 10) === activeStoryId) {
                        $(this).addClass("active");
                        lastIndex = key;
                    }
                    else {
                        $(this).removeClass("active");
                    }
                });
                if (roomStatus !== "open") {
                    if ($("#storyListGrid_content_table tr").length === (lastIndex + 1)) {
                        if (!isCheckPendingStoryTeam) {
                            $("#nextStory").addClass("hide");
                        }
                        if (!isCheckPendingStoryTemplate) {
                            $("#skipStory").addClass("hide");
                        }
                    }
                    else {
                        $("#skipStory").removeClass("hide");
                        $("#nextStory").removeClass("hide");
                    }
                }
            }
        }
        $(".story-filter").find('span').removeClass("disabled");
    }
    else {
        $(".story-filter").find('span').addClass("disabled");
    }
}

function actionBegin() {
    if (targetId) {
        ej.popups.showSpinner(targetId);
    }
}

function actionComplete() {
    if (showLoader) {
        if (targetId) {
            ej.popups.hideSpinner(targetId);
        }
    }
    else {
        showLoader = true;
    }
}

function GetNextStoryClick() {
    var counter = 0;
    var rowCount = 0;
    var lastIndex = 0;
    $.each($("#storyListGrid_content_table .grid-row"), function (key, value) {
        rowCount++;
        if ($(this).hasClass("active")) {
            lastIndex = key + 1;
        }
    });

    var filter = $(".story-filter-ul").find(".glyphicon-ok").parent().text().trim().toLowerCase();

    $.each($(".grid-row"), function (key, value) {
        if ($(this).hasClass("active") && ((rowCount != lastIndex) || (filter != "completed"))) {
            var storyid = key + 1;
            if (roomStatus !== "open" && roomStatus !== "closed") {
                var filter = $(".story-filter-ul").find(".glyphicon-ok").parent().text().trim().toLowerCase();
                sessionStorage.checkPendingStory = true;
                var crntStoryStatus = $("#storyContent").find(".shown").data("status");
                var nextStoryRow = $(".grid-row.active").next("tr");
                var nextMapperStoryId = 0;
                if (nextStoryRow) {
                    nextMapperStoryId = parseInt(nextStoryRow.attr("id"), 10);
                }
                if (crntStoryStatus.toLowerCase() !== "estimated") {
                    var crntStoryId = $("#storyContent").find(".shown").data("id");
                    confirmDialogObj.header = "Reset Story";
                    confirmDialogObj.content = '<div class="confirmdialog-icon confirmdialog-warning" style="display: block;">!</div><h2 class="confirmdialog-title" id="confirmdialog-title">Are you sure?</h2><div id="confirmdialog-content" class="confirmdialog-content" style="display: block;">You want to skip the story?</div>';
                    confirmDialogObj.currStoryId = crntStoryId;
                    confirmDialogObj.nxtStoryId = nextMapperStoryId;
                    confirmDialogObj.roomId = roomId;
                    confirmDialogObj.rowObj = null;
                    confirmDialogObj.storyListGridObj = storyListGridObj;
                    confirmDialogObj.nxtStoryIdx = storyid;
                    confirmDialogObj.filterValue = filter;
                    $("#confirmDialog").removeClass("hide");
                    confirmDialogObj.show();
                }
                else {
                    sessionStorage.ResetFrom = "nextlink";
                    sessionStorage.StryId = storyid;
                    ResetEstimatedStory(nextMapperStoryId);
                }
            }
            else {
                GetNextStory(storyid);
            }
            return false;
        }
        else {
            counter++;
        }
    });

    var isCheckPendingStories = document.getElementById('isCheckPendingStoryTemplate');
    if ((($(".grid-row").length === counter) || (rowCount === lastIndex)) && (filter != "all")) {
        if (filter == "pending") {
            if (!isCheckPendingStories) {
                toastInformation.content = messages.noStorySelectedMessage;
                toastObj.show(toastInformation);
            }
        }
        else {
            toastInformation.content = messages.noStorySelectedMessage;
            toastObj.show(toastInformation);
        }

    }
}

function GetNextStory(storyId) {
    ej.popups.showSpinner(targetId);
    storyId = parseInt(storyId, 10);
    var loggedInUser = parseInt($('#groupOwnerId').html(), 10);
    var filter = $(".story-filter-ul").find(".glyphicon-ok").parent().text().trim().toLowerCase();
    var checkPendingStory = false;
    if (sessionStorage.checkPendingStory !== "null" && sessionStorage.checkPendingStory === "true") {
        checkPendingStory = true;
        sessionStorage.checkPendingStory = null;
    }
    var searchKeys = document.getElementsByClassName('search-txt')[0];
    var searchval = "";
    if (searchKeys) {
        searchval = searchKeys.value;
    }
    $.ajax({
        cache: false,
        data: {
            'roomId': roomId,
            'storyId': storyId,
            'filter': filter,
            'checkPendingStory': checkPendingStory,
            'searchText': searchval,
            'userId': loggedInUser
        },
        dataType: 'html',
        timeout: defaultValues.timeout,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        type: "POST",
        url: 'play/getstory',
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
            var storyContent = $(response).find("#storyTemplate");
            if (storyContent.length > 0) {
                if (response.indexOf("No stories found") !== -1) {
                    var playAreaContainer = document.getElementsByClassName('play-area')[0];
                    playAreaContainer.innerHTML = "";
                    playAreaContainer.innerHTML = response;
                }
                else if (response.indexOf("server error") !== -1 || response.toLowerCase().indexOf("unable to process the request") !== -1) {
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
                else if (response.toLowerCase().indexOf("access denied") !== -1) {
                    toastError.content = messages.accessDeniedMessage;
                    toastObj.show(toastError);
                }
                else {
                    var windowWidth = $(window).width();
                    if (windowWidth < 961) {
                        $('#appHeaderInner').append($('.header-btns'));
                    }
                    var playAreaContainer = document.getElementsByClassName('play-area')[0];
                    playAreaContainer.innerHTML = "";
                    playAreaContainer.innerHTML = response;
                    if (windowWidth < 961) {
                        $('.play-area-inner').prepend($('.header-btns'));
                    }
                    isShowMoreContainer = $(response).find('#isShowMore')[0];
                    hasTimerContainer = $(response).find('#hasTimer')[0];
                    hasTimer = hasTimerContainer != null ? hasTimerContainer.value.toLowerCase() : "";
                    isShowMore = isShowMoreContainer != null ? isShowMoreContainer.value : "";
                    if (isShowMore.toLowerCase() === "true") {
                        ShowMore();
                    }
                    var button = new ej.buttons.Button();
                    button.appendTo('#estimateButton');
                    var flipButton = new ej.buttons.Button();
                    flipButton.appendTo('#flipButton');
                    EnableAnchor();
                    $("#storyListGrid_content_table tr").each(function (key, value) {
                        var activeStoryId = $("#storyContent").find(".shown").data("id");
                        if (parseInt(this.id, 10) === activeStoryId) {
                            $(this).addClass("active");
                        }
                        else {
                            $(this).removeClass("active");
                        }
                    });

                    if (windowWidth < 961) {
                        $("#timerGauge").css("display", "none");
                        var skipStoryElem = $("#skipStory");
                        if (skipStoryElem.length > 0) {
                            skipStoryElem.find('span').text("SKIP");
                        }
                        $("#waitforOrganizer").css("padding-top", "5px");
                        $("#organizerMessage").removeClass("warningmsguser");

                        if (hasTimer && hasTimer === "true") {
                            $(".story-timer-div").removeClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
                            $(".stroy-detail-div").removeClass("col-lg-8 col-md-8 col-sm-8 col-xs-8");
                            $(".stroy-detail-div").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                            $('.mobile-story-timer').append($('#storyDigitalTimerText'));
                            $('.mobile-story-timer').append($('#storyDigitalTimer'));
                            $(".mobile-story-timer").removeClass("hide");
                            $(".mobile-story-timer").css("display", "flex").css("justify-content", "center");
                            $("#storyDigitalTimerText").css("font-size", "15px").css("padding-top", "4px").css("padding-right", "2px");
                            if (roomStatus === "open") {
                                if (isOwner === "true") {
                                    $("#hamburger.menu").css("position", "absolute");
                                }
                                else {
                                    $("#hamburger.menu").css("position", "relative");
                                }
                                $(".mobile-story-timer").css("padding-top", "4px").css("padding-bottom", "6px");
                            }
                        }
                        else {
                            if (roomStatus === "open") {
                                if (isOwner === "true") {
                                    $("#hamburger.menu").css("position", "absolute");
                                }
                                else {
                                    $("#hamburger.menu").css("position", "relative");
                                }
                            }
                        }
                    }
                    else {
                        $("#timerGauge").css("display", "block");
                        var skipStoryElem = $("#skipStory");
                        if (skipStoryElem.length > 0) {
                            skipStoryElem.find('span').text("SKIP THE STORY");
                        }
                        $("#waitforOrganizer").css("padding-top", "12px");
                        $("#organizerMessage").addClass("warningmsguser");

                        if (hasTimer && hasTimer === "true") {
                            $(".stroy-detail-div").removeClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                            $(".stroy-detail-div").addClass("col-lg-8 col-md-8 col-sm-8 col-xs-8");
                            $(".story-timer-div").addClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
                            $('#gaugeContent').prepend($('#storyDigitalTimerText'));
                            $('#gaugeContent').append($('#storyDigitalTimer'));
                            $(".mobile-story-timer").addClass("hide");
                            $(".mobile-story-timer").css("display", "flex").css("justify-content", "center");
                            $("#storyDigitalTimerText").css("font-size", "12px").css("padding-top", "0").css("padding-right", "0");
                        }
                    }

                    var stryStsContainer = document.getElementById('storyStatus');
                    currentStoryStatus = stryStsContainer != null ? stryStsContainer.value : "";
                    storyTimerContainer = document.getElementById('storyTimer');
                    currentTimeContainer = $(response).find('#currentTime')[0];
                    roomTotTimeElement = document.getElementById('roomTotalTime');
                    roomStartTimeContainer = document.getElementById('roomStartTime');
                    roomEndTimeContainer = document.getElementById('roomEndTime');
                    roomIdleTimeContainer = document.getElementById('roomIdleTime');
                    storyTotTimeElement = document.getElementById('storyTotalTime');
                    storyStartTimeContainer = document.getElementById('storyStartTime');
                    storyEndTimeContainer = document.getElementById('storyEndTime');
                    storyIdleTimeContainer = document.getElementById('storyIdleTime');
                    if (hasTimer && hasTimer === "true") {
                        LoadGauge();
                    }
                    isTeamAvgView = false;
                    ResizeHeight();
                    AdjustFooter();
                    RefreshPlayerList();
                    RefreshStoryDescription();
                }
            }
            else {
                var playAreaContent = $(response).find(".play-area-inner");
                if (playAreaContent.length > 0) {
                    var windowWidth = $(window).width();
                    if (windowWidth < 961) {
                        $('#appHeaderInner').append($('.header-btns'));
                    }
                    var playAreaContainer = document.getElementsByClassName('play-area')[0];
                    playAreaContainer.innerHTML = "";
                    playAreaContainer.innerHTML = response;
                    if (windowWidth < 961) {
                        $('.play-area-inner').prepend($('.header-btns'));
                    }
                    finishVotingBtn = document.getElementById('#finishVoting');
                    var actStoryId = $("#storyContent").find(".shown").data("id");
                    LoadChart(actStoryId);
                    var button = new ej.buttons.Button();
                    button.appendTo('#finishVoting');
                    $("#storyListGrid_content_table tr").each(function (key, value) {
                        var activeStoryId = $("#storyContent").find(".shown").data("id");
                        if (parseInt(this.id, 10) === activeStoryId) {
                            $(this).addClass("active");
                        }
                        else {
                            $(this).removeClass("active");
                        }
                    });

                    if (windowWidth < 961) {
                        var finishVotingBtnElem = $("#finishVoting");
                        if (finishVotingBtnElem.length > 0) {
                            finishVotingBtnElem.find('span').text("Finish");
                            finishVotingBtn.style.cssText = "width : auto";
                        }
                        var nextStoryElem = $("#nextStory");
                        if (nextStoryElem.length > 0) {
                            nextStoryElem.find('span').text("NEXT");
                        }

                        if ((isAvgCalculated && isAvgCalculated === "true") || (isStoryEstimated && isStoryEstimated === "true")) {
                            $(".final-time-div").removeClass("col-lg-3 col-md-3 col-sm-3 col-xs-3");
                            $(".stroy-detail-div").removeClass("col-lg-9 col-md-9 col-sm-9 col-xs-9");
                            $(".stroy-detail-div").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                            $('.mobile-story-timer').append($('.final-time-header'));
                            $('.mobile-story-timer').append($('.final-time-value'));
                            $(".final-time-header").css("display", "initial");
                            $(".final-time-value").css("display", "initial");
                            $(".mobile-story-timer").removeClass("hide");
                            var txt = "Story Timer: ";
                            if (isStoryEstimated === "true") {
                                txt = "Time Taken: ";
                            }
                            $(".final-time-header").text(txt);
                            $(".final-time-header").css("font-size", "15px");
                            $(".final-time-div").css("display", "block");
                            if (roomStatus === "open" || roomStatus === "closed") {
                                $("#hamburger.menu").css("position", "absolute");
                                $(".mobile-story-timer").css("padding-top", "4px");
                            }
                        }
                    }
                    else {
                        var finishVotingBtnElem = $("#finishVoting");
                        if (finishVotingBtnElem.length > 0) {
                            finishVotingBtnElem.find('span').text("Finish Voting");
                            finishVotingBtn.style.cssText = "width : 165px";
                        }
                        var nextStoryElem = $("#nextStory");
                        if (nextStoryElem.length > 0) {
                            nextStoryElem.find('span').text("NEXT STORY");
                        }

                        if ((isAvgCalculated && isAvgCalculated === "true") || (isStoryEstimated && isStoryEstimated === "true")) {
                            $(".stroy-detail-div").removeClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
                            $(".stroy-detail-div").addClass("col-lg-9 col-md-9 col-sm-9 col-xs-9");
                            $(".final-time-div").addClass("col-lg-3 col-md-3 col-sm-3 col-xs-3");
                            $('.final-time-div').append($('.final-time-header'));
                            $('.final-time-div').append($('.final-time-value'));
                            $(".final-time-header").css("display", "table-row");
                            $(".final-time-value").css("display", "table-row");
                            $(".mobile-story-timer").addClass("hide");
                            var txt = "Story Timer";
                            if (isStoryEstimated === "true") {
                                txt = "Time Taken";
                            }
                            $(".final-time-header").text(txt);
                            $(".final-time-header").css("font-size", "13px");
                            $(".final-time-div").css("display", "table");
                        }
                    }

                    isTeamAvgView = true;
                    ResizeHeight();
                    AdjustFooter();
                    RefreshStoryDescription();
                    RefreshPlayerList();
                }
                else {
                    toastError.content = messages.ajaxerrorMessage;
                    toastObj.show(toastError);
                }
            }
        },
    });
}

function RefreshPlayerList() {
    var storyId = $("#storyContent").find(".shown").data("id");
    var loggedInUser = parseInt($('#groupOwnerId').html(), 10);
    $.ajax({
        cache: false,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        contentType: "application/json; charset=utf-8",
        data: {
            'roomId': roomId,
            'storyId': storyId,
            'userId': loggedInUser
        },
        dataType: 'json',
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
            if (response.success) {
                playerListGrid.dataSource = response.result;
                playerListGrid.refresh();
                $(".totalplayervalue").text(response.totalPlayer);
                $(".offlineplayervalue").text(response.offlinePlayers);
            }
            else {
                toastError.content = messages.ajaxerrorMessage;
                toastObj.show(toastError);
            }
        },
        timeout: defaultValues.timeout,
        type: 'GET',
        url: 'getplayerdetails',
    });
}

function EnableAnchor() {
    var anchorDesc = $(".storyDescription").find("a");
    if (anchorDesc.length === 1) {
        $(anchorDesc[0]).addClass("link-colored-content");
    }
    else {
        $(anchorDesc).each(function (key, value) {
            if (!$(this).hasClass("link-colored-content")) {
                $(this).addClass("link-colored-content");
            }
        });
    }
}

function CardClick(args) {
    var proxy = $(args);
    if (proxy.attr("disabled") === undefined) {
        var isSelected = false;
        selectedCard = "";
        $.each($(".card"), function (key, value) {
            if (proxy[0].id === $(this)[0].id) {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                }
                else {
                    $(this).addClass('active');
                }
            }
            else {
                $(this).removeClass('active');
            }

            if ($(this).hasClass('active')) {
                isSelected = true;
                selectedCard = $(this).find('.card-text-span')[0].innerText.trim();
                var windowWidth = $(window).width();
                if (windowWidth < 961) {
                    var playArea = document.getElementsByClassName('play-area')[0];
                    playArea.style.overflowX = "hidden";
                    playArea.style.overflowY = "auto";
                    var scrollBottom = $(window).scrollTop() + $(window).height();
                    $('.play-area').scrollTop(scrollBottom);
                }
            }
        });

        UpdateButton(isSelected);
    }
}

function UpdateButton(isSelected) {
    var estimateBtn = document.getElementById('estimateButton');
    if (estimateBtn) {
        estimateBtnText = estimateBtn.getElementsByTagName("span")[0];
        estimateBtnIcon = estimateBtn.getElementsByTagName("i")[0];
    }
    if (estimateBtn) {
        if (isSelected) {
            estimateBtn.removeAttribute('disabled');
        }
        else {
            estimateBtn.setAttribute('disabled', 'disabled');
        }
    }

    var floatValue;
    if (selectedCard === "") {
        floatValue = "";
    }
    else if (selectedCard === "½") {
        var val = parseFloat(selectedCard);
        floatValue = 0.5;
    }
    else {
        var val = parseFloat(selectedCard);
        if (!isNaN(val)) {
            floatValue = val;
        }
    }

    estimateBtnIcon.innerText = "thumb_up";
    estimateBtnIcon.style.cssText = "display: table-cell; padding-left: 0";
    estimateBtnText.style.cssText = "display: table-cell; top: 1px;";
    if (floatValue && !isNaN(floatValue)) {
        if (floatValue === 0) {
            estimateBtnText.innerText = "Estimate 0 Point";
            estimateBtn.style.width = "200px";
        }
        else if (floatValue === 0.5) {
            estimateBtnText.innerText = "Estimate ½ Point";
            estimateBtn.style.width = "200px";
        }
        else if (floatValue === 1) {
            estimateBtnText.innerText = "Estimate 1 Point";
            estimateBtn.style.width = "200px";
        }
        else {
            estimateBtnText.innerText = "Estimate " + floatValue + " Points";
            if (floatValue.toString().length === 3) {
                estimateBtn.style.width = "208px";
            }
            else {
                estimateBtn.style.width = "200px";
            }
        }

    }
    else {
        if (floatValue === "") {
            estimateBtnText.innerText = "Estimate";
            estimateBtn.style.width = "130px";
        }
        else if (floatValue === 0) {
            estimateBtnText.innerText = "Estimate 0 Point";
            estimateBtn.style.width = "200px";
        }
        else if (floatValue === 0.5) {
            estimateBtnText.innerText = "Estimate ½ Point";
            estimateBtn.style.width = "200px";
        }
        else if (floatValue === 1) {
            estimateBtnText.innerText = "Estimate 1 Point";
            estimateBtn.style.width = "200px";
        }
        else {
            if (selectedCard === "?") {
                estimateBtnIcon.style.cssText = "display: none";
                estimateBtnText.style.cssText = "display: inline-flex; top: 2px;padding-left:0px;";
                estimateBtnText.innerText = "? Not Sure";
                selectedCard = "not sure";
                estimateBtn.style.width = "130px";
            }
            else {
                estimateBtnIcon.innerText = "free_breakfast";
                estimateBtnIcon.style.cssText = "padding-left: 20px";
                estimateBtnText.innerText = "Need a Break";
                selectedCard = "need a break";
                estimateBtn.style.width = "200px";
            }
        }
    }
}

function gridRowClick(row) {
    if (!$(row).hasClass("active") && !isRemoveStoryClick) {
        var nextStoryId = parseInt($(row).attr("id"), 10);
        var windowWidth = $(window).width();
        if (windowWidth < 961) {
            defaultSidebar.hide();
        }
        if (roomStatus !== "open" && roomStatus !== "closed") {
            var crntStoryStatus = $("#storyContent").find(".shown").data("status");
            if (crntStoryStatus.toLowerCase() !== "estimated") {
                var crntStoryId = $("#storyContent").find(".shown").data("id");
                confirmDialogObj.header = "Reset Story";
                confirmDialogObj.content = '<div class="confirmdialog-icon confirmdialog-warning" style="display: block;">!</div><h2 class="confirmdialog-title" id="confirmdialog-title">Are you sure you want to move?</h2><div id="confirmdialog-content" class="confirmdialog-content" style="display: block;">Do you want to move to the selected story?</div>';
                confirmDialogObj.currStoryId = crntStoryId;
                confirmDialogObj.nxtStoryId = nextStoryId;
                confirmDialogObj.roomId = roomId;
                confirmDialogObj.rowObj = row;
                confirmDialogObj.storyListGridObj = storyListGridObj;
                $("#confirmDialog").removeClass("hide");
                confirmDialogObj.show();
            }
            else {
                sessionStorage.ResetFrom = "gridrow";
                sessionStorage.rowId = row.id;
                $(row).addClass('active');
                ResetEstimatedStory(nextStoryId);
            }
        }
        else {
            $.each($(".grid-row"), function (key, value) {
                if (row.id === this.id) {
                    var currentPage = storyListGridObj.pageSettings.currentPage - 1;
                    var pageSize = storyListGridObj.pageSettings.pageSize;
                    var storyId = (currentPage * pageSize) + key;
                    GetNextStory(storyId);
                }
                $(this).removeClass('active');
            });
            $(row).addClass('active');
        }
    }
    else {
        isRemoveStoryClick = false;
    }
}

function RemoveFilterClick() {
    var filterWrapper = document.getElementsByClassName('filter-text-outer')[0];
    if (filterWrapper) {
        filterWrapper.classList.add('hide');
        var searchWrapper = document.getElementsByClassName('search-wrapper')[0];
        searchWrapper.style.paddingTop = "15px";
        $.each($(".story-filter-ul li"), function (key, value) {
            var spanElement = $(this).find('span');
            if (key === 0) {
                spanElement.removeClass('no-icon');
                spanElement.addClass('glyphicon-ok');
            }
            else {
                if (!spanElement.hasClass('no-icon')) {
                    spanElement.addClass('no-icon');
                    spanElement.removeClass('glyphicon-ok');
                }
            }
        });
        FilterGrid("all");
    }
}

function FilterGrid(filterValue) {
    ej.popups.showSpinner(targetId);
    $.ajax({
        cache: false,
        complete: function () {
            ej.popups.hideSpinner(targetId);
        },
        type: 'POST',
        url: 'play/storieslist',
        dataType: 'json',
        data: {
            'roomId': roomId,
            'filter': filterValue,
        },
        timeout: defaultValues.timeout,
        success: function (response) {
            fromSearchOrFilter = true;
            if (filterValue === "all") {
                mapperStoryId = response.MapperStoryId;
            }
            else {
                mapperStoryId = "0";
            }
            storyListGridObj.dataSource = response.result;
            if (storyListGridObj.dataSource.length === 0) {
                var searchKeys = document.getElementsByClassName('search-txt')[0];
                if (searchKeys.value.trim() === "") {
                    $('#increased-width-Id').attr('readonly', true);
                    $('#increased-width-Id').addClass('input-disabled');
                    $(".search").find('span').addClass("disabled");
                }
            } else {
                $('#increased-width-Id').attr('readonly', false);
                $('#increased-width-Id').removeClass('input-disabled');
                $(".search").find('span').removeClass("disabled");
            }
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
    });
}

function removeStoryClick(object) {
    if (object) {
        isRemoveStoryClick = true;
        var windowWidth = $(window).width();
        if (windowWidth < 961) {
            defaultSidebar.hide();
        }
        var storyId = $(object).data("id");
        var storyTitle = $(object).data("title");
        var limitStoryTitle = (storyTitle.length > 50) ? storyTitle.substring(0, 50) + "..." : storyTitle;
        confirmDialogObj.header = "Remove Story";
        confirmDialogObj.content = '<div class="confirmdialog-icon confirmdialog-warning" style="display: block;">!</div><h2 class="confirmdialog-title" id="confirmdialog-title">Are you sure?</h2><div id="confirmdialog-content" class="confirmdialog-content" style="display: block;">You want to remove the story - <span style="color: #1f1f1f !important; font-size: 18px !important; font-weight: 500 !important" title="' + storyTitle + '">' + limitStoryTitle + '</span> ? </div>';
        confirmDialogObj.id = storyId;
        confirmDialogObj.name = storyTitle;
        confirmDialogObj.roomId = roomGuid;
        $("#confirmDialog").removeClass("hide");
        confirmDialogObj.show();
    }
}

function enableStartBtn() {
    if (startButton) {
        toggleStartBtn = document.getElementById("startBtn").ej2_instances[0];
        toggleStartBtn.disabled = false;
    }
}

function CheckIsPlayPage() {
    var result = false;
    var winLocation = window.location.href.split("#/");
    if (winLocation[1] && (winLocation[1].toLocaleLowerCase() == "play" || winLocation[1].toLocaleLowerCase() == "playuser")) {
        result = true;
    }
    return result;
}

var urlHub = "/refresh";
var basePath = document.getElementById('basePath');
if (basePath && basePath.value !== "") {
    urlHub = basePath.value + urlHub;
}
// Start the connection.
startConnection(urlHub, function (connection) {
    // Create a function that the hub can call to broadcast messages.
    connection.on('refreshPage', function (groupId, userId, message) {
        if (CheckIsPlayPage()) {
            // Refresh to the page.
            var loggedInUser = $('#groupOwnerId').html();
            if (parseInt(roomId, 10) === groupId && parseInt(loggedInUser, 10) !== userId) {
                var winLoc = window.location.href.split("#/");
                var url = "playpage";
                if (winLoc[1] && winLoc[1].toLocaleLowerCase() == "playuser") {
                    url = "playuserpage";
                }
                $.ajax({
                    cache: false,
                    complete: function () {
                        ej.popups.hideSpinner(targetId);
                    },
                    dataType: 'html',
                    type: "POST",
                    url: url,
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
                        if (message) {
                            toastSuccess.content = message;
                            toastObj.show(toastSuccess);
                        }

                        isShowMoreContainer = $(response).find('#isShowMore')[0];
                        isCurrentStoryContainer = $(response).find('#isCurrentStory')[0];
                        storyStatusContainer = $(response).find('#currentStoryStatus')[0];
                        mapperStoryContainer = $(response).find('#mapperStoryId')[0];
                        isOwnerContainer = $(response).find('#isOwner')[0];
                        hasTimerContainer = $(response).find('#hasTimer')[0];
                        roomStatusContainer = $(response).find('#roomStatus')[0];
                        isAllStoryEstimated = $(response).find('#isAllStoryEstimated')[0];
                        isStoryEstimated = $(response).find('#isStoryEstimated')[0];
                        isAvgCalculated = $(response).find('#isAvgCalculated')[0];
                        isCurrentUserVotedContainer = $(response).find('#isCurrentUserVoted')[0];
                        storyTimerContainer = $(response).find('#storyTimer')[0];
                        currentTimeContainer = $(response).find('#currentTime')[0];
                        roomTotTimeElement = $(response).find('#roomTotalTime')[0];
                        roomStartTimeContainer = $(response).find('#roomStartTime')[0];
                        roomEndTimeContainer = $(response).find('#roomEndTime')[0];
                        roomIdleTimeContainer = $(response).find('#roomIdleTime')[0];
                        storyTotTimeElement = $(response).find('#storyTotalTime')[0];
                        storyStartTimeContainer = $(response).find('#storyStartTime')[0];
                        storyEndTimeContainer = $(response).find('#storyEndTime')[0];
                        storyIdleTimeContainer = $(response).find('#storyIdleTime')[0];
                        finishVotingBtn = $(response).find('#finishVoting')[0];

                        var windowWidth = $(window).width();
                        if (windowWidth < 961) {
                            $('#appHeaderInner').append($('#roomDigitalTimer'));
                        }
                        var playAreaContainer = document.getElementsByClassName('play-area')[0];
                        playAreaContainer.innerHTML = "";
                        playAreaContainer.innerHTML = $(response).find(".play-area").html();
                        if (isOwner === 'false') {
                            var leftPanelContainer = document.getElementById('leftPanel');
                            leftPanelContainer.innerHTML = "";
                            leftPanelContainer.innerHTML = $(response).find("#leftPanel").html();
                            if (roomStatusContainer.value !== "inprogress" && roomStatusContainer.value !== "paused") {
                                if (document.getElementById("storyListGrid")) {
                                    RefreshStoryList(false);
                                }
                            }
                        }
                        initialize();
                        RefreshPlayerList();
                        if ($("#storylengthtext").is(":visible")) {
                            RefreshStoryDescription();
                        }
                        var chartContainer = document.getElementById('teamAverageChart');
                        if (chartContainer) {
                            isTeamAvgView = true;
                            var isEstimatedValue = $(response).find("#isEstimated");
                            if (isEstimatedValue && isEstimatedValue.val().toLocaleLowerCase() === "true") {
                                var totalStories = $(response).find("#totalStories");
                                var totalEstimatedStories = $(response).find("#totalEstimatedStories");
                                var totalEstimatedStoryPoints = $(response).find("#totalEstimatedStoryPoints");
                                if (totalStories && totalEstimatedStories) {
                                    if (windowWidth < 961) {
                                        $("#estVsTotStories").text(totalEstimatedStories.val() + "/" + totalStories.val());
                                    }
                                    else {
                                        $("#estVsTotStories").text(totalEstimatedStories.val() + "/" + totalStories.val() + " Completed");
                                    }
                                }
                                if (totalEstimatedStoryPoints) {
                                    if (windowWidth < 961) {
                                        $("#totStoryPoints").text(totalEstimatedStoryPoints.val());
                                    }
                                    else {
                                        $("#totStoryPoints").text("Total Story Points: " + totalEstimatedStoryPoints.val());
                                    }
                                }
                            }
                        }
                        else {
                            isTeamAvgView = false;
                        }
                        ResizeHeight();
                        AdjustFooter();
                    },
                });
            }
        }
    });

    // Create a function that the hub can call to broadcast messages.
    connection.on('refreshPlayers', function (groupId, userId, message) {
        if (CheckIsPlayPage()) {
            // Refresh to the page.
            var loggedInUser = $('#groupOwnerId').html();
            if (parseInt(roomId, 10) === groupId && parseInt(loggedInUser, 10) !== userId) {
                if (message) {
                    toastInformation.content = message;
                    toastObj.show(toastInformation);
                }
                RefreshPlayerList();
            }
        }
    });

    // Create a function that the hub can call to broadcast messages.
    connection.on('refreshForUser', function (groupId, userId, content) {
        if (CheckIsPlayPage()) {
            // Refresh to the page.
            var loggedInUser = $('#groupOwnerId').html();
            if (parseInt(roomId, 10) === groupId && parseInt(loggedInUser, 10) !== userId) {
                $("#storyDigitalTimer").timer("pause");
                $("#roomDigitalTimer").timer("pause");

                informationDialogObj.header = "Game is" + content;
                if (content === "stopped") {
                    var chartContainer = document.getElementById('teamAverageChart');
                    if (chartContainer) {
                        $(".blink").text("Stopped...");
                    }
                    informationDialogObj.content = '<div class="confirmdialog-icon confirmdialog-success" style="display: block;border-color:#E85959 !important;border:1px solid transparent"><span class="material-icons" style="font-size: 45px;margin-top: 19px;color: #E85959;opacity:100%;radius:0px;">stop</span></div><h2 class="confirmdialog-title" id="confirmdialog-title" style="font-size:16px !important;opacity:100%;color:#000000 !important;line-height:19px;" >Game is ' + content + '</h2><div id="confirmdialog-content" class="confirmdialog-content" style="display:block;font-size:14px !important;opacity:100%;color:#757575 !important;line-height:16px;">Your Game is ' + content + ' by the Organizer</div>';
                }
                else {
                    informationDialogObj.content = '<div class="confirmdialog-icon confirmdialog-success" style="display: block;border-color:#18BD38 !important;border:1px solid transparent"><span class="material-icons" style="font-size:55px;margin-top: 12px;color: #18BD38;opacity:100%;radius:0px;">done</span></div><h2 class="confirmdialog-title" id="confirmdialog-title" style="font-size:16px !important;opacity:100%;color:#000000 !important;line-height:19px;" >Game is ' + content + '</h2><div id="confirmdialog-content" class="confirmdialog-content" style="display:block;font-size:14px !important;opacity:100%;color:#757575 !important;line-height:16px;">Your Game is ' + content + ' by the Organizer</div>';
                }
                $("#informationDialog").removeClass("hide");
                informationDialogObj.show();
            }
        }
    });

    // Create a function that the hub can call to refresh voting page.
    connection.on('refreshVotingPage', function (groupId, userId, message) {
        if (CheckIsPlayPage()) {
            // Refresh to the voting page.
            var loggedInUser = $('#groupOwnerId').html();
            if (parseInt(roomId, 10) === groupId && parseInt(loggedInUser, 10) !== userId) {
                var winLoc = window.location.href.split("#/");
                var url = "playpage";
                if (winLoc[1] && winLoc[1].toLocaleLowerCase() == "playuser") {
                    url = "playuserpage";
                }
                $.ajax({
                    cache: false,
                    complete: function () {
                        ej.popups.hideSpinner(targetId);
                    },
                    dataType: 'html',
                    type: "POST",
                    url: url,
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
                        if (message) {
                            toastSuccess.content = message;
                            toastObj.show(toastSuccess);
                        }

                        isShowMoreContainer = $(response).find('#isShowMore')[0];
                        isCurrentStoryContainer = $(response).find('#isCurrentStory')[0];
                        storyStatusContainer = $(response).find('#currentStoryStatus')[0];
                        mapperStoryContainer = $(response).find('#mapperStoryId')[0];
                        isOwnerContainer = $(response).find('#isOwner')[0];
                        hasTimerContainer = $(response).find('#hasTimer')[0];
                        roomStatusContainer = $(response).find('#roomStatus')[0];
                        isAllStoryEstimated = $(response).find('#isAllStoryEstimated')[0];
                        isStoryEstimated = $(response).find('#isStoryEstimated')[0];
                        isAvgCalculated = $(response).find('#isAvgCalculated')[0];
                        isCurrentUserVotedContainer = $(response).find('#isCurrentUserVoted')[0];
                        storyTimerContainer = $(response).find('#storyTimer')[0];
                        currentTimeContainer = $(response).find('#currentTime')[0];
                        roomTotTimeElement = $(response).find('#roomTotalTime')[0];
                        roomStartTimeContainer = $(response).find('#roomStartTime')[0];
                        roomEndTimeContainer = $(response).find('#roomEndTime')[0];
                        roomIdleTimeContainer = $(response).find('#roomIdleTime')[0];
                        storyTotTimeElement = $(response).find('#storyTotalTime')[0];
                        storyStartTimeContainer = $(response).find('#storyStartTime')[0];
                        storyEndTimeContainer = $(response).find('#storyEndTime')[0];
                        storyIdleTimeContainer = $(response).find('#storyIdleTime')[0];
                        finishVotingBtn = $(response).find('#finishVoting')[0];

                        isEveryUserVoted = $(response).find('#isEveryUserVoted')[0];
                        if ($('#votingStatusContainer').length > 0) {
                            var votingAreaContainer = document.getElementById('votingStatusContainer');
                            votingAreaContainer.innerHTML = "";
                            votingAreaContainer.innerHTML = $(response).find("#votingStatusContainer").html();
                        }
                        RefreshPlayerList();
                        ResizeHeight();
                        AdjustFooter();
                    },
                });
            }
        }
    });
});

// Starts a connection with transport fallback - if the connection cannot be started using
// the webSockets transport the function will fallback to the serverSentEvents transport and
// if this does not work it will try longPolling. If the connection cannot be started using
// any of the available transports the function will return a rejected Promise.
function startConnection(url, configureConnection) {
    return function start(transport) {
        //console.log(`Starting connection using ${signalR.TransportType[transport]} transport`)
        var logger = new signalR.ConsoleLogger(signalR.LogLevel.Information);
        var winLoc = window.location.href.split("#/");
        var loggedInUser = 4;
        if (winLoc[1] && winLoc[1].toLocaleLowerCase() == "playuser") {
            loggedInUser = 3;
        }
        var chatHub = new signalR.HttpConnection(url + "?userId=" + loggedInUser, { transport: transport, logger: logger });

        var connection = new signalR.HubConnection(chatHub, logger);
        if (configureConnection && typeof configureConnection === 'function') {
            configureConnection(connection);
        }

        return connection.start()
            .then(function () {
                return connection;
            })
            .catch(function (error) {
                //console.log(`Cannot start the connection use ${signalR.TransportType[transport]} transport. ${error.message}`);
                if (transport !== signalR.TransportType.LongPolling) {
                    return start(transport + 1);
                }

                return Promise.reject(error);
            });
    }(signalR.TransportType.WebSockets);
}

function GetInvitationLink() {
    var codeElement = document.getElementById('qrCode');
    codeElement.innerHTML = "";
    var qrText = window.location.href;
    if (qrText.lastIndexOf("#/playuser") !== (qrText.length - '#/playuser'.length)) {
        var url = qrText.split('#/');
        if (url) {
            qrText = url[0] + "#/playuser";
        }
    }
    var qrCodeElement = $('#qrCode').qrcode({
        render: "table",
        height: '100',
        width: '100',
        text: qrText,
    });
    var temp = document.getElementById('qrCode');
    qrCodeDialogObj.header = "Invite Link";
    qrCodeDialogObj.content = '<div class="confirmdialog-content"><div style="font-size:14px;font-weight: 500;color:#1F1F1F">SCAN</div><br /><div id="qrCodeDiv" style="display:flex;align-items:center;justify-content:center;">' + temp.innerHTML + '</div><br /></div><hr class="hr-text" data-content="OR"><div class="confirmdialog-content" id="confirmdialog-title" style="font-size:14px !important;font-weight: 500;opacity:100%;color:#1F1F1F !important;line-height:19px;margin-top:5px;" >COPY</div><br /><div id="confirmdialog-content" ><a href=' + qrText + ' target="_blank" class="confirmdialog-content" style="display:block;font-size:10px !important;opacity:100%;color:blue !important;line-height:16px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90%">' + qrText + '</a><span id="copyinvitelink" class="glyphicon glyphicon-duplicate invitecopy" style="float: right;margin-top: -15px;" onclick="CopyInviteLink()"></span></div>';
    qrCodeDialogObj.close = function () {
        (document.getElementById('leftPanel')).style.zIndex = "1000";
    };
    qrCodeDialogObj.open = function () {
        (document.getElementById('leftPanel')).style.zIndex = "0";
    };
    $("#qrCodeDialog").removeClass("hide");
    qrCodeDialogObj.show();
}

function CopyInviteLink() {
    var $temp = $("<input>");
    $("body").append($temp);
    var qrText = window.location.href;
    if (qrText.lastIndexOf("#/playuser") !== (qrText.length - '#/playuser'.length)) {
        var url = qrText.split('#/');
        if (url) {
            qrText = url[0] + "#/playuser";
        }
    }
    $temp.val(qrText).select();
    document.execCommand("copy");
    $temp.remove();
    toastSuccess.content = "URL Copied.";
    toastObj.show(toastSuccess);
}

function ShowMore() {
    var showMoreTag = document.getElementById('showmore');
    var hideTag = document.getElementById('showless');
    showMoreTag.style.cssText = "display : none";
    hideTag.style.cssText = "display : block";
    hideTag.style.cssText = "text-align : justify";
}

function ShowLess() {
    var showMoreTag = document.getElementById('showmore');
    var hideTag = document.getElementById('showless');
    hideTag.style.cssText = "display : none";
    showMoreTag.style.cssText = "display : block";
    showMoreTag.style.cssText = "text-align : justify";
}

function RefreshStoryDescription() {
    var storyDetailsWidth = $("#storydetailsarea").width();
    var storyDescription = $("#storyhiddentext").html();

    if (storyDescription) {
        if (storyDetailsWidth >= 1000) {
            if (storyDescription.length > 270) {
                $("#storylengthtext").html(storyDescription.substring(0, 250) + "...");
                $("#showmorelink").css('display', 'inline-block');
            }
        }
        else if (storyDetailsWidth >= 900) {
            if (storyDescription.length > 240) {
                $("#storylengthtext").html(storyDescription.substring(0, 220) + "...");
                $("#showmorelink").css('display', 'inline-block');
            }
        }
        else if (storyDetailsWidth >= 800) {
            if (storyDescription.length > 220) {
                $("#storylengthtext").html(storyDescription.substring(0, 200) + "...");
                $("#showmorelink").css('display', 'inline-block');
            }
        }
        else if (storyDetailsWidth >= 600) {
            if (storyDescription.length > 170) {
                $("#storylengthtext").html(storyDescription.substring(0, 150) + "...");
                $("#showmorelink").css('display', 'inline-block');
            }
        }
        else if (storyDetailsWidth >= 500) {
            if (storyDescription.length > 140) {
                $("#storylengthtext").html(storyDescription.substring(0, 120) + "...");
                $("#showmorelink").css('display', 'inline-block');
            }
        }
        else if (storyDetailsWidth >= 400) {
            if (storyDescription.length > 120) {
                $("#storylengthtext").html(storyDescription.substring(0, 100) + "...");
                $("#showmorelink").css('display', 'inline-block');
            }
        }
        else {
            if (storyDescription.length > 80) {
                $("#storylengthtext").html(storyDescription.substring(0, 80) + "...");
                $("#showmorelink").css('display', 'inline-block');
            }
        }
    }
}

function ResizeHeight() {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    if (windowWidth > 960) {
        $("#wrapper").css("overflow-y", "auto");
        $("#wrapper").css("position", "fixed");
        $("#wrapper").css("width", "100%");
    }
    var headerHeight = $(".app-header").height();
    var btnFooterHeight = $(".btn-footer").height();
    $(".play-area-inner").css("padding-bottom", "20px");
    var playAreaFooter = $(".playerfooter").outerHeight();
    var playerSummaryHeight = $(".summaryplayer").outerHeight();
    var playerInvitationHeight = $(".invitelink").outerHeight();
    var playAreaInner = parseInt($(".play-area-inner").css("padding-bottom")) + parseInt($(".play-area-inner").css("padding-top")) + parseInt($(".play-area").css("padding-top"));
    var storyContent = parseInt($("#storyContent").css("padding-top"));
    var titleHeight = $(".storyTitle").height();
    var descriptionHeight = windowHeight - (headerHeight + storyContent + titleHeight);
    var cardAreaHeight = windowHeight / 1.67;
    $(".storyDescription").height(130);
    var playAreaHeight = windowHeight - (parseInt($('.app-header').css("height")) + parseInt($('.btn-footer').css("height")) + parseInt($(".play-area").css("padding-top")));
    if ($(".play-area-inner .header-btns").is(":visible")) {
        playAreaHeight = playAreaHeight + $(".header-btns").height();
    }
    $(".play-area").css("height", playAreaHeight);
    $(".storyPart").height(windowHeight - headerHeight);
    $(".player-part").height(windowHeight - (headerHeight + playAreaFooter + playerSummaryHeight + playerInvitationHeight));
    setTimeout(function () {
        var gaugeSVGHeight = "90px";
        if (windowWidth > 1366) {
            gaugeSVGHeight = "140px";
        }

        $("#timerGauge_svg").height(gaugeSVGHeight);
        $("#timerGauge_svg").css("margin-top", "10px");
    }, 1000);

    if (isTeamAvgView == true) {
        var btnFooterPaddingTop = parseInt($(".btn-footer").css("padding-top"));
        var storyContentHeight = $("#storyContent").height();
        $(".play-area-inner").css("padding-bottom", "0");
        playAreaInner = parseInt($(".play-area-inner").css("padding-bottom")) + parseInt($(".play-area-inner").css("padding-top")) + parseInt($(".play-area").css("padding-top"));
        var dividerBorder = parseInt($(".chart-top-border").css("border-top-width"));
        $(".play-area-content").height(windowHeight - (headerHeight + storyContent + btnFooterHeight + btnFooterPaddingTop + playAreaInner - 30));
    }

    if ($('#no-stories-div').length > 0) {
        $(".play-area").parent().height(windowHeight - (headerHeight));
        var playAreaHeight = $(".play-area").parent().height() / 2;
        var noDivAreaHeight = $('#no-stories-div').height();
        var noStoiesTxtHeight = $('.no-stories-text').height();
        var noStoiesTxtMarTop = parseInt($(".no-stories-text").css("margin-top"));
        var importBtnDivHeight = 0
        if ($('#importBtnDiv').height()) {
            importBtnDivHeight = $('#importBtnDiv').height();
        }
        var importBtnDivMarTop = 0;
        if ($("#importBtnDiv").css("margin-top")) {
            importBtnDivMarTop = parseInt($("#importBtnDiv").css("margin-top"));
        }
        var totHeight = noDivAreaHeight + noStoiesTxtHeight + noStoiesTxtMarTop + importBtnDivHeight + importBtnDivMarTop;
        var marginTop = (playAreaHeight - (totHeight / 2));
        $('#no-stories-div').css("margin-top", marginTop);
    }
}
