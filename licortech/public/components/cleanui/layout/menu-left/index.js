/////////////////////////////////////////////////////////////////////////////////////////
// "cui-menu-right" module scripts

;(function($) {
	'use strict'
	$(function() {
	if ($('body').find('.cui__menuLeft').length < 1) {
		return
	}

	/////////////////////////////////////////////////////////////////////////////////////////
	// set active menu item on load

	var url = window.location.href;
    if (url.indexOf('?') > 0) {
        url = url.substr(0, page.indexOf('?'));
    }
    var page = url.substr(url.lastIndexOf('/') + 1);
	var currentItem = $('.cui__menuLeft').find('#left-menu-' + page);

    if (currentItem.length < 1) {
        var cutUrl1 = url.substr(0, url.lastIndexOf('/'));
        page = cutUrl1.substr(cutUrl1.lastIndexOf('/') + 1);

        var currentItem = $('.cui__menuLeft').find('#left-menu-' + page);
    }

	currentItem
		.addClass('cui__menuLeft__item--active')
		.closest('.cui__menuLeft__submenu')
		.addClass('cui__menuLeft__submenu--toggled')
		.find('> .cui__menuLeft__navigation')
		.show()

	/////////////////////////////////////////////////////////////////////////////////////////
	// toggle on resize
	;(function() {
		var isTabletView = false
		function toggleMenu() {
			if (!isTabletView) {
				$('body').addClass('cui__menuLeft--toggled');
			}
		}
		if ($(window).innerWidth() <= 992) {
			toggleMenu()
			isTabletView = true
		}
		$(window).on('resize', function() {
		if ($(window).innerWidth() <= 992) {
			toggleMenu()
			isTabletView = true
		} else {
			isTabletView = false
		}
		})
	})()

	/////////////////////////////////////////////////////////////////////////////////////////
	// toggle

	$('.cui__menuLeft__trigger').on('click', function() {
		if ($('body').hasClass('cui__menuLeft--toggled')) {
			setCookie('show_left_menu', 'show');
		} else {
			setCookie('show_left_menu', 'off');
		}
		$('body').toggleClass('cui__menuLeft--toggled');
	})

	/////////////////////////////////////////////////////////////////////////////////////////
	// mobile toggle

	$('.cui__menuLeft__backdrop, .cui__menuLeft__mobileTrigger').on('click', function() {
		$('body').toggleClass('cui__menuLeft--mobileToggled')
	})

	/////////////////////////////////////////////////////////////////////////////////////////
	// mobile toggle slide

	var touchStartPrev = 0
	var touchStartLocked = false

	const unify = e => {
		return e.changedTouches ? e.changedTouches[0] : e
	}
	document.addEventListener(
		'touchstart',
		e => {
		const x = unify(e).clientX
		touchStartPrev = x
		touchStartLocked = x > 70
		},
		{ passive: false }
	)
	document.addEventListener(
		'touchmove',
		e => {
		const x = unify(e).clientX
		const prev = touchStartPrev
		if (x - prev > 50 && !touchStartLocked) {
			$('body').toggleClass('cui__menuLeft--mobileToggled')
			touchStartLocked = true
		}
		},
		{ passive: false }
	)

	/////////////////////////////////////////////////////////////////////////////////////////
	// submenu

	$('.cui__menuLeft__submenu > .cui__menuLeft__item__link').on('click', function() {
		var el = $(this).closest('.cui__menuLeft__submenu'),
		opened = $('.cui__menuLeft__submenu--toggled')

		if (
		!el.hasClass('cui__menuLeft__submenu--toggled') &&
		!el.parent().closest('.cui__menuLeft__submenu').length
		)
		opened
			.removeClass('cui__menuLeft__submenu--toggled')
			.find('> .cui__menuLeft__navigation')
			.slideUp(200)

		el.toggleClass('cui__menuLeft__submenu--toggled')
		var item = el.find('> .cui__menuLeft__navigation')
		if (item.is(':visible')) {
		item.slideUp(200)
		} else {
		item.slideDown(200)
		}
	})
	})
})(jQuery)
