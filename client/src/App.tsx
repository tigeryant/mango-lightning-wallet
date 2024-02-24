function App() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form className="lg:w-[50%] w-[80%] h-[80%] border border-black rounded-lg flex flex-col px-[5%] pt-[5%]">
        <label>Host</label>
        <input className="border border-neutral-300 rounded-lg mb-[30px]"></input>
        <label>TLS Certificate</label>
        <input className="h-[200px] border border-neutral-300 rounded-lg mb-[30px]"></input>
        <label>Macaroon</label>
        <input className="border border-neutral-300 rounded-lg mb-[30px]"></input>
        <button className="bg-orange-500 py-[5px] px-[20px] rounded-lg text-white ml-auto w-fit">
          Connect
        </button>
      </form>
    </div>
  );
}

export default App;
