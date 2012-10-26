$(function() {
	var nodes = {},
		tree = {};
	tree = flat2Tree(nodes, fakeFlatData);
	renderTree($("#root"), tree);

	$(document).on("click", ".add-node", function(e) {
		var $li = $(this).closest('li');
		var $ul = $li.find('ul');

		if ($ul.length === 0) {
			var newUl = $("<ul class='node-ul'></ul>").append(getNewLi());
			$li.append(newUl);
		} else {
			$ul.first().append(getNewLi());
		}

	});



	function getNewLi(title, link) {
		var editorDiv = $("<div class='editor'></div>").append($("<label>topic: </label>")).append($("<input type ='text' class='title'/>")).append($("<label>link: </label>")).append($("<input type ='text' class='link'/>")).append($("<button class = 'save-node'>save</button>")).append($("<button class = 'cancel-node'>cancel</button>")).hide();
		var displayDiv = $("<div class='display'></div>").append($("<span class = 'node-title'>" + (title || "click to edit me") + "</span>")).append($("<a class = 'node-link' href='#'>" + (link || "#") + "</a>")).append($("<button class = 'add-node'>add another</button>"));

		var $newLi = $("<li class='node'></li>").append(displayDiv).append(editorDiv);
		return $newLi;
	}

	$(document).on("click", ".save-node", function(e) {
		var $li = $(this).closest('li');

		var $title = $li.find('.title');
		var $link = $li.find('.link');

		var $display = $li.children('.display');
		var $editor = $li.children('.editor');

		$display.children('.node-title').text($title.val());
		$display.children('.node-link').attr("href", $link.val());

		$display.show();
		$editor.hide();
	});

	$(document).on("click", ".cancel-node", function(e) {
		var $li = $(this).closest('li');
		var $display = $li.children('.display');
		var $editor = $li.children('.editor');
		$display.show();
		$editor.hide();
	});

	$(document).on('click', '.node-title', function(e) {
		var $li = $(this).closest('li');
		$li.children('.display').hide();
		$li.children('.editor').show();
	});

	function renderTree(root, data) {
		if ($.isEmptyObject(data)) {
			var data = {
				title: 'click to edit me',
				link: '#',
				more: []
			};
		}
		var $rootLi = getNewLi(data.title, data.link);
		root.append($rootLi); // do dom manip after all appends..move it one line down
		renderBranches($rootLi, data.more)
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
			var $li = getNewLi(children[i].title, children[i].link);
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

	});
