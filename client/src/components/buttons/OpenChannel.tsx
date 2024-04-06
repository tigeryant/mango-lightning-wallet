import { useOpenChannelMutation } from "../../redux/features/channels/channelsSlice";

const OpenChannel = () => {
  const [openChannel ] = useOpenChannelMutation();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pubkey = event.currentTarget.pubkey.value
    const fundingAmount = parseInt(event.currentTarget.fundingAmount.value)
    const pushSat = parseInt(event.currentTarget.pushSat.value)

    // add input validation
    try {
      openChannel({ pubkey, fundingAmount, pushSat })
    } catch (error: any) {
      error.data.error ? console.error(error.data.error) : console.error(error);
    }
  }

  return (
    <form className="flex flex-col" onClick={handleSubmit}>
      <label>Public key of remote node (hex encoded):</label>
      <textarea
        id='pubkey'
        className="border boder-neutral-300 mb-[5px]"
        defaultValue="03e5f9a35b4df97b267778d8a31716426515901d80b1dfc677210078e2c09f034e"
      ></textarea>
      <label>Number of satoshis to commit to channel:</label>
      <input
        id='fundingAmount'
        className="border boder-neutral-300 mb-[5px]"
        defaultValue={100000}
      ></input>
      <label>Number of satoshis to send channel partner initially:</label>
      <input id='pushSat' className="border boder-neutral-300" defaultValue={20000}></input>
      <button
        className="bg-orange-500 text-white rounded-lg p-[5px] mb-[10px] w-fit mt-[10px]"
        type="submit"
      >
        Open Channel
      </button>
    </form>
  );
};

export default OpenChannel;
