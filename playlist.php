<?php

//echo shell_exec('whoami');
//exit;

//phpinfo();
//exit;

require_once("inc/init.inc.php");

if (!has_internet()) {
	header("Location:network.php");
}

$body_cls = 'fullscreen';
$data_page = 'video-list';
include("inc/head.inc.php");

?>
<section id="video-screen-wrapper">
	<section id="main-video-wrapper">
		<header id="video-wrapper-header">
			<a href="index.php" id="video-wrapper-back-button" class="video-header-button">
				<img class="icon pad-right" src="img/chevron-left.png">Back
			</a>
			<h1 id="video-wrapper-header-title"><img id="video-list-pp-logo" src="img/logo.png">Set-up</h1>
			<a href="javascript:savePlaylist()" id="video-wrapper-save-button" class="video-header-button">
				<img class="icon pad-right" src="img/save.png">Save Selection
			</a>
			<a href="network.php" id="video-wrapper-network-button" class="video-header-button">
				<img class="icon pad-right" src="img/wifi.png">Network
			</a>
			<div class="clear-float"></div>
		</header>
		<div id="video-list-wrapper"></div>
	</section>
	<aside id="video-roll-wrapper">
		<div>
			<h3 id="kiosk-roll-title">Kiosk Roll:</h3>
		</div>
		<div id="kiosk-roll-video-list"></div>
	</aside>
</section>
<div id="loading-modal-wrapper">
	<div id="loading-modal-content-wrapper">
		<h2 id="video-download-modal-title"><div class="spinner"></div>Downloading Videos...</h2>
		<div id="download-outer-loading-wrapper">
			<div id="download-inner-loading-bar"></div>
		</div>
		<button id="cancel-download-button">Cancel</button>
	</div>
</div>
<textarea id="save-rsp" style="" placeholder="Save response..." autocomplete="off"></textarea>
<?php

$ondomready = ("
	init_playlistConfig();
");

$add_to_foot = ('
<script src="js/kiosk-functions.js"></script>
');

include("inc/foot.inc.php");

?>