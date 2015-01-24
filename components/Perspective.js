var React = require('react/addons');
var _ = require('lodash');
var curryRight = require('curry-d').curryRight;
var EventHandler = require('rx-react').EventHandler;
var Rx = require('rx');
var viewport = require('viewport-size');

function getCursorPerspective(position) {
	var x = position[0];
	var y = position[1];
	var vW = viewport.getWidth();
	var vH = viewport.getHeight();

	// perspectives. -100 ~ 100. 0 is center
	var pX = (x * 200 / vW) - 100;
	var pY = (y * 200 / vH) - 100;

	return [pX, pY];
}

function makeSetState(stateName) {
	return function(value) {
		var state = {};
		state[stateName] = value;
		this.setState(state);
	};
}

var Perspective = React.createClass({ displayName: 'Perspective',

	getInitialState: function() {
		return {
			perspective: [0, 0]
		};
	},

	componentWillMount: function() {
		var mouseSource = Rx.Observable.fromEvent(document, 'mousemove');

		// Get all mouse movements
		mouseSource
			// pick just the desired properties
			.map(
				curryRight(_.pick)('y')('x')
			)
			// transform into an array of the values
			.map(_.values)
			// get the cursor perspective
			.map(getCursorPerspective)
			// finally set state
			.subscribe(_.bind(makeSetState('perspective'), this));
	},

	renderChild: function(child) {
		var $perspective = this.state.perspective;

		return React.addons.cloneWithProps(child, { perspective: $perspective });
	},

	renderChildren: function() {
		return React.Children.map(this.props.children, this.renderChild);
	},

	render: function() {
		var children = this.renderChildren();

		return (
			React.createElement('div', { className: 'Perspective' },
				children
			)
		);
	}

});

module.exports = Perspective;