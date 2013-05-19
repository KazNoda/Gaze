<?php


$query      = 'id("topicsfb")/div[@class="topicsindex"]/ul[@class="emphasis"]/li[1]/a';


class ScrapingManagerClass
{
	private $url;
	private $user_agent = "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0\r\n";

	// $user_agent .= "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n";
// $user_agent .= "Accept-Language: ja,en-us;q=0.7,en;q=0.3\r\n";
// $user_agent .= "Accept-Encoding: gzip, deflate\r\n";

	public function __construct($url = false, $user_agent)
	{
		$this->url = $url;
		$this->user_agent = $user_agent;
	}

	public function setUrl($url)
	{
		$this->url = $url;
	}

	public function setUserAgent($user_agent)
	{
		$this->user_agent = $user_agent;
	}

	/**
	 * コンテキストを作成
	 */
	private function _getContextOption()
	{
		$context = stream_context_create(array(
			'http' => array(
				'method' => 'GET',
				'header' => $this->user_agent,
			)
		));

		return $context;
	}

	/**
	 * 指定されているURL + OptionからWebページのHTMLを取得
	 * @return string HTMLデータ
	 */
	public function getHtmlContent()
	{
		$context = $this->_getContextOption();

		if(($content = file_get_contents($this->url, false, $context)) !== false) {
			return $content;
		} else {
			return false;
		}
	}
}


?>
