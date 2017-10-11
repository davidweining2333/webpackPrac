import _ from 'lodash';
import './main.scss';
import test from "./test.js"

function component() {
  var element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack11d11'], ' ');

  return element;
}

document.body.appendChild(component());

if (module && module.hot) {
    module.hot.accept('./test.js', function() {
        test();
    })
}