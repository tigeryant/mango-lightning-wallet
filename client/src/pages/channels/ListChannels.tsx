import { useListChannelsQuery } from "../../redux/features/api/apiSlice";
import { Link } from "react-router-dom";

const ListChannels = () => {
  // await this?
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
            <div
              className="w-[800px] border border-neutral-300 rounded-lg flex justify-between"
              key={index}
            >
              <span><strong>Channel id: </strong>{channel.chan_id}</span>
              <span><strong>Local balance: </strong>{channel.local_balance}</span>
              <span><strong>Remote balance: </strong>{channel.remote_balance}</span>
            </div>
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
