var StoryEstimator;
var currentPage;
var targetId = document.getElementById('spinner');
var toastObj;
var toastSuccess = {
    content: '',
    cssClass: 'success',
    icon: 'e-success-msg toast-icons'
};
var toastError = {
    content: '',
    cssClass: 'error',
    icon: 'e-error-msg toast-icons'
};
var toastInformation = {
    content: '',
    cssClass: 'info',
    icon: 'e-information toast-icons'
};

(function (StoryEstimator) {
    StoryEstimator[StoryEstimator["dashboard"] = 0] = "dashboard";
    StoryEstimator[StoryEstimator["play"] = 1] = "play";
    StoryEstimator[StoryEstimator["playuser"] = 2] = "playuser";
    StoryEstimator[StoryEstimator["about"] = 3] = "about";
})(StoryEstimator || (StoryEstimator = {}));

function getCurrentPage() {
    if (window.location.hash === '#/' + StoryEstimator[StoryEstimator.dashboard]) {
        currentPage = StoryEstimator[StoryEstimator.dashboard];
    } else if (window.location.hash === '#/' + StoryEstimator[StoryEstimator.play]) {
        currentPage = StoryEstimator[StoryEstimator.play];
    } else if (window.location.hash === '#/' + StoryEstimator[StoryEstimator.playuser]) {
        currentPage = StoryEstimator[StoryEstimator.playuser];
    } else if (window.location.hash === '#/' + StoryEstimator[StoryEstimator.about]) {
        currentPage = StoryEstimator[StoryEstimator.about];
    }
    return currentPage;
}

routeDefault();
function routeDefault() {
    crossroads.addRoute('', function () {
        window.location.href = window.location.href.lastIndexOf("/") === window.location.href.length - '/'.length ? '#/dashboard' : window.location.href + "/#/dashboard";
    });
}

crossroads.addRoute('/:lang:', function () {
    var sample = currentPage || getCurrentPage();
    if ((currentPage && currentPage !== '') || (window.location.hash === '#/' + getCurrentPage())) {
        var ajaxHTML = new ej.base.Ajax('Home/' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1), 'GET', true);
        ajaxHTML.send().then(function (value) {
            document.getElementById('targetId').innerHTML = '';
            document.getElementById('targetId').innerHTML = value.toString();

            renderControl("targetId");

            if (!targetId) {
                targetId = document.getElementById('spinner');
            }
            ej.popups.createSpinner({
                target: targetId
            });
            ej.popups.showSpinner(targetId);

            toastObj = new ej.notifications.Toast({
                target: document.body,
                position: {
                    X: 'Right'
                }
            });
            toastObj.appendTo('#toast_msg_container');

            if (currentPage === StoryEstimator[StoryEstimator.dashboard] ||
                '#/' + StoryEstimator[StoryEstimator.dashboard] === window.location.hash) {
                handleResize();
                if (window.dashboard) {
                    window.dashboard();
                }
            } else if (currentPage === StoryEstimator[StoryEstimator.play] ||
                '#/' + StoryEstimator[StoryEstimator.play] === window.location.hash ||
                currentPage === StoryEstimator[StoryEstimator.playuser] ||
                '#/' + StoryEstimator[StoryEstimator.playuser] === window.location.hash) {
                handleResize();
                if (window.play) {
                    window.play();
                }
            } else if (currentPage === StoryEstimator[StoryEstimator.about] ||
                '#/' + StoryEstimator[StoryEstimator.about] === window.location.hash) {
                handleResize();
            }
            ej.popups.hideSpinner(targetId);
        });
    }
}).rules = { lang: ['dashboard', 'play', 'playuser', 'about'] };

crossroads.bypassed.add(function (request) {
    var samplePath = ['dashboard', 'play', 'playuser', 'about'];
    var hash = request.split(' ')[0];
    if (samplePath.indexOf(hash) === -1) {
        location.hash = '#/' + samplePath[0];
    }
});

function renderControl(id) {
    var scripts = document.querySelectorAll("#" + id + " script");
    var length = scripts.length;
    for (var i = 0; i < length; i++) {
        if (scripts[i].id === "")
            eval(scripts[i].text);
    }
}

hasher.initialized.add(function (hashValue) {
    crossroads.parse(hashValue);
});

hasher.changed.add(function (hashValue) {
    currentPage = hashValue;
    crossroads.parse(hashValue);
});
hasher.init();

var resizeTimer;
window.onresize = function (args) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        handleResize();
    }, 200);
};

function handleResize() {
    var windowWidth = $(window).width();
    var loggedinUserName = document.getElementById('layourcurrentusernameDiv');
    var userprofileListItem = document.getElementsByClassName('userprofile')[0];
    if (windowWidth <= 480) {
        if (loggedinUserName) {
            $(loggedinUserName).addClass("hide");
        }
        if (userprofileListItem) {
            $(userprofileListItem).removeClass("hide");
            document.getElementById('usernameLabel').style.width = '60px';
        }
    }
    else {
        if (loggedinUserName) {
            $(loggedinUserName).removeClass("hide");
        }
        if (userprofileListItem) {
            $(userprofileListItem).addClass("hide");
            document.getElementById('usernameLabel').style.width = 'auto';
        }
    }
}
