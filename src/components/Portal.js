import ReactDOM from 'react-dom';
import { useEffect } from 'react';

const portalElement = document.getElementById('portal');

const Portal = ({ children }) => {
  const el = document.createElement('div');

  useEffect(() => {
    portalElement.appendChild(el);
    return function cleanup() {
      portalElement.removeChild(el);
    };
  }, []);

  return ReactDOM.createPortal(children, el);
};

export default Portal;
