<?php

require_once("DomManagerClass.php");
require_once("ScrapingManagerClass.php");
	
$url        = "http://www.yahoo.co.jp";

$user_agent = "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0\r\n";

$query      = 'id("topicsfb")/div[@class="topicsindex"]/ul[@class="emphasis"]/li[1]/a';

$scraper    = new ScrapingManagerClass($url, $user_agent);
$dom        = new DomManagerClass();

$content    = $scraper->getHtmlContent();
$nodes      = $dom->getDomInHtml($content, $query);

$dom->renderTextNode($nodes);

?>
