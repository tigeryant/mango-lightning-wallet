import { useListChannelsQuery } from "../../redux/features/api/apiSlice";
import { Link } from "react-router-dom";
import ChannelRow from "./ChannelRow";
import { useAppSelector } from "../../redux/app/hooks";
import ChannelOpen from "../../components/buttons/ChannelOpen";
import { useEffect } from "react";

const ListChannels = () => {
  const { data, error: listError, refetch } = useListChannelsQuery();
  if (listError) {
    console.error(JSON.stringify(listError));
  }
  let channels: any[] = [];
  if (data) {
    channels = data.channels;
  }

  const channelStatus = useAppSelector((state) => state.channels.channelState);
  console.log(`channelStatus: ${channelStatus}`);
  const channelPending = channelStatus === "chan_pending";
  const channelOpen = channelStatus === "chan_open";

  useEffect(() => {
    if (channelOpen) {
      refetch();
    }
  }, [channelOpen]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold mb-[30px]">List Channels Page</h1>
      <div className="flex justify-between w-[800px] h-[300px]">
        <ChannelOpen />
        <div className="flex items-center">
          <p>
            <strong>Status:</strong>
          </p>
          {channelPending && (
            <div className="bg-yellow-500 px-[10px] py-[5px] text-orange rounded-lg h-fit">
              Channel pending
            </div>
          )}
          {channelOpen && (
            <div className="bg-green-600 px-[10px] py-[5px] text-white rounded-lg h-fit">
              Channel opened
            </div>
          )}
        </div>
      </div>
      <table className="w-[800px] border border-neutral-300">
        <thead className="text-left">
          <tr>
            <th>Alias</th>
            <th>Channel ID</th>
            <th>Local balance</th>
            <th className="text-center">Capacity</th>
            <th className="text-right">Remote balance</th>
          </tr>
        </thead>
        <tbody>
          {channels &&
            channels.map((channel, index) => {
              return (
                <ChannelRow
                  chanId={channel.chan_id}
                  localBalance={channel.local_balance}
                  remoteBalance={channel.remote_balance}
                  remotePubkey={channel.remote_pubkey}
                  channelCapacity={channel.capacity}
                  key={index}
                />
              );
            })}
        </tbody>
      </table>
      <Link
        to="/dashboard"
        className="bg-blue-500 text-white rounded-lg p-[5px] mt-[10px]"
      >
        Dashboard
      </Link>
    </div>
  );
};

export default ListChannels;
