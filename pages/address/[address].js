import { useRouter } from "next/router";
import { useEffect } from "react";
import { classify, isVault } from "../../classifier";

export default function AddressView(props) {
  const router = useRouter();
  const { address } = router.query;

  useEffect(() => {
    async function work() {
      if (address === undefined) {
        return;
      }
      const clasification = await classify(address);
      console.log(clasification);
    }

    work();
  }, [address]);

  return <p>This is the address page for {address}</p>;
}
