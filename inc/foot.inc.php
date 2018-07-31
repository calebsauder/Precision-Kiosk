<?php

?>
<div id="dimwin">
	<div class="spinner"></div>
	<div id="dimwin_txt"></div>
</div>
<script src="js/libs/jquery-3.2.1.min.js"></script>
<script src="js/libs/jquery-ui-1.12.1/jquery-ui.min.js"></script>
<script src="js/libs/sweetalert.1.1.3/sweetalert.min.js"></script>
<script src="js/functions.js?rn=<?=time()?>"></script>
<script>
	QA = <?=QA ? "true" : "false"?>;
</script>
<?=$add_to_foot?>
<script language="javascript">
<!--
$(document).ready(function(){
	<?php
	echo $ondomready;
	?>
});

$(document).keydown(function(event) {
	if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189'  ) ) {
        event.preventDefault();
     }
    // 107 Num Key  +
    // 109 Num Key  -
    // 173 Min Key  hyphen/underscor Hey
    // 61 Plus key  +/= key
});

$(window).bind('mousewheel DOMMouseScroll', function (event) {
	if (event.ctrlKey == true) {
       event.preventDefault();
	}
});

//-->
</script>
</body>
</html>