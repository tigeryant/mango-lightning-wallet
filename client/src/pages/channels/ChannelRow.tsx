import { useGetNodeInfoQuery } from "../../redux/features/api/apiSlice";
import ProgressBar from "@ramonak/react-progress-bar";

const ChannelRow = ({
  chanId,
  localBalance,
  remoteBalance,
  remotePubkey,
  channelCapacity,
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

  const adjustedLocalBal =
    (channelCapacity - (localBalance + remoteBalance)) / 2 + localBalance;

  return (
    <>
      <tr className="border border-neutral-300">
        <td>{data ? alias : ""}</td>
        <td>{chanId}</td>
        <td>{localBalance}</td>
        <td className="text-center">{channelCapacity}</td>
        <td className="text-right">{remoteBalance}</td>
      </tr>
      <tr>
        <td colSpan={2}></td>
        <td colSpan={3}>
          <ProgressBar
            completed={adjustedLocalBal}
            maxCompleted={channelCapacity}
            customLabel=" "
            baseBgColor="blue"
            bgColor="orange"
          />
        </td>
      </tr>
    </>
  );
};

export default ChannelRow;
