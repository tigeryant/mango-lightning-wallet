import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConnectMutation } from "../../redux/features/api/apiSlice";

const ConnectForm = () => {
  // const [host, setHost] = useState<string>("");
  // const [cert, setCert] = useState<string>("");
  // const [macaroon, setMacaroon] = useState<string>("");
  const navigate = useNavigate();

  const [host, setHost] = useState<string>("127.0.0.1:10004");
  const [cert, setCert] = useState<string>(
    "/Users/john/.polar/networks/2/volumes/lnd/bob/tls.cert"
  );
  const [macaroon, setMacaroon] = useState<string>(
    "0201036c6e6402f801030a10d21e5394c4ce2bae069ba1c70387473f1201301a160a0761646472657373120472656164120577726974651a130a04696e666f120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a210a086d616361726f6f6e120867656e6572617465120472656164120577726974651a160a076d657373616765120472656164120577726974651a170a086f6666636861696e120472656164120577726974651a160a076f6e636861696e120472656164120577726974651a140a057065657273120472656164120577726974651a180a067369676e6572120867656e6572617465120472656164000006204190a838afad1e96acb39931e6c3ea59fca48b1ac4bd6389670bd46888ab6671"
  );

  const [connect, { error }] = useConnectMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await connect({ host, cert, macaroon }).unwrap();
      navigate("/dashboard");
    } catch (error: any) {
      // copy this error handling logic to the other query, or find out how to use error from useConnectMutation above
      error.data.error ? console.error(error.data.error) : console.error(error);
    }
  }

  return (
    <form
      className="lg:w-[50%] w-[80%] h-[80%] border border-black rounded-lg flex flex-col px-[5%] pt-[5%]"
      onSubmit={handleSubmit}
    >
      <label>Host</label>
      <input
        className="border border-neutral-300 rounded-lg mb-[30px]"
        onChange={(e) => setHost(e.target.value)}
        defaultValue="127.0.0.1:10004"
      ></input>
      <label>TLS Certificate</label>
      <input
        className="border border-neutral-300 rounded-lg mb-[30px]"
        onChange={(e) => setCert(e.target.value)}
        defaultValue="/Users/john/.polar/networks/2/volumes/lnd/bob/tls.cert"
      ></input>
      <label>Macaroon</label>
      <textarea
        className="h-[146px] border border-neutral-300 rounded-lg mb-[30px]"
        onChange={(e) => setMacaroon(e.target.value)}
        defaultValue="0201036c6e640267030a10d81e5394c4ce2bae069ba1c70387473f1201301a0c0a04696e666f1204726561641a170a08696e766f69636573120472656164120577726974651a160a076d657373616765120472656164120577726974651a100a086f6666636861696e1204726561640000062084d0cfc04f53f83ecccd723f413fb4792c271cebf3c12c994e9cd7a02380f4c4"
      ></textarea>
      <button
        className="bg-orange-500 py-[5px] px-[20px] rounded-lg text-white ml-auto w-fit"
        type="submit"
      >
        Connect
      </button>
    </form>
  );
};

export default ConnectForm;
