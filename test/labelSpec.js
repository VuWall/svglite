import { assert, expect } from 'chai';
import sinon from 'sinon';
import { svgl } from '../src/svglite';

describe('svgl Label Tests', function(){
    var xlmns = 'http://www.w3.org/2000.svg';

    var options = {
	'font-family': 'serif',
	'font-size': 14,
	'x':350,
	'y':150,
	'fill': '#FF0000'
    };

    it('should create a text html element', function(){
	var labelNode = svgl.createLabel(options).getObject();
	assert.equal(labelNode.nodeName, "text");
    });

    describe('options', function(){
	it('respond with a matching x record ', function(){
	    var label  = svgl.createLabel(options);
	    assert.equal(label.get('x'), options.x);
	});

	it('respond with a matching y record ', function(){
	    var label  = svgl.createLabel(options);
	    assert.equal(label.get('y'), options.y);
	});

	it('respond with a matching font-size record ', function(){
	    var label  = svgl.createLabel(options);
	    assert.equal(label.get('font-size'), options['font-size']);
	});

	it('respond with a matching font-family record ', function(){
	    var label  = svgl.createLabel(options);
	    assert.equal(label.get('font-family'), options['font-family']);
	});

	it('respond with a matching fill record ', function(){
	    var label  = svgl.createLabel(options);
	    assert.equal(label.get('fill'), options.fill);
	});
    });
});
