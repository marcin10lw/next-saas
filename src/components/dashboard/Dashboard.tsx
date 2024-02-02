import UploadButton from "./UploadButton";
import UserFiles from "./UserFiles";

const Dashboard = () => {
  return (
    <main className="mx-auto max-w-7xl px-2.5 md:p-10">
      <section className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 text-5xl font-bold text-gray-900">My Files</h1>
        <UploadButton />
      </section>
      <UserFiles />
    </main>
  );
};

export default Dashboard;
