import React from 'react';
import ReactDOM from 'react-dom';

function HiddenMessage({ children }) {
  const [showMessage, setShowMessage] = React.useState(false);
  return (
    <div>
      <label htmlFor="toggle">Show Message</label>
      <input
        id="toggle"
        type="checkbox"
        onChange={(e) => setShowMessage(e.target.checked)}
        checked={showMessage}
      />
      {showMessage ? children : null}
    </div>
  );
}
export default HiddenMessage;

import '@testing-library/jest-dom/extend-expect';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required
import { render, fireEvent } from '@testing-library/react';
test('shows the children when the checkbox is checked', () => {
  const testMessage = 'Test Message';
  const { queryByText, getByLabelText, getByText } = render(
    <HiddenMessage>{testMessage}</HiddenMessage>
  );
  // query* functions will return the element or null if it cannot be found
  // get* functions will return the element or throw an error if it cannot be found
  expect(queryByText(testMessage)).toBeNull();
  // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
  fireEvent.click(getByLabelText(/show/i));
  // .toBeInTheDocument() is an assertion that comes from jest-dom
  // otherwise you could use .toBeDefined()
  expect(getByText(testMessage)).toBeInTheDocument();
});
