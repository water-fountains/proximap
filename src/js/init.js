/*
	Prologue by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.init({
		reset: 'full',
		breakpoints: {
			'global':	{ range: '*', href: 'css/style.css', containers: 1400, grid: { gutters: 40 }, viewport: { scalable: false } },
			'wide':		{ range: '961-1880', href: 'css/style-wide.css', containers: 1200, grid: { gutters: 40 } },
			'normal':	{ range: '961-1620', href: 'css/style-normal.css', containers: 960, grid: { gutters: 40 } },
			'narrow':	{ range: '961-1320', href: 'css/style-narrow.css', containers: '100%', grid: { gutters: 20 } },
			'narrower':	{ range: '-960', href: 'css/style-narrower.css', containers: '100%', grid: { gutters: 20 } },
			'mobile':	{ range: '-736', href: 'css/style-mobile.css', containers: '100%!', grid: { collapse: true } }
		},
		plugins: {
			layers: {
				config: {
					mode: 'transform'
				},
				sidePanel: {
					hidden: true,
					breakpoints: 'narrower',
					position: 'top-left',
					side: 'left',
					animation: 'pushX',
					width: 240,
					height: '100%',
					clickToHide: true,
					html: '<div data-action="moveElement" data-args="header"></div>',
					orientation: 'vertical'
				},
				sidePanelToggle: {
					breakpoints: 'narrower',
					position: 'top-left',
					side: 'top',
					height: '4em',
					width: '5em',
					html: '<div data-action="toggleLayer" data-args="sidePanel" class="toggle"></div>'
				}
			}
		}
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

	
		// Scrolly links.
			$('.scrolly').scrolly();

		// Nav.
			var $nav_a = $('#nav a');

			// Scrolly-fy links.
				$nav_a
					.scrolly()
					.on('click', function(e) {

						var t = $(this),
							href = t.attr('href');

						if (href[0] != '#')
							return;

						e.preventDefault();

						// Clear active and lock scrollzer until scrolling has stopped
							$nav_a
								.removeClass('active')
								.addClass('scrollzer-locked');

						// Set this link to active
							t.addClass('active');

					});

			// Initialize scrollzer.
				var ids = [];

				$nav_a.each(function() {

					var href = $(this).attr('href');

					if (href[0] != '#')
						return;

					ids.push(href.substring(1));

				});

				$.scrollzer(ids, { pad: 200, lastHack: true });

	});

})(jQuery);