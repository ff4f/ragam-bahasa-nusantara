import ContributeLoggedOut from "../components/ContributeLoggedOut";
import ContributeLoggedIn from "../components/ContributeLoggedIn";
import { useUser } from "@/hooks/use-user";

const Contribute = () => {
  const { user } = useUser();
  return user ? <ContributeLoggedIn /> : <ContributeLoggedOut />;
};

export default Contribute;