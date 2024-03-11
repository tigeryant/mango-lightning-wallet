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
  let alias = ''
  if (data) {
    alias = data.node.alias
  }

  return (
    <div className="w-[800px] border border-neutral-300 rounded-lg flex justify-between">
      {data &&
        <span>
          <strong>Alias: </strong>
          {alias}
        </span>
      }
      <span>
        <strong>Channel id: </strong>
        {chanId}
      </span>
      <span>
        <strong>Local balance: </strong>
        {localBalance}
      </span>
      <span>
        <strong>Remote balance: </strong>
        {remoteBalance}
      </span>
    </div>
  );
};

export default ChannelEntry;
