import { useGetInfoQuery } from "../redux/features/api/apiSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data, error } = useGetInfoQuery();
  if (error) {
    console.error(JSON.stringify(error));
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold mb-[30px]">Dashboard</h1>
      <Link
        to="/receive"
        className="bg-blue-500 text-white rounded-lg p-[5px] mb-[5px]"
      >
        Receive payment page
      </Link>
      <Link to="/send" className="bg-blue-500 text-white rounded-lg p-[5px]">
        Send payment page
      </Link>
      <p className="mt-[40px]">Data:</p>
      {data && (
        <>
          <p>alias: {data.alias}</p>
          <p>balance: {data.balance}</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
