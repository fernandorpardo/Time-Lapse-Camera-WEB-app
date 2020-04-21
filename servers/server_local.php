<?php
header('Content-Type: text/xml');
header('Cache-Control: no-cache');
header('Cache-Control: no-store', false);     // false => this header not override the previous similar header
header("Access-Control-Allow-Origin: *");
	
$action= isset($_POST['Action'])?$_POST['Action']:'Unknown';
$as_result= 'OK';
$xmlStr="<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
$xmlStr .="<data>";
$xmlStr .="<action>$action</action>";

switch($action)
{
	case 'FILE': // Read file content
		$stime= date("H:i:s", time());	
		$fullfilename= isset($_POST['file'])?$_POST['file']:NULL;
		$cresult="ERROR";
		if($fullfilename && ($fp = fopen($fullfilename, 'r')))
		{
			$content = fread($fp, filesize($fullfilename));
			fclose($fp);
			$xmlStr .="<content>$content</content>";
			$xmlStr .="<time>$stime</time>";
			$cresult="OK";
		}
	break;
	default: 
		$as_result= 'ERROR';
	break;
}
$xmlStr .="<result>$as_result</result>";
$xmlStr .="</data>";
echo $xmlStr;
?>