<?php
	
$url = "http://www.yahoo.co.jp";

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

$content    = file_get_contents($url, false, $context);
$query      = 'id("topicsfb")/div[@class="topicsindex"]/ul[@class="emphasis"]/li[1]/a';

$content    = fixFormat($content);
$nodes      = getDom($content, $query);

renderTextNode($nodes);

function fixFormat($data)
{
	return mb_convert_encoding($data, 'HTML-ENTITIES', 'UTF-8');
}

function getDom($data, $query)
{
	$dom = new DOMDocument;

	//preserveWhiteSpaceはインデント部分の余分な空白を取り除いてくれるので、空白で悩まされなくていい。
	$dom->preserveWhiteSpace = false;

	//文字化け対策.  
	$dom->encoding = 'UTF-8';

	//字下げや空白を考慮してきれいに整形した出力を行う。.
	$dom->formatOutput = true;  	

	@$dom->loadHTML($data); // nameとidの値が被るとエラーになるので、@で抑制
	$xpath = new DOMXpath($dom);

	$text_nodes = $xpath->query($query);

	return $text_nodes;		
}

/**
 * テキストノードを出力
 * @param  object $nodes ノード要素
 */
function renderTextNode($nodes)
{
	foreach ($nodes as $n) {
	  var_dump($n->nodeValue);
	}
}

?>
