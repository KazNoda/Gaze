function DOMInspectorLib()
{
  /* tags to be inspected */
  var _tag = {
    BODY:       true,
    TEXTAREA:   true,
    INPUT:      true,
    SELECT:     true,
    CENTER:     true,
    DIV:	  true,
    TABLE:      true,
    TH:         true,
    TR:         true,
    TD:         true,
    IMG:        true,
    AREA:       true,
    A:          true,
    B:          true,
    I:          true,
    FONT:       true,
    MARQUEE:    true,
    H1:         true,
    H2:         true,
    H3:         true,
    H4:         true,
    H5:         true,
    H6:         true,
    DL:         true,
    DT:         true,
    UL:	  true
  };

	/* methods */

	/* utilities */
	this.childNodesTag = function(obj,tag)
	{

		var nodes = obj.childNodes;
		var nodes_tag = new Array();

		tag = tag.toUpperCase();

		for(var i = 0; i < nodes.length; i++) {
			if (nodes[i].tagName == tag) {
				nodes_tag.push(nodes[i]);
			}
		}
		return nodes_tag;
	}

	this.getRect = function(w,obj)
	{
		var rect = new Object();

		/* scroll rect */
		rect.scrollWidth = w.document.body.scrollWidth;
		rect.scrollHeight = w.document.body.scrollHeight;

		/* width & height */
		if( obj.tagName == 'BODY' )
		{
			rect.width = rect.scrollWidth;
			rect.height = rect.scrollHeight;
		}
		else
		{
			rect.width = obj.offsetWidth;
			rect.height = obj.offsetHeight;
		}

		if( obj.tagName == 'BODY' )
		{
			rect.left = 0;
			rect.top = 0;
			rect.right = rect.scrollWidth;
			rect.bottom = rect.scrollHeight;
		}
		else
		{
			//for IE
			if( obj.getBoundingClientRect )
			{
				var r = obj.getBoundingClientRect();
				var scrollLeft = w.document.body.scrollLeft || w.document.documentElement.scrollLeft;
				var scrollTop = w.document.body.scrollTop || w.document.documentElement.scrollTop;
				rect.left = r.left + scrollLeft;
				rect.top = r.top + scrollTop;
				rect.right = r.right + scrollLeft;
				rect.bottom = r.bottom + scrollTop;
			}
			//for FF
			else if( obj.ownerDocument.getBoxObjectFor )
			{
				var r = obj.ownerDocument.getBoxObjectFor(obj);
				rect.left = r.x;
				rect.top = r.y;
				rect.right = rect.left + r.width;
				rect.bottom = rect.top + r.height;
			}
			else
			{
				var x = 0;
				var y = 0;

				if( obj.tagName == 'IFRAME' )
				{
					x += obj.offsetLeft;
					y += obj.offsetTop;
					obj = obj.offsetParent;
				}

				while( obj )
				{
					if( obj.tagName == 'IFRAME' ) break; /* avoid ascending to owning element */
					x += obj.offsetLeft;
					y += obj.offsetTop;
					obj = obj.offsetParent;
				}

				rect.left = x;
				rect.top = y;
				rect.right = rect.left + rect.width;
				rect.bottom = rect.top + rect.height;
			}
		}

		return rect;
	}

	this.getTree = function(obj,sel_mode,tag)
	{
		var tree = new Array();
		var r1 = null;
		var n1 = 0;

		if (sel_mode != 1) {
			tree.push(obj);
			obj = obj.parentNode;
		}

		while(obj)
		{
			if( _tag[obj.tagName] )
			{
				var r = this.getRect(window,obj);
				if(	r.width > 0 &&
						r.height > 0 &&
						(
							r1 == null ||
							(
								r.left <= r1.left ||
								r.top <= r1.top ||
								r.right >= r1.right ||
								r.bottom >= r1.bottom
							)
						)
					)
				{
					r1 = r;

					/* just want anchor tags */
					if( obj.tagName == tag)
					{
						tree.push(obj);
						n1 = 1;
					}
					else
					{
						var n = obj.getElementsByTagName(tag).length;
						if( n > n1 ) {
							tree.push(obj);
							n1 = n;
						}
					}
				}
			}
			obj = obj.parentNode;
		}

		return tree;
	}

	this.getRelativePath = function(frome,toe,w)
	{
		var obj = frome;
		var from_tree = [];
		while(obj) {
			if(obj.nodeName == '#document') {
				break;
			}
			from_tree.unshift(obj);
			obj = obj.parentNode;
		}

		var obj = toe;
		var to_tree = [];
		while(obj) {
			if(obj.nodeName == '#document') {
				break;
			}
			to_tree.unshift(obj);
			obj = obj.parentNode;
		}

		var to_part = new Array();
		var from_part = new Array();
		var tyousei = 0;
		for(var i = 0;i < to_tree.length;i++) {

			var from_attr = this._getAddress_col(w,from_tree[i],1);
			var to_attr = this._getAddress_col(w,to_tree[i],1);

			var result = 0;
			if (document.all) {
				if (from_attr.tag != to_attr.tag ||
						from_attr.id != to_attr.id ||
						from_attr.class_name != to_attr.class_name ||
						from_attr.index != to_attr.index) {
					result = 1;
				}
			} else {
				if (!to_tree[i].isSameNode(from_tree[i])) {
					result = 1;
				}
			}
			if (result) {
				to_part = to_tree.slice(i);
				from_part = from_tree.slice(i);
				tyousei = 1;
				break;
			}
		}
		if (tyousei == 0) {
			if (to_tree.length > to_tree.length) {
				to_part = to_tree.slice(to_tree.length - 1);
				from_part = from_tree.slice(to_tree.length - 1);
			} else {
				to_part = to_tree.slice(from_tree.length - 1);
				from_part = from_tree.slice(from_tree.length - 1);
			}
		}

		var path = '';
		for(var i = 1;i < from_part.length;i++) {
			if (path) {
				path += '/';
			}
			path += '..';
		}
		if (!path) {
			path = '.';
		}

		if (!to_part.length) {
			return path;
		}

		if (from_part.length) {
			attr = this._getAddress_str(w,to_part[0],1);
			if (attr.class_name) {
				//class
				if (path) path += '/';
				path += '../' + attr.str;
			} else {
				//index
				//0:search
				//1:preceding
				//2:following
				var mode = 0;
				var node_cnt = 0;

				var childs = from_part[0].parentNode.childNodes;
//				for(var i = 1;i < childs.length;i++) {
				for(var i = 0;i < childs.length;i++) {
					if (mode && childs[i].nodeName == to_part[0].nodeName) {
						node_cnt++;
					}

					if (childs[i] == to_part[0]) {
						if (mode == 0) {
							mode = 1;
							node_cnt++;
						} else if (mode == 1) {
						} else if (mode == 2) {
							//end
							break;
						}
					}

					if (childs[i] == from_part[0]) {
						if (mode == 0) {
							mode = 2;
						} else if (mode == 1) {
							//end
							if (childs[i].nodeName == to_part[0].nodeName) node_cnt--;
							break;
						} else if (mode == 2) {
						}
					}
				}

				var tag = to_part[0].nodeName.toLowerCase() + '[' + node_cnt + ']';
				switch (mode) {
				case 1:
					path += '/preceding-sibling::' + tag;
					break;
				case 2:
					path += '/following-sibling::' + tag;
					break;
				default:
					alert('error');
					break;
				}
			}

			from_part = from_part.slice(1);
			to_part = to_part.slice(1);

		}

		for(var i = 0;i < to_part.length;i++) {
			attr = this._getAddress_str(w,to_part[i],1);
			path += '/' + attr.str;
		}
		return path;

	}

	this.evaluate = function(w,exp,doc)
	{
		if (w.document.evaluate) {
			return w.document.evaluate(exp,doc,null,7,null);
		} else {
			return window.document.evaluate(exp,doc,null,7,null);
		}
	}

	this._getAddress_str = function(w,obj,mode)
	{
		attr = this._getAddress_col(w,obj,mode);
		return this._getAddress_str_make(attr);
	}	

	//mode 0:default 1:disable id
	this._getAddress_col = function(w,obj,mode)
	{
		var attr = new Object();
		attr.tag = obj.tagName.toLowerCase();

		//id
		if (mode != 1) {
			var id = obj.getAttribute('id');
			if (id) {
				var es = this.evaluate(w,'//*[@id="' + id + '"]',w.document);
				if (es.snapshotLength == 1) {
					attr.id = id;
					return attr;
				}
			}
		}

		//class
		var class_name = obj.getAttribute('class')||obj.getAttribute('className');
		if (class_name) {
			var es = this.evaluate(w,'.//*[@class="' + class_name + '"]',obj.parentNode);
			if (es.snapshotLength == 1) {
				attr.class_name = class_name;
				return attr;
			}
		}

		//index
		var nodes = this.childNodesTag(obj.parentNode,attr.tag);
		if(nodes.length > 1) {
			for(var i = 1; i <= nodes.length; i++) {
				if(obj == nodes[i - 1]) {
					attr.index = i;
					return attr;
				}
			}
		}
		return attr;
	}

	this._getAddress_str_make = function(attr)
	{
		if (attr.id) {
			attr.str = attr.tag + '[@id="' + attr.id + '"]';
			attr.str_id = 'id("' + attr.id + '")';
		} else if (attr.class_name) {
			attr.str = attr.tag + '[@class="' + attr.class_name + '"]';
		} else if (attr.index) {
			attr.str = attr.tag + '[' + attr.index + ']';
		} else {
			attr.str = attr.tag;
		}
		return attr;
	}

	this._getAddress_attr_diff = function(attr1,attr2)
	{
		var attr = new Array();
		for(var i = 0; i < attr1.length; i++) {
			if (!attr1[i] || !attr2[i]) {
				break;
			} else if (attr1[i] == attr2[i]) {
				attr.push(attr1[i]);
			} else {
				if (attr1[i].tag != attr2[i].tag) {
					break;
				}
				if (attr1[i].id != attr2[i].id) {
					//id del
					delete attr1[i].id;
					delete attr1[i].str_id;
					delete attr2[i].id;
					delete attr2[i].str_id;
				}
				if (attr1[i].class_name != attr2[i].class_name) {
					//class del
					delete attr1[i].class_name;
					delete attr2[i].class_name;
				}
				if (attr1[i].index != attr2[i].index) {
					//index del
					delete attr1[i].index;
					delete attr2[i].index;
				}
				//str
				attr1[i] = this._getAddress_str_make(attr1[i]);
				attr2[i] = this._getAddress_str_make(attr2[i]);
				attr.push(attr1[i]);
			}
		}
		return attr;
	}

	this._getAddress_make = function(path,mode)
	{
		var addr = '';
		for(var i = 0; i < path.length; i++) {
			if (mode != 1 && path[i].id) {
				addr += path[i].str_id;
			} else {
				addr += '/' + path[i].str;
			}
		}

		return addr;
	}

	this._getAddress_attr = function(w,obj,mode)
	{
		var path = new Array();
		while(obj)
		{
			if(obj.nodeName == '#document') {
				break;
			}

			attr = this._getAddress_str(w,obj);
			path.unshift(attr);
			if (mode != 1 && attr.id) {
				break;
			}
			obj = obj.parentNode;
		}
		return path;
	}

	this.links2str = function(a)
	{
		var buf = new Array();
		for(var i = 0; i < a.length; i++) {
			var img = a[i].getElementsByTagName('IMG');
			var text = getText(a[i]);

			if( ! text && img.length ) {
				text = img[0].getAttribute('alt');
				if( text ) text = '[img_alt]' + text;
			}

			if( ! text && img.length ) {
				var wk = img[0].getAttribute('src');
				var wk_n = wk.lastIndexOf('/');
				text = wk.substr(wk_n + 1);
				if( text ) text = '[img_src]' + text;
			}

			var href = a[i].getAttribute('href');
			if( href ) {
				if( text && href.match(/^http[s]?:\/\//) ) {
					text = text.replace(/<[^>]*>/g, '').normalize(); 
					buf.push(text);
					buf.push(href);
				}
			}
		}
		return buf;

		function getText(node)
		{
			var text = '';
			if ( node.nodeType == 3 ) text += node.nodeValue;
			for (var i = 0; i < node.childNodes.length; i++) text += getText(node.childNodes[i]);
			return text;
		}
	}
}

DOMInspector.prototype = new DOMInspectorLib();

function DOMInspector(w)
{
	var self = this;
	/* config */
	var callback_ini = null;
	var callback_dom = null;
	var sel_mode = 0;
	var tag = null;
	var addr_mode = 0;
	var atag = 'A';

	/* class variables */
	this.active = false;
	this.object = null;
	this.dom = new Array();
	this.doms = new Array();
	this.state = 0;

	/* images */
	this.selected = [];
	this.clear = null;

	/* border */
	this.border = null;
	this.mouse_border = null;

	this.setCallbackIni = function(func)
	{
		callback_ini = func;
	}
	this.setCallbackDom = function(func)
	{
		callback_dom = func;
	}
	//mode 0:default
	//     1:a tag only
	this.setSelMode = function(mode)
	{
		sel_mode = mode;
	}

	this.setTag = function(tagName)
	{
		tag = tagName.toUpperCase();
	}
	//mode 0:default
	//     1:disable id
	this.setAddrMode = function(mode)
	{
		addr_mode = mode;
	}

	this.setTree = function(dom)
	{
		var o = self.getElement(dom);
		if(o.snapshotLength) {
			self.dom = self.getTree(o.snapshotItem(0),sel_mode,atag);
			self.object = self.dom[0];
		}
	}

	/* event handlers for hack */
	function doClick(e)
	{
		if( ! self.active ) return;

		var e = e ? e : w.event;
		var o = e.target ? e.target : e.srcElement;

		if((e.shiftKey || e.ctrlKey) && self.doms.length) {
			self.dom = new Array();

			if (self.doms.length > 1) {
				var wk = self.doms[self.doms.length - 1];
				self.doms = new Array();
				self.doms.push(wk);
			}
			var wk = self.getTree(o,sel_mode,atag);
			self.doms.push(wk[0]);

			//merge
			var attr1 = self._getAddress_attr(w,self.doms[0],addr_mode);
			var attr2 = self._getAddress_attr(w,self.doms[1],addr_mode);
			var attr3 = self._getAddress_attr_diff(attr1,attr2);
			var addr = self._getAddress_make(attr3,addr_mode);
			self.display(addr);
		} else {
			self.dom = self.getTree(o,sel_mode,atag);
			self.doms = new Array();
			self.doms.push(self.dom[0]);
			self.display_obj(self.dom[0]);
		}

		e.cancelBubble = true;
		e.returnValue = false;
		return false;
	}

	//マウスの運動量でDOMを操作
	function doMouseWheel(e)
	{

		if( ! self.active ) return;

		var e = e ? e : w.event;
		var o = e.target ? e.target : e.srcElement;
		var d = e.wheelDelta ? -e.wheelDelta : e.detail;

		if( self.object )
		{
			for(var i = 0; i < self.dom.length; i++)
			{
				if( self.object == self.dom[i] )
				{
					if( d > 0 )
					{
						if( i + 1 < self.dom.length ) self.display_obj(self.dom[i+1]);
					}
					else
					{
						if( i - 1 >= 0 ) self.display_obj(self.dom[i-1]);
					}
					break;
				}
			}

			e.cancelBubble = true;
			e.returnValue = false;
			if( e.stopPropagation ) e.stopPropagation();
			if( e.preventDefault ) e.preventDefault();
			return false;
		}
	}

	function doKeyUp(e)
	{
		if( ! self.active ) return;

		var e = e || w.event;
		e.cancelBubble = true;
		e.returnValue = false;
		return false;
	}

	function doKeyDown(e)
	{
		if( ! self.active ) return;

		var e = e || w.event;
		self.control(e.keyCode);
		e.cancelBubble = true;
		e.returnValue = false;
		return false;
	}

	function doKeyPress(e)
	{
		if( ! self.active ) return;

		var e = e || w.event;
		e.cancelBubble = true;
		e.returnValue = false;
		return false;
	}


	doMouseOver = function(e) {
		var e = e ? e : w.event;
		var o = e.target ? e.target : e.srcElement;

		if (o.tagName.toLowerCase() != "body" && o)
		{
			/* mouse_border */
			if (document.all) {
				//ie
				var r = self.getRect(w,o);
				self.mouse_border.style.top = r.top - 5 + 'px';
				self.mouse_border.style.left = r.left - 5 + 'px';
				self.mouse_border.style.width = r.right - r.left + 6 + 'px';
				self.mouse_border.style.height = r.bottom - r.top + 6 + 'px';
				self.mouse_border.style.borderColor = '#4c88ae';
				self.mouse_border.style.display = '';
			} else {
				o.style.outline = '2px solid #4c88ae';
			}
		}
	};

	doMouseOut = function(e) {
		var e = e ? e : w.event;
		var o = e.target ? e.target : e.srcElement;
		if (document.all) {
			//ie
			self.mouse_border.style.display = 'none';
		} else {
			o.style.outline = '';
		}
	};

	this.control = function(keycode)
	{
		if( self.object )
		{
			for(var i = 0; i < self.dom.length; i++)
			{
				if( self.object == self.dom[i] )
				{
					switch(keycode)
					{
					case 38: // up
						if( i + 1 < self.dom.length ) self.display_obj(self.dom[i+1]);
						break;
					case 40: // down
						if( i - 1 >= 0 ) self.display_obj(self.dom[i-1]);
						break;
					case 37: // left
						break;
					case 39: // right
						break;
					case 13: // enter
						break;
					case 27: // esc
					//self.undisplay();
						break;
					}
					break;
				}
			}
		}
	}

	this.show = function()
	{
		/* show iframe */
		var iframes = w.document.body.getElementsByTagName('iframe');
		for(var i = 0; i < iframes.length; i++) iframes[i].style.visibility = '';

		/* show flash */
		var objects = w.document.body.getElementsByTagName('object');
		for(var i = 0; i < objects.length; i++) objects[i].style.visibility = '';

		/* show select */
		var selects = w.document.body.getElementsByTagName('select');
		for(var i = 0; i < selects.length; i++) selects[i].style.visibility = '';
	}

	this.hide = function()
	{
		/* hide iframe */
		var iframes = w.document.body.getElementsByTagName('iframe');
		for(var i = 0; i < iframes.length; i++) iframes[i].style.visibility = 'hidden';

		/* hide flash */
		var objects = w.document.body.getElementsByTagName('object');
		for(var i = 0; i < objects.length; i++) objects[i].style.visibility = 'hidden';

		/* hide select */
		var selects = w.document.body.getElementsByTagName('select');
		for(var i = 0; i < selects.length; i++) selects[i].style.visibility = 'hidden';
	}

	this.display = function(dom)
	{
		if( callback_dom ) callback_dom(dom);
	}

	this.display_obj = function(o)
	{
		/* set object */
		self.object = o;
		self.display(self.getAddress(o));
//		if( callback_dom ) callback_dom(o);
////		if( callback_dom ) callback_dom(self.getAddress(o));
	}

	this.undisplay = function()
	{
		/* clear object */
		self.object = null;
		self.deselect();
	}

	this.display_dom = function(dom)
	{
		self.deselect();
		var o = self.getElement(dom);
		var a = [];
		for(var i = 0;i < o.snapshotLength;i++) a.push(o.snapshotItem(i));
		self.select(a);
	}

	this.select = function(o)
	{
		if(o.length == 0)return;

		var color = document.getElementById('color');
		color = color && color.value || 'red';

		if (sel_mode == 1) {
			var wk = new Array();
			for(var i = 0;i < o.length;i++) {
				if(o[i].tagName == atag) {
					wk.push(o[i]);
				} else {
					var wk2 = o[i].getElementsByTagName(atag);
					for(var j = 0; j < wk2.length; j++)wk.push(wk2[j]);
				}
			}
			var o = wk;

//			if (tag == 'A') {
			var wk = new Array();
			for(var i = 0; o[i]; i++) {
				if( o[i].href.match(/^https?:\/\//) ) {
					wk.push(o[i]);
				}
			}
			var o = wk;
//			}
		}


		self.selected = [];
		for(var i = 0; o[i]; i++)
		{
			self.selected.push({object:o[i], bgcolor:o[i].style.backgroundColor||''});
			o[i].style.backgroundColor = color;
//			if( o[i].href.match(/^https?:\/\//) )
//			{
//			}
		}

		/* scroll into view */
		self.select_into_view();
		self.border.style.borderColor = color;
		self.border.style.display = '';

	}


	this.reselect = function()
	{
		var a = [];
		for(var i = 0; self.selected[i]; i++) a.push(self.selected[i].object);
		self.deselect();
		self.select(a);
	}

	this.deselect = function()
	{
		var o = self.selected;
		for(var i = 0; o[i]; i++) o[i].object.style.backgroundColor = o[i].bgcolor;
		self.border.style.display = 'none';
		self.selected = [];
	}

	this.select_into_view = function()
	{
		var r = {top:-1, left:-1, right:-1, bottom:-1};
		for(var i = 0; self.selected[i]; i++)
		{
			var r1 = self.getRect(w, self.selected[i].object);
			if( r.top < 0 || r1.top < r.top ) r.top = r1.top;
			if( r.left < 0 || r1.left < r.left ) r.left = r1.left;
			if( r.bottom < 0 || r1.bottom > r.bottom ) r.bottom = r1.bottom;
			if( r.right < 0 || r1.right > r.right ) r.right = r1.right;
		}

		if( i )
		{
			/* border */
			self.border.style.top = r.top - 5 + 'px';
			self.border.style.left = r.left - 5 + 'px';
			self.border.style.width = r.right - r.left + 6 + 'px';
			self.border.style.height = r.bottom - r.top + 6 + 'px';

//			//var w1 = w;
//			var w1 = top.page;
			var w1 = w;
			var xmin = w1.document.body.scrollLeft || w1.document.documentElement.scrollLeft;
			var ymin = w1.document.body.scrollTop || w1.document.documentElement.scrollTop;
			var page = top.document.getElementById('page');

			if( r.left < xmin || r.right > xmin + page.offsetWidth - 20 )
			{
				r.left -= 10;
				w1.document.body.scrollLeft = r.left;
				w1.document.documentElement.scrollLeft = r.left;
			}

			if( r.top <  ymin || r.bottom > ymin + page.offsetHeight - 20 )
			{
				r.top -= 10;
				w1.document.body.scrollTop = r.top;
				w1.document.documentElement.scrollTop = r.top;
			}

		}
	}

	/* initialization */
	this.initialize = function()
	{
		/* target document */
		var d = w.document;

		/* hide iframe, flash, select */
		this.hide();

		/* override event handlers */
		for(var i = 0; i < d.anchors.length; i++) d.anchors[i].onclick = doClick;
		for(var i = 0; i < d.links.length; i++) d.links[i].onclick = doClick;
		d.onclick = doClick;
		d.onkeydown = doKeyDown;
		d.onkeypress = doKeyPress;
		d.onkeyup = doKeyUp;
		if( d.addEventListener )
		{
			d.addEventListener('mouseover',doMouseOver,false);
			d.addEventListener('mouseout', doMouseOut, false);
//			d.addEventListener('DOMMouseScroll', doMouseWheel, false);
		}
		else
		{
			d.onmouseover = doMouseOver;
			d.onmouseout = doMouseOut;
//			d.onmousewheel = doMouseWheel;
		}







		/* border */
		self.border = d.body.appendChild(d.createElement('div'));
		self.border.style.borderStyle = 'solid';
		self.border.style.borderWidth = '2px';
		self.border.style.position = 'absolute';
		self.border.style.display = 'none';

		/* mouse_border */
		if (document.all) {
			//ie
			self.mouse_border = d.body.appendChild(d.createElement('div'));
			self.mouse_border.style.borderStyle = 'solid';
			self.mouse_border.style.borderWidth = '2px';
			self.mouse_border.style.position = 'absolute';
			self.mouse_border.style.display = 'none';
		}

		if( self.state++ == 0 && callback_ini) callback_ini();

	}

	this.activate = function()
	{
		self.active = true;
	}

	this.deactivate = function()
	{
		self.undisplay();
		self.active = false;
	}

	this.getAddress = function(obj)
	{
		var path = self._getAddress_attr(w,obj,addr_mode);
		return self._getAddress_make(path,addr_mode);
	}

	this.getElement = function(addr)
	{
		return this.evaluate(w,addr,w.document);
	}

	this.getRelativePaths = function(basestr,addrstr)
	{
		var ret = new Array();
		var b = this.evaluate(w,basestr,w.document);
		var a = this.evaluate(w,addrstr,w.document).snapshotItem(0);
		for(var i = 0;i < b.snapshotLength;i++) {
			var path = this.getRelativePath(b.snapshotItem(i),a,w);
			ret.push(path);
			if (i > 5) {
				break;
			}
		}

//alert(ret.join("\n"));

		var min_path = '';
		var min_length = 0;
		for(var i = 0;i < ret.length;i++) {
			if (min_length == 0 || min_length > ret[i].length) {

				min_path = ret[i];
				min_length = ret[i].length;
			}

		}

		return min_path;
	}

}
