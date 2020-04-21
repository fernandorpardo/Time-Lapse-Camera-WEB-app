<?PHP
// Time Lapse Camera WEB app
// This is part of the Wilson project (www.iambobot.com)
header('Cache-Control: no-cache');
header('Cache-Control: no-store', false);     // false => this header not override the previous similar header
// Comment / Uncomment these two lines to show/hide PHP server errors
ini_set('display_errors', 'on');
error_reporting(E_ALL);

define("DEFAULT_FRAMERATE", 100); // mili seconds
define("IMAGE_DIR", "../ramdisk/"); // Image directory; should have write permission to any
$datafile= '/var/www/ramdisk/data.txt';
$ServerLocal= 'servers/server_local.php';
$time_lapse= isset($_GET['time'])? $_GET['time'] : DEFAULT_FRAMERATE; 
?>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="lang" content="es" />
	<title>Time Lapse Camera</title>
	<meta name="description" content="Time-Lapse Camera control">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0;">
	<link rel="stylesheet" type="text/css" media="all" href="style/style.css"/>
	<script type='text/javascript' language="javascript" src='scripts/ajax.0.10.tlcam.js'></script>
</head>

<body>
<div class="canvas">
	<div class="wrapper">
		<div class="container">
			<div id="CAMERA_1" class="camera_box">
				<div class="frame_header"><p>Camera 1</p></div>
				<div id="frames" style='frame_container'>
					<div class='frame'><img alt='' src='' width="100%" height="auto"></div>
					<div class='frame'><img alt='' src='' width="100%" height="auto"></div>
				</div>
				<div id='info' class='frame_footer'><p></p><p></p></div>							
			</div>	
			<div class="debug_area" style="margin-top:8px;">
				<p id="DEBUG_TRACES"></p>
			</div>						
		</div>
	</div>
</div>
</body>
</html>

<script type="text/javascript">
// -------- CAMERA --------------------------------------------------------------------------------
// Object global variables
var cam;
var ifirst;
// Class
class Camera {
	constructor(id) 
	{
		this.id = id;
		this.size= 0;
		this.canvas= document.getElementById(this.id);	
		// HTML
		var element = document.getElementById('frames');
		var divs= element.getElementsByTagName("div");
		this.refresh_rate=  parseInt("<?=$time_lapse ?>");
		var p= document.getElementById('info').getElementsByTagName("p");
		p[1].innerHTML=  "Time-lapse= <span>" + this.refresh_rate + " msec</span>";			
		function img_onload() 
		{
			var div = document.getElementById('frames').getElementsByTagName("div");
			div[ifirst? 1 : 0].style.zIndex="1";
			div[ifirst? 0 : 1].style.zIndex="0";
			//div[ifirst? 0 : 1].getElementsByTagName("img")[0].src="";
		}
		var div= document.getElementById('frames').getElementsByTagName("div");
		div[0].getElementsByTagName("img")[0].onload = img_onload;		
		div[1].getElementsByTagName("img")[0].onload = img_onload;	
		ifirst= true;
		this.next();
	}
	next()
	{
		var param= "<?PHP echo $datafile ?>";
		getXMLDoc('<?PHP echo $ServerLocal ?>', "Action=FILE&file=" + param, XMLCallBackCamera, 5000); // Timeout= 5 seconds 		
		setTimeout("cam.next()", this.refresh_rate);
	}
	load(image, ctime)
	{
		// Image
		var div= document.getElementById('frames').getElementsByTagName("div")[ifirst?0:1];	
		var img= div.getElementsByTagName("img")[0];
		img.src=  '<?PHP echo IMAGE_DIR ?>' + image + "?" + new Date().getTime();
		ifirst = !ifirst;
		// set the onload each time the src is updated, otherwise image swings
		img.onload = function () 
		{
			var div = document.getElementById('frames').getElementsByTagName("div");
			div[ifirst? 0 : 1].style.zIndex="1";
			div[ifirst? 1 : 0].style.zIndex="0";
		}
		// Footer info - image name
		var p= document.getElementById('info').getElementsByTagName("p");
		p[0].innerHTML=  image +" / <span>"+ctime+"</span>";		
	}
} // (END) Class Camera



function XMLCallBackCamera(xmlstr, returnvalue) 
{
	// Time-out 
	if(typeof returnvalue !== "undefined" && returnvalue==1) 
	{
		console.log('TIMEOUT!!!');	
	}
	else 
	{
		var xmlDoc= XMLDocCreate(xmlstr);
		var action= XMLDocParse(xmlDoc, "action", 0);
		var result= XMLDocParse(xmlDoc, "result", 0);
		// Response
		if(result != 'OK')
		{
			var error= XMLDocParse(xmlDoc, "error", 0);
			var error_message= 'ERROR! XMLCallBack unknown action= ' + action + '(' + error + ')';
			ErrorManager(error_message);
		}
		else
		switch (action)
		{
			case 'FILE':
				var content= XMLDocParse(xmlDoc, "content", 0);
				var ctime= XMLDocParse(xmlDoc, "time", 0);
				cam.load(content, ctime);
			break;
			default:
				var error_message= 'ERROR! Default - XMLCallBack unknown action= ' + action;
				ErrorManager(error_message);
			break;		
		}
	}		
}
function ErrorManager(mess) { console.log(mess); DebugWrite(mess); }	
function DebugInit() { document.getElementById("DEBUG_TRACES").innerHTML = ""; }
function DebugWrite(text)
{
	var e= document.getElementById("DEBUG_TRACES");
	e.innerHTML += text + "</br>";
	e.scrollTop = e.scrollHeight - e.clientHeight;
}
!function ()
{
	window.addEventListener(
		"resize",
		function() 
		{
			DebugWrite("screen size= " + screen.width + " x " + screen.height);		
		},
		{ passive: true }
	);
	// Debug
	DebugInit();
	DebugWrite("screen size= " + screen.width + " x " + screen.height);
	// Camera
	cam = new Camera("CAMERA_1");
}();
</script>	
<!-- END OF FILE --> 
