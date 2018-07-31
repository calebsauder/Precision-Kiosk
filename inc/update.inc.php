<?php

	$update_error = false;
	define("RUNNING_UPDATE_SCRIPT", ENV_NAME == "RASPBERRY_PI" && !$_SESSION["ran_update_script"]);

	if (RUNNING_UPDATE_SCRIPT) {
		define("AUTOSTART_FILE", "/home/pi/.config/lxsession/LXDE-pi/autostart");
		$old_contents = sudo("cat " . AUTOSTART_FILE);
		if ($old_contents["return"]) {
			if (strpos($old_contents["output"], "@unclutter") === false) {
				sudo("apt-get install unclutter");
				sudo("echo '@unclutter -idle 0.1' >> " . AUTOSTART_FILE);
			}
			// else - unclutter is already set up!
		}
		else
			$update_error = "Sudo privileges were not available.";

		if (!$update_error)
			$_SESSION["ran_update_script"] = true;

	}

	define("UPDATE_ERROR", $update_error);