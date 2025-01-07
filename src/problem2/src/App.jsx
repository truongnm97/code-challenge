import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFetch, useForm } from "./hooks";
import swapLogo from "./assets/swap.svg";
import { Loading, TokenSelect, Notification } from "./components";

const initialValue = {
  tokenSend: null,
  tokenReceive: null,
};

const validate = (values) => {
  const errors = {};

  if (!values.sendAmount) {
    errors.sendAmount = "Please enter your amount!";
  } else if (isNaN(Number(values.sendAmount))) {
    errors.sendAmount = "Your amount is invalid.";
  }

  if (!values.tokenSend) {
    errors.tokenSend = "Please select a token!";
  }

  if (!values.tokenReceive) {
    errors.tokenReceive = "Please select a token!";
  }
  return errors;
};

function App() {
  const { data, loading } = useFetch(
    "https://interview.switcheo.com/prices.json",
  );
  const timeoutId = useRef(null);
  const [notificationOpened, setNotificationOpened] = useState(false);

  const onSubmit = async (values) => {
    // Fake API call
    await new Promise((resolve) => {
      timeoutId.current = setTimeout(() => {
        resolve();
      }, 3000);
    });
    console.log("submit", values);
    setNotificationOpened(true);
  };
  const {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    handleChange,
    handleSubmit,
    updateValues,
  } = useForm(initialValue, validate, onSubmit, { validateOnChange: true });

  const { tokenSend, tokenReceive, sendAmount } = values;

  const tokens = useMemo(
    () =>
      data?.reduce((prev, curr) => {
        // If token's already exists, get latest one
        const token = prev.find((d) => d.currency === curr.currency);
        if (!token || (token && new Date(curr.date) > new Date(token.date))) {
          prev.push(curr);
        }
        return prev;
      }, []) || [],
    [data],
  );

  const handleSwap = () => {
    updateValues({
      tokenSend: tokenReceive,
      tokenReceive: tokenSend,
    });
  };

  const handleTokenSendChange = (value) => {
    const selectedToken = tokens.find((token) => token.currency === value);
    if (selectedToken) {
      setFieldValue("tokenSend", selectedToken);
    }
  };

  const handleTokenReceiveChange = (value) => {
    const selectedToken = tokens.find((token) => token.currency === value);
    if (selectedToken) {
      setFieldValue("tokenReceive", selectedToken);
    }
  };

  const exchangeRate =
    tokenReceive && tokenSend ? tokenSend.price / tokenReceive.price : 0;

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="text-5xl font-bold mb-8">Swap Your Token</div>
      <div className="max-w-full w-[472px] bg-gray-800 p-4 rounded-lg flex flex-col gap-2 shadow-lg relative">
        {loading && (
          <div className="inset-0 absolute flex justify-center items-center z-10 bg-gray-700/50 rounded-lg">
            <Loading className="!w-10 !h-10" />
          </div>
        )}
        <div className="flex flex-col gap-2 relative">
          <div className="h-24 rounded-lg bg-gray-700 p-2 flex shadow-lg">
            <div className="flex flex-col gap-4">
              <TokenSelect
                tokens={tokens?.filter(
                  ({ currency }) => currency !== tokenReceive?.currency,
                )}
                value={tokenSend?.currency}
                onChange={handleTokenSendChange}
                disabled={isSubmitting}
              />
              {tokenSend && (
                <div className="text-sm text-slate-300 text-left font-semibold">
                  $ {tokenSend.price.toFixed(4)}
                </div>
              )}
              {errors.tokenSend && (
                <div className="text-sm text-red-300 text-left font-semibold">
                  {errors.tokenSend}
                </div>
              )}
            </div>
            <div className="flex-1 flex-col items-end justify-center flex">
              <input
                className="w-full text-right text-white bg-transparent outline-0 h-10 text-xl font-bold"
                placeholder="0.00"
                type="number"
                name="sendAmount"
                value={sendAmount}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.sendAmount && (
                <div className="text-sm text-red-300 font-semibold">
                  {errors.sendAmount}
                </div>
              )}
            </div>
          </div>
          <div className="h-24 rounded-lg bg-gray-700 p-2 flex gap-4 shadow-lg">
            <div className="flex flex-col gap-4">
              <TokenSelect
                tokens={tokens?.filter(
                  ({ currency }) => currency !== tokenSend?.currency,
                )}
                value={tokenReceive?.currency}
                onChange={handleTokenReceiveChange}
                disabled={isSubmitting}
              />
              {tokenReceive && (
                <div className="text-sm text-slate-300 text-left font-semibold">
                  $ {tokenReceive.price.toFixed(4)}
                </div>
              )}
              {errors.tokenReceive && (
                <div className="text-sm text-red-300 text-left font-semibold">
                  {errors.tokenReceive}
                </div>
              )}
            </div>
            <div className="flex-1 items-center justify-end flex">
              <input
                className="w-full text-right text-white bg-transparent outline-0 h-10 text-xl font-bold"
                placeholder="0.00"
                value={
                  Number(sendAmount) && exchangeRate
                    ? (Number(sendAmount) * exchangeRate).toFixed(4)
                    : ""
                }
                type="number"
                disabled
              />
            </div>
          </div>
          <div className="w-15 h-15 absolute top-[calc(50%-36px)] left-[calc(50%-36px)] border-8 border-gray-800 rounded-full">
            <button
              className="p-4 !outline-0 hover:bg-gray-600 disabled:bg-gray-700 bg-gray-700 transition-colors rounded-full shadow-lg"
              onClick={handleSwap}
              disabled={isSubmitting}
            >
              <img src={swapLogo} alt="Swap Logo" />
            </button>
          </div>
        </div>
        <div className="text-right my-2 text-gray-400 text-sm h-5 font-semibold">
          {tokenReceive && tokenSend
            ? `1 ${tokenSend.currency} = ${exchangeRate.toFixed(8)} ${tokenReceive.currency}`
            : ""}
        </div>
        <button
          className="h-12 rounded-lg bg-blue-400 !outline-0 p-0 border-none hover:bg-blue-500 disabled:bg-blue-400/50 transition-colors font-semibold shadow-lg flex items-center justify-center"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? <Loading /> : "Swap"}
        </button>
      </div>

      <Notification
        open={notificationOpened}
        onOpenChange={setNotificationOpened}
        type="success"
        title="Swap Notification"
        content="Swap successfully!!!"
      />
    </div>
  );
}

export default App;
