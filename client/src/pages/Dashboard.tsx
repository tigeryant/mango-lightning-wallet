import { useGetInfoQuery } from "../redux/features/api/apiSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data, error } = useGetInfoQuery();
  if (error) {
    console.error(JSON.stringify(error));
  }

  return (
    <>
      <h1 className="font-bold">Dashboard</h1>
      <Link
        to="/receive"
        className="bg-blue-500 text-white rounded-lg p-[5px] block"
      >
        Receive payment page
      </Link>
      <p className="mt-[40px]">Data:</p>
      {data && (
        <>
          <p>alias: {data.alias}</p>
          <p>balance: {data.balance}</p>
        </>
      )}
    </>
  );
};

export default Dashboard;
