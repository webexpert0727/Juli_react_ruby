import React from "react";
import _ from "lodash";
// Note: If you override componentDidMount or componentWillUnmount you will need to
// call super.componentDidMount() or super.componentWillUnmount() or call
// watchStores() and unWatchStores() directly.
export default class BaseComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  _bind(...methods) {
    methods.forEach( (method) => this[method] = this[method].bind(this) );
  }

}