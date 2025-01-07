// TODO: `blockchain` haven't been defined
interface WalletBalance {
  currency: string;
  amount: number;
}

// TODO: This interface could extends from WalletBalance, so we don't have to duplicate the definition
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

// TODO: React.FC is not recommended for react below 18 and typescript below 5.1, annotating props is enough. More detail: https://www.totaltypescript.com/you-can-stop-hating-react-fc
const WalletPage: React.FC<Props> = (props: Props) => {
  // TODO: destructuring props in function's param
  // TODO: remove children props if unused
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // TODO: This function is pure, move it outside the component or to utils file
  // TODO: Resolve any type
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      // TODO: "Zilliqa" and "Neo" has same return value, so just need to return once for both
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  // TODO: Handle `formattedBalances` and `rows` inside `useMemo`
  const sortedBalances = useMemo(() => {
    // TODO: Optimize filter and sort function
    // TODO: Remove return for cleaner implementation
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  // TODO: Handle this inside useMemo above
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    // TODO: Remove return for cleaner implementation
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // TODO: Handle this inside useMemo above
  const rows = formattedBalances.map(
    // TODO: destructuring `balance` for furthur usage
    (balance: FormattedWalletBalance, index: number) => {
      // TODO: `usdValue`'s' used once, remove it 
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // TODO: key should be an unique props, `balance.blockchain` should work
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    },
  );

  return <div {...rest}>{rows}</div>;
};
