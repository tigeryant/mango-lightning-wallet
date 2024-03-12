import { useListChannelsQuery } from "../../redux/features/api/apiSlice";
import { Link } from "react-router-dom";
import ChannelRow from "./ChannelRow";

const ListChannels = () => {
  const { data, error } = useListChannelsQuery();
  if (error) {
    console.error(JSON.stringify(error));
  }
  let channels: any[] = [];
  if (data) {
    channels = data.channels;
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold mb-[30px]">List Channels Page</h1>
      <table className="table-auto w-[800px] border border-neutral-300">
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
