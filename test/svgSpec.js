import { assert, expect } from 'chai';
import sinon from 'sinon';
import { svgl } from '../src/svglite';

describe('VuWall SVG Svg', function(){
    var options = {
	"id": "svgId",
	"width": "100%",
	"height": "500",
	"xmlns": "http://www.w3.org/2000/svg"
    };


    it('should create a svg html element', function(){
	var svg = svgl.createSvg(options).getObject();
	assert.equal(svg.nodeName, "svg");
    });
    
    describe('options', function(){
	it('respond with a matching id record', function(){
	    var svg = svgl.createSvg(options);
	    assert.equal(svg.get('id'), options.id);
	});

	it('respond with a matching height record', function(){
	    var svg = svgl.createSvg(options);
	    assert.equal(svg.get('height'), options.height);
	});

	it('respond with a matching width record', function(){
	    var svg = svgl.createSvg(options);
	    assert.equal(svg.get('width'), options.width);
	});
    });

});
