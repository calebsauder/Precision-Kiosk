<?php

require_once("inc/init.inc.php");

$body_cls = 'fullscreen player';
include("inc/head.inc.php");

$playlist = get_playlist();

?>


<?php

$ondomready = ("
	init_player();
");

$add_to_foot .= "<script src='js/error-logging.js'></script>";

include("inc/foot.inc.php");

?>
