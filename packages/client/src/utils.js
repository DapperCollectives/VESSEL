export const checkResponse = async (response) => {
  if (!response.ok) {
    const { status, statusText, url } = response;
    const { error } = response.json ? await response.json() : {};
    throw new Error(
      JSON.stringify({ status, statusText: error || statusText, url })
    );
  }
  return response.json();
};

export const notifyError = (err, history, url) => {
  try {
    const response = JSON.parse(err.message);
    if (typeof response === "object") {
      history.replace(history.location.pathname, response);
    }
  } catch (error) {
    history.replace(history.location.pathname, {
      status: 500,
      statusText: `Server not available: ${err.message}`,
      url,
    });
  }
};

export const shortenAddr = (addr) => {
  if (!addr) return addr;
  const firstChunk = addr.slice(0, 4);
  const secondChunk = addr.slice(addr.length - 4, addr.length);
  return `${firstChunk}...${secondChunk}`;
};

// rudimentary address check before actually querying with bad inputs
export const isAddr = (addr) => {
  // remove special chars
  addr = addr.replace(/[^a-z0-9]/gi, "");
  console.log("new addr", addr);
  // remove 0x prefix if exists
  const noPrefix = addr.startsWith("0x") ? addr.replace("0x", "") : addr;
  // result should be 16 chars long
  return noPrefix.length === 16;
};
