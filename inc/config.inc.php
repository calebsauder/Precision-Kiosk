<?php

	/**
	 * Each environment has the following configuration options:
	 * 		data_dir			string	required	The "data" root directory path, beginning from the file system root and ending
	 * 																		with a "/". Note, however, that if this environment has a "detect_dir" or a
	 * 																		"detect_regex", then the "data_dir" will be PREFIXED with the "detect_dir" or
	 * 																		"detect_regex".
	 * 		detect_dir		string	optional	A substring that will be matched against the beginning of the __FILE__ constant
	 * 																		to detect the presence of this environment. If neither this nor "detect_regex"
	 * 																		are provided, then this environment will be used as the default environment.
	 * 		detect_regex	string	optional	A regular expression to match against the __FILE__ constant to detect the
	 * 																		presence of this environment. If neither this option nor "detect_dir" are
	 * 																		provided, then this environment will be used as the default environment.
	 * 		qa						boolean	optional	Whether this environment is a QA environment. If it is, then debugging
	 * 																		information will be shown. Defaults to FALSE (meaning that this is a production
	 * 																		environment).
	 * 		root_url			string	required	The root URL to access the Kiosk app from in this environment, beginning and
	 * 																		ending with a "/".
	 */
	define("ENVIRONMENTS", [

		// ROOT on pi:
		// /usr/share/apache2/htdocs/
		"RASPBERRY_PI" => [
			"data_dir" => "/data/",
			"root_url" => "/",
		],
		"MAMP" => [
			"detect_dir" => "/Applications/MAMP",
			"root_url" => "/",
			"data_dir" => "/htdocs/data/",
			"qa" => true
		],
		"XAMPP" => [
			"detect_dir" => "/Applications/XAMPP/xamppfiles",
			"root_url" => "/pp-kiosk/",
			"data_dir" => "/htdocs/pp-kiosk/data/",
			"qa" => true
		],
		"VALET" => [
			"detect_regex" => "/^\/Users\/[^\/]+\/Sites/",
			"root_url" => "/",
			"data_dir" => "/kiosk/kiosk-data/",
			"qa" => true
		]
	]);

	$detected_env = null;
	$data_dir_prefix = "";
	foreach (ENVIRONMENTS as $env_name => $env_config) {
		$detect_dir = $env_config["detect_dir"];
		$detect_regex = $env_config["detect_regex"];
		if ($detect_dir || $detect_regex) {
			if ($detect_dir && strpos(__FILE__, $detect_dir) === 0) {
				$data_dir_prefix = $detect_dir;
				$detected_env = $env_name;
			}
			if ($detect_regex && preg_match($detect_regex, __FILE__, $matches) === 1) {
				$data_dir_prefix = $matches[0];
				$detected_env = $env_name;
			}
		}
		else
			$default_env = $env_name;
	}

	define("ENV_NAME", $detected_env ? $detected_env : $default_env);
	define("ENV_CONFIG", ENVIRONMENTS[ENV_NAME]);
	define("ROOT_URL", ENV_CONFIG["root_url"]);
	define("QA", !!ENV_CONFIG["qa"] || isset($_GET["qa"]));

	// location below root of data directory
	$base = $data_dir_prefix . ENV_CONFIG["data_dir"];