import React from "react";

function mapValues(object, iteratee) {
  object = Object(object);
  const result = {};
  Object.keys(object).forEach((key) => {
    result[key] = iteratee(object[key], key, object);
  });
  return result
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}



const DefaultConfig = {
  // It is safer to delay by default slightly the loader removal
  // For example if your promise has 2 then() callbacks (removal of a view and loader removal),
  // this ensures that the loader is not removed just before view removal, leading to flicker
  delay: true,
};


function wrap(Comp,config = DefaultConfig) {

  const {
    delay,
  } = {
    ...config,
    ...DefaultConfig,
  };

  class ReactNestedLoader extends React.Component {

    state = {
      loading: false,
    };

    componentWillMount() {
      // This is the component API that will be injected into wrapped component
      // And can also be used imperatively by using ref
      this.api = {
        handlePromise: this.handlePromise,
      }
    };

    componentWillUnmount() {
      this.unmounted = true;
    }

    proxyCache = {};

    setLoading = () => this.setState({loading: true});

    setNotLoading = () => this.setState({loading: false});

    handlePromise = promise => {
      this.promise = promise;
      this.setLoading();

      // Handle potential concurrency issues due to handling multiple promises concurrently
      const setNotLoadingSafe = () => {
        if (this.unmounted) {
          return;
        }
        if (this.promise === promise) {
          this.setNotLoading();
        }
      };

      const handlePromiseResolve = () => {
        // We add the ability to delay loader removal (see config comment)
        if (delay) {
          if (delay instanceof Function) {
            delay(setNotLoadingSafe);
          }
          else if (delay instanceof Number ) {
            setTimeout(setNotLoadingSafe,delay);
          }
          else {
            setTimeout(setNotLoadingSafe,0);
          }
        }
        else {
          setNotLoadingSafe();
        }
      };

      promise.then(handlePromiseResolve, handlePromiseResolve);
    };

    buildProxy = fn => {
      return (...args) => {
        const result = fn(...args);
        if (result instanceof Promise) {
          this.handlePromise(result);
        }
        return result;
      };
    };

    // We use caching, so that if input functions are stable across renders,
    // we provide stable proxied functions to children to avoid triggering unnecessary renders to wrapped component
    maybeBuildProxy = (prop, propName) => {
      if (prop instanceof Function) {
        const cache = this.proxyCache[propName];
        if (cache && cache.originalProp === prop) {
          return cache.proxyProp;
        } else {
          const proxy = this.buildProxy(prop);
          this.proxyCache[propName] = {
            originalProp: prop,
            proxyProp: proxy,
          };
          return proxy;
        }
      } else {
        return prop;
      }
    };

    render() {
      return (
        <Comp
          loading={this.state.loading}
          reactNestedLoader={this.api}
          {...mapValues(this.props, this.maybeBuildProxy)}
        />
      );
    }
  }

  ReactNestedLoader.displayName = `ReactNestedLoader(${getDisplayName(Comp)})`;

  return ReactNestedLoader;
}


export default compOrOptions => {
  if ( typeof compOrOptions === 'object' ) {
    return Comp => wrap(Comp,compOrOptions);
  }
  else {
    return wrap(compOrOptions);
  }
}
