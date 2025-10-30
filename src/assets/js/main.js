//Глобальный объект App сайта
var App = {
    win: $(window),
	doc: $(document),
	is_mobile: detectmob(), // браузер мобильный или нет
	ms_ie: /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent), // Браузер - ie или нет
	max_mobile_width: 992, // максимальная ширина, при которой применяется стили и функционал для портативных устройств
};


// определение мобильного браузера
function detectmob() { 
	if(navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
	)
		{
			return true;
		}
	else {
		return false;
	}
}


var getElementsInArea = (function(docElm){
    var viewportHeight = docElm.clientHeight;

    return function(e, opts){
        var found = [], i;
        
        if( e && e.type == 'resize' )
            viewportHeight = docElm.clientHeight;

        for( i = opts.elements.length; i--; ){
            var elm        = opts.elements[i],
                pos        = elm.getBoundingClientRect(),
                topPerc    = pos.top    / viewportHeight * 100,
                bottomPerc = pos.bottom / viewportHeight * 100,
                middle     = (topPerc + bottomPerc)/2,
                inViewport = middle > opts.zone[1] && 
                             middle < (100-opts.zone[1]);

            elm.classList.toggle(opts.markedClass, inViewport);

            if( inViewport )
                found.push(elm);
        }
    };
})(document.documentElement);



function checkFlipCards(e){
    getElementsInArea(e, {
        elements    : document.querySelectorAll('.is_mobile .flip-card-item-content'), 
        markedClass : 'active',
        zone        : [20, 20] // percentage distance from top & bottom
    });
}


// различный дополнительный функционал
App.Main = function () {
	if (App.is_mobile) {
		$('html').addClass('is_mobile');

		if ($('.is_mobile .flip-card-item-content').length) {
			window.addEventListener('scroll', checkFlipCards);
		}
	} 
};


App.HeaderMenu = function () {
    var class_site_menu_open = 'site--menu-open';
	$('.js--main-menu-button').on('click', function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('body').removeClass(class_site_menu_open);
        } else {
            $(this).addClass('active');
            $('body').addClass(class_site_menu_open);
        }
    });
};


$(document).ready(function() {
	App.Main();
	App.HeaderMenu();
});
