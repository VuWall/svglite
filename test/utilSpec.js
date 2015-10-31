import { assert, expect } from 'chai';
import sinon from 'sinon';
import { svgl } from '../src/svglite';

describe('svgl API utilities functions Tests', function(){

    var xmlns = 'http://www.w3.org/2000/svg', xValue = 100;
    var Util = svgl.Modules.Util;
    var svgOptions = {
	"id": "svgId",
	"width": "100%",
	"height": "500",
	"xmlns": "http://www.w3.org/2000/svg"
    };

    var options = {
	"width" : 300,
	"height" : 200
    };

    describe('svgl Utility', function(){
	describe('Create Node Function', function(){
	    it('should create a xml node', function(){
		var node = Util.CreateNode('svg', {});
		assert.equal(node.nodeName, 'svg');
	    });

	    it('should create a xml node with an attribute', function(){
		var node = Util.CreateNode('svg', { id: "foo" });
		assert.equal(node.getAttribute('id'), "foo");
	    });

	    it('should create a xml node with a right attribute', function(){
		var node = Util.CreateNode('svg', { id: "foo" });
		assert.notEqual(node.getAttribute('id'), "bar");
	    });
	});

	describe('AddChild function', function(){
	    it('should add a child to an svg node', function(){
		var node = document.createElementNS(xmlns, 'g');
		var rect = document.createElementNS(xmlns, 'rect');
		node = Util.AddChild(node, rect);

		expect(node.children.length).to.be.equal(1);
	    });
	    it('should add a child to an svg node', function(){
		var node = document.createElementNS(xmlns, 'g');
		var rect = null;
		node = Util.AddChild(node, rect);

		expect(node.children.length).to.be.equal(0);
	    });
	});

	describe('Create Text Function', function(){
	    it('should create a text node with a text value', function(){
		var text = 'vuwall';
		var node = Util.CreateTextNode(text);
		assert.equal(node.textContent, text);
	    });

	    it('should create a text node with a right value', function(){
		var text = 'vuwall';
		var node = Util.CreateTextNode(text);
		assert.notEqual(node.textContent, 'crestron');
	    });

	    it('should create an empty text node', function(){
		var text = '';
		var node = Util.CreateTextNode(text);
		assert.equal(node.textContent, '');
	    });
	});

	describe('On/Off Function', function(){
	    it('should add an event listener', function(){
		var called = false;
		var node = Util.CreateNode('rect',{});
		Util.On(node, 'click', function(){ called = true;});
		var clickEvt = new Event('click');
		node.dispatchEvent(clickEvt);
		assert.equal(called, true);
	    });

	    it('should add a custom event listener', function(){
		var called = false;
		var node = Util.CreateNode('circ',{});
		Util.On(node, 'click', function(){ called = true;});
		var customClick = new CustomEvent('click', { foo: 'bar' });
		node.dispatchEvent(customClick);
		assert.equal(called, true);
	    });

	    it('should remove an event listener', function(){
		var called = 'foo';
		var node = Util.CreateNode('rect',{});
		Util.On(node, 'click', function(){ called = 'bar';});
		Util.Off(node, 'click', function(){ called = 'baz';});
		var clickEvt = new Event('click');
		node.dispatchEvent(clickEvt);
		assert.equal(called, 'bar');
	    });

	    it('should remove a non-existing event listener', function(){
		var called = 'foo';
		var node = Util.CreateNode('rect',{});
		Util.Off(node, 'click', function(){ called = 'bar';});
		var clickEvt = new Event('click');
		node.dispatchEvent(clickEvt);
		assert.equal(called, 'foo');
	    });

	    it('should remove a non-existing custom event listener', function(){
		var called = 'foo';
		var node = Util.CreateNode('rect',{});
		Util.Off(node, 'click', function(){ called = 'bar';});
		var customClick = new CustomEvent('click', { foo: 'bar' });
		node.dispatchEvent(customClick);
		assert.equal(called, 'foo');
	    });
	    
	});
	
	describe('Add Method Function', function(){
	    it('should add child node to a node', function(){
		var children = [];
		var node = Util.CreateNode('g',{});
		var child = svgl.createRect(svgOptions); 

		Util.Add(node, children, child);
		expect(children).to.have.length(1);
		expect(node.children).to.have.length(1);
	    });
	});

	describe('Get Method Function', function(){
	    it('should return a node attribute', function(){
		var rect = Util.CreateNode('rect',{});
		Util.Set(rect, { 'x': xValue }, ['x']);
		assert.equal(Util.Get(rect, 'x'), xValue);
	    });
	});
	
	describe('Set Method Function', function(){
	    
	    it('should set a node attribute', function(){
		var rect = Util.CreateNode('rect',{});
		Util.Set(rect, { 'x': xValue }, ['x']);
		assert.equal(rect.getAttribute('x'), xValue);
	    });

	    it('should set a node if passed arguments exist', function(){
		var rect = Util.CreateNode('rect',{});
		Util.Set(rect, { 'x': xValue, 'wrongProp': "hey" });
		assert.equal(rect.getAttribute('x'), xValue);
		assert.equal(rect.getAttribute('wrongProp'), null);
	    });
	});

	describe('GetChild Function', function(){
	    it('should return null if no children exist', function(){
		var group = svgl.createGroup({});
		var rect = svgl.createRect(options);
		assert.equal(group.getChild("zone1"), null);
	    });

	    it('should return null if a children is not found', function(){
		var group = svgl.createGroup({});
		var rect = svgl.createRect(options);
		group.add(rect);
		assert.equal(group.getChild("zone1"), null);
	    });

	    it('should return the child identified by id', function(){
		var group = svgl.createGroup({});
		var rect = svgl.createRect(options);
		rect.update({'id' : "zone1"});
		group.add(rect);
		assert.equal(group.getChild("zone1"), rect);
	    });
	});

	describe('Update Method Function', function(){
	    it('should update a node\'s attributes', function(){
		var newxValue = 200;
		var rect = Util.CreateNode('rect',{});
		Util.Set(rect, { 'x': xValue }, ['x']);
		assert.equal(Util.Get(rect, 'x'), xValue);

		Util.Update(rect, { 'x': newxValue });
		assert.equal(Util.Get(rect, 'x'), newxValue);
	    });
	});

	describe('Update Text Node Function', function(){
	    it('should update a text node', function(){
		var text = 'dog';
		var updatedText = 'cat';
		var node = Util.CreateTextNode(text);
		node = Util.UpdateTextNode(node, updatedText);
		assert.equal(node.textContent, updatedText);
		
	    });

	    it('should not update a text node if no new value is specified', function(){
		var text = 'dog';
		var node = Util.CreateTextNode(text);
		node = Util.UpdateTextNode(node);
		assert.equal(node.textContent, text);
	    });
	});

	describe('Is svgl object', function(){
	    it('should be a svgl object', function(){
		expect(Util.isSvglObject(svgl.createRect({}))).to.equal(true);
	    });
	    it('should not be a svgl object', function(){
		expect(Util.isSvglObject({})).to.equal(false);
	    });
	    it('null should not be a svgl object', function(){
		expect(Util.isSvglObject(null)).to.equal(false);
	    });
	    it('undifined should not be a svgl object', function(){
		expect(Util.isSvglObject(undefined)).to.equal(false);
	    });
	});

	describe('Is svg element', function(){
	    it('should be a svg element', function(){
		var node = document.createElementNS(xmlns, 'svg');
		expect(Util.isSVGElement(node)).to.equal(true);
	    });
	    it('object should not be a svg element', function(){
		expect(Util.isSVGElement({})).to.equal(false);
	    });
	    it('null should not be a svg element', function(){
		expect(Util.isSVGElement(null)).to.equal(false);
	    });
	    it('undifined should not be a svg element', function(){
		expect(Util.isSVGElement(undefined)).to.equal(false);
	    });
	});

	describe('Get Mouse Location', function(){
	    it('should provide client coordinates', function(){
		var coords = { clientX : '0', clientY: '10' };
		var node = Util.CreateNode('svg', {});
		var resultCoords = Util.GetMouseLocation(node, coords);

		var pt = node.createSVGPoint();
		pt.x = coords.clientX; pt.y = coords.clientY;
		var testCoords =  pt.matrixTransform(node.getScreenCTM().inverse());

		expect(resultCoords.x).to.be.equal(testCoords.x);
		expect(resultCoords.y).to.be.equal(testCoords.y);
	    });
	});

	describe('Remove child Function', function(){
	    it('should remove a child node', function(){
		var children = [];
		var node = Util.CreateNode('g',{});
		var child = svgl.createRect(svgOptions); 

		Util.Add(node, children, child);
		var result = Util.Remove(node, children, child);
		node = result.node;
		children = result.children;
		expect(children).to.have.length(0);
		expect(node.children).to.have.length(0);
	    });

	    it('should not crash when removing null', function(){
		var children = [];
		var node = Util.CreateNode('g',{}); 
		var child = null;

		var result = Util.Remove(node, children, child);
		node = result.node;
		children = result.children;
		expect(children).to.have.length(0);
		expect(node.children).to.have.length(0);
	    });

	    it('should not crash when removing non-existent child node', function(){
		var children = [];
		var node = Util.CreateNode('g',{});
		var child = svgl.createRect(svgOptions); 

		var result = Util.Remove(node, children, child);
		node = result.node;
		children = result.children;
		expect(children).to.have.length(0);
		expect(node.children).to.have.length(0);
	    });
	});
	
    });

});
