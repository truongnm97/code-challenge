interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

enum Blockchain {
  OSMOSIS = "Osmosis",
  ETHEREUM = "Ethereum",
  ARBITRUM = "Arbitrum",
  ZILLIQA = "Zilliqa",
  NEO = "Neo",
}

interface Props extends BoxProps {}

const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case Blockchain.OSMOSIS:
      return 100;
    case Blockchain.ETHEREUM:
      return 50;
    case Blockchain.ARBITRUM:
      return 30;
    case Blockchain.ZILLIQA:
    case Blockchain.NEO:
      return 20;
    default:
      return -99;
  }
};

const WalletPage = ({ children, ...rest }: Props) => {
  const balances: WalletBalance[] = useWalletBalances();
  const prices = usePrices();

  const walletRows = useMemo(
    () =>
      balances
        .filter(
          (balance) => getPriority(balance.blockchain) > -99 && balance.amount <= 0,
        )
        .sort(
          (lhs, rhs) =>
            getPriority(rhs.blockchain) - getPriority(lhs.blockchain),
        )
        .map(({ amount, blockchain, currency }) => (
          <WalletRow
            className={classes.row}
            key={blockchain}
            amount={amount}
            usdValue={prices[currency] * amount}
            formattedAmount={amount.toFixed()}
          />
        )),
    [balances, prices],
  );

  return <div {...rest}>{walletRows}</div>;
};
