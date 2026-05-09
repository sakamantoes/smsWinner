import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="h-screen bg-background-default">
      <div className="mx-auto flex min-h-screen flex-col lg:flex-row">
        <main className="flex-1 h-screen overflow-y-scroll px-4 sm:px-6  bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
