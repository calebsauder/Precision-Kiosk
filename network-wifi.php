<?php
 
//echo shell_exec('whoami');
//exit;

require_once("inc/init.inc.php");
$data_page = '';
include("inc/head.inc.php");

set_networkMonitor();

?>
<header id="video-wrapper-header">
	<a href="index.php" id="video-wrapper-back-button" class="video-header-button">
		<img class="icon pad-right" src="img/chevron-left.png">Back
	</a>
	<h1 id="video-wrapper-header-title"><img id="video-list-pp-logo" src="img/logo.png">Network</h1>
	<a href="playlist.php" id="video-wrapper-save-button" class="video-header-button">
		<img class="icon pad-right" src="img/gear.png">Configure Playlist
	</a>
	<div class="clear-float"></div>
</header>
<section id="setup-screen-wrapper">
	<div id="setup-screen-error-wrapper">
		<p class="warning-text"><img class="icon pad-right" src="img/warning.png">This kiosk is not connected to the internet. Please plug it into your local network or select a WiFi network.</p>
	</div>
	<div id="setup-screen-success-wrapper">
		<p class="success-text"><img class="icon pad-right" src="img/check.png">This kiosk is connected to the internet. <span id="current_wifi_network"></span></p>
	</div>
	
	<div class="clear"></div>
	
	<div id="setup-connection-wrapper">
		<h2 id="setup-wifi-title">Available WiFi Networks</h2>
		<form>
			<label class="wifi-setup-label">
				SSID <div id="looking-spinner" class="spinner"></div>
				<ul id="available-networks"></ul>
			</label>
			<br>
			<label class="wifi-setup-label">
				Pass
				<input id="wifi-setup-input" type="password" placeholder="Enter network password..." autocomplete="off" maxlength="150" onKeyDown="hitEnterOnPass(event)">
			</label>
			<button id="toggle-password-button" class="btn-green" type="button"><span></span> Password</button>
		</form>
		<div class="connect-btn">
			<button id="wifi-connect-button" class="btn-green" onclick="connectToNetwork()">Connect</button>
			<div id="connect-spinner" class="spinner"></div>
		</div>
	</div>
</section>

<?php

$ondomready = ("
	init_network();
");

include("inc/foot.inc.php");

?>
