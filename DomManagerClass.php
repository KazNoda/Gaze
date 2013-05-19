<?php

class DomManagerClass
{
	public function __construct()
	{

	}

	private function _fixHtmlFormat($html)
	{
		return mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
	}

	public function getDomInHtml($html, $query)
	{
		$dom = new DOMDocument;

		//preserveWhiteSpaceはインデント部分の余分な空白を取り除いてくれるので、空白で悩まされなくていい。
		$dom->preserveWhiteSpace = false;

		//文字化け対策.  
		$dom->encoding = 'UTF-8';

		//字下げや空白を考慮してきれいに整形した出力を行う。.
		$dom->formatOutput = true;  	

		@$dom->loadHTML($html); // nameとidの値が被るとエラーになるので、@で抑制
		$xpath = new DOMXpath($dom);

		$text_nodes = $xpath->query($query);

		return $text_nodes;		
	}

	/**
	 * テキストノードを出力
	 * @param  object $nodes ノード要素
	 */
	public function renderTextNode($nodes)
	{
		foreach ($nodes as $n) {
		  var_dump($this->fixHtmlFormat($n->nodeValue));
		}
	}
}

?>
