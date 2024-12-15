const setTimelineH = () => {
    let tLineHeight = $(document).height() - (400 + $(window).height());
    $("#svg")[0].setAttribute('viewBox', '0 0 8 ' + tLineHeight);
    $("#svg")[0].setAttribute('height', tLineHeight + 'px');
};

$(document).ready(function() {
    setTimelineH();
});

$(window).on('resize', function(){
    setTimelineH();
});

/* anonymous function for triggering all other animations & compoents appearances */
$(function() {
    $(window).scroll(function() {

        var winTop = $(window).scrollTop();
        //update progress transform: translate3d(50%, 0px, 0px);
        var scrollPercentage = 100 * (winTop) / (3 * $(window).height());
        $('#timeline')[0].setAttribute('y2', winTop-200);
    });

    // handle scroll down button
    $("#scroll-down").click(function() {
        $('html, body').animate({
            scrollTop: $(".timeline-wrapper").offset().top
        }, 1500);
    });

}); // end of anonymous function
