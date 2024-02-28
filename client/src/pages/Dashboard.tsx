import { useGetInfoQuery } from "../features/api/apiSlice";

const Dashboard = () => {
  const { data } = useGetInfoQuery();

  return (
    <div>
      Dashboard
      <p>Data:</p>
      {data && (
        <>
          <p>{data.alias}</p>
          <p>{data.balance}</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
