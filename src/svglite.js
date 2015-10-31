// 
import _ from 'lodash';

export let svgl = svglModule(_);

export default function svglModule(_){
    var Util = svglGenerics(_);
    var Mixins = svglMixins(_, Util);

    //API
    return { 
	createGroup: createGroup,
	createLabel: createLabel,
	createRect: createRect,
	createSvg: createSvg,

	//Only for tests purpose
	Modules: {	
	    Util: Util,
	    Mixins: Mixins
	}
    };

    function createGroup(options){
	var state = {
	    node: options.node || Util.CreateNode('g', options),
	    children: []
	};

	return _.assign(
	    {},
	    Mixins.svglObject(state),
	    Mixins.hasAttribute(state),
	    Mixins.hasChildren(state)
	);
    }

    function createLabel(options){
	var state = {
	    node: options.node || Util.CreateNode('text', options),
	    textNode: Util.CreateTextNode(options.text)
	};
	state.node.appendChild(state.textNode);

	return _.assign(
	    { },
	    Mixins.svglObject(state),
	    Mixins.hasAttribute(state),
	    Mixins.hasTextNode(state),
	    Mixins.observable(state)
	);
    }

    function createRect(options){
	var state = {
	    node: options.node || Util.CreateNode('rect', options)
	};

	return _.assign(
	    {},
	    Mixins.svglObject(state),
	    Mixins.hasAttribute(state),
	    Mixins.observable(state)
	);
    }

    function createSvg(options){
	var state = {
	    node: options.node || Util.CreateNode('svg', options),
	    children: []
	};

	return _.assign(
	    {},
	    Mixins.svglObject(state),
	    Mixins.hasAttribute(state),
	    Mixins.observable(state),
	    Mixins.hasChildren(state),
	    Mixins.hasMouseLocation(state)
	);
    }   
}


///MIXINS
function svglMixins(_, Util){
    
    var observable = function(state){ return {
	off: function(event, callback){ return Util.Off(state.node, event, callback); },
	on: function(event, callback){ return Util.On(state.node, event, callback); }
    };};
    
    var hasAttribute = function(state){ return {
	get: function(attribute){ return Util.Get(state.node, attribute); },	
	update: function(options){ return Util.Update(state.node, options); }
    };};

    var hasChildren = function(state){ return {
	add: function(child){ 
	    var result =  Util.Add(state.node, state.children, child); 
	    state.children = result.children;
	    state.node = result.node;
	    return child;
	},
	getChild: function(child){ return Util.GetChild(state.children, child);  },
	getChildren: function(){ return state.children; },
	remove: function(child){ 
	    var result = Util.Remove(state.node, state.children, child);
	    state.children = result.children;
	    state.node = result.node;
	    return child; 
	}
    };};

    var hasTextNode = function(state){ return {
	update: function(args){
	    state.node.removeChild(state.textNode);
	    state.textNode = Util.UpdateTextNode(state.textNode, args.text);
	    state.node.appendChild(state.textNode);
	    state.node = Util.Update(state.node, args);
	    return state.node;
	},
	getText: function(){
	    return	state.textNode.textContent;
	}
    };};
    
    var hasMouseLocation = function(state){ return {
	getMouseLocation: function(mouseevent){ return Util.GetMouseLocation(state.node, mouseevent); } 
    };};

    var svglObject = function(state){ return {
	getObject: function(){ return state.node; } 
    };};
    
    //mixins available... (A..Z)
    return { 
	hasAttribute: hasAttribute,
	hasChildren: hasChildren,
	hasMouseLocation: hasMouseLocation,
	hasTextNode: hasTextNode,
	observable: observable,
	svglObject: svglObject
    };
}

//TODO - Move
///GENERICS METHODS
function svglGenerics(_){
    var xmlns = 'http://www.w3.org/2000/svg';

    //generic functions available (A..Z)
    return {
	Add: Add,
	AddChild: AddChild,
	CreateNode: CreateNode,
	CreateTextNode: CreateTextNode,
	Get: Get,
	GetChild: GetChild,
	GetMouseLocation: GetMouseLocation,
	isSvglObject: isSvglObject,
	isSVGElement: isSVGElement,
	Off: Off,
	On: On,
	Remove: Remove,
	RemoveChild: RemoveChild,
	Set: Set,
	Update: Update,
	UpdateTextNode: UpdateTextNode
    };

    ////Implementations    

    function Add(node, children, child){
	_.forEach(children || [], function(c){ RemoveChild(node, c.getObject()); });
	if(isSvglObject(child)) children.push(child);
	_.forEach(children, function(c){ AddChild(node, c.getObject()); });
	return { 'node': node, 'children': children };
    }

    function AddChild(node, child){
	if(isSVGElement(child)) node.appendChild(child);
	return node;
    }

    function CreateNode(tag, options){
	return Set(document.createElementNS(xmlns, tag), options);
    }
    
    function CreateTextNode(text){
	return document.createTextNode(text);
    }

    function Get(node, attribute){
	return node.getAttribute(attribute);
    }

    function GetChild(children, id){
	var result = _.filter(children, function(child){ return child.get('id') == id;	});
	return _.first(result) || null;  
    }

    function GetMouseLocation(node, option){
	var pt = node.createSVGPoint();
	pt.x = option.clientX; pt.y = option.clientY;
	return pt.matrixTransform(node.getScreenCTM().inverse());
    }

    function isSvglObject(obj){
	if(obj && obj.getObject != undefined && obj.getObject != null) return true;
	return false;
    }

    function isSVGElement(obj){
	if(obj && obj.namespaceURI === xmlns) return true;
	return false;
    }
    
    function Off(node, event, callback){
	node.removeEventListener(event, callback);
	return node;
    }
    
    function On(node, event, callback){
	node.addEventListener(event, callback);	
	return node;
    }

    function Remove(node, children, child){
	_.forEach(children || [], function(c){ RemoveChild(node, c.getObject()); });
	if(isSvglObject(child)) children = _.filter(children, function(item){
	    return item.get('id') != child.get('id');
	});
	_.forEach(children, function(c){ AddChild(node, c.getObject()); });
        
	return { 'node': node, 'children': children };
    }

    function RemoveChild(node, child){
	if(isSVGElement(child))  node.removeChild(child);
	return node;
    }

    function Set(node, options, attributes){
	attributes = attributes || [
	    'id', 
	    'x', 'y', 
	    'height', 'width', 
	    'fill', 'font-size', 'font-family', 
	    'stroke', 'stroke-width',
	    'focusable'
	];
	_.forEach(attributes, function(attribute){
	    if(options[attribute] != undefined && 
	       options[attribute] != null)
		node.setAttributeNS(null, attribute, options[attribute]);
	});
	return node;
    }

    function Update(node, options){
	return Set(node, options, _.keys(options));
    }

    function UpdateChildList(node, children){
	_.forEach(children, function(c){ AddChild(node, c.getObject()); });
	return node;
    }
    
    function UpdateTextNode(textNode, text){
	textNode = text ? CreateTextNode(text) : textNode;
	return textNode;
    }
}
