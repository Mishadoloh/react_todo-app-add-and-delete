import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

// eslint-disable-next-line @typescript-eslint/naming-convention
type props = {
  errorMessage: ErrorMessage | '';
  onClearMessage: () => void;
};

export const ErrorNotification: React.FC<props> = ({
  errorMessage,
  onClearMessage,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      onClearMessage();
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, onClearMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClearMessage()}
      />
      {errorMessage}
    </div>
  );
};
