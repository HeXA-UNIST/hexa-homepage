$(document).on('ready pjax:end', function (e) {

    // pjax 실행 시 메인 메뉴 아이템들의 click 이벤트 리스너가 중첩되는 것을 막기 위한 코드
    if (e.type.indexOf("pjax:end") > -1) {
        $(".header-hexa-logo").unbind('click');
    }

    // Header navbar configurations
    var header_menu = $("#header-menu").find("li");
    if (header_menu.length > 0) {
        var container = $("#header").find(".container");
        var underbar = $("#underbar");

        goTo(header_menu.first(), true);

        header_menu
            .on("click", function () {
                var hash = $(this).attr("data-target");
                var target_scroll = $(hash).offset().top - 80;
                $("body").animate({
                    scrollTop: target_scroll
                }, 400);
            });

        $(document).on("scroll", headerScrollHandler);
        $(window).on("resize", headerScrollHandler);

        function headerScrollHandler() {
            var header_menu = $("#header-menu");
            var background_threshold = header_menu.attr("data-target");
            header_menu = header_menu.find("li");
            if (!background_threshold) {
                background_threshold = header_menu.get(1).getAttribute("data-target")
            }

            var scroll = $(window).scrollTop();
            if (scroll > ($(background_threshold).offset().top - 100)) {
                $("#header").addClass("header-background");
            } else {
                $("#header").removeClass("header-background");
            }

            var target = scroll + $(window).height() * .6;
            for (var i = 0; i < header_menu.length; i++) {
                if (target < $(header_menu.get(i).getAttribute("data-target")).offset().top) {
                    goTo($(header_menu.get(i - 1)));
                    break;
                }
                if (i == header_menu.length - 1) {
                    goTo($(header_menu.get(i)));
                }
            }
        }

        function goTo(menu, isFirstCall) {
            menu = menu.find("span");
            var windowWidth = $(window).width();
            var marginBottom;
            if (windowWidth > 992) {
                marginBottom = 10;
            } else if (windowWidth > 768) {
                marginBottom = 5;
            } else {
                marginBottom = 3;
            }
            underbar.stop().animate({
                width: menu.width(),
                height: menu.height() + marginBottom,
                top: menu.offset().top - container.offset().top,
                left: isFirstCall
                    ? menu.offset().left - container.offset().left - 5
                    : menu.offset().left - container.offset().left
            }, isFirstCall ? 0 : 100);
        }
    }

    $(".header-hexa-logo").one('click', function () {
        $("#header.header").removeClass("header-down");
        $(".content-open").removeClass("content-open").addClass("content-close");
        setTimeout(function () {
            $.pjax({
                url: "./",
                container: "#content-body",
                fragment: "#content-body"
            });
        }, 400);
    });
});

function setTitle(title) {
    $("#header").find(".header-page-label").text(title);
}

function registerHeaderMenu(bgTarget) {
    var header_menu = $("#header-menu").empty();
    if (bgTarget) {
        header_menu.attr("data-target", bgTarget);
    } else {
        header_menu.removeAttr("data-target");
    }
    header_menu.html(
        "<div id='underbar'></div>" +
        $("#content > div").map(function (i, e) {
            return "<li data-target=#" + e.id + "><span>" + e.id + "</span></li>"
        }).toArray().join("")
    );
}
