import {
  useListChannelsQuery,
} from "../../redux/features/api/apiSlice";
import { Link } from "react-router-dom";
import ChannelEntry from "./ChannelEntry";

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
      {/* use a proper HTML table */}
      {channels &&
        channels.map((channel, index) => {
          return (
            <ChannelEntry
              chanId={channel.chan_id}
              localBalance={channel.local_balance}
              remoteBalance={channel.remote_balance}
              remotePubkey={channel.remote_pubkey}
              key={index}
            />
          );
        })}
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
