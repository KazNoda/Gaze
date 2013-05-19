// window.onload = function () {
// 	$id('html2xpath').style.display = 'none';
// 	$id('start_url').onsubmit = url_submit;
// 	$id('start_url').url.onfocus = function(){this.select();};
// }

var html2xpath;

$(function () {
	$id('html2xpath').style.display = 'none';
	$('#start_url').submit(function(){

		html2xpath = new html2xpath($id('html2xpath'));
	//	html2xpath.setRedirect('./redirect/?url=');
	//	html2xpath.setRedirect('./redirect/index.html?url=');
	//	
		html2xpath.init($('#url').val());

		//画面切替
		$id('start').style.display = 'none';
		$id('html2xpath').style.display = '';

		//url submit
	//	if ($id('edit_form').url.value) {
			html2xpath.form_submit();
	//	}

		return false;
	});
	$id('start_url').url.onfocus = function(){this.select();};
});

function html2xpath(b) {
	var self = this;
	var d = null;
	var redirect = '';
	var url = null;
	var active_xpath = null;

	this.init = function(start_url)
	{
		var e = $id('edit');
		var p = $id('page');
		var pp = p.parentNode;

		var $wrap = $("#page").parent();

		$("#page").css("float", "left");

		$wrap
			.append(
				$("<div/>")
					.attr("id", "preview")
					.css("float", "none")
			)
			.append(
				$("<div/>")
					.css("clear", "left")	
			);

		// $("#edit")
		// 	.append(
		// 		$("<form/>")
		// 			.attr("id", "edit_form")
		// 			.append(
		// 				$("<input/>")
		// 					.attr({
		// 						"id": "html2xpath_url",
		// 						"name": "url",
		// 						"type": "text",
		// 						"url": start_url
		// 					})
		// 					.css("width", "40em")
		// 					.focus(function(){
		// 						$(this).select();
		// 					})
		// 			)
		// 			.append(
		// 				$("<input/>")
		// 					.attr({
		// 						"name": "submit",
		// 						"type": "submit"
		// 					})
		// 					.val("URL")
		// 			)
		// 	)
		// 	.append(
		// 		$("<a/>")
		// 			.attr("id", "extend")
		// 			.html("拡げる[↑]")
		// 	)
		// 	.append(
		// 		$("<a/>")
		// 			.attr("id", "refine")
		// 			.html("縮める[↓]")
		// 	)
		// 	.append(
		// 		$("<select/>")
		// 			.attr("id", "color")
		// 			.append($("<option/>").val("orange").html("オレンジ"))
		// 			.append($("<option/>").val("red").html("赤"))
		// 			.append($("<option/>").val("skyblue").html("水色"))
		// 			.append($("<option/>").val("yellow").html("黄色"))
		// 			.append($("<option/>").val("green").html("緑色"))
		// 	)
		// 	.append(
		// 		$("<input/>")
		// 			.attr({
		// 				"id": "disable_id",
		// 				"type": "checkbox"
		// 			})
		// 			.val(1)
		// 			.after("id無効<br />")
		// 	);

		$("#edit")
			.append(
				$("<form/>")
					.attr("id", "edit_form")
					.append(
						$("<input/>")
							.attr({
								"id": "html2xpath_url",
								"name": "url",
								"type": "text",
								"url": start_url
							})
							.css("width", "40em")
							.focus(function(){
								$(this).select();
							})
					)
					.append(
						$("<input/>")
							.attr({
								"name": "submit",
								"type": "submit"
							})
							.val("URL")
					)
			)

		//エディット部品生成
		var f = document.createElement('form');
		f.id = 'edit_form';
		e.appendChild(f);

		url = document.createElement('input');
		url.id = 'html2xpath_url';
		url.name = 'url';
		url.type = 'text';
		url.value = start_url;
		url.style.width = '40em';
		url.onfocus = function(){this.select();};
		f.appendChild(url);

		var submit = document.createElement('input');
		submit.name = 'submit';
		submit.type = 'submit';
		submit.value = 'URL';
		f.appendChild(submit);

		var extend = document.createElement('a');
		extend.id = 'extend';
		extend.appendChild(document.createTextNode('拡げる[↑]'));
		e.appendChild(extend);

		var refine = document.createElement('a');
		refine.id = 'refine';
		refine.appendChild(document.createTextNode('縮める[↓]'));
		e.appendChild(refine);

		var color = e.appendChild(document.createElement('select'));
		color.id = 'color';

		var opt = color.appendChild(document.createElement('option'));
		opt.value = 'orange';
		opt.appendChild(document.createTextNode('オレンジ'));
		var opt = color.appendChild(document.createElement('option'));
		opt.value = 'red';
		opt.appendChild(document.createTextNode('赤'));
		var opt = color.appendChild(document.createElement('option'));
		opt.value = 'skyblue';
		opt.appendChild(document.createTextNode('水色'));
		var opt = color.appendChild(document.createElement('option'));
		opt.value = 'yellow';
		opt.appendChild(document.createTextNode('黄色'));
		var opt = color.appendChild(document.createElement('option'));
		opt.value = 'green';
		opt.appendChild(document.createTextNode('緑色'));

		var id = document.createElement('input');
		id.id = 'disable_id';
		id.type = 'checkbox';
		id.value = '1';
		e.appendChild(id);
		e.appendChild(document.createTextNode('id無効'));
		e.appendChild(document.createElement('br'));




		var xpaths = e.appendChild(document.createElement('form'));
		xpaths.id = 'xpaths';
		xpaths.name = 'xpaths';

		var active = _create_input('radio','active');
		active.id = 'active_def';
		active.value = '';
		active.onchange = function(){
			_set_active(this.parentNode.childNodes.item(1));
		}
		xpaths.appendChild(active);
		active.checked = true;

		var xpath = xpaths.appendChild(document.createElement('input'));
		xpath.id = 'xpath';
		xpath.name = 'xpath';
		xpath.type = 'text';
		xpath.value = '';
		xpath.style.width = '40em';
		xpath.onfocus = function(){
			this.select();
			_set_active(this);
		};

//		_set_active(active.parentNode.childNodes.item(1));
		active_xpath = active.parentNode.childNodes.item(1);

		var add = document.createElement('input');
		add.type = 'button';
		add.value = '+';
		add.onclick = function(){
			var r = $id('relatives');

			//xpath入力がある
			if (!$id('xpath').value) return;

			//xpathから1件以上ノードが存在する
			//未作成

			var relative = document.createElement('div');
			relative.id = 'relative';
			r.appendChild(relative);

			var active = _create_input('radio','active');
			active.value = '';
			active.onchange = function(){
				_set_active(this.parentNode.childNodes.item(1));
			}
			relative.appendChild(active);
			active.checked = true;

			var xpath = document.createElement('input');
			xpath.id = 'relative';
			xpath.name = 'relative';
			xpath.type = 'text';
			xpath.value = '';
			xpath.style.width = '40em';
			xpath.onkeydown = _xpath_keydown;
			xpath.onfocus = function(){
				this.select();
				_set_active(this);
			};
			relative.appendChild(xpath);

			_set_active(active.parentNode.childNodes.item(1));

			var del = document.createElement('input');
			del.type = 'button';
			del.value = '-';
			del.onclick = function(){
				var p = this.parentNode;
				if (p.firstChild.checked) {
					$id('active_def').checked = true;
					_set_active($id('active_def').parentNode.childNodes.item(1));
				}
				p.parentNode.removeChild(p);
			};
			relative.appendChild(del);

		};
		xpaths.appendChild(add);

		var relatives = xpaths.appendChild(document.createElement('div'));
		relatives.id = 'relatives';

		var gray = document.createElement('div');
		gray.id = 'gray1';
		gray.style.display = 'none';
		gray.style.position = 'absolute';
		gray.style.left = '0px';
		gray.style.top = '0px';
		gray.style.width = '100%';
		gray.style.height = '9999px';
		gray.style.zIndex = '200';
//		gray.style.color = '#ffffff';
		gray.style.paddingTop = '100px';
		gray.style.textAlign = 'center';
		gray.style.backgroundImage = 'url(./gray.png)';
		gray.appendChild(document.createTextNode('サイトを表示します．しばらくお待ち下さい．'));
		e.appendChild(gray);

		//画面構成初期処理
		$id('edit_form').onsubmit = _form_submit;
		if (document.all) {
			//ie
			$id('page').onreadystatechange = function () {
				if (this.readyState == 'complete') {
					_load();
//					this.onreadystatechange = null;
				}
			}
		} else {
			$id('page').onload =_load;
		}


		$id('xpath').onkeydown = _xpath_keydown;

	}
	this.form_submit = function()
	{
		_form_submit();
	}
	this.setRedirect = function(url)
	{
		redirect = url;
	}

	function _create_input(type,name) {
		if (document.all) {
			//ie
			var input = document.createElement('<input type="' + type + '" name="' + name + '">');
		} else {
			var input = document.createElement('input');
			input.type = type;
			input.name = name;
		}
		return input;
	}

	function _set_active(o){
		active_xpath = o;
		var radio = o.parentNode.childNodes.item(0);
		if (radio.checked == false) {
			radio.checked = true;
			_set_dom(o);
		}
	}

	function _form_submit(){
		var url = $id('html2xpath_url').value;

		var temp_url = "./redirect.php?url=";

		if (url) {
			$id('gray1').style.display = '';

			console.debug("redirect : ", redirect + encodeURIComponent(url));

			//$id('page').src = redirect + encodeURIComponent(url);
			
			$id('page').src = temp_url + encodeURIComponent(url);
		}
		return false;
	}

	function _load(){
		/* ovverride */
		top.page = window.page;


		/* initialize dom inspector */
		d = new DOMInspector(top.page);
		d.setCallbackDom(callback_dom);
//		d.setTag('a');
//		d.setSelMode(1);

		d.initialize();

		d.activate();


		$id('extend').onclick = function (e) {
			return _extend_refine(e,38);
		}
		$id('refine').onclick = function (e) {
			return _extend_refine(e,40);
		}
		$id('color').onchange = function (e) {
			d.reselect();
			top.page.focus();
		}

		$id('disable_id').onclick = function () {
			var mode = $id('disable_id').checked ? 1 : 0;
			d.setAddrMode(mode);
		}


		/* resize */
		var page = $id('page');
		var w0 = window.page.document.body.scrollWidth;
		var h0 = window.page.document.body.scrollHeight;
		var w1 = window.page.document.documentElement.scrollWidth;
		var h1 = window.page.document.documentElement.scrollHeight;
		var w = w0 > w1 ? w0 : w1;
		var h = h0 > h1 ? h0 : h1;
		if(w && h)
		{
			page.style.width = w + 'px';
			page.style.height = h + 'px';

			url.style.width = w + 'px';
			$id('xpath').style.width = w + 'px';
		}
		document.getElementById('gray1').style.display = 'none';
	}

	function callback_dom(dom) {

		if (active_xpath.parentNode.id == 'relative') {
			//相対パス
			var base = $id('xpath').value;
			var set_dom = d.getRelativePaths(base,dom);
			var exec_dom = base + '/' + set_dom;
//alert(set_dom + ' ' + exec_dom + ' ' + dom);
		} else {
			var set_dom = dom;
			var exec_dom = dom;
		}

		_disp(exec_dom);
		active_xpath.value = set_dom;
	}

	function _disp(dom) {

		var preview = $id('preview');
		$id('preview').innerHTML = '';
		var buf = new Array();

		var o = d.getElement(dom);
		if(o.snapshotLength) {
			/* display */
	//		if( buf.length ) d.display_dom(dom);
			d.display_dom(dom);

			for(var i = 0; i < o.snapshotLength; i++) {
				buf = buf.concat(d.links2str(o.snapshotItem(i).tagName == 'A' ? [o.snapshotItem(i)]: o.snapshotItem(i).getElementsByTagName('A')));
			}
			for(var i = 0; i < buf.length; i+=2) _insert(buf[i], buf[i + 1]);

		}

		if (buf.length) {
			return buf.length/2;
		} else {
			return 0;
		}
	}

	function _extend_refine(e,code) {
		d.control(code);
		top.page.focus();

		return _event_cancel(e);
	}

	function _event_cancel(e) {
			var e = e ? e : window.event;
			e.cancelBubble = true;
			e.returnValue = false;
			return false;
	}

	function _insert(title, link) {
		var item = {title:title, link:link, checked:true};

		var a = document.createElement('a');
		a.href = link;
		a.innerHTML = item.title.truncate(170).normalize();
		a.target = '_blank';
		a.onclick = function (e) {
			var e = e ? e : window.event;
			var o = e.target ? e.target : e.srcElement;

			$id('html2xpath_url').value = o.href;

			return _event_cancel(e);
		}
		$id('preview').appendChild(a);
		$id('preview').appendChild(document.createElement('br'))
	}

	function _xpath_keydown(e){
		var e = e || window.event;
		var keycode = e.keyCode;
		switch( keycode )
		{
		case 13: // enter
			var o = e.target ? e.target : e.srcElement;
			_set_dom(o);
			return _event_cancel(e);
			break;
		default:
			break;
		}

	}

	function _set_dom(o) {
		var dom = o.value;

		if (dom) {
			if (active_xpath.parentNode.id == 'relative') {
				var exec_dom = $id('xpath').value + '/' + dom;
			} else {
				var exec_dom = dom;
			}

			if (exec_dom) {
				d.setTree(exec_dom);
			}

			_disp(exec_dom);
		}
	}

}

String.prototype.normalize = function()
{
	return this.replace(/&/g,'&amp;').replace(/&amp;([a-z]+|#[x]?[0-9a-fA-F]+);/g,'&$1;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
}

String.prototype.truncate = function(width, className)
{
	/* initialize truncation buffer */
	var buf = String.prototype.truncation_buffer;
	if( ! buf )
	{
		buf = String.prototype.truncation_buffer = document.createElement('nobr');
		if( className ) buf.style.className = className;
		buf.style.visibility = 'hidden';
		document.body.appendChild(buf);
	}

	var length = this.length;
	var result;

	buf.innerHTML = result = this;
	if( buf.offsetWidth > width )
	{
		while( --length )
		{
			buf.innerHTML = result = this.slice(0, length) + '...';
			if( buf.offsetWidth < width ) break;
		}
	}

	return result;
}

function $id(e) { return document.getElementById(e); }

function ConfirmMsg(msg) {
	if(confirm(msg) == true){
		return true;
	} else {
		return false;
	}
}