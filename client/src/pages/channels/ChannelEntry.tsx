import { useGetNodeInfoQuery } from "../../redux/features/api/apiSlice";

const ChannelEntry = ({
  chanId,
  localBalance,
  remoteBalance,
  remotePubkey,
}) => {
  const { data, error } = useGetNodeInfoQuery({
    pubKey: remotePubkey,
  });
  if (error) {
    console.error(JSON.stringify(error));
  }
  let alias = "";
  if (data) {
    alias = data.node.alias;
  }

  return (
    <tr className="border border-neutral-300">
      <td>{data ? alias : ""}</td>
      <td>{chanId}</td>
      <td>{localBalance}</td>
      <td>{remoteBalance}</td>
    </tr>
  );
};

export default ChannelEntry;
