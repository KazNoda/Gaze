<?php
	
$url = $_GET['url'];

$user_agent = "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0\r\n";
// $user_agent .= "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n";
// $user_agent .= "Accept-Language: ja,en-us;q=0.7,en;q=0.3\r\n";
// $user_agent .= "Accept-Encoding: gzip, deflate\r\n";

$context = stream_context_create(array(
	'http' => array(
		'method' => 'GET',
		'header' => $user_agent,
	)
));

$content = file_get_contents($url, false, $context);


$location_path = 'id("topicsfb")/div[@class="topicsindex"]/ul[@class="emphasis"]/li[1]/a';


// $pattern = "/(<link.*?href=\")\.?\/(.*?\/>)/s";
// $css_pattern = "/(<link.*?href=\")\.?\/(css.*?\/>)/s";
// $img_pattern = "/(<img.*?src=\")\.?\/(images.*?\/>)/s";

// $base_url_pattern = "/http:\/\/.*?\//";

// if(preg_match($base_url_pattern, $url, $match)){
// 	$base_url = $match[1];
// }

// $content = preg_replace($pattern, "$1".$base_url."/$2", $content);
//$content = preg_replace($css_pattern, "$1".$url."/$2", $content);
//$content = preg_replace($img_pattern, "$1".$url."/$2", $content);

echo($content);

?>
