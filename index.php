<?php

require_once("inc/init.inc.php");
$body_cls = 'fullscreen';
$data_page = 'welcome';
include("inc/head.inc.php");

?>
<section id="welcome-screen-wrapper" data-view="welcome">
	<h1 id="welcome-screen-title">Welcome</h1>
	<?=QA ? "
		<p id='welcome-screen-debug'>
			QA mode: <b>On</b><br>
			Detected environment: <b>" . ENV_NAME . "</b>
		</p>
	" : ""?>
	<p><img id="main-screens-pp-logo" src="img/logo.png"></p>
	<!--<div class='alert' id='update-alert' style='display: none'>You've been updated to the latest and greatest version of the Kiosk software!</div>-->
	<div id="welcome-screen-button-wrapper">
		<a href="check-network.php" id="welcome-screen-setup-button" class="welcome-screen-button">
			<span class="welcome-screen-button-icon"><img class="icon pad-right" src="img/gear.png"></span>Set-up
		</a>
		<a href id="welcome-screen-start-button" class="welcome-screen-button">
			<span class="welcome-screen-button-icon"><img class="icon pad-right" src="img/play.png"></span>Start Kiosk
		</a>
		<?=QA ? "
			<a href='local-storage.php' class='welcome-screen-button'>
				LocalStorage viewer
			</a>
		" : ""?>
	</div>
</section>

<section data-view="player">
	<video id="player" data-index="0"></video>
	<ul id="playlist">
	<?php

	$n = 1;
		$playlist = get_playlist();
		foreach ($playlist as $video){
		if (file_exists($video_dir.$video['id'].'.mp4')) {
			echo '<li id="v'.$video['id'].'" data-id="'.$video['id'].'" data-hotkey="'.$video['hotkey'].'" data-video="'.$video_url.$video['id'].'.mp4"><span><img src="img/chevron-right.png"></span>'.$video['title'];
			if ($video['hotkey'] != '') echo '<div>Hot key: '.$video['hotkey'].'</div>';
			if ($n == count($playlist)) {
				echo '<div style="margin-top:20px; text-align:right">Esc to exit</div>';
			}
			echo '</li>';
		}
		$n++;
	}

	?>
	</ul>
	<div id="video-title"></div>
	<div id="require-setup">This kiosk requires set-up. Please hit <em>ESC</em> to return to main menu.</div>
</section>

<?php

$ondomready .= ("
	QA = " . (QA ? "true" : "false") . ";
	checkForUpdates(initHomePage);
");

//$add_to_foot .= "<script src='js/error-logging.js'></script>";

include("inc/foot.inc.php");

?>
