
interface DashboardHeaderProps {
  isAdmin: boolean;
}

export const DashboardHeader = ({ isAdmin }: DashboardHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">
        {isAdmin ? "Admin Dashboard" : "My Dashboard"}
      </h1>
    </div>
  );
};
