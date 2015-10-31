import { assert, expect } from 'chai';
import sinon from 'sinon';
import { svgl } from '../src/svglite';

describe('svgl Rectangle Tests', function(){

    var options = {
	'width': 100,
	'height': 200,
	'x': 150,
	'y': 250,
	'stroke-width': 3,
	'stroke': "blue",
	'fill': "green"
    };

    it('should create a rect html element', function(){
	var rect = svgl.createRect(options).getObject();
	assert.equal(rect.nodeName, "rect");
    });

    describe('options', function(){
	it('respond with a matching x record', function(){
	    var rect = svgl.createRect(options);
	    assert.equal(rect.get('x'), options.x);
	});

	it('respond with a matching y record', function(){
	    var rect = svgl.createRect(options);
	    assert.equal(rect.get('y'), options.y);
	});

	it('respond with a matching width record', function(){
	    var rect = svgl.createRect(options);
	    assert.equal(rect.get('width'), options.width);
	});

	it('respond with a matching height record', function(){
	    var rect = svgl.createRect(options);
	    assert.equal(rect.get('height'), options.height);
	});
	
	it('respond with a matching stroke record', function(){
	    var rect = svgl.createRect(options);
	    assert.equal(rect.get('stroke'), options.stroke);
	});

	it('respond with a matching fill record', function(){
	    var rect = svgl.createRect(options);
	    assert.equal(rect.get('fill'), options.fill);
	});

	it('respond with a matching stroke-width record', function(){
	    var rect = svgl.createRect(options);
	    assert.equal(rect.get('stroke-width'), options['stroke-width']);
	});
    });
});
