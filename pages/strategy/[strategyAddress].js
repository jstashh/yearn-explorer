import { useRouter } from "next/router";

export default function StrategyView() {
  const router = useRouter();
  const { strategyAddress } = router.query;

  return <p>This is the strategy view for {strategyAddress}</p>;
}
