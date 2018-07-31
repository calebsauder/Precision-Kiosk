function rn () {
	return Math.floor(Math.random() * 999999999);
}

function initHomePage () {

	// Home page views
	const
		AUTOPLAY_TIMEOUT = 30000,
		$views = $('[data-view]'),
		views = {

			welcome: {
				init () {
					$('#welcome-screen-start-button').click(() => {
						showView('player');
						return false;
					});
					$('#recheck-for-updates').click(() => sessionStorage.clear());
				},
				show () {
					if (!QA)
						this.autoPlayInterval = setTimeout(() => showView('player'), AUTOPLAY_TIMEOUT);
				},
				hide () {
					clearInterval(this.autoPlayInterval);
				}
			},

			player: {
				$player: $('#player'),
				player: null,

				init () {
					this.player = this.$player[0];
				},

				show () {

					const playVideo = index => {
						clearTimeout(checkIfPlayingTimeout);
						if (index == 'next') {
							index = parseInt(this.$player.data('index'));
							if (isNaN(index)) index = 0;
							index++;
						}
						if (index == 'previous') {
							index = parseInt(this.$player.data('index'));
							if (isNaN(index)) index = 0;
							index--;
							if (index < 0) index = (playlist.length - 1);
						}
						if (index > (playlist.length - 1)) index = 0;
						const video = playlist[index];
						$('#v' + playlist[index]['id'])[0].scrollIntoView({
							behavior: 'smooth'
						});
						if (titleFader) {
							clearTimeout(titleFader);
							titleFader = false;
						}
						$('#video-title').html(video.title).addClass('_show');
						//player.html('<source src="'+video.video+'" type="video/mp4">Your browser does not support the video tag.');
						titleFader = setTimeout(function () {
							$('#video-title').removeClass('_show');
							titleFader = false;
						}, 3000);
						$('#playlist li._show').removeClass('_show');
						$('#v' + video.id).addClass('_show');
						this.$player
							.prop('src', video.video)
							.data('index', index);
						this.player.play();
						checkIfPlayingTimeout = setTimeout(() => {
							if (
								this.player.readyState == MEDIA_EL_READY_STATE_HAVE_NOTHING
								&& this.player.currentTime == 0
								&& this.player.networkState == MEDIA_EL_NETWORK_STATE_NO_SOURCE
							)
								playVideo(index);
						}, 5000);
					};

					function playHotKeyVideo (hotkey) {
						let gotit = false;
						for (let i = 0; i < playlist.length; i++) {
							if ((!gotit) && (playlist[i].hotkey == hotkey + '')) {
								gotit = true;
								playVideo(i);
							}
						}
						if (!gotit) console.log('Hot key [' + hotkey + '] unassigned');
					}

					const
						MEDIA_EL_READY_STATE_HAVE_NOTHING = 0,
						MEDIA_EL_NETWORK_STATE_NO_SOURCE = 3,
						playlist = [];

					let
						titleFader = false,
						checkIfPlayingTimeout;

					$('#playlist li').each(function () {
						const p = $(this);
						playlist.push({
							id: p.data('id'),
							video: p.data('video'),
							hotkey: p.data('hotkey'),
							title: p.html()
						});
					});

					this.$player.on('ended.player', () => {
						console.log('ended');
						playVideo('next');
					});

					$(window).on({
						'keyup.player': event => {
							const keycode = event.which;
							if (keycode == 32) { // space bar
								$('#playlist').removeClass('_show');
							}
							event.preventDefault();
						},
						'keydown.player': event => {
							const keycode = event.which;
							console.log(keycode);
							if (keycode == 37) { // left arrow
								playVideo('previous');
							}
							else if (keycode == 39) { // right arrow
								playVideo('next');
							}
							else if (keycode == 32) { // space bar
								//playVideo('next');
								$('#playlist').addClass('_show');
							}
							else if (keycode == 13) { // enter
								playVideo('next');
							}
							else if (keycode == 38) { // up
								playVideo('previous');
							}
							else if (keycode == 40) { // down
								playVideo('next');
							}
							else if (keycode == 27) { // esc
								showView('welcome');
							}
							else if (keycode == 48) { // 0
								playHotKeyVideo(0);
							}
							else if (keycode == 49) { // 1
								playHotKeyVideo(1);
							}
							else if (keycode == 50) { // 2
								playHotKeyVideo(2);
							}
							else if (keycode == 51) { // 3
								playHotKeyVideo(3);
							}
							else if (keycode == 52) { // 4
								playHotKeyVideo(4);
							}
							else if (keycode == 53) { // 5
								playHotKeyVideo(5);
							}
							else if (keycode == 54) { // 6
								playHotKeyVideo(6);
							}
							else if (keycode == 55) { // 7
								playHotKeyVideo(7);
							}
							else if (keycode == 56) { // 8
								playHotKeyVideo(8);
							}
							else if (keycode == 57) { // 9
								playHotKeyVideo(9);
							}
							else {
							}
							event.preventDefault();
						}
					});

					if (playlist.length) {
						$('#require-setup').removeClass('_show');
						playVideo(0);
					}
					else {
						$('#require-setup').addClass('_show');
					}
				},

				hide () {

					this.player.pause();

					// Unbind all events
					$('*').add(window).off('.player');
				}

			}

		};
	let curView;

	function showView (newView) {

		const $body = $('body');

		if (curView && views[curView].hide) views[curView].hide();
		$body.removeClass(curView);

		curView = newView;

		$views.hide().filter(`[data-view=${newView}]`).show();
		$body.addClass(newView);
		// Add the correct
		if (views[newView].show) views[newView].show();

	}

	// When the page loads, run all the init functions, and then show the first view
	$.each(views, (name, view) => { if (view.init) view.init(); });
	showView($views.eq(0).data('view'));
}

function hitEnterOnPass(event){
	const keycode = event.which;
	if (keycode == 13) {
		connectToNetwork();
		event.preventDefault();
		return false;
	}
}

function init_network () {

	// Poll to check whether we're connected to the Internet
	let checkInternetRunning = false;
	const checkInternet = () => {
		if (!checkInternetRunning) {
			checkInternetRunning = 1;
			//console.log('Check network config...');
			$.ajax({
				type: "POST",
				url: 'ajax/kiosk-controller.php?rn=' + rn(),
				data: {
					action: 'check-internet'
				},
				success: function (rsp) {
					//console.log(rsp);
					checkInternetRunning = false;
					if (rsp['response'] == 'success') {
						// We have Internet!
						$('#setup-screen-error-wrapper').removeClass('_show');
						$('#setup-screen-success-wrapper').addClass('_show');
						$('#video-wrapper-save-button').show();
						checkForUpdates(true);

					}
					else {
						$('#setup-screen-error-wrapper').addClass('_show');
						$('#setup-screen-success-wrapper').removeClass('_show');
						$('#video-wrapper-save-button').hide();
					}
				}
			});
		}
		else {
			checkInternetRunning++;
			if (checkInternetRunning > 3) checkInternetRunning = false;
		}
	};
	setInterval(checkInternet, 2000);
	checkInternet();

	// Poll to get the list of available networks
	const lastNetworkList = '';
	let getNetworksRunning = false;
	const getNetworks = function () {
		if (!getNetworksRunning) {
			getNetworksRunning = 1;
			console.log('Scanning for networks...');
			$.ajax({
				type: "POST",
				url: 'ajax/kiosk-controller.php?rn=' + rn(),
				data: {
					action: 'get-networks'
				},
				success: function (rsp) {
					console.log(rsp);
					getNetworksRunning = false;
					const s = $('#wifi-setup-select');
					let v = s.val();
					if (rsp['response'] == 'success') {
						//if (rsp.current_wifi_network != '') {
						//	$('#current_wifi_network').html('Current network: <strong>'+rsp.current_wifi_network+'</strong>');
						//}
						//else {
						$('#current_wifi_network').html('');
						//}
						if (v == '') v = rsp.current_wifi_network;

						/*
						var snap = JSON.stringify(rsp.networks);
						if (snap != lastNetworkList) {
							//console.log(lastNetworkList);
							lastNetworkList = snap;
							if (rsp.networks.length) {
								var os = '<option value="">--</option>';
								for (var i = 0; i < rsp.networks.length; i++) os += '<option value="'+rsp.networks[i]+'"'+((v == rsp.networks[i]) ? ' selected="selected"' : '')+'>'+rsp.networks[i]+'</option>';
								s.html(os);
								$('#looking-spinner').addClass('_hide');
							}
							else {
								$('#looking-spinner').removeClass('_hide');
								s.html('<option value="">Looking for networks...</option>');
							}
						}
						*/

						if (rsp.networks.length) {
							$('li.looking').remove();
							$('#looking-spinner').addClass('_hide');
							const
								curNames = [],
								$li = $('#available-networks li');
							$li.each(function () {
								curNames.push($(this).html());
							});
							const newNames = [];
							for (let i = 0; i < rsp.networks.length; i++) {
								newNames.push(rsp.networks[i]);
								if (curNames.indexOf(rsp.networks[i]) == -1) {
									const li = $('<li>').html(rsp.networks[i]).click(function () {
										const me = $(this);
										$('#available-networks li._selected').each(function () {
											$(this).removeClass('_selected');
										});
										me.addClass('_selected');
									});
									if (v == rsp.networks[i]) li.addClass('_selected');
									$('#available-networks').append(li);
								}
							}
							$li.each(function () {
								if (newNames.indexOf($(this).html()) == -1) $(this).remove();
							});
						}
						else {
							$('#looking-spinner').removeClass('_hide');
							$('#available-networks').html('<li class="looking">Looking for networks...</li>');
						}

					}
					else {
						s.html('<option value="">Looking for networks...</option>');
						$('#looking-spinner').removeClass('_hide');
					}
				}
			});
		}
		else {
			getNetworksRunning++;
			if (getNetworksRunning > 2) getNetworksRunning = false;
		}
	};
	setInterval(getNetworks,5000);
	getNetworks();

	// Toggle password field
	const togglePassword = toggle => {
		let shown = $password.prop('type') == 'text';
		if (toggle) {
			shown = !shown;
			$password.prop('type', shown ? 'text' : 'password');
		}
		$togglePassword.find('span').text(shown ? 'Hide' : 'Show');
	};
	
	const
		$password = $('#wifi-setup-input'),
		$togglePassword = $('#toggle-password-button').click(() => togglePassword(true));
	togglePassword();

}

let spinnerTimer = false;

function connectToNetwork () {
	let network = '';
	$('#available-networks li._selected').each(function () {
		if (network == '') network = $(this).html();
	});
	const params = {
		action: 'set-wifi-network',
		network: network,
		pass: $('#wifi-setup-input').val()
	};
	if (params.network == '') {
		swal('Oops!', 'Please select a WiFi network to connect to.', 'error');
		return false;
	}
	else {
		if (spinnerTimer) clearTimeout(spinnerTimer);
		const spinner = $('#connect-spinner');
		spinner.addClass('_show');
		spinnerTimer = setTimeout(function () {
			spinner.removeClass('_show');
		}, 20000);
		$.ajax({
			type: "POST",
			url: 'ajax/kiosk-controller.php?rn=' + rn(),
			data: params,
			success: function (rsp) {
				//
			}
		});
	}
}

/**
 * If the kiosk has a pending update check scheduled, then this function runs that update check.
 * @param {function|boolean} callback - If a callback function is provided, then it will be called once the update check
 * has completed. If the boolean value TRUE is provided and a update check has been postponed because there was no
 * network, then the postponed update check will be rerun.
 */
function checkForUpdates (callback) {

	const retryUpdateWaitingOnNetwork = callback === true;
	if (retryUpdateWaitingOnNetwork)
		callback = $.noop;

	if (
		+sessionStorage.checkedForUpdates
		|| (+sessionStorage.updateCheckWaitingOnNetwork && retryUpdateWaitingOnNetwork !== true)
	) { // We already checked for updates
		/*if (+sessionStorage.showUpdateMessage) { // Was an update just applied?
			sessionStorage.showUpdateMessage = 0;
			const $updateAlert = $('#update-alert').show();
			setTimeout(() => $updateAlert.slideUp(), 3000);
		}*/
		callback();
	}

	else { // We haven't checked for updates yet...let's do that now

		sessionStorage.updateCheckWaitingOnNetwork = false;

		/**
		 * Hide the update UI and call the post-update callback
		 */
		function hideUpdateUI () {
			swal.close();
			callback();
		}
		
		function showUpdateMessage (title, text, callback) {
			if (QA)
				swal({
					title: title,
					text: text,
					type: 'info'
				}, callback);
			else
				callback();
		}

		swal({
			title: 'Checking for updates...',
			allowEscapeKey: false,
			showConfirmButton: false
		});

		// Do the actual check
		$.post('ajax/kiosk-controller.php', { action: 'check-for-updates' }, response => {

			if (response.response == 'success') { // We heard back from git

				sessionStorage.checkedForUpdates = 1;
				const gitRsp = response.git_rsp;

				showUpdateMessage('git response:', gitRsp, () => {
					if (gitRsp.split('\n').reverse()[0].toLowerCase().replace(/[^a-z]/g, '') == 'alreadyuptodate')
						hideUpdateUI();
					else // We just applied updates from git
						//sessionStorage.showUpdateMessage = 1;
						location.reload();
				});

			}
			else // If we get here, that means that there's currently no network
				showUpdateMessage(
					'No network connection',
					`
						The update check could not be completed because there is no network connection. It will automatically retry
						when there is network.
					`,
					() => {
						sessionStorage.updateCheckWaitingOnNetwork = 1;
						hideUpdateUI();
					}
				);
		});

	}

}