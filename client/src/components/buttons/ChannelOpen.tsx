import { useOpenChannelMutation } from "../../redux/features/api/apiSlice";

const ChannelOpen = () => {
  const [openChannel, { error: openError }] = useOpenChannelMutation();
  if (openError) {
    console.error(openError);
  }

  return (
    <button
      className="bg-orange-500 text-white rounded-lg p-[5px] mb-[10px]"
      onClick={() => openChannel()}
    >
      Open Channel
    </button>
  );
};

export default ChannelOpen;
