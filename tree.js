var mangoTree = function($,options) {
	var nodes = {},
		tree = {};
	var nodeSavedCallbacks = [];	
	var $root = $("#"+options.rootUl); 
	tree = flat2Tree(nodes, fakeFlatData);
	
	renderTree($("#root"), tree);
	
	
	$root.on("click", ".add-node", function(e) {
		
		var $li = $(this).closest('li');
		var parentId = $li.attr('id');
		var $ul = $li.find('ul');
	
		if ($ul.length) {
			var $parentUl = $ul.first();
			var siblingId = $parentUl.children('li').last().attr('id'); }
		else {
			$parentUl = $("<ul class='node-ul'></ul>");
			$li.append($parentUl);
		} 
		
		var data = getNodeData(parentId,siblingId);
		var newLi = getNewLi(data);
		$parentUl.append(newLi);
	});
	
	function getNodeData(parentId,siblingId){
		var newId = inferId(parentId,siblingId);
		return {
			id : newId,
			parent: parentId,
			title: 'click to edit me',
			link: '#'
		};
	}

	function inferId(parentId,siblingId){
		var id = 1;
		if(siblingId){
			var idStr = siblingId.split('/').pop();
			id = parseInt(idStr)+1; 
		}
		id = parentId+"/"+id;
		return id;
	}

	function getNewLi(data) {
		var editorDiv = $("<div class='editor'></div>")
							.append($("<label>topic: </label>"))
							.append($("<input type ='text' class='title'/>"))
							.append($("<label>link: </label>"))
							.append($("<input type ='text' class='link'/>"))
							.append($("<button class = 'save-node'>save</button>"))
							.append($("<button class = 'cancel-node'>cancel</button>")).hide();
		var displayDiv = $("<div class='display'></div>")
							.append($("<span class = 'node-title'>" + data.title + "</span>"))
							.append($("<span>&nbsp;~&nbsp;</span>"))
							.append($("<a class = 'node-link' href='#'>" + data.link  + "</a>"));

		var $newLi = $("<li class='node' id = '"+data.id+"' data-parentid = '"+data.parent+"'></li>").append(displayDiv);					
		
		if (options.editable){
			displayDiv.append($("<button class = 'add-node'>add a child topic</button>"));
			$newLi.append(editorDiv);
		}
		
		return $newLi;
	}

	$root.on("click", ".save-node", function(e) {
		var $li = $(this).closest('li');

		var $title = $li.find('.title');
		var $link = $li.find('.link');

		var $display = $li.children('.display');
		var $editor = $li.children('.editor');

		$display.children('.node-title').text($title.val());
		$display.children('.node-link')
			.text($link.val())
			.attr("href", $link.val());

		$display.show();
		$editor.hide();
		//todo: update nodes[]
		var data = {
			id:$li.attr('id'),
			parent:$li.data('parentid'),
			title:$title.val(),
			link:$link.val()
		};
		$(nodes).trigger("nodeChanged", data);
	});

    $(nodes).bind("nodeChanged", function(e, data) {
    	//save the item ?? update the tree in db??
		for(var i = 0;i<nodeSavedCallbacks.length;i++){
			nodeSavedCallbacks[i](e,data);
		}
    });

	

	$root.on("click", ".cancel-node", function(e) {
		var $li = $(this).closest('li');
		var $display = $li.children('.display');
		var $editor = $li.children('.editor');
		$display.show();
		$editor.hide();
	});

	$root.on('click', '.node-title', function(e) {
		var $li = $(this).closest('li');
		var $display = $li.children('.display');
		var $editor = $li.children('.editor');
		var $title = $editor.children('.title');
		var $link = $editor.children('.link');
		var $nodeTitle = $display.children('.node-title');
		var $nodeLink = $display.children('.node-link');
		$title.val($nodeTitle.text());
		$link.val($nodeLink.text());
		
		$display.hide();
		$editor.show();
	});

	function renderTree(root, data) {
		if ($.isEmptyObject(data)) {
			var data = {
				title: 'click to edit me',
				link: '#',
				more: []
			};
		}
		var $rootLi = getNewLi(data);
		renderBranches($rootLi, data.more)
		root.append($rootLi); 
	};

	function renderBranches($rootLi, children) {
		//find or create ul for children
		if (children.length){
			var $ul = $rootLi.children("ul").first();
			if ($ul.length===0) {
				$ul = $("<ul class='node-ul'></ul>");
				$rootLi.append($ul);
			}
		}
		
		for (var i = 0; i < children.length; i++) {
			var $li = getNewLi(children[i]);
			$ul.append($li);
			if (children[i].more.length) {
				renderBranches($li, children[i].more);
			}
		}
	};

		function flat2Tree(nodes, flat) {
			for (var i = 0; i < flat.length; i++) {
				var item = {
					title: flat[i].title,
					link: flat[i].link,
					id: flat[i].id,
					parent: flat[i].parent,
					more: []
				};

				nodes[item.id] = item;
				if (nodes[item.parent] !== undefined) nodes[item.parent].more.push(item);

			}
			return nodes['1'];
		};
		
		return {
			nodeSaved :function (callback){
			nodeSavedCallbacks.push(callback);
			}
		}
	};
