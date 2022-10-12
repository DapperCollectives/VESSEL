import { useCallback, useEffect, useRef, useState } from 'react';

function useTimedValue(initialValue) {
  const [value, setValue] = useState(initialValue);
  const timeoutRef = useRef();

  const setTimedValue = (newValue, timeout) => {
    clearTimeout(timeoutRef.current);
    setValue(newValue);

    timeoutRef.current = window.setTimeout(
      () => setValue(initialValue),
      timeout
    );
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return [value, setTimedValue];
}

export default function useClipboard({
  copiedTimeout = 2000,
  onSuccess,
  onError,
} = {}) {
  const [textJustCopied, setTextJustCopied] = useTimedValue(null);

  const copyHandler = useCallback(
    (text) => {
      function handleSuccess(value) {
        onSuccess?.();
        setTextJustCopied(value, copiedTimeout);
      }

      function handleError() {
        onError?.();
      }

      async function copy(value) {
        navigator.clipboard
          .writeText(value)
          .then(() => handleSuccess(value))
          .catch(handleError);
      }

      if (typeof text === 'string') {
        copy(text);
      }
    },
    [copiedTimeout, onSuccess, onError, setTextJustCopied]
  );

  return {
    textJustCopied,
    copy: copyHandler,
  };
}
