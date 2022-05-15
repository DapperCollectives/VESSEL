import { useCallback, useRef, useState, useEffect } from "react";

function useTimedToggle(initialValue) {
  const [value, setValue] = useState(false);
  const timeoutRef = useRef();
  const initialValueRef = useRef(initialValue);

  const toggleValue = (timeout) => {
    clearTimeout(timeoutRef.current);
    setValue(!initialValueRef.current);

    timeoutRef.current = window.setTimeout(
      () => setValue(initialValueRef.current),
      timeout
    );
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return [value, toggleValue];
}

export default function useClipboard({
  copiedTimeout = 2000,
  onSuccess,
  onError,
} = {}) {
  const [didCopy, setCopied] = useTimedToggle(false);

  const copyHandler = useCallback(
    (text) => {
      function handleSuccess() {
        onSuccess?.();
        setCopied(copiedTimeout);
      }

      function handleError() {
        onError?.();
      }

      async function copy(value) {
        navigator.clipboard
          .writeText(value)
          .then(handleSuccess)
          .catch(handleError);
      }

      if (typeof text === "string") {
        copy(text);
      }
    },
    [copiedTimeout, onSuccess, onError, setCopied]
  );

  return {
    didCopy,
    copy: copyHandler,
  };
}
