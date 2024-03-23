import { useGetNodeInfoQuery } from "../../redux/features/info/infoSlice";
import ProgressBar from "@ramonak/react-progress-bar";
import CloseChannel from "../../components/buttons/CloseChannel";

const ChannelRow = ({
  chanId,
  localBalance,
  remoteBalance,
  remotePubkey,
  channelCapacity,
  channelPoint
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
      <tr className="border-x border-t border-neutral-300 pt-[5px]">
        <td>{data ? alias : ""}</td>
        <td>{chanId}</td>
        <td>{localBalance}</td>
        <td className="text-center">{channelCapacity}</td>
        <td className="text-right">{remoteBalance}</td>
        <td className="text-right"><CloseChannel channelPoint={channelPoint} /></td>
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
            height="10px"
          />
        </td>
        <td colSpan={1}></td>
      </tr>
    </>
  );
};

export default ChannelRow;
