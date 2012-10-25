/*
var fakeData = {
	title: '1',
	link: '',
	more: [{
		title: '1-1',
		link: '',
		more: [{
			title: '1-1-1',
			link: '',
			more: []
		}]
	}, {
		title: '1-2',
		link: '',
		more: [{
			title: '1-2-1',
			link: '',
			more: []
		}]
	}]
};
*/


var fakeFlatData = [{
	title: '1',
	link: '#',
	id: '1',
	parent: '0',}, 
	{
	title: '1.1',
	link: '#',
	id: '1/1',
	parent: '1'}, 
	{
	title: '1.1.1',
	link: '#',
	id: '1/1/1',
	parent: '1/1'}, 
	{
	title: '1.1.2',
	link: '#',
	id: '1/1/2',
	parent: '1/1'}];

var flat2Tree = function(flat) {
		var tree = {};
		var nodes = {};
		for (var i = 0; i < flat.length; i++) {
			var item = {
				title: flat[i].title,
				link: flat[i].link,
				id: flat[i].id,
				parent: flat[i].parent,
				more: []};

			nodes[item.id] = item ;
			if(nodes[item.parent] !== undefined) nodes[item.parent].more.push(item);

		}
		tree = nodes['1'];
		return tree;
	};
