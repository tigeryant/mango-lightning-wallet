import { useGetInfoQuery } from "../features/api/apiSlice";

const Dashboard = () => {
  const { data, error  } = useGetInfoQuery();
  if (error) {
    console.error(JSON.stringify(error))
  }

  return (
    <div>
      Dashboard
      <p>Data:</p>
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
