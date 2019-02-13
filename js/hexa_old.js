$(document).on('ready pjax:end', function (e) {
    if (e.type.indexOf("pjax:end") > -1) {
        $(".header-hexa-logo").unbind('click');
    }
    // Main Page
    var main_items = $(".main-item:not(.main-logo)");
    main_items.one('click', function () {
        var self = $(this);
        if (self.hasClass("disabled") || self.hasClass("inactive")) return;
        $(".bubble").trigger("hide");
        var self_index = main_items.index(this);
        var idx_asc = self_index, idx_desc = self_index;
        var iter = Math.ceil((main_items.length - 1) / 2) + 1;
        var interval = 100;
        for (var i = 0; i < iter + 1; i++) {
            if (i < iter) {
                if (idx_desc < 0) idx_desc += main_items.length;
                if (idx_asc >= main_items.length) idx_asc -= main_items.length;
                if (idx_asc == idx_desc) {
                    menuDisappear(main_items[idx_asc], interval * (iter - i));
                } else {
                    menuDisappear(main_items[idx_asc], interval * (iter - i));
                    menuDisappear(main_items[idx_desc], interval * (iter - i));
                }
                idx_asc++;
                idx_desc--;
            } else {
                setTimeout(function () {
                    $(".main-item .hexa-logo").toggleClass("scale-0");
                    pageOpen(self);
                }, interval * i + 500);
            }
        }
    });

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

            var scroll = $("body").scrollTop();
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

    function menuDisappear(item, delay) {
        setTimeout(function () {
            $(item).find(".hexagon")
                .toggleClass("scale-0");
        }, delay || 0);
    }

    function pageOpen(elem) {
        var label = elem.find("span").text();

        elem = elem.find("input");
        var type = elem.attr("name");
        switch (type) {
            case "url":
                setTitle(label);
                $("#header").addClass("header-down");
                $("#header-menu").removeAttr("data-target");
                setTimeout(function () {
                    $.pjax({
                        url: elem.val(),
                        container: "#content-body",
                        fragment: "#content-body"
                    });
                    $("#footer").show();
                }, 400);
                return;
            case "redirect":
                window.open( elem.val());
                location.reload();
                return;
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